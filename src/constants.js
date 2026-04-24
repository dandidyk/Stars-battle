export const C = {
  BG:      0x0d0d1a,
  PLAYER:  0x4fc3f7,
  AI:      0xef5350,
  NEUTRAL: 0x555566,
  TEXT:    '#e0e8ff',
  SUBTEXT: '#888899',
};

export const DIFFICULTY = {
  easy:   { stars: 8,  aiInterval: 2000 },
  normal: { stars: 12, aiInterval: 1200 },
  hard:   { stars: 16, aiInterval: 700  },
};

export const OWNER_NEUTRAL = -1;
export const OWNER_PLAYER  =  0;
export const OWNER_AI      =  1;

export const STAR_RADIUS_MIN   = 18;
export const STAR_RADIUS_MAX   = 38;
export const STAR_MARGIN       = 60;
export const STAR_MIN_GAP      = 28;
export const SHIP_SPEED        = 120;  // px/sec
export const ROUTE_DISPATCH_MS = 900;
