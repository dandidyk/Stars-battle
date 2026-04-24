import { OWNER_AI, OWNER_PLAYER } from '../constants.js';
import { createRoute } from '../entities/route.js';

const MAX_AI_ROUTES = 6;

export function updateAI(scene) {
  scene.aiTimer += scene._lastDt * 1000;
  if (scene.aiTimer < scene.aiInterval) return;
  scene.aiTimer = 0;

  const aiStars  = scene.stars.filter(s => s.owner === OWNER_AI);
  const aiRoutes = scene.routes.filter(r => r.owner === OWNER_AI);

  // Defense: reinforce stars under attack
  for (const target of aiStars) {
    const underAttack = scene.ships.some(sh => sh.owner === OWNER_PLAYER && sh.toStar === target);
    if (underAttack) {
      const helper = aiStars
        .filter(s => s !== target && s.units > 15)
        .sort((a, b) =>
          Math.hypot(a.x - target.x, a.y - target.y) -
          Math.hypot(b.x - target.x, b.y - target.y)
        )[0];
      if (helper) {
        const dup = aiRoutes.find(r => r.fromStar === helper && r.toStar === target);
        if (!dup && aiRoutes.length < MAX_AI_ROUTES) {
          scene.routes.push(createRoute(OWNER_AI, helper, target));
        }
      }
    }
  }

  if (aiRoutes.length >= MAX_AI_ROUTES) return;

  // Offense: score and attack best target
  const sources = aiStars.filter(s => s.units >= 12);
  if (!sources.length) return;

  let bestScore = -Infinity;
  let bestSrc   = null;
  let bestTgt   = null;

  for (const src of sources) {
    for (const tgt of scene.stars) {
      if (tgt.owner === OWNER_AI) continue;
      const dup = scene.routes.find(r => r.fromStar === src && r.toStar === tgt && r.owner === OWNER_AI);
      if (dup) continue;

      const dist      = Math.hypot(src.x - tgt.x, src.y - tgt.y);
      const weakness  = (tgt.maxUnits - tgt.units) / tgt.maxUnits;
      const proximity = 1 - dist / 1200;
      const isPlayer  = tgt.owner === OWNER_PLAYER ? 0.4 : 0;
      const score     = weakness * 1.2 + proximity * 0.8 + isPlayer;

      if (score > bestScore) {
        bestScore = score;
        bestSrc   = src;
        bestTgt   = tgt;
      }
    }
  }

  if (bestSrc && bestTgt) {
    scene.routes.push(createRoute(OWNER_AI, bestSrc, bestTgt));
  }
}
