# Stars Battle

A fast-paced real-time strategy game for mobile browsers — inspired by Galcon and Auralux.

**[▶ Play Now](https://dandidyk.github.io/Stars-battle/)**

---

## How to Play

- Stars generate units over time — bigger stars grow faster
- **Tap** one of your blue stars to select it, then tap a target to attack or reinforce
- **Drag** directly from your star to a target to create a permanent route
- Routes dispatch ships automatically until you cancel them
- **Swipe** across a route line to cut (cancel) it
- Capture **all stars** to win

## Controls

| Action | Gesture |
|--------|---------|
| Select your star | Tap |
| Attack / Reinforce | Select → tap target |
| Create route | Drag from your star to target |
| Cancel route | Swipe across the route line |
| Game speed | Slider at bottom center |

## Modes

### Quick Difficulty
Three one-tap presets — Easy / Normal / Hard.

### Quick Battle ⚙
Full manual setup:

| Setting | Options |
|---------|---------|
| Map Size | Tiny (6) · Small (10) · Medium (14) · Large (18) · Huge (22 stars) |
| AI Level | Passive · Easy · Normal · Hard · Brutal |
| Starting Units | Low · Normal · High |
| Economy | Slow · Normal · Fast regen |

## Mechanics

- **Routes** — persistent attack or reinforce lanes between stars
- **Interception** — stars spawn defenders against nearby enemy ships
- **Route risk** — AI evaluates enemy planets along attack paths and avoids highly interceptable routes
- **Reinforcement** — send ships to friendly stars (green routes)
- **Game speed** — 0.5× / 1× / 1.5× / 2× / 3× / 4× slider in-game

## Visuals

- **Plasma shader** — each planet has a unique animated plasma surface (GLSL FBm + two-level domain warping)
- **Color by owner** — blue (player), distinct AI faction colors, silver-gray (neutral); colors change on capture
- **Limb darkening** — realistic solar disc falloff toward the edge
- **Smooth glow** — soft halo around each planet, accumulates from 14 overlapping circles
- **Orbiting squadrons** — ships group into small rotating formations around their home planet
- **Spark FX** — hit sparks and expanding ring on planet capture
- **Camera shake** — on large captures
- **Rocket ships** — triangular rocket shape with white nose-tip highlight

---

## Development Roadmap

### Phase 1 — Core Polish
- [ ] Sound FX: ship launch, explosion, capture, win/lose fanfare
- [ ] Background music (ambient loop, toggleable)
- [ ] Star names / labels on capture
- [ ] Smoother unit count display (animated counter)
- [ ] Visual pulse on star when it hits max units (overflow indicator)

### Phase 2 — Gameplay Depth
- [ ] **Multiple AI opponents** — 2–3 AI factions with distinct colors (orange, green)
- [ ] **Fog of war** — player only sees stars in range of owned planets
- [ ] **Star upgrades** — spend units to upgrade attack or defense level (tap-hold on owned star)
- [ ] **Wormholes** — paired teleport points on the map
- [ ] **Asteroid belts** — impassable zones that ships must route around

### AI Improvement Plan
- [x] **Stage 1: Split AI decisions into clear helpers** — keep current behavior but isolate target scoring, defense helper selection, duplicate route checks, and attack route selection.
- [x] **Stage 2: First-pass attack restraint** — estimate target cost from units/HP, avoid opening attacks from weak or already-busy sources, and factor in route interception risk.
- [x] **Stage 3: First-pass source garrisons** — keep a minimum unit reserve and prevent one source planet from opening multiple attack routes.
- [x] **Stage 4: First-pass smarter defense** — estimate incoming pressure, avoid reinforcement loops, ignore weak probes against stocked planets, choose useful nearby helpers, and prioritize high-value endangered planets.
- [x] **Stage 5: First-pass route economy** — cancel reinforcement when the target is safe, stop attacks from drained/threatened sources, avoid stale owned-target routes, and shift routes as the map changes.
- [x] **Stage 6: First-pass AI personalities** — assign Balanced, Expander, Aggressor, Turtle, Opportunist, and Swarm profiles across AI factions.
- [x] **Stage 7: First-pass difficulty tuning** — make Passive/Easy/Normal/Hard/Brutal differ by reaction time, aggression, defense, route limits, risk tolerance, player focus, and mistake chance.
- [x] **Stage 8: First-pass AI debug overlay** — show each AI's personality and latest action in the backtick debug overlay.

### Phase 3 — Progression
- [ ] **Campaign mode** — hand-crafted levels with story text
- [ ] **Achievements** — win in under 60 s, never lose a star, etc.
- [ ] **High score / leaderboard** (local storage, then remote)
- [ ] Persistent unlocks — new map themes, ship skins

### Phase 4 — Multiplayer
- [ ] **Local 2-player** — split-screen or hot-seat on tablet
- [ ] **Online PvP** — WebSocket real-time match (Node.js backend)
- [ ] Lobby / matchmaking screen
- [ ] Replay system

### Phase 5 — Platform
- [ ] PWA packaging (installable, offline play)
- [ ] Capacitor / Expo wrapper for App Store / Google Play
- [ ] Cloud save (progress sync across devices)

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Renderer | [Phaser 3](https://phaser.io) WebGL |
| Shader | GLSL — FBm plasma with domain warping |
| Build | Vite 5 |
| Language | ES Modules (vanilla JS) |
| HiDPI | `Scale.NONE + zoom:1/dpr` |
| Deploy | GitHub Actions → GitHub Pages |

## Local Development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
```
