import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Rate limiting configuration
const RESEND_WINDOW_MINUTES = 60;
const MAX_RESEND_REQUESTS = 5;
const RESEND_COOLDOWN_SECONDS = 60;

// In-memory rate limiting (for development)
const rateLimitMap = new Map<string, { count: number; firstRequest: number; lastRequestTime: number }>();

// Initialize Supabase admin client for database operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { email, userId, otpType = "email" } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase().trim();
    console.log("Sending OTP to:", normalizedEmail);

    // Check rate limiting
    const now = Date.now();
    const rateLimitKey = `${normalizedEmail}:${otpType}`;
    const existingLimit = rateLimitMap.get(rateLimitKey);

    // Check cooldown (1 minute between requests)
    if (existingLimit) {
      const secondsSinceLastRequest = (now - existingLimit.lastRequestTime) / 1000;
      if (secondsSinceLastRequest < RESEND_COOLDOWN_SECONDS) {
        const retryAfter = Math.ceil(RESEND_COOLDOWN_SECONDS - secondsSinceLastRequest);
        return NextResponse.json(
          { 
            message: "Please wait before requesting a new code",
            retryAfter
          },
          { status: 429, headers: { "Retry-After": String(retryAfter) } }
        );
      }

      // Check if within window and exceeded max requests
      const minutesSinceFirst = (now - existingLimit.firstRequest) / 1000 / 60;
      if (minutesSinceFirst < RESEND_WINDOW_MINUTES && existingLimit.count >= MAX_RESEND_REQUESTS) {
        return NextResponse.json(
          { 
            message: "Too many requests. Please try again later.",
            retryAfter: RESEND_WINDOW_MINUTES * 60
          },
          { status: 429 }
        );
      }
    }

    // Update rate limit
    if (!existingLimit || (now - existingLimit.firstRequest) / 1000 / 60 >= RESEND_WINDOW_MINUTES) {
      rateLimitMap.set(rateLimitKey, { count: 1, firstRequest: now, lastRequestTime: now });
    } else {
      rateLimitMap.set(rateLimitKey, { 
        count: existingLimit.count + 1, 
        firstRequest: existingLimit.firstRequest,
        lastRequestTime: now
      });
    }

    // Call the custom Edge Function to send 6-digit OTP via email
    // This uses Resend to send the email with a custom 6-digit code
    const edgeFunctionUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-otp`;
    
    const edgeFunctionResponse = await fetch(edgeFunctionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({
        email: normalizedEmail,
        userId,
        otpType: "email_verify",
      }),
    });

    const result = await edgeFunctionResponse.json();

    if (!edgeFunctionResponse.ok) {
      console.error("Edge function error:", result);
      
      if (edgeFunctionResponse.status === 429) {
        return NextResponse.json(
          { message: result.error || "Too many requests. Please try again later.", retryAfter: result.retryAfter },
          { status: 429, headers: { "Retry-After": String(result.retryAfter || 60) } }
        );
      }
      
      return NextResponse.json(
        { message: result.error || "Failed to send verification code" },
        { status: 500 }
      );
    }

    console.log("OTP sent successfully via Edge Function to:", normalizedEmail);

    return NextResponse.json(
      { 
        message: "Verification code sent successfully",
        // Return email in normalized form for frontend storage
        email: normalizedEmail
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
