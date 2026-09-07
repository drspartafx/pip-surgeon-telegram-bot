import sharp from "sharp";

// Renders an SVG string to a PNG buffer. Used for the poster images — no AI image
// generation involved, so no cost and no risk of garbled text.
export async function renderSVGToPNGBuffer(svgString) {
  return sharp(Buffer.from(svgString)).png().toBuffer();
}
