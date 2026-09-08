import { sendTelegramPhotoBuffer, sendTelegramPoll } from "../lib/telegram.js";
import { generateText } from "../lib/gemini.js";
import { buildPosterSVG } from "../lib/poster.js";
import { renderSVGToPNGBuffer } from "../lib/renderImage.js";
import { BRAND_VOICE, SIGNATURE } from "../lib/brand.js";
import { SYSTEM_ICONS } from "../lib/iconAssignments.js";

async function main() {
  const prompt = `${BRAND_VOICE}

Write a short "New Week Ahead" briefing for Sunday evening, as traders prepare for the week's market open.
Set the tone for the week — sharp, composed, not hype. Include one line reminding traders to plan setups rather than chase, and one line noting a USD sentiment poll follows this post.
3-4 sentences total. No hashtags, no title line.`;

  const body = await generateText(prompt);
  const caption = `🗓️ *NEW WEEK AHEAD*\n\n${body}${SIGNATURE}`;

  const svg = buildPosterSVG("NEW WEEK AHEAD", SYSTEM_ICONS.weeklyBriefing);
  const pngBuffer = await renderSVGToPNGBuffer(svg);

  await sendTelegramPhotoBuffer(pngBuffer.toString("base64"), "image/png", caption);
  console.log("Weekly briefing sent.");

  await sendTelegramPoll(
    "This week — where's the dollar heading?",
    ["Strengthening 💪", "Weakening 📉", "Range-bound / choppy 🔁"]
    // Channels only support anonymous polls — non-anonymous is a group-only feature.
  );
  console.log("Weekly sentiment poll sent.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
