import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { otpStore, generateOTP, getExpiryTime } from "@/lib/otp-store";

// Rate limiting configuration
const RESEND_WINDOW_MINUTES = 60;
const MAX_RESEND_REQUESTS = 5;
const RESEND_COOLDOWN_SECONDS = 60;
const OTP_EXPIRY_MINUTES = 10;

// In-memory rate limiting (for development)
const rateLimitMap = new Map<string, { count: number; firstRequest: number }>();

export async function POST(request: NextRequest) {
  try {
    const { email, userId, otpType = "email_verify" } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // Check rate limiting (in-memory for development)
    const now = Date.now();
    const rateLimitKey = `${email}:${otpType}`;
    const existingLimit = rateLimitMap.get(rateLimitKey);

    if (existingLimit) {
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

      if (minutesSinceFirst < 1) { // Cooldown within 1 minute
        return NextResponse.json(
          { 
            message: "Please wait before requesting a new code",
            retryAfter: RESEND_COOLDOWN_SECONDS
          },
          { status: 429, headers: { "Retry-After": String(RESEND_COOLDOWN_SECONDS) } }
        );
      }
    }

    // Update rate limit
    if (!existingLimit || (now - existingLimit.firstRequest) / 1000 / 60 >= RESEND_WINDOW_MINUTES) {
      rateLimitMap.set(rateLimitKey, { count: 1, firstRequest: now });
    } else {
      rateLimitMap.set(rateLimitKey, { 
        count: existingLimit.count + 1, 
        firstRequest: existingLimit.firstRequest 
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = getExpiryTime();

    // Store OTP in memory
    otpStore.set(email, { 
      otp, 
      expiresAt, 
      verified: false,
      email,
      createdAt: Date.now()
    });

    // Send email using Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    
    if (resendApiKey && !resendApiKey.includes("placeholder")) {
      const resend = new Resend(resendApiKey);
      
      const emailResponse = await resend.emails.send({
        from: "Hopewell ChMS <noreply@hopewellchms.com>",
        to: email,
        subject: "Your Hopewell ChMS Verification Code",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif; background-color: #f6f6f6; padding: 20px; margin: 0;">
              <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <div style="text-align: center; margin-bottom: 30px;">
                  <h1 style="color: #0F1525; margin: 0; font-size: 24px;">Hopewell ChMS</h1>
                  <p style="color: #666666; margin: 8px 0 0 0; font-size: 14px;">Church Management System</p>
                </div>
                
                <h2 style="color: #0F1525; margin: 0 0 20px 0; font-size: 20px; text-align: center;">Verify Your Email</h2>
                
                <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                  Your verification code is:
                </p>
                
                <div style="background-color: #0F1525; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 20px;">
                  <span style="color: #C9A87C; font-size: 32px; font-weight: bold; letter-spacing: 8px;">${otp}</span>
                </div>
                
                <p style="color: #666666; font-size: 14px; margin: 0 0 20px 0;">
                  This code will expire in <strong>${OTP_EXPIRY_MINUTES} minutes</strong>.
                </p>
                
                <p style="color: #999999; font-size: 12px; margin: 0; text-align: center;">
                  If you didn't request this code, please ignore this email.
                </p>
              </div>
            </body>
          </html>
        `,
      });

      if (emailResponse.error) {
        console.error("Failed to send email:", emailResponse.error);
        return NextResponse.json(
          { message: "Failed to send verification email" },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { message: "Verification code sent successfully" },
        { status: 200 }
      );
    } else {
      // Return OTP in development mode if Resend is not configured
      console.log("Development mode - OTP for", email, ":", otp);
      return NextResponse.json(
        { 
          message: "Verification code sent successfully",
          devOTP: otp // For testing without email
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
