// Each icon is self-contained SVG markup in a local 240x240 box, drawn in gold (#e8c15a)
// on transparent background. poster.js positions/scales these into the final layout.

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

export function brokenChainGold() {
  return `
    <g stroke="${GOLD}" stroke-width="7" fill="none">
      <circle cx="70" cy="90" r="32"/>
      <path d="M 155 65 A 32 32 0 0 1 175 120"/>
      <path d="M 195 145 A 32 32 0 0 1 175 120"/>
    </g>
    <rect x="95" y="140" width="50" height="38" fill="${GOLD}" stroke="none"/>
    <line x1="95" y1="140" x2="108" y2="122" stroke="${GOLD}" stroke-width="5"/>
    <line x1="145" y1="140" x2="158" y2="122" stroke="${GOLD}" stroke-width="5"/>
    <line x1="108" y1="122" x2="158" y2="122" stroke="${GOLD}" stroke-width="5"/>`;
}

export function pipMarker() {
  return `
    <g stroke="${GOLD}" stroke-width="5" stroke-linecap="round">
      <line x1="30" y1="170" x2="210" y2="170"/>
      <line x1="60" y1="155" x2="60" y2="170"/>
      <line x1="95" y1="155" x2="95" y2="170"/>
      <line x1="130" y1="155" x2="130" y2="170"/>
      <line x1="165" y1="140" x2="165" y2="170" stroke-width="7"/>
      <circle cx="165" cy="125" r="12" fill="${GOLD}" stroke="none"/>
    </g>`;
}

export function crackedCross() {
  return `
    <g fill="${GOLD}" stroke="none">
      <polygon points="105,60 135,60 135,105 180,105 180,135 135,135 135,180 105,180 105,135 60,135 60,105 105,105"/>
    </g>
    <g stroke="${GOLD_DIM}" stroke-width="3" fill="none">
      <line x1="120" y1="60" x2="105" y2="20"/>
      <line x1="105" y1="180" x2="90" y2="215"/>
      <line x1="60" y1="120" x2="20" y2="105"/>
      <line x1="180" y1="120" x2="215" y2="135"/>
    </g>`;
}

export function rocketChart() {
  return `
    <g stroke="${GOLD}" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="30,190 70,190 100,150 130,165 160,100 185,110 205,40"/>
      <polygon points="205,40 185,55 210,65" fill="${GOLD}" stroke="none"/>
    </g>`;
}

export function tiltedScaleBalloon() {
  return `
    <g stroke="${GOLD}" stroke-width="6" fill="none" stroke-linecap="round">
      <line x1="120" y1="70" x2="120" y2="105"/>
      <line x1="35" y1="90" x2="205" y2="140"/>
    </g>
    <line x1="35" y1="90" x2="35" y2="120" stroke="${GOLD}" stroke-width="4"/>
    <circle cx="35" cy="65" r="24" fill="none" stroke="${GOLD}" stroke-width="6"/>
    <line x1="205" y1="140" x2="205" y2="165" stroke="${GOLD}" stroke-width="4"/>
    <polygon points="185,165 225,165 205,200" fill="${GOLD_DIM}" stroke="none"/>
    <circle cx="120" cy="65" r="7" fill="${GOLD}" stroke="none"/>`;
}

export function seesawBoulder() {
  return `
    <polygon points="120,155 95,195 145,195" fill="${GOLD}"/>
    <line x1="30" y1="182" x2="205" y2="108" stroke="${GOLD}" stroke-width="7" stroke-linecap="round"/>
    <circle cx="42" cy="178" r="10" fill="${GOLD}"/>
    <circle cx="188" cy="98" r="44" fill="none" stroke="${GOLD}" stroke-width="6"/>
    <circle cx="188" cy="98" r="30" fill="${GOLD}" opacity="0.15"/>`;
}

