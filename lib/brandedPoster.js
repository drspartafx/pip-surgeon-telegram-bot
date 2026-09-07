import sharp from "sharp";
import { generateCloudflareImage } from "./cloudflareImage.js";
import { fetchAIBackground } from "./aiImage.js";
import { renderSVGToPNGBuffer } from "./renderImage.js";
import { wrapText } from "./textWrap.js";
import { buildPosterSVG } from "./poster.js";

const WIDTH = 1024;
const HEIGHT = 768;
const GOLD = "#e8c15a";
const CORNER_ZONE_HEIGHT = 38; // reserved strip for the small brand mark — title never enters this

function buildOverlaySVG(title, badge) {
  const fontSize = title.length > 42 ? 42 : title.length > 26 ? 50 : 64;
  const maxCharsPerLine = Math.floor((WIDTH - 140) / (fontSize * 0.6));
  const lines = wrapText(title, maxCharsPerLine, 3);
  const lineHeight = fontSize * 1.15;
  const firstLineY = CORNER_ZONE_HEIGHT + fontSize * 0.95;
  const topBarHeight = firstLineY + (lines.length - 1) * lineHeight + fontSize * 0.4;

  const titleLines = lines
    .map((line, i) => {
      const y = firstLineY + i * lineHeight;
      const escaped = escapeXml(line);
      return `<text x="${WIDTH / 2}" y="${y}" font-family="Georgia, 'Times New Roman', serif" ` +
        `font-size="${fontSize}" font-weight="700" fill="${GOLD}" stroke="#000000" stroke-width="1.5" ` +
        `paint-order="stroke" text-anchor="middle" letter-spacing="1">${escaped}</text>`;
    })
    .join("\n");

  return `
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="topFade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#000000" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <rect x="0" y="0" width="${WIDTH}" height="${topBarHeight}" fill="url(#topFade)"/>
  ${titleLines}

  <!-- Small, subtle brand mark confined to its own reserved strip — never touches the title -->
  <text x="${WIDTH - 24}" y="24" font-family="Arial, Helvetica, sans-serif" font-size="14"
        font-weight="700" fill="${GOLD}" fill-opacity="0.8" text-anchor="end" letter-spacing="2">${escapeXml(badge.toUpperCase())}</text>
</svg>`;
}

function escapeXml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Three-tier image strategy, best-first:
 *   1. Cloudflare FLUX.1 Schnell — 12B model, authenticated, no watermark (primary)
 *   2. Pollinations — free/no-key, lower quality, unreliable from datacenter IPs (fallback)
 *   3. Local SVG icon poster — always works, no network needed (last resort)
 * Branded text is composited locally in all cases, so it's always crisp and legible.
 */
export async function buildBrandedImage({ title, scene, badge = "Pip Surgeon", fallbackIcon = "candlestickChannel" }) {
  const overlaySvg = buildOverlaySVG(title, badge);

  let background = null;

  try {
    background = await generateCloudflareImage(scene);
  } catch (err) {
    console.error("Cloudflare FLUX failed, trying Pollinations:", err.message);
    try {
      background = await fetchAIBackground(scene, { width: WIDTH, height: HEIGHT });
    } catch (err2) {
      console.error("Pollinations also failed, using local icon poster:", err2.message);
    }
  }

  if (!background) {
    const fallbackSvg = buildPosterSVG(title, fallbackIcon);
    return renderSVGToPNGBuffer(fallbackSvg);
  }

  const overlayBuffer = await renderSVGToPNGBuffer(overlaySvg);
  return sharp(background)
    .resize(WIDTH, HEIGHT, { fit: "cover" })
    .composite([{ input: overlayBuffer, top: 0, left: 0 }])
    .png()
    .toBuffer();
}
