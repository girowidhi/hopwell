import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const MPESA_API_URL = "https://api.safaricom.co.ke/mpesa/stkpush/v1/";

async function getMpesaToken() {
  const consumerKey = Deno.env.get("MPESA_CONSUMER_KEY");
  const consumerSecret = Deno.env.get("MPESA_CONSUMER_SECRET");
  const auth = btoa(`${consumerKey}:${consumerSecret}`);

  const response = await fetch(
    "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    }
  );

  const data = await response.json();
  return data.access_token;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: { "Access-Control-Allow-Origin": "*" } });
  }

  try {
    const { phoneNumber, amount, memberName } = await req.json();

    const token = await getMpesaToken();
    const timestamp = new Date().toISOString().replace(/[:-]/g, "").split(".")[0];
    const passkey = Deno.env.get("MPESA_PASSKEY");
    const shortcode = Deno.env.get("MPESA_SHORTCODE");

    const password = btoa(`${shortcode}${passkey}${timestamp}`);

    const response = await fetch(`${MPESA_API_URL}stk/pop/v1`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: Math.floor(amount),
        PartyA: phoneNumber.replace(/^\+/, ""),
        PartyB: shortcode,
        PhoneNumber: phoneNumber.replace(/^\+/, ""),
        CallBackURL: Deno.env.get("MPESA_CALLBACK_URL"),
        AccountReference: `Giving-${memberName}`,
        TransactionDesc: "Church Giving",
      }),
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { "Content-Type": "application/json" }, status: 400 }
    );
  }
});
