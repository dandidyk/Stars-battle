import { OWNER_PLAYER } from '../constants.js';

let routeCounter = 0;

export function createRoute(owner, fromStar, toStar, reinforce = false) {
  return {
    id:            routeCounter++,
    owner,
    fromStar,
    toStar,
    reinforce,
    dispatchTimer: 0,
    dashOffset:    0,
  };
}

export function routeIsDead(route) {
  if (route.fromStar.owner !== route.owner) return true;
  if (route.reinforce) return route.toStar.owner !== route.owner;
  return route.toStar.owner === route.owner;
}

export function resetRouteCounter() { routeCounter = 0; }
