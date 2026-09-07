import { sendTelegramPhotoBuffer } from "../lib/telegram.js";
import { buildPosterSVG } from "../lib/poster.js";
import { renderSVGToPNGBuffer } from "../lib/renderImage.js";
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

// Maps the real outcome to one of the existing reliable icons — no AI involved,
// so the icon is always logically tied to what actually happened.
function classifyResult(actual, forecast) {
  const a = parseFloat(actual);
  const f = parseFloat(forecast);
  if (Number.isNaN(a) || Number.isNaN(f)) return { tag: "", icon: "spikeChart" };
  if (a > f) return { tag: " 📈 beat forecast", icon: "rocketChart" };
  if (a < f) return { tag: " 📉 missed forecast", icon: "shatteringFloor" };
  return { tag: " — in line with forecast", icon: "spikeChart" };
}

async function main() {
  const events = await getJustReleasedHighImpactUSD();

  if (events.length === 0) {
    console.log("No newly released high-impact USD events this run. Skipping — expected most runs.");
    return;
  }

  for (const e of events) {
    const time = (e.date || "").slice(11, 16) || "TBD";
    const { tag, icon } = classifyResult(e.actual, e.forecast);
    const caption =
      `🚨 *JUST RELEASED — USD*\n\n*${e.title}*\n\n` +
      `Actual: *${e.actual}*${tag}\n` +
      `Forecast: ${e.forecast || "n/a"}\n` +
      `Previous: ${e.previous || "n/a"}\n` +
      `Released: ${time} UTC${SIGNATURE}`;

    const svg = buildPosterSVG(e.title, icon);
    const pngBuffer = await renderSVGToPNGBuffer(svg);
    await sendTelegramPhotoBuffer(pngBuffer.toString("base64"), "image/png", caption);
    console.log("Release alert sent:", e.title);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
