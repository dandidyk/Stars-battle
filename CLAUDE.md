# Stars Battle — Claude Context

Mobile RTS game built with Phaser 3 + Vite 5. Inspired by Galcon / Auralux.

## Stack

- **Phaser 3.80** — WebGL renderer, `Phaser.Scale.NONE + zoom:1/dpr` for HiDPI
- **Vite 5** — ES Modules, no TypeScript
- **Deploy** — GitHub Actions → GitHub Pages at `dandidyk.github.io/Stars-battle`

## Key Files

| File | Role |
|------|------|
| `src/main.js` | Phaser game config, resize handler |
| `src/constants.js` | `OWNER_*`, `STAR_RADIUS_MIN/MAX`, `C` colors, `DIFFICULTY` |
| `src/utils/dpr.js` | `DPR = devicePixelRatio`, `px(n)` helper |
| `src/shaders/plasma.js` | GLSL fragment shader for planet plasma surface |
| `src/scenes/GameScene/index.js` | Main game scene: state, update loop, shader management |
| `src/scenes/GameScene/draw.js` | All canvas drawing: stars, ships, routes, drag, selection |
| `src/scenes/GameScene/input.js` | Touch/mouse input handling |
| `src/scenes/GameScene/hud.js` | HUD: resource bars, speed button |
| `src/scenes/GameScene/fx.js` | Particle FX: sparks, capture ring, camera shake |
| `src/entities/star.js` | Star generation and data model |
| `src/entities/ship.js` | Ship factory (`createShip`, `createDefender`) |
| `src/entities/route.js` | Route model, `routeIsDead` |
| `src/combat.js` | `resolveArrival` — damage / capture logic |
| `src/ai/basicAI.js` | AI decision loop |

## Coordinate System

All game coordinates are in **device pixels** (CSS px × DPR). `STAR_RADIUS_MIN = 18`, `STAR_RADIUS_MAX = 38` are CSS px values — multiply by DPR when used in draw code.

## Plasma Shader

`src/shaders/plasma.js` — GLSL fragment shader registered as `Phaser.Display.BaseShader('plasma', ...)`.

Uniforms:
- `time` — driven by `scene.time.now / 1000 * gameSpeed`
- `offset` — per-star seed: `[star.x * 0.008, star.y * 0.008]` (gives unique pattern per planet)
- `coolColor` / `hotColor` — `vec3` RGB (0–1) set by owner

Color palette defined in `index.js`:
```js
const PLASMA_COLORS = [
  { cool: [0.00, 0.04, 0.18], hot: [0.35, 0.85, 1.00] }, // 0 player — blue
  { cool: [0.12, 0.01, 0.00], hot: [1.00, 0.20, 0.05] }, // 1 AI — red
  { cool: [0.02, 0.08, 0.02], hot: [0.20, 0.90, 0.20] }, // 2 AI — green
  { cool: [0.12, 0.06, 0.00], hot: [1.00, 0.65, 0.05] }, // 3 AI — orange
  { cool: [0.08, 0.02, 0.12], hot: [0.75, 0.20, 0.95] }, // 4 AI — purple
  { cool: [0.12, 0.02, 0.06], hot: [1.00, 0.25, 0.60] }, // 5 AI — pink
  { cool: [0.10, 0.10, 0.00], hot: [0.95, 0.95, 0.15] }, // 6 AI — yellow
  { cool: [0.10, 0.05, 0.02], hot: [0.95, 0.55, 0.30] }, // 7 AI — bronze
];
```

Key shader parameters (don't break these — they were hard-won):
- `smoothstep(0.05, 0.40, f)` — keeps planets bright (too wide = dark)
- `coolColor * 0.7` — floor for dark regions (don't go below ~0.5 or planets go black)
- `pow(1.0 - smoothstep(0.60, 1.0, d), 0.7)` — limb darkening starts at 60% radius (was 35%, caused dark veil)
- `alpha = 1.0 - smoothstep(0.92, 1.0, d)` — hard antialiased disc edge

## Orbiting Squadrons

Each star has a `troops` array. Each troop:
```js
{
  angle,       // squad center angle (radians)
  progress,    // 0→1, how far emerged from center (~0.8s)
  speed,       // rad/s — can be negative (counterclockwise)
  r,           // squad orbit radius multiplier
  spacing,     // spacing between ships in the local formation
  drift,       // subtle radial breathing amount
  driftSpeed,  // breathing speed
  phase,       // accumulated drift phase
  formation,   // 'wedge' | 'line' | 'diamond'
  squadSize,   // 3–5 ships
  slot,        // index inside the squadron
}
```

Troops are updated in `_syncTroops` (index.js), positioned through `troopOrbitPosition` (utils/troops.js), and drawn in `drawStarDetail` (draw.js). The squadron effect comes from small formations with varied shape, speed, radius, and direction.

## Ship Sizes

Ships are **fixed size regardless of planet**:
- Defenders: `4.2 * DPR`
- Attackers: `3.5 * DPR`
- Orbit troops: `(1.4 + 2.0 * tr.progress) * DPR` (grow as they emerge)

## Glow

`drawStarGlow` draws 14 overlapping circles with `alpha = 0.016` each. The natural accumulation creates a smooth gradient — no discrete steps visible.

## Depth Order

| Depth | Object |
|-------|--------|
| 0 | Route lines |
| 1 | Star glow (soft circles) |
| 2 | Plasma shaders |
| 3 | Star detail (HP arc, orbit troops) |
| 4 | Ships in flight |
| 5 | Selection ring |
| 6 | Drag arrow |

## Common Pitfalls

- **Dark planets** — if you touch limb darkening or smoothstep range, planets can go very dark. The `smoothstep(0.60, 1.0, d)` range is critical — moving start below 0.55 makes large parts of the disc dark.
- **Dark veil** — semi-transparent dark pixels at the disc edge darkened the whole scene. Caused by narrow rim ranges leaving dead zones. Keep alpha and limb darkening in sync.
- **Route interception** — the AI now evaluates attack routes against enemy/neutral stars with troops. High-risk routes should be penalized or avoided, especially for low-risk AI profiles.
- **All stars same plasma** — `offset` uniform must be set per-star from world position; without it all stars show identical FBm pattern.
- **DPR** — always multiply pixel sizes by `DPR`. Missing it causes tiny UI on Retina displays.
