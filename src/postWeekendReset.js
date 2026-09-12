import { sendTelegramPhotoBuffer } from "../lib/telegram.js";
import { generateText } from "../lib/gemini.js";
import { buildPosterSVG } from "../lib/poster.js";
import { renderSVGToPNGBuffer } from "../lib/renderImage.js";
import { BRAND_VOICE, SIGNATURE } from "../lib/brand.js";
import { SYSTEM_ICONS } from "../lib/iconAssignments.js";

async function main() {
  const prompt = `${BRAND_VOICE}

Write a short Saturday "Weekend Reset" message for a trading community. Markets are closed — this is explicitly NOT a trading day, and the message should not reference any live setups or price action.

Cover, briefly:
- Review/backtest the week's trades honestly — what actually worked, what didn't
- Consider whether any profit sitting in the account should actually be withdrawn, rather than left there to eventually get traded away
- Then close the charts entirely — rest, get outside, recharge away from screens

Tone: calm, permission-giving, not another instruction to grind. The point is that stepping away is part of the discipline, not a break from it.
3-5 sentences. No hashtags, no title line.`;

  const body = await generateText(prompt);
  const caption = `🌤️ *WEEKEND RESET*\n\n${body}${SIGNATURE}`;

  const svg = buildPosterSVG("WEEKEND RESET", SYSTEM_ICONS.weekendReset);
  const pngBuffer = await renderSVGToPNGBuffer(svg);

  await sendTelegramPhotoBuffer(pngBuffer.toString("base64"), "image/png", caption);
  console.log("Weekend reset post sent.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
