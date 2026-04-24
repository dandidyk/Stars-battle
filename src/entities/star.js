import Phaser from 'phaser';
import {
  OWNER_NEUTRAL, OWNER_PLAYER, OWNER_AI,
  STAR_RADIUS_MIN, STAR_RADIUS_MAX, STAR_MARGIN, STAR_MIN_GAP,
} from '../constants.js';

export function buildStar(id, x, y, radius, owner, startUnitsMult = 1.2, regenMult = 1.0) {
  const maxUnits  = Math.round(radius * 2.5);
  const maxHp     = Math.round(radius * 2);
  const regenRate = radius * 0.7 / STAR_RADIUS_MAX * regenMult;
  const hpRegen   = radius * 0.15 / STAR_RADIUS_MAX * regenMult;
  const baseMult  = (owner === OWNER_PLAYER || owner === OWNER_AI) ? startUnitsMult : startUnitsMult * 0.4;
  const units     = Math.min(Math.round(radius * baseMult), maxUnits);
  return {
    id,
    x, y,
    radius,
    owner,
    units,
    maxUnits,
    regenRate,
    hp:     maxHp,
    maxHp,
    hpRegen,
    atkLevel: 0,
    defLevel: 0,
    rotation: 0,
    rotSpeed: (Math.random() * 0.3 + 0.1) * (Math.random() < 0.5 ? 1 : -1),
    troops:   [], // visual troop objects: { angle, progress, speed, r }
  };
}

export function generateStars(W, H, count, startUnitsMult = 1.2, regenMult = 1.0) {
  const rng   = new Phaser.Math.RandomDataGenerator([`map_${count}_${W}`]);
  const pts   = [];
  const tries = 800;

  for (let i = 0; i < count; i++) {
    const r = rng.between(STAR_RADIUS_MIN, STAR_RADIUS_MAX);
    for (let t = 0; t < tries; t++) {
      const x = rng.between(STAR_MARGIN + r, W - STAR_MARGIN - r);
      const y = rng.between(STAR_MARGIN + r, H - STAR_MARGIN - r);
      let ok = true;
      for (const s of pts) {
        if (Math.hypot(x - s.x, y - s.y) < s.r + r + STAR_MIN_GAP) { ok = false; break; }
      }
      if (ok) { pts.push({ x, y, r }); break; }
    }
  }

  const leftPts  = pts.filter(p => p.x < W / 2).sort((a, b) => b.r - a.r);
  const rightPts = pts.filter(p => p.x >= W / 2).sort((a, b) => b.r - a.r);
  const playerPt = leftPts[0];
  const aiPt     = rightPts[0];

  return pts.map((p, i) => {
    let owner = OWNER_NEUTRAL;
    if (p === playerPt) owner = OWNER_PLAYER;
    if (p === aiPt)     owner = OWNER_AI;
    return buildStar(i, p.x, p.y, p.r, owner, startUnitsMult, regenMult);
  });
}
