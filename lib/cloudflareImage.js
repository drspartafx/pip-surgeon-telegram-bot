// Cloudflare Workers AI — FLUX.1 Schnell (12B parameter model).
// Free tier: 10,000 Neurons/day, no credit card. FLUX images cost roughly 40 neurons
// each, so ~230/day are free; this bot uses 2-3. Enormous headroom.
//
// Chosen over Pollinations as the PRIMARY source because:
//   1. Far better image quality (real frontier model vs anonymous free tier)
//   2. Authenticated API — no datacenter-IP blocking (Pollinations 403s from CI runners)
//   3. No watermark
//
// Get credentials: dash.cloudflare.com → Workers AI → "Use REST API" → create token,
// and copy your Account ID from the same page.

const MODEL = "@cf/black-forest-labs/flux-1-schnell";
const MAX_PROMPT_CHARS = 2048; // hard API limit — longer prompts are rejected

export async function generateCloudflareImage(sceneDescription) {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !apiToken) {
    throw new Error("Cloudflare credentials missing (CLOUDFLARE_ACCOUNT_ID / CLOUDFLARE_API_TOKEN)");
  }

  const stylePreamble =
    "Black and gold minimalist financial illustration, dramatic lighting, high contrast, " +
    "premium editorial style, clean composition, no text, no words, no watermark, " +
    "no depiction of real identifiable people. Scene: ";

  // Truncate the scene, never the style preamble, so brand styling always survives.
  const availableForScene = MAX_PROMPT_CHARS - stylePreamble.length;
  const prompt = stylePreamble + sceneDescription.slice(0, availableForScene);

  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${MODEL}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      steps: 8, // schnell's max; it's a few-step distilled model, higher isn't better
      seed: Math.floor(Math.random() * 1_000_000_000),
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Cloudflare image API failed: ${res.status} ${text.slice(0, 300)}`);
  }

  const data = await res.json();
  const base64 = data?.result?.image;

  if (!base64) {
    throw new Error(`Cloudflare returned no image: ${JSON.stringify(data).slice(0, 300)}`);
  }

  // FLUX on Workers AI returns base64-encoded JPEG.
  return Buffer.from(base64, "base64");
}
