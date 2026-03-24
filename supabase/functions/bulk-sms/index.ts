import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: { "Access-Control-Allow-Origin": "*" } });
  }

  try {
    const { recipientList, message } = await req.json();
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${Deno.env.get("TWILIO_ACCOUNT_SID")}/Messages.json`;

    const results = [];

    for (const phone of recipientList) {
      const response = await fetch(twilioUrl, {
        method: "POST",
        headers: {
          "Authorization": `Basic ${btoa(`${Deno.env.get("TWILIO_ACCOUNT_SID")}:${Deno.env.get("TWILIO_AUTH_TOKEN")}`)}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          From: Deno.env.get("TWILIO_PHONE_NUMBER")!,
          To: phone,
          Body: message,
        }).toString(),
      });

      results.push({
        phone,
        success: response.ok,
        status: response.status,
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
