export function starPolyPoints(cx, cy, outerR, innerR, points, angleOffset) {
  const pts = [];
  const step = Math.PI / points;
  for (let i = 0; i < points * 2; i++) {
    const r   = i % 2 === 0 ? outerR : innerR;
    const ang = angleOffset + i * step - Math.PI / 2;
    pts.push({ x: cx + Math.cos(ang) * r, y: cy + Math.sin(ang) * r });
  }
  return pts;
}

export function segmentsIntersect(ax, ay, bx, by, cx, cy, dx, dy) {
  const det = (bx - ax) * (dy - cy) - (by - ay) * (dx - cx);
  if (Math.abs(det) < 1e-10) return false;
  const t = ((cx - ax) * (dy - cy) - (cy - ay) * (dx - cx)) / det;
  const u = ((cx - ax) * (by - ay) - (cy - ay) * (bx - ax)) / det;
  return t >= 0 && t <= 1 && u >= 0 && u <= 1;
}

export function routeLineEndpoints(route) {
  const from = route.fromStar;
  const to   = route.toStar;
  const dx   = to.x - from.x;
  const dy   = to.y - from.y;
  const len  = Math.hypot(dx, dy);
  const ux   = dx / len;
  const uy   = dy / len;
  return {
    x1: from.x + ux * from.radius,
    y1: from.y + uy * from.radius,
    x2: to.x   - ux * to.radius,
    y2: to.y   - uy * to.radius,
  };
}