export function debrisGoldBar() {
  return `
    <rect x="85" y="115" width="70" height="50" fill="${GOLD}"/>
    <line x1="85" y1="115" x2="102" y2="92" stroke="${GOLD}" stroke-width="5"/>
    <line x1="155" y1="115" x2="172" y2="92" stroke="${GOLD}" stroke-width="5"/>
    <line x1="102" y1="92" x2="172" y2="92" stroke="${GOLD}" stroke-width="5"/>
    <g stroke="${GOLD_DIM}" stroke-width="4" opacity="0.75" stroke-linecap="round">
      <line x1="40" y1="40" x2="65" y2="95"/>
      <line x1="60" y1="30" x2="80" y2="85"/>
      <line x1="200" y1="35" x2="175" y2="90"/>
      <line x1="180" y1="25" x2="160" y2="80"/>
      <line x1="50" y1="200" x2="75" y2="165"/>
      <line x1="190" y1="205" x2="165" y2="170"/>
    </g>`;
}

export function shatteringFloor() {
  return `
    <g>
      <rect x="105" y="50" width="30" height="100" fill="${GOLD_DIM}"/>
      <line x1="120" y1="50" x2="120" y2="35" stroke="${GOLD_DIM}" stroke-width="4"/>
      <line x1="120" y1="150" x2="120" y2="165" stroke="${GOLD_DIM}" stroke-width="4"/>
      <line x1="30" y1="150" x2="210" y2="150" stroke="${GOLD}" stroke-width="5"/>
      <polyline points="90,150 105,165 95,180" fill="none" stroke="${GOLD}" stroke-width="3"/>
      <polyline points="150,150 138,168 155,182" fill="none" stroke="${GOLD}" stroke-width="3"/>
    </g>`;
}

export function crackingArrowFacade() {
  return `
    <g stroke="${GOLD}" stroke-width="5" fill="none">
      <rect x="60" y="70" width="120" height="110"/>
      <line x1="80" y1="70" x2="80" y2="180"/>
      <line x1="105" y1="70" x2="105" y2="180"/>
      <line x1="135" y1="70" x2="135" y2="180"/>
      <line x1="160" y1="70" x2="160" y2="180"/>
      <polygon points="40,140 150,95 135,115 200,100" fill="${GOLD}" stroke="none"/>
    </g>
    <g stroke="${GOLD_DIM}" stroke-width="2" fill="none" opacity="0.7">
      <polyline points="150,95 160,110 145,120"/>
      <polyline points="135,115 148,128 130,138"/>
    </g>`;
}

// --- Dedicated icons for recurring SYSTEM posts ---
// These are reserved exclusively for Market Pulse, Weekly Digest, and the three
// news-release outcomes. They are deliberately NOT shared with the educational
// topic pool, because system posts fire far more often and any overlap becomes
// visible to subscribers fast. See lib/iconAssignments.js for the registry.

export function pulseRings() {
  return `
    <g fill="none" stroke="${GOLD}" stroke-linecap="round">
      <circle cx="120" cy="118" r="14" fill="${GOLD}" stroke="none"/>
      <path d="M 152 86 A 45 45 0 0 1 152 150" stroke-width="6"/>
      <path d="M 88 150 A 45 45 0 0 1 88 86" stroke-width="6"/>
      <path d="M 178 60 A 82 82 0 0 1 178 176" stroke-width="5" opacity="0.65"/>
      <path d="M 62 176 A 82 82 0 0 1 62 60" stroke-width="5" opacity="0.65"/>
    </g>`;
}

export function weekBars() {
  const bars = [
    [45, 130], [80, 95], [115, 145], [150, 75], [185, 110],
  ];
  const rects = bars
    .map(([x, top]) => `<rect x="${x - 11}" y="${top}" width="22" height="${175 - top}" fill="${GOLD}"/>`)
    .join("");
  return `
    <g>
      ${rects}
      <line x1="25" y1="175" x2="215" y2="175" stroke="${GOLD}" stroke-width="5" stroke-linecap="round"/>
      <polyline points="45,118 80,83 115,133 150,63 185,98" fill="none" stroke="${GOLD_DIM}"
                stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/>
    </g>`;
}

