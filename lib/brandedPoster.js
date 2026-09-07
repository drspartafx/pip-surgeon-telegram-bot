import sharp from "sharp";
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
  // First line's baseline is pushed down enough that even its cap-height top clears
  // the corner badge zone, regardless of font size or title length.
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

export async function buildBrandedImage({ title, scene, badge = "Pip Surgeon", fallbackIcon = "candlestickChannel" }) {
  try {
    const background = await fetchAIBackground(scene, { width: WIDTH, height: HEIGHT });
    const overlaySvg = buildOverlaySVG(title, badge);
    const overlayBuffer = await renderSVGToPNGBuffer(overlaySvg);

    return await sharp(background)
      .resize(WIDTH, HEIGHT, { fit: "cover" })
      .composite([{ input: overlayBuffer, top: 0, left: 0 }])
      .png()
      .toBuffer();
  } catch (err) {
    console.error("AI background failed, using fallback poster:", err.message);
    const fallbackSvg = buildPosterSVG(title, fallbackIcon);
    return renderSVGToPNGBuffer(fallbackSvg);
  }
}
