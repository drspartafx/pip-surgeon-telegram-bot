// Each icon is self-contained SVG markup in a local 240x240 box, drawn in gold (#e8c15a)
// on transparent background. poster.js positions/scales these into the final layout.
// Keeping icons simple and geometric on purpose — matches the clean flat-poster style,
// not photoreal AI art.

const GOLD = "#e8c15a";
const GOLD_DIM = "#c9a227";

export function goldBar() {
  return `
    <g>
      <polygon points="60,150 180,150 200,120 80,120" fill="${GOLD}" opacity="0.15"/>
      <rect x="60" y="120" width="120" height="60" fill="none" stroke="${GOLD}" stroke-width="5"/>
      <line x1="60" y1="120" x2="80" y2="95" stroke="${GOLD}" stroke-width="5"/>
      <line x1="180" y1="120" x2="200" y2="95" stroke="${GOLD}" stroke-width="5"/>
      <line x1="80" y1="95" x2="200" y2="95" stroke="${GOLD}" stroke-width="5"/>
      <line x1="200" y1="95" x2="200" y2="120" stroke="${GOLD}" stroke-width="5"/>
    </g>`;
}

export function spikeChart() {
  return `
    <g stroke="${GOLD}" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="30,150 80,150 100,150 120,50 140,190 160,150 210,150"/>
      <line x1="20" y1="190" x2="220" y2="190" stroke="${GOLD_DIM}" stroke-width="2" opacity="0.5"/>
    </g>`;
}

export function magnifierCalendar() {
  return `
    <g stroke="${GOLD}" stroke-width="5" fill="none" stroke-linejoin="round">
      <rect x="45" y="60" width="120" height="110" rx="8"/>
      <line x1="45" y1="90" x2="165" y2="90"/>
      <line x1="75" y1="45" x2="75" y2="70"/>
      <line x1="135" y1="45" x2="135" y2="70"/>
      <circle cx="90" cy="130" r="10" fill="${GOLD}" stroke="none"/>
      <circle cx="150" cy="125" r="42" fill="none" stroke="${GOLD}" stroke-width="6"/>
      <line x1="180" y1="155" x2="210" y2="185" stroke="${GOLD}" stroke-width="7" stroke-linecap="round"/>
    </g>`;
}

export function gavelScale() {
  return `
    <g stroke="${GOLD}" stroke-width="5" fill="none" stroke-linecap="round">
      <line x1="120" y1="50" x2="120" y2="180"/>
      <line x1="60" y1="80" x2="180" y2="80"/>
      <path d="M 60 80 L 40 130 A 22 22 0 0 0 84 130 Z"/>
      <path d="M 180 80 L 160 130 A 22 22 0 0 0 204 130 Z"/>
      <line x1="90" y1="180" x2="150" y2="180"/>
      <circle cx="120" cy="50" r="7" fill="${GOLD}" stroke="none"/>
    </g>`;
}

export function stethoscopeChart() {
  return `
    <g>
      <polyline points="30,170 60,170 75,120 95,190 115,150 135,170 210,170"
                stroke="${GOLD_DIM}" stroke-width="4" fill="none" opacity="0.5"
                stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M 80 60 C 80 110 100 135 125 135 C 150 135 170 110 170 60"
            fill="none" stroke="${GOLD}" stroke-width="7" stroke-linecap="round"/>
      <circle cx="80" cy="60" r="8" fill="${GOLD}"/>
      <circle cx="170" cy="60" r="8" fill="${GOLD}"/>
      <circle cx="125" cy="150" r="16" fill="none" stroke="${GOLD}" stroke-width="6"/>
    </g>`;
}

export function candlestickChannel() {
  const candles = [
    [40, 150, 170, "down"], [65, 140, 165, "up"], [90, 125, 155, "up"],
    [115, 110, 140, "up"], [140, 90, 125, "up"], [165, 75, 110, "up"],
    [190, 60, 95, "up"],
  ];
  const bodies = candles
    .map(([x, top, bottom, dir]) => {
      const color = dir === "up" ? GOLD : GOLD_DIM;
      return `<rect x="${x - 6}" y="${top}" width="12" height="${bottom - top}" fill="${color}"/>
              <line x1="${x}" y1="${top - 8}" x2="${x}" y2="${bottom + 8}" stroke="${color}" stroke-width="2"/>`;
    })
    .join("");
  return `
    <g>
      <line x1="20" y1="185" x2="200" y2="70" stroke="${GOLD}" stroke-width="3" opacity="0.55"/>
      <line x1="20" y1="150" x2="215" y2="35" stroke="${GOLD}" stroke-width="3" opacity="0.55"/>
      ${bodies}
    </g>`;
}

export function globeDollar() {
  return `
    <g stroke="${GOLD}" stroke-width="5" fill="none">
      <circle cx="120" cy="115" r="75"/>
      <ellipse cx="120" cy="115" rx="30" ry="75"/>
      <line x1="45" y1="115" x2="195" y2="115"/>
      <line x1="55" y1="75" x2="185" y2="75"/>
      <line x1="55" y1="155" x2="185" y2="155"/>
      <text x="120" y="128" font-family="Georgia, serif" font-size="46" font-weight="700"
            fill="${GOLD}" stroke="none" text-anchor="middle">$</text>
    </g>`;
}

export const ICONS = {
  goldBar,
  spikeChart,
  magnifierCalendar,
  gavelScale,
  stethoscopeChart,
  candlestickChannel,
  globeDollar,
};
