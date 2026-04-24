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
| Game speed | Button at bottom center |

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
- **Reinforcement** — send ships to friendly stars (green routes)
- **Game speed** — 0.5× / 1× / 2× toggle in-game

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
| Renderer | [Phaser 3](https://phaser.io) |
| Build | Vite 5 |
| Language | ES Modules (vanilla JS) |
| Deploy | GitHub Actions → GitHub Pages |

## Local Development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
```
