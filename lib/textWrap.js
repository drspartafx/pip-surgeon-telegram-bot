// Shared greedy word-wrap for SVG text (SVG has no native text wrapping).
export function wrapText(text, maxCharsPerLine, maxLines) {
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
