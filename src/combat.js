export function atkPower(star)  { return 1 + star.atkLevel * 0.25; }
export function defFactor(star) { return 1 / (1 + star.defLevel * 0.25); }

export function resolveArrival(ship, scene) {
  const target = ship.toStar;

  if (ship.owner === target.owner) {
    target.units = Math.min(target.units + ship.hp, target.maxUnits);
    scene.fxSpark(ship.x, ship.y, target.owner, 4);
    return;
  }

  const dmg = atkPower(ship.fromStar) * defFactor(target);

  if (target.units > 0) {
    target.units -= dmg;
    if (target.units < 0) {
      target.hp   += target.units;
      target.units = 0;
    }
    scene.fxSpark(target.x, target.y, ship.owner, 4);
  } else {
    target.hp -= dmg;
    scene.fxSpark(target.x, target.y, ship.owner, 6);
  }

  if (target.hp <= 0) {
    const oldOwner  = target.owner;
    target.owner    = ship.owner;
    target.hp       = Math.min(Math.abs(target.hp), target.maxHp * 0.15);
    target.units    = 0;
    target.troops   = [];
    target.atkLevel = 0;
    target.defLevel = 0;
    scene.fxCapture(target, oldOwner);
  }
}
