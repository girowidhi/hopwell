import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { otpStore } from "@/lib/otp-store";

// Rate limiting configuration (in-memory for development)
const MAX_VERIFICATION_ATTEMPTS = 5;
const VERIFICATION_WINDOW_MINUTES = 15;
const BLOCK_DURATION_MINUTES = 15;

// In-memory rate limiting
const verifyAttemptMap = new Map<string, { count: number; firstAttempt: number; blockedUntil?: number }>();

interface OTPValidationResult {
  valid: boolean;
  source: 'memory' | 'database' | null;
  error?: string;
  attempts?: number;
}

// Validate OTP from in-memory store
async function validateOTPFromMemory(email: string, otp: string): Promise<OTPValidationResult> {
  const storedOtp = otpStore.get(email);
  
  if (!storedOtp || storedOtp.verified) {
    return { valid: false, source: null, error: "Invalid or expired verification code" };
  }

  // Check if OTP matches
  if (storedOtp.otp !== otp) {
    return { 
      valid: false, 
      source: 'memory', 
      error: "Invalid verification code",
      attempts: storedOtp.attempts || 0
    };
  }

  // Check expiry
  if (new Date(storedOtp.expiresAt) < new Date()) {
    return { valid: false, source: 'memory', error: "Verification code has expired" };
  }

  return { valid: true, source: 'memory' };
}

// Validate OTP from database (used by Supabase Edge Function)
async function validateOTPFromDatabase(supabase: any, email: string, otp: string): Promise<OTPValidationResult> {
  // Get the latest unverified OTP for this email
  const { data: otpRecord, error } = await supabase
    .from("verification_otp")
    .select("*, attempts")
    .eq("email", email)
    .eq("otp_type", "email_verify")
    .is("verified_at", null)
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !otpRecord) {
    return { valid: false, source: null, error: "Invalid or expired verification code" };
  }

  // Check if OTP matches
  if (otpRecord.otp_code !== otp) {
    // Increment attempts
    await supabase
      .from("verification_otp")
      .update({ attempts: (otpRecord.attempts || 0) + 1 })
      .eq("id", otpRecord.id);

    // Check if max attempts reached
    if ((otpRecord.attempts || 0) + 1 >= MAX_VERIFICATION_ATTEMPTS) {
      // Invalidate the OTP
      await supabase
        .from("verification_otp")
        .update({ verified_at: new Date().toISOString() })
        .eq("id", otpRecord.id);

      return { 
        valid: false, 
        source: 'database', 
        error: "Too many failed attempts. Please request a new verification code."
      };
    }

    return { 
      valid: false, 
      source: 'database', 
      error: "Invalid verification code",
      attempts: (otpRecord.attempts || 0) + 1
    };
  }

  return { valid: true, source: 'database' };
}

export async function POST(request: NextRequest) {
  try {
    const { otp, userId, email, firstName, lastName, phone } = await request.json();

    if (!otp || !email) {
      return NextResponse.json(
        { message: "OTP and email are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check rate limiting (in-memory for development)
    const now = Date.now();
    const attemptKey = email;
    const attemptData = verifyAttemptMap.get(attemptKey);

    if (attemptData?.blockedUntil && attemptData.blockedUntil > now) {
      const retryAfter = Math.ceil((attemptData.blockedUntil - now) / 1000 / 60);
      return NextResponse.json(
        { 
          message: "Too many failed attempts. Please try again later.",
          retryAfter 
        },
        { status: 429 }
      );
    }

    if (attemptData && attemptData.count >= MAX_VERIFICATION_ATTEMPTS) {
      const minutesSinceFirst = (now - attemptData.firstAttempt) / 1000 / 60;
      if (minutesSinceFirst < VERIFICATION_WINDOW_MINUTES) {
        // Block the email
        const blockedUntil = now + BLOCK_DURATION_MINUTES * 60 * 1000;
        verifyAttemptMap.set(attemptKey, { ...attemptData, blockedUntil });
        return NextResponse.json(
          { 
            message: "Too many failed attempts. Please try again later.",
            retryAfter: BLOCK_DURATION_MINUTES
          },
          { status: 429 }
        );
      } else {
        // Reset attempts after window
        verifyAttemptMap.delete(attemptKey);
      }
    }

    // Try to validate OTP - first check memory, then database
    let validationResult = await validateOTPFromMemory(email, otp);
    
    // If not found in memory, check database
    if (!validationResult.valid && validationResult.source === null) {
      validationResult = await validateOTPFromDatabase(supabase, email, otp);
    }

    // Handle validation failure
    if (!validationResult.valid) {
      // Record failed attempt
      const currentAttempt = verifyAttemptMap.get(attemptKey) || { count: 0, firstAttempt: now };
      verifyAttemptMap.set(attemptKey, { 
        count: currentAttempt.count + 1, 
        firstAttempt: currentAttempt.firstAttempt 
      });

      // Check if max attempts reached
      const newCount = (verifyAttemptMap.get(attemptKey)?.count || 0);
      if (newCount >= MAX_VERIFICATION_ATTEMPTS) {
        // Invalidate OTP in memory if it exists
        const storedOtp = otpStore.get(email);
        if (storedOtp) {
          storedOtp.verified = true;
        }
        
        // Also invalidate in database if exists
        await supabase
          .from("verification_otp")
          .update({ verified_at: new Date().toISOString() })
          .eq("email", email)
          .eq("otp_type", "email_verify")
          .is("verified_at", null);

        return NextResponse.json(
          { message: "Too many failed attempts. Please request a new verification code." },
          { status: 401 }
        );
      }

      return NextResponse.json(
        { message: validationResult.error || "Invalid verification code" },
        { status: 401 }
      );
    }

    // OTP is valid - mark as verified
    if (validationResult.source === 'memory') {
      const storedOtp = otpStore.get(email);
      if (storedOtp) {
        storedOtp.verified = true;
      }
    } else if (validationResult.source === 'database') {
      // Mark as verified in database
      await supabase
        .from("verification_otp")
        .update({ verified_at: new Date().toISOString() })
        .eq("email", email)
        .eq("otp_type", "email_verify")
        .is("verified_at", null);
    }

    // Clear failed attempts on success
    verifyAttemptMap.delete(attemptKey);

    // Now create the member profile
    const memberUserId = userId;

    if (!memberUserId) {
      return NextResponse.json(
        { message: "User ID not found. Please sign up again." },
        { status: 400 }
      );
    }

    // Check if member profile already exists
    const { data: existingMember } = await supabase
      .from("members")
      .select("id")
      .eq("user_id", memberUserId)
      .single();

    if (!existingMember) {
      // Create member profile
      const { error: memberError } = await supabase
        .from("members")
        .insert({
          user_id: memberUserId,
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
          status: "active",
          membership_date: new Date().toISOString().split("T")[0],
        });

      if (memberError) {
        console.error("Failed to create member profile:", memberError);
        return NextResponse.json(
          { message: "Failed to create member profile" },
          { status: 500 }
        );
      }
    }

    // Create or ensure user role is set to "member"
    const { error: roleError } = await supabase
      .from("user_roles")
      .upsert({
        user_id: memberUserId,
        role: "member",
        created_at: new Date().toISOString(),
      }, {
        onConflict: "user_id,role"
      });

    if (roleError) {
      console.error("Failed to set user role:", roleError);
    }

    return NextResponse.json(
      { 
        message: "Email verified successfully",
        verified: true 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
