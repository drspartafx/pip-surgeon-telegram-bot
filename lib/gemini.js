// Google Gemini API (free tier). Get a key at https://aistudio.google.com/apikey

export async function generateText(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = "gemini-2.5-flash-lite"; // fast, cheap, stays inside the free tier

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

// Gemini 2.5 Flash Image (aka "Nano Banana") — free tier, same API key as text.
// Returns base64 image data + mime type (not a URL — this model returns inline bytes).
export async function generateImage(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = "gemini-2.5-flash-image";

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });

  const data = await res.json();
  const parts = data?.candidates?.[0]?.content?.parts || [];
  const imagePart = parts.find((p) => p.inlineData);

  if (!imagePart) {
    throw new Error(`Gemini image generation returned no image: ${JSON.stringify(data)}`);
  }

  return {
    base64: imagePart.inlineData.data,
    mimeType: imagePart.inlineData.mimeType || "image/png",
  };
}
