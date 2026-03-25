import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Rate limiting configuration
const MAX_VERIFICATION_ATTEMPTS = 5;
const VERIFICATION_WINDOW_MINUTES = 15;
const BLOCK_DURATION_MINUTES = 15;

// In-memory rate limiting
const verifyAttemptMap = new Map<string, { count: number; firstAttempt: number; blockedUntil?: number }>();

// Initialize Supabase admin client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { otp, email, firstName, lastName, phone } = await request.json();

    if (!otp || !email) {
      return NextResponse.json(
        { message: "OTP and email are required" },
        { status: 400 }
      );
    }

    // Normalize email to lowercase for consistent lookup
    const normalizedEmail = email.toLowerCase().trim();
    console.log("Verify request - email:", normalizedEmail, "OTP:", otp);

    // Check rate limiting
    const now = Date.now();
    const attemptKey = normalizedEmail;
    const attemptData = verifyAttemptMap.get(attemptKey);

    // Check if blocked
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

    // Check attempt count
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

    // Verify the OTP against the database
    // The custom edge function stores OTPs in the verification_otp table
    const { data: otpRecord, error: otpError } = await supabaseAdmin
      .from("verification_otp")
      .select("*")
      .eq("email", normalizedEmail)
      .eq("otp_code", otp)
      .eq("otp_type", "email_verify")
      .is("verified_at", null)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    // Handle verification errors
    if (otpError || !otpRecord) {
      console.error("OTP verification error:", otpError);
      
      // Record failed attempt
      const currentAttempt = verifyAttemptMap.get(attemptKey) || { count: 0, firstAttempt: now };
      verifyAttemptMap.set(attemptKey, { 
        count: currentAttempt.count + 1, 
        firstAttempt: currentAttempt.firstAttempt 
      });

      // Check if max attempts reached
      const newCount = (verifyAttemptMap.get(attemptKey)?.count || 0);
      if (newCount >= MAX_VERIFICATION_ATTEMPTS) {
        return NextResponse.json(
          { message: "Too many failed attempts. Please request a new verification code." },
          { status: 401 }
        );
      }

      // Return 401 for invalid OTP
      return NextResponse.json(
        { message: "Invalid or expired verification code" },
        { status: 401 }
      );
    }

    // Clear failed attempts on success
    verifyAttemptMap.delete(attemptKey);

    // OTP verified successfully
    // Mark the OTP as verified in the database
    await supabaseAdmin
      .from("verification_otp")
      .update({ verified_at: new Date().toISOString() })
      .eq("id", otpRecord.id);

    console.log("OTP verified successfully for:", normalizedEmail);

    // Create or get the user in Supabase Auth
    // If the user doesn't exist, create them
    // Note: We need to list users and filter by email since getUserByEmail doesn't exist
    const { data: userList } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = userList.users.find(u => u.email?.toLowerCase() === normalizedEmail);
    
    let userId: string;
    
    if (existingUser) {
      userId = existingUser.id;
    } else {
      // Create a new user with the email (they'll need to set a password later or use OTP login)
      const { data: newUser, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
        email: normalizedEmail,
        email_confirm: true, // Email is verified via OTP
        user_metadata: {
          first_name: firstName,
          last_name: lastName,
        }
      });

      if (createUserError) {
        console.error("Failed to create user:", createUserError);
        return NextResponse.json(
          { message: "Failed to create user account" },
          { status: 500 }
        );
      }

      userId = newUser.user.id;
    }
    
    if (userId) {
      // Create or update member profile if needed
      // Use createClient with service role key for admin operations
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      // Check if member profile already exists
      const { data: existingMember } = await supabaseAdmin
        .from("members")
        .select("id")
        .eq("user_id", userId)
        .single();

      if (!existingMember && firstName) {
        // Create member profile with the verified user's info
        const { error: memberError } = await supabaseAdmin
          .from("members")
          .insert({
            user_id: userId,
            first_name: firstName,
            last_name: lastName,
            email: normalizedEmail,
            phone: phone || null,
            status: "active",
            membership_date: new Date().toISOString().split("T")[0],
          });

        if (memberError) {
          console.error("Failed to create member profile:", memberError);
          // Don't fail the verification for this - user can still login
        }
      }

      // Set or confirm user role as member
      const { error: roleError } = await supabaseAdmin
        .from("user_roles")
        .upsert({
          user_id: userId,
          role: "member",
          created_at: new Date().toISOString(),
        }, {
          onConflict: "user_id,role"
        });

      if (roleError) {
        console.error("Failed to set user role:", roleError);
      }
    }

    // Return success - the session is now set via cookies
    return NextResponse.json(
      { 
        message: "Email verified successfully",
        verified: true,
        // Include session info if needed
        user: data.user ? {
          id: data.user.id,
          email: data.user.email,
        } : null
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
