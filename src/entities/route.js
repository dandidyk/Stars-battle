import { OWNER_PLAYER } from '../constants.js';

let routeCounter = 0;

export function createRoute(owner, fromStar, toStar) {
  return {
    id:            routeCounter++,
    owner,
    fromStar,
    toStar,
    dispatchTimer: 0,
    dashOffset:    0,
  };
}

export function routeIsDead(route) {
  if (route.fromStar.owner !== route.owner) return true;
  if (route.toStar.owner === route.owner)   return true;
  return false;
}

export function resetRouteCounter() { routeCounter = 0; }
