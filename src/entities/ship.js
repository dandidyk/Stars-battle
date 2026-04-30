let shipCounter = 0;

export function createShip(owner, fromStar, toStar, startX, startY) {
  const angle     = Math.atan2(toStar.y - startY, toStar.x - startX);
  const totalDist = Math.hypot(toStar.x - startX, toStar.y - startY);
  return {
    id:         shipCounter++,
    type:       'attacker',
    owner,
    fromStar,
    toStar,
    targetShip: null,
    x:          startX,
    y:          startY,
    spawnX:     startX,
    spawnY:     startY,
    progress:   0,
    angle,
    totalDist,
    hp:         1.0,
    _hit:       new Set(),
  };
}

export function createDefender(owner, fromStar, startX, startY, targetShip) {
  const angle = Math.atan2(targetShip.y - startY, targetShip.x - startX);
  return {
    id:         shipCounter++,
    type:       'defender',
    owner,
    fromStar,
    toStar:     null,
    targetShip,
    x:          startX,
    y:          startY,
    spawnX:     startX,
    spawnY:     startY,
    progress:   0,
    angle,
    totalDist:  Math.hypot(targetShip.x - startX, targetShip.y - startY),
    hp:         1.0,
    _hit:       new Set(),
    trail:      [],
  };
}

export function resetShipCounter() { shipCounter = 0; }
