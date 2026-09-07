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

// Generates an image scene description for a given topic, instead of relying on a
// hand-written scene per topic. Bakes in the rules learned from real failures:
// combined/abstract scenes get partially dropped by the image model, single concrete
// objects render reliably. This is what lets the system handle any topic, not just a
// fixed hardcoded list.
export async function generateImageScene(topic, articleText) {
  const prompt = `You are writing an image-generation prompt for a black-and-gold financial trading illustration.

RULES (learned from real failures — follow them exactly):
- Describe exactly ONE concrete physical object or one single continuous action.
- NEVER combine two unrelated objects/concepts in one scene. Example of what fails: "a magnifying glass over a calendar" — the image model renders a random magnifying glass and drops the calendar entirely, losing all connection to the topic.
- If the topic is abstract, psychological, or about a real named person, translate it into ONE simple physical metaphor object instead (a tilted scale, a cracking structure, a single chart spike, a folded object) — not a multi-part illustration and never a depiction of a real person's likeness.
- No text, words, numbers, or logos anywhere in the described scene.
- Output ONLY the scene description itself as one sentence. No preamble, no quotation marks, no explanation.

Topic: "${topic}"
Article text for context: "${articleText}"

Scene:`;

  const scene = await generateText(prompt);
  // Strip stray quotes/formatting Gemini sometimes adds despite instructions.
  return scene.replace(/^["']|["']$/g, "").trim();
}
