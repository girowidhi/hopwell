import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: { "Access-Control-Allow-Origin": "*" } });
  }

  try {
    const { visitorData, eventDetails } = await req.json();
    const openaiKey = Deno.env.get("OPENAI_API_KEY");

    // Generate follow-up email for visitors
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
              "You are a friendly church staff member crafting personalized follow-up emails for visitors.",
          },
          {
            role: "user",
            content: `Write a warm follow-up email for this visitor: ${JSON.stringify(visitorData)}. Event details: ${JSON.stringify(eventDetails)}`,
          },
        ],
        temperature: 0.8,
        max_tokens: 500,
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
