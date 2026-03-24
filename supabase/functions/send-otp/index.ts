import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resendApiKey = Deno.env.get("RESEND_API_KEY");
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

// OTP expiry time in minutes
const OTP_EXPIRY_MINUTES = 3;
// Maximum OTP attempts before requiring resend
const MAX_OTP_ATTEMPTS = 5;

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function getExpiryTime(): string {
  const now = new Date();
  now.setMinutes(now.getMinutes() + OTP_EXPIRY_MINUTES);
  return now.toISOString();
}

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  try {
    const { email, userId, otpType = "email_verify" } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ success: false, error: "Email is required" }),
        { headers: { "Content-Type": "application/json" }, status: 400 }
      );
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ success: false, error: "Server configuration error" }),
        { headers: { "Content-Type": "application/json" }, status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check for existing valid OTP for this email
    const { data: existingOtp } = await supabase
      .from("verification_otp")
      .select("*")
      .eq("email", email)
      .eq("otp_type", otpType)
      .is("verified_at", null)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    // Check rate limiting - if there's a recent OTP, check if we can resend
    if (existingOtp) {
      const createdAt = new Date(existingOtp.created_at);
      const now = new Date();
      const timeSinceLastOtp = (now.getTime() - createdAt.getTime()) / 1000 / 60; // in minutes

      if (timeSinceLastOtp < 1) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Please wait before requesting a new code",
            retryAfter: Math.ceil(60 - timeSinceLastOtp * 60),
          }),
          { headers: { "Content-Type": "application/json" }, status: 429 }
        );
      }
    }

    // Generate new OTP
    const otp = generateOTP();
    const expiresAt = getExpiryTime();

    // Invalidate any existing unverified OTPs for this email
    await supabase
      .from("verification_otp")
      .update({ verified_at: new Date().toISOString() })
      .eq("email", email)
      .eq("otp_type", otpType)
      .is("verified_at", null);

    // Store OTP in database
    const { data: otpRecord, error: otpError } = await supabase
      .from("verification_otp")
      .insert({
        user_id: userId || null,
        email: email,
        otp_code: otp,
        otp_type: otpType,
        expires_at: expiresAt,
        attempts: 0,
      })
      .select()
      .single();

    if (otpError) {
      console.error("Failed to store OTP:", otpError);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to generate verification code" }),
        { headers: { "Content-Type": "application/json" }, status: 500 }
      );
    }

    // Send Email
    if (resendApiKey && email) {
      const emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
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
                    This code will expire in <strong>3 minutes</strong>.
                  </p>
                  
                  <p style="color: #999999; font-size: 12px; margin: 0; text-align: center;">
                    If you didn't request this code, please ignore this email.
                  </p>
                </div>
              </body>
            </html>
          `,
        }),
      });

      if (!emailResponse.ok) {
        const emailError = await emailResponse.text();
        console.error("Failed to send email:", emailError);
        // Don't fail the request if email fails, but log it
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Verification code sent successfully",
        expiresAt: expiresAt,
        // In development, return OTP for testing (remove in production)
        ...(Deno.env.get("ENVIRONMENT") === "development" && { otp: otp }),
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Send OTP error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { "Content-Type": "application/json" }, status: 400 }
    );
  }
});
