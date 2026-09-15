import { GLYPHS, BADGES } from "./glyphs.js";

// Combines a main glyph with a small corner badge into a single composed icon.
// This is what lets ~53 glyphs x 16 badges cover 800+ visually distinct icons
// without hand-drawing each one — every part is drawn properly once, so every
// combination still looks deliberate.
//
// Placement convention (glyphs are all centred on 120,120 in a 240 box):
//   main  -> centred slightly up-left, scale 0.95
//   badge -> bottom-right corner, scale 0.30, on a dark disc so it reads separately

const BG = "#0a0a0a";
const DIM = "#c9a227";

function place(inner, targetX, targetY, s) {
  // Maps the glyph's own centre (120,120) onto (targetX, targetY) at scale s.
  const tx = targetX - 120 * s;
  const ty = targetY - 120 * s;
  return `<g transform="translate(${tx.toFixed(2)}, ${ty.toFixed(2)}) scale(${s})">${inner}</g>`;
}

export function composeIcon(glyphName, badgeName) {
  const glyphFn = GLYPHS[glyphName];
  if (!glyphFn) throw new Error(`Unknown glyph: "${glyphName}"`);

  const main = place(glyphFn(), 110, 112, 0.95);

  if (!badgeName) return main;

  const badgeFn = BADGES[badgeName];
  if (!badgeFn) throw new Error(`Unknown badge: "${badgeName}"`);

  // Dark disc keeps the badge legible even when it overlaps the main glyph.
  const disc = `<circle cx="184" cy="182" r="38" fill="${BG}" stroke="${DIM}" stroke-width="3"/>`;
  const badge = place(badgeFn(), 184, 182, 0.28);

  return main + disc + badge;
}

export const GLYPH_NAMES = Object.keys(GLYPHS);
export const BADGE_NAMES = Object.keys(BADGES);
