import { sendTelegramPhotoBuffer } from "../lib/telegram.js";
import { generateText } from "../lib/gemini.js";
import { buildPosterSVG } from "../lib/poster.js";
import { renderSVGToPNGBuffer } from "../lib/renderImage.js";
import { BRAND_VOICE, SIGNATURE } from "../lib/brand.js";
import { SYSTEM_ICONS } from "../lib/iconAssignments.js";

const CALENDAR_URL = "https://nfs.faireconomy.media/ff_calendar_thisweek.json";

// No database needed: the "this week" calendar feed already retains every event's
// actual/forecast values as they get released through the week, so Friday can just
// re-fetch it and pull out everything with a populated "actual" field.
async function getThisWeeksReleasedUSDEvents() {
  const res = await fetch(CALENDAR_URL);
  const events = await res.json();
  return events.filter((e) => e.country === "USD" && e.impact === "High" && isPopulated(e.actual));
}

function isPopulated(value) {
  return value !== undefined && value !== null && String(value).trim() !== "";
}

async function main() {
  const events = await getThisWeeksReleasedUSDEvents();

  const eventsList = events.length
    ? events.map((e) => `- ${e.title}: actual ${e.actual}, forecast ${e.forecast || "n/a"}, previous ${e.previous || "n/a"}`).join("\n")
    : "No high-impact USD releases logged this week.";

  const prompt = `${BRAND_VOICE}

Write a "Week in Review" digest summarizing this week's high-impact USD economic releases and what they meant for Gold, USDJPY, US30, and Nasdaq traders.

THIS WEEK'S USD RELEASES:
${eventsList}

If the list is empty, say plainly it was a quiet data week and pivot to one general reminder about discipline/risk management instead of fabricating events.

4-6 sentences or a tight bullet list. No specific trade signals or price predictions.`;

  const body = await generateText(prompt);
  const caption = `📊 *WEEK IN REVIEW*\n\n${body}${SIGNATURE}`;

  const svg = buildPosterSVG("WEEK IN REVIEW", SYSTEM_ICONS.weeklyDigest);
  const pngBuffer = await renderSVGToPNGBuffer(svg);

  await sendTelegramPhotoBuffer(pngBuffer.toString("base64"), "image/png", caption);
  console.log("Weekly digest sent.", events.length, "events covered.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
