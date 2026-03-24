import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: { "Access-Control-Allow-Origin": "*" } });
  }

  try {
    const { prayerText } = await req.json();
    const openaiKey = Deno.env.get("OPENAI_API_KEY");

    // Classify prayer requests into categories
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are an assistant that categorizes prayer requests. Respond with only a JSON object with 'category' field.",
          },
          {
            role: "user",
            content: `Categorize this prayer request into one of: healing, financial, family, spiritual_growth, work, guidance, other. Prayer: "${prayerText}"`,
          },
        ],
        temperature: 0.3,
        max_tokens: 100,
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
