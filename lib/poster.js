import { ICONS } from "./icons.js";

const WIDTH = 1024;
const HEIGHT = 768;
const GOLD = "#e8c15a";
const GOLD_DIM = "#c9a227";
const BG = "#0a0a0a";

// Greedy word-wrap by estimated character width (SVG has no native text wrapping).
function wrapText(text, maxCharsPerLine, maxLines) {
  const words = text.toUpperCase().split(" ");
  const lines = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxCharsPerLine && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
    if (lines.length === maxLines - 1 && current.length > maxCharsPerLine) break;
  }
  if (current) lines.push(current);
  return lines.slice(0, maxLines);
}

/**
 * Builds a clean flat-style poster: solid dark background, bold gold title text,
 * one simple line-art icon below it, small brand footer. Matches a title-card
 * aesthetic (deliberately not photoreal AI art — image models render clean legible
 * text poorly, so the text is real SVG text, not AI-generated).
 */
export function buildPosterSVG(title, iconKey) {
  const iconFn = ICONS[iconKey] || ICONS.candlestickChannel;

  // Shorter titles get bigger text; longer ones shrink and wrap more.
  const fontSize = title.length > 42 ? 46 : title.length > 26 ? 56 : 68;
  const maxCharsPerLine = Math.floor((WIDTH - 160) / (fontSize * 0.62));
  const lines = wrapText(title, maxCharsPerLine, 3);
  const lineHeight = fontSize * 1.15;
  const titleBlockHeight = lines.length * lineHeight;
  const titleStartY = 150 - titleBlockHeight / 2 + fontSize * 0.8;

  const titleLines = lines
    .map((line, i) => `<text x="${WIDTH / 2}" y="${titleStartY + i * lineHeight}" ` +
      `font-family="Georgia, 'Times New Roman', serif" font-size="${fontSize}" font-weight="700" ` +
      `fill="${GOLD}" text-anchor="middle" letter-spacing="1">${escapeXml(line)}</text>`)
    .join("\n");

  return `
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${BG}"/>
  <rect x="18" y="18" width="${WIDTH - 36}" height="${HEIGHT - 36}" fill="none" stroke="${GOLD_DIM}" stroke-width="2" opacity="0.5"/>

  ${titleLines}

  <g transform="translate(${WIDTH / 2 - 150}, 240) scale(1.4)">
    ${iconFn()}
  </g>

  <line x1="${WIDTH / 2 - 120}" y1="700" x2="${WIDTH / 2 + 120}" y2="700" stroke="${GOLD_DIM}" stroke-width="1.5" opacity="0.6"/>
  <text x="${WIDTH / 2}" y="732" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700"
        fill="${GOLD}" text-anchor="middle" letter-spacing="4">PIP SURGEON</text>
</svg>`;
}

function escapeXml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
