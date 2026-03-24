import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://cdn.skypack.dev/resend";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: { "Access-Control-Allow-Origin": "*" } });
  }

  try {
    const { recipientList, subject, htmlContent } = await req.json();

    const results = [];

    for (const email of recipientList) {
      const response = await resend.emails.send({
        from: "noreply@hopewellchms.com",
        to: email,
        subject,
        html: htmlContent,
      });

      results.push({
        email,
        success: !response.error,
        messageId: response.data?.id || null,
      });
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { "Content-Type": "application/json" }, status: 400 }
    );
  }
});
