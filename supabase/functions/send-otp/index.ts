import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resendApiKey = Deno.env.get("RESEND_API_KEY");
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

// OTP expiry time in minutes
const OTP_EXPIRY_MINUTES = 3;
// Maximum OTP attempts before requiring resend
const MAX_OTP_ATTEMPTS = 5;

// Email template types
type EmailTemplateType = "email_verify" | "password_reset" | "login_verification";

interface EmailTemplateData {
  subject: string;
  title: string;
  description: string;
  ctaText: string;
  footerText: string;
}

const getEmailTemplateData = (type: EmailTemplateType, firstName?: string): EmailTemplateData => {
  const templates: Record<EmailTemplateType, EmailTemplateData> = {
    email_verify: {
      subject: "Verify Your Email - Hopewell ChMS",
      title: "Verify Your Email",
      description: "Thank you for signing up with Hopewell ChMS. Please use the verification code below to confirm your email address.",
      ctaText: "Verify Email",
      footerText: "If you didn't create an account with Hopewell ChMS, please ignore this email.",
    },
    password_reset: {
      subject: "Reset Your Password - Hopewell ChMS",
      title: "Reset Your Password",
      description: "We received a request to reset your Hopewell ChMS password. Use the verification code below to proceed.",
      ctaText: "Reset Password",
      footerText: "If you didn't request a password reset, please ignore this email or contact support.",
    },
    login_verification: {
      subject: "Verify Your Login - Hopewell ChMS",
      title: "Verify Your Login",
      description: "We noticed a sign-in attempt to your Hopewell ChMS account. Use the verification code below to complete the process.",
      ctaText: "Verify Login",
      footerText: "If this wasn't you, please secure your account immediately.",
    },
  };
  
  return templates[type];
};

// Generate HTML email template with auth page styling (dark theme with gold accents)
const generateEmailHTML = (
  type: EmailTemplateType,
  otp: string,
  firstName?: string
): string => {
  const template = getEmailTemplateData(type, firstName);
  
  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${template.title}</title>
  </head>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif; background-color: #0A0F1E; padding: 20px; margin: 0;">
    <div style="max-width: 500px; margin: 0 auto; background-color: #0F1525; border-radius: 16px; padding: 40px; box-shadow: 0 4px 24px rgba(0,0,0,0.3); border: 1px solid rgba(201, 168, 124, 0.2);">
      <!-- Logo and Header -->
      <div style="text-align: center; margin-bottom: 32px;">
        <div style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, rgba(201, 168, 124, 0.1), rgba(201, 168, 124, 0.05)); border-radius: 12px; border: 1px solid rgba(201, 168, 124, 0.2);">
          <h1 style="color: #C9A87C; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 1px;">HOPEWELL</h1>
          <p style="color: #C9A87C/80; margin: 4px 0 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Church Management System</p>
        </div>
      </div>
      
      <!-- Decorative Cross -->
      <div style="text-align: center; margin-bottom: 24px;">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#C9A87C" stroke-width="1.5" stroke-linecap="round">
          <path d="M12 2v20M2 12h20" stroke-linecap="round" />
        </svg>
      </div>
      
      <!-- Title -->
      <h2 style="color: #FFFFFF; margin: 0 0 16px 0; font-size: 24px; text-align: center; font-weight: 600;">${template.title}</h2>
      
      <!-- Description -->
      <p style="color: #9CA3AF; font-size: 15px; line-height: 1.6; margin: 0 0 28px 0; text-align: center;">
        ${template.description}
      </p>
      
      <!-- OTP Code Box -->
      <div style="background: linear-gradient(135deg, #0A0F1E 0%, #151D2E 100%); border-radius: 12px; padding: 28px; text-align: center; margin-bottom: 28px; border: 1px solid rgba(201, 168, 124, 0.3);">
        <p style="color: #C9A87C; font-size: 12px; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 1px; font-weight: 500;">Your Verification Code</p>
        <span style="color: #FFFFFF; font-size: 36px; font-weight: 700; letter-spacing: 12px; font-family: 'Courier New', monospace;">${otp}</span>
      </div>
      
      <!-- Expiry Warning -->
      <div style="text-align: center; margin-bottom: 24px;">
        <p style="color: #F59E0B; font-size: 13px; margin: 0; display: inline-flex; align-items: center; gap: 6px;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          This code will expire in <strong>3 minutes</strong>
        </p>
      </div>
      
      <!-- Help Text -->
      <div style="background-color: rgba(201, 168, 124, 0.05); border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <p style="color: #6B7280; font-size: 12px; margin: 0; text-align: center; line-height: 1.5;">
          Having trouble? The verification code can be entered on the login page.<br>
          If you didn't request this, please ignore this email.
        </p>
      </div>
      
      <!-- Footer -->
      <div style="border-top: 1px solid rgba(201, 168, 124, 0.1); padding-top: 20px; text-align: center;">
        <p style="color: #4B5563; font-size: 11px; margin: 0;">
          ${template.footerText}
        </p>
        <p style="color: #374151; font-size: 11px; margin: 8px 0 0 0;">
          &copy; ${new Date().getFullYear()} Hopewell Church. All rights reserved.
        </p>
      </div>
    </div>
    
    <!-- Fallback for email clients that don't support styled divs -->
    <div style="display: none; font-size: 0; line-height: 0;">
      Verification Code: ${otp}
    </div>
  </body>
</html>
`;
};

// Generate plain text version for accessibility
const generatePlainText = (type: EmailTemplateType, otp: string): string => {
  const template = getEmailTemplateData(type);
  
  return `
HOPEWELL CHMS - ${template.title.toUpperCase()}
=============================================

${template.description}

YOUR VERIFICATION CODE: ${otp}

This code will expire in 3 minutes.

${template.footerText}

© ${new Date().getFullYear()} Hopewell Church. All rights reserved.
  `.trim();
};

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
    const { email, userId, otpType = "email_verify", firstName } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ success: false, error: "Email is required" }),
        { headers: { "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Validate OTP type
    const validTypes = ["email_verify", "password_reset", "login_verification"];
    const type = validTypes.includes(otpType) ? otpType as EmailTemplateType : "email_verify";

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
      .eq("otp_type", type)
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
      .eq("otp_type", type)
      .is("verified_at", null);

    // Store OTP in database
    const { data: otpRecord, error: otpError } = await supabase
      .from("verification_otp")
      .insert({
        user_id: userId || null,
        email: email,
        otp_code: otp,
        otp_type: type,
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

    // Get template data for email
    const template = getEmailTemplateData(type, firstName);

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
          subject: template.subject,
          html: generateEmailHTML(type, otp, firstName),
          text: generatePlainText(type, otp),
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
