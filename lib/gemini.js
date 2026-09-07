// Google Gemini API (free tier). Get a key at https://aistudio.google.com/apikey
//
// IMPORTANT: only the TEXT model here has a genuine free tier. Gemini's image
// models (2.5/3.1 Flash Image, aka "Nano Banana") are paid-only with no free
// allowance as of this build — deliberately NOT used, to guarantee $0 spend.
// Images are generated via Pollinations.ai instead (see src/postEducational.js).

export async function generateText(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = "gemini-3.5-flash-lite"; // current model with a genuine free tier (confirmed Sept 2026)

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error(`Gemini text generation failed: ${JSON.stringify(data)}`);
  }
  return text.trim();
}
