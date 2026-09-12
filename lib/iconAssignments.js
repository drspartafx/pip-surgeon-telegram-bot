// SINGLE SOURCE OF TRUTH for which icon each recurring system post uses.
//
// Why this file exists: icons were previously hardcoded inline in each src/ script,
// which made it invisible when two post types quietly picked the same one. Five real
// collisions built up that way (Market Pulse vs the "Dollar's Reserve Status" topic,
// Weekly Digest vs "Plaza Accord", and all three news-release outcomes vs educational
// topics). Centralising them here makes overlaps obvious and lets scripts/auditIcons.js
// catch new ones automatically.
//
// RULE: icons listed here are RESERVED for system posts and must never be reused in
// the educational topic pool in src/postEducational.js. System posts fire far more
// often, so any overlap becomes visible to subscribers quickly.

export const SYSTEM_ICONS = {
  marketPulse: "pulseRings",
  weeklyDigest: "weekBars",
  weeklyBriefing: "sunrise",
  releaseBeat: "breakoutUp",
  releaseMiss: "breakdownDown",
  releaseInline: "steadyLevel",
  weekendReset: "hammockRelax",
};

// Convenience list for the audit script.
export const RESERVED_ICON_NAMES = Object.values(SYSTEM_ICONS);
