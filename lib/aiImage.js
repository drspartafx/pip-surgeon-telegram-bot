// Fetches a real AI-generated background image from Pollinations.ai — free, no key.
// A random seed is attached on every call so repeated topics/scenes still produce a
// visually distinct image each time (Pollinations otherwise caches identical prompts).
export async function fetchAIBackground(sceneDescription, { width = 1024, height = 768 } = {}) {
  const prompt =
    "Black and gold minimalist financial illustration, dramatic lighting, high contrast, " +
    "premium editorial style, clean composition, no text, no words, no watermark, no people's faces. " +
    `Depict this specific scene literally: ${sceneDescription}`;

  const encoded = encodeURIComponent(prompt);
  const seed = Math.floor(Math.random() * 1_000_000_000);
  const url = `https://image.pollinations.ai/prompt/${encoded}?width=${width}&height=${height}&nologo=true&seed=${seed}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Pollinations fetch failed: ${res.status} ${res.statusText}`);
  }
  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
