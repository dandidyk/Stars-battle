import { OWNER_PLAYER } from '../../constants.js';
import { createRoute } from '../../entities/route.js';
import { segmentsIntersect, routeLineEndpoints } from '../../utils/geometry.js';
import { DPR } from '../../utils/dpr.js';

export function setupInput(scene) {
  const DRAG_THRESHOLD = Math.round(16 * DPR);

  scene.input.on('pointerdown', (ptr) => {
    if (scene.phase !== 'playing') return;
    const hit = scene.starAt(ptr.x, ptr.y);
    scene.dragOrigin = { x: ptr.x, y: ptr.y };
    scene.dragMoved  = false;

    if (hit && hit.owner === OWNER_PLAYER) {
      scene.dragFrom  = hit;
      scene.dragPos   = { x: ptr.x, y: ptr.y };
      scene.swipePath = null;
    } else {
      scene.dragFrom  = null;
      scene.swipePath = [{ x: ptr.x, y: ptr.y }];
    }
  });

  scene.input.on('pointermove', (ptr) => {
    if (scene.dragFrom) {
      scene.dragPos = { x: ptr.x, y: ptr.y };
      if (!scene.dragMoved) {
        const d = Math.hypot(ptr.x - scene.dragOrigin.x, ptr.y - scene.dragOrigin.y);
        if (d > DRAG_THRESHOLD) scene.dragMoved = true;
      }
    } else if (scene.swipePath) {
      scene.swipePath.push({ x: ptr.x, y: ptr.y });
    }
  });

  scene.input.on('pointerup', (ptr) => {
    if (scene.phase !== 'playing') return;
    const hit = scene.starAt(ptr.x, ptr.y);

    if (scene.swipePath && scene.swipePath.length >= 2) {
      const swipeDist = Math.hypot(
        ptr.x - scene.swipePath[0].x,
        ptr.y - scene.swipePath[0].y
      );
      if (swipeDist > Math.round(40 * DPR)) cutRoutesAlongSwipe(scene);
      scene.swipePath = null;
      return;
    }
    scene.swipePath = null;

    if (scene.dragFrom) {
      if (scene.dragMoved) {
        if (hit && hit !== scene.dragFrom) tryCreateRoute(scene, scene.dragFrom, hit);
        scene.dragFrom  = null;
        scene.dragPos   = null;
        scene.dragMoved = false;
        return;
      }
      if (!hit) {
        scene.selectedStar = null;
      } else if (scene.selectedStar && hit !== scene.selectedStar) {
        tryCreateRoute(scene, scene.selectedStar, hit);
        scene.selectedStar = null;
      } else if (hit.owner === OWNER_PLAYER) {
        scene.selectedStar = (scene.selectedStar === hit) ? null : hit;
        scene.selPulse = 0;
      }
      scene.dragFrom  = null;
      scene.dragPos   = null;
      scene.dragMoved = false;
      return;
    }

    if (!hit) scene.selectedStar = null;
  });
}

export function tryCreateRoute(scene, from, to) {
  if (to === from) return;
  const reinforce = to.owner === OWNER_PLAYER;
  const dup = scene.routes.find(
    r => r.fromStar === from && r.toStar === to && r.owner === OWNER_PLAYER
  );
  if (!dup) scene.routes.push(createRoute(OWNER_PLAYER, from, to, reinforce));
}

export function cutRoutesAlongSwipe(scene) {
  const path = scene.swipePath;
  if (!path || path.length < 2) return;

  const cut = new Set();
  for (let i = 0; i < path.length - 1; i++) {
    const sx1 = path[i].x,   sy1 = path[i].y;
    const sx2 = path[i+1].x, sy2 = path[i+1].y;
    for (const route of scene.routes) {
      if (route.owner !== OWNER_PLAYER) continue;
      const { x1, y1, x2, y2 } = routeLineEndpoints(route);
      if (segmentsIntersect(sx1, sy1, sx2, sy2, x1, y1, x2, y2)) cut.add(route);
    }
  }

  if (cut.size === 0) return;

  for (const route of cut) {
    const { x1, y1, x2, y2 } = routeLineEndpoints(route);
    const flash = scene.add.graphics();
    flash.lineStyle(3 * DPR, 0xffffff, 0.9);
    flash.beginPath();
    flash.moveTo(x1, y1);
    flash.lineTo(x2, y2);
    flash.strokePath();
    scene.tweens.add({
      targets: flash, alpha: 0, duration: 220,
      onComplete: () => flash.destroy(),
    });
  }

  scene.routes = scene.routes.filter(r => !cut.has(r));
}
