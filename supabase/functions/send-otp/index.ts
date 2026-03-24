import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { TwilioClient } from "https://cdn.jsdelivr.net/npm/twilio/lib/rest/Twilio.js";
import { Resend } from "https://cdn.skypack.dev/resend";

const twilio = new TwilioClient(
  Deno.env.get("TWILIO_ACCOUNT_SID"),
  Deno.env.get("TWILIO_AUTH_TOKEN")
);

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: { "Access-Control-Allow-Origin": "*" } });
  }

  try {
    const { email, phone } = await req.json();
    const otp = generateOTP();

    // Store OTP in cache or database (in production, use Supabase for this)
    // For now, we'll just send it

    // Send SMS
    if (phone) {
      await twilio.messages.create({
        body: `Your Hopewell ChMS verification code is: ${otp}. Valid for 10 minutes.`,
        from: Deno.env.get("TWILIO_PHONE_NUMBER"),
        to: phone,
      });
    }

    // Send Email
    if (email) {
      await resend.emails.send({
        from: "noreply@hopewellchms.com",
        to: email,
        subject: "Your Hopewell ChMS Verification Code",
        html: `
          <h1>Verification Code</h1>
          <p>Your verification code is: <strong>${otp}</strong></p>
          <p>This code will expire in 10 minutes.</p>
        `,
      });
    }

    return new Response(
      JSON.stringify({ success: true, otp }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { "Content-Type": "application/json" }, status: 400 }
    );
  }
});
