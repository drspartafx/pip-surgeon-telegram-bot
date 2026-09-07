import { sendTelegramMessage, sendTelegramPhotoBuffer } from "../lib/telegram.js";
import { buildBrandedImage } from "../lib/brandedPoster.js";
import { SIGNATURE } from "../lib/brand.js";

const CALENDAR_URL = "https://nfs.faireconomy.media/ff_calendar_thisweek.json";
const LOOKBACK_MINUTES = 20;

function isPopulated(value) {
  return value !== undefined && value !== null && String(value).trim() !== "";
}

async function getJustReleasedHighImpactUSD() {
  const res = await fetch(CALENDAR_URL);
  const events = await res.json();
  const now = Date.now();
  const lookbackMs = LOOKBACK_MINUTES * 60 * 1000;

  return events.filter((e) => {
    const isUSD = e.country === "USD";
    const isHighImpact = e.impact === "High";
    const hasActual = isPopulated(e.actual);
    if (!isUSD || !isHighImpact || !hasActual) return false;
    const eventTime = new Date(e.date).getTime();
    if (Number.isNaN(eventTime)) return false;
    return eventTime <= now && now - eventTime <= lookbackMs;
  });
}

function classifyResult(actual, forecast) {
  const a = parseFloat(actual);
  const f = parseFloat(forecast);
  if (Number.isNaN(a) || Number.isNaN(f)) return { tag: "", scene: "a golden chart line holding steady at a horizontal threshold, a small pulse of light marking the exact release point" };
  if (a > f) return { tag: " 📈 beat forecast", scene: "a golden upward arrow breaking through a calm horizontal chart line, bursts of light radiating from the breakout point" };
  if (a < f) return { tag: " 📉 missed forecast", scene: "a golden chart line breaking downward through a calm horizontal threshold, cracks spreading outward from the break point" };
  return { tag: " — in line with forecast", scene: "a golden chart line holding steady at a horizontal threshold, a small pulse of light marking the exact release point" };
}

async function main() {
  const events = await getJustReleasedHighImpactUSD();

  if (events.length === 0) {
    console.log("No newly released high-impact USD events this run. Skipping — expected most runs.");
    return;
  }

  for (const e of events) {
    const time = (e.date || "").slice(11, 16) || "TBD";
    const { tag, scene } = classifyResult(e.actual, e.forecast);
    const caption =
      `🚨 *JUST RELEASED — USD*\n\n*${e.title}*\n\n` +
      `Actual: *${e.actual}*${tag}\n` +
      `Forecast: ${e.forecast || "n/a"}\n` +
      `Previous: ${e.previous || "n/a"}\n` +
      `Released: ${time} UTC${SIGNATURE}`;

    try {
      const imageBuffer = await buildBrandedImage({
        title: e.title,
        scene,
        badge: "Pip Surgeon · Breaking",
        fallbackIcon: "spikeChart",
      });
      await sendTelegramPhotoBuffer(imageBuffer.toString("base64"), "image/png", caption);
    } catch (err) {
      // Image pipeline itself errored (not just AI background) — never let a release go
      // unposted over an image bug, fall back to text-only.
      console.error("Image build failed entirely, sending text-only:", err.message);
      await sendTelegramMessage(caption);
    }
    console.log("Release alert sent:", e.title);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
