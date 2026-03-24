import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Rate limiting configuration
const RESEND_WINDOW_MINUTES = 60;
const MAX_RESEND_REQUESTS = 3;
const RESEND_COOLDOWN_SECONDS = 180; // 3 minutes

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();
    console.log("Resend OTP for:", normalizedEmail);

    const supabase = await createClient();

    // Check rate limiting for resend requests
    const { data: recentRequests } = await supabase
      .from("verification_otp")
      .select("created_at")
      .eq("email", email)
      .eq("otp_type", "email_verify")
      .order("created_at", { ascending: false })
      .limit(MAX_RESEND_REQUESTS);

    if (recentRequests && recentRequests.length >= MAX_RESEND_REQUESTS) {
      const oldestRequest = new Date(recentRequests[MAX_RESEND_REQUESTS - 1].created_at);
      const now = new Date();
      const minutesSinceOldest = (now.getTime() - oldestRequest.getTime()) / 1000 / 60;

      if (minutesSinceOldest < RESEND_WINDOW_MINUTES) {
        const { data: lastRequest } = await supabase
          .from("verification_otp")
          .select("created_at")
          .eq("email", email)
          .eq("otp_type", "email_verify")
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (lastRequest) {
          const lastRequestTime = new Date(lastRequest.created_at);
          const secondsSinceLastRequest = (now.getTime() - lastRequestTime.getTime()) / 1000;

          if (secondsSinceLastRequest < RESEND_COOLDOWN_SECONDS) {
            const retryAfter = Math.ceil(RESEND_COOLDOWN_SECONDS - secondsSinceLastRequest);
            return NextResponse.json(
              { 
                message: "Please wait before requesting a new code",
                retryAfter 
              },
              { status: 429 }
            );
          }
        }

        return NextResponse.json(
          { 
            message: "Too many resend requests. Please try again later.",
            retryAfter: RESEND_WINDOW_MINUTES * 60
          },
          { status: 429 }
        );
      }
    }

    // Call the local send-otp API endpoint (more reliable)
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/send-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: normalizedEmail,
        userId: null,
        otpType: "email_verify",
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      // Handle rate limiting from Edge Function
      if (response.status === 429) {
        return NextResponse.json(
          { message: result.error || "Too many requests" },
          { status: 429, headers: { "Retry-After": String(result.retryAfter || 60) } }
        );
      }

      return NextResponse.json(
        { message: result.error || "Failed to send verification code" },
        { status: response.status }
      );
    }

    return NextResponse.json(
      { message: "Verification code sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Resend OTP error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