export function breakoutUp() {
  return `
    <g stroke="${GOLD_DIM}" stroke-width="5" stroke-linecap="round">
      <line x1="30" y1="130" x2="98" y2="130"/>
      <line x1="142" y1="130" x2="210" y2="130"/>
    </g>
    <g stroke="${GOLD}" stroke-width="8" stroke-linecap="round" fill="none">
      <line x1="120" y1="185" x2="120" y2="70"/>
    </g>
    <polygon points="120,45 98,82 142,82" fill="${GOLD}"/>
    <g stroke="${GOLD_DIM}" stroke-width="3" opacity="0.8" stroke-linecap="round">
      <line x1="98" y1="130" x2="86" y2="118"/>
      <line x1="142" y1="130" x2="154" y2="118"/>
    </g>`;
}

export function breakdownDown() {
  return `
    <g stroke="${GOLD_DIM}" stroke-width="5" stroke-linecap="round">
      <line x1="30" y1="110" x2="98" y2="110"/>
      <line x1="142" y1="110" x2="210" y2="110"/>
    </g>
    <g stroke="${GOLD}" stroke-width="8" stroke-linecap="round" fill="none">
      <line x1="120" y1="55" x2="120" y2="170"/>
    </g>
    <polygon points="120,195 98,158 142,158" fill="${GOLD}"/>
    <g stroke="${GOLD_DIM}" stroke-width="3" opacity="0.8" stroke-linecap="round">
      <line x1="98" y1="110" x2="86" y2="122"/>
      <line x1="142" y1="110" x2="154" y2="122"/>
    </g>`;
}

export function steadyLevel() {
  return `
    <g stroke="${GOLD}" stroke-width="7" stroke-linecap="round">
      <line x1="45" y1="98" x2="195" y2="98"/>
      <line x1="45" y1="142" x2="195" y2="142"/>
    </g>
    <circle cx="120" cy="120" r="20" fill="none" stroke="${GOLD}" stroke-width="6"/>
    <circle cx="120" cy="120" r="7" fill="${GOLD}"/>`;
}

export function sunrise() {
  return `
    <g stroke="${GOLD}" stroke-width="5" fill="none">
      <line x1="20" y1="150" x2="220" y2="150"/>
      <path d="M 60 150 A 60 60 0 0 1 180 150" fill="${GOLD}" opacity="0.18"/>
      <path d="M 60 150 A 60 60 0 0 1 180 150"/>
    </g>
    <g stroke="${GOLD}" stroke-width="4" stroke-linecap="round">
      <line x1="120" y1="55" x2="120" y2="35"/>
      <line x1="75" y1="70" x2="60" y2="55"/>
      <line x1="165" y1="70" x2="180" y2="55"/>
    </g>
    <polyline points="30,180 65,180 85,160 105,190 130,150 150,175 210,175"
              stroke="${GOLD_DIM}" stroke-width="3" fill="none" opacity="0.8"
              stroke-linecap="round" stroke-linejoin="round"/>
  `;
}

export const ICONS = {
  // Educational topic pool
  goldBar, spikeChart, magnifierCalendar, gavelScale, stethoscopeChart,
  candlestickChannel, globeDollar, brokenChainGold, pipMarker, crackedCross,
  rocketChart, tiltedScaleBalloon, seesawBoulder, debrisGoldBar,
  shatteringFloor, crackingArrowFacade,
  // Reserved for recurring system posts (see lib/iconAssignments.js)
  sunrise, pulseRings, weekBars, breakoutUp, breakdownDown, steadyLevel,
};

export function hammockRelax() {
  return `
    <g stroke="${GOLD}" stroke-width="6" stroke-linecap="round" fill="none">
      <line x1="50" y1="60" x2="50" y2="175"/>
      <line x1="190" y1="60" x2="190" y2="175"/>
      <path d="M 50 100 Q 120 155 190 100" stroke-width="7"/>
    </g>
    <line x1="20" y1="175" x2="220" y2="175" stroke="${GOLD_DIM}" stroke-width="4" opacity="0.7" stroke-linecap="round"/>
    <circle cx="185" cy="52" r="16" fill="${GOLD}" opacity="0.85"/>
  `;
}

Object.assign(ICONS, { hammockRelax });
