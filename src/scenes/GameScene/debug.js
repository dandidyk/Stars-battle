const MAX_LINES = 60;
const log = [];
let visible = false;
let overlay = null;
let textObj = null;
let fpsHistory = [];

export function createDebugOverlay(scene) {
  overlay = scene.add.graphics();
  textObj = scene.add.text(8, 40, '', {
    fontSize: '11px',
    fontFamily: 'Courier New, monospace',
    color: '#00ff99',
    lineSpacing: 2,
  }).setDepth(1000);

  // Toggle with backtick `
  scene.input.keyboard.on('keydown-BACKTICK', () => {
    visible = !visible;
    textObj.setVisible(visible);
    overlay.setVisible(visible);
  });
  textObj.setVisible(false);
  overlay.setVisible(false);

  debugLog('Debug overlay ready — press ` to toggle');
}

export function debugLog(msg) {
  const ts = (performance.now() / 1000).toFixed(2);
  log.push(`[${ts}] ${msg}`);
  if (log.length > MAX_LINES) log.shift();
}

export function updateDebugOverlay(scene) {
  if (!visible) return;

  const ships     = scene.ships || [];
  const routes    = scene.routes || [];
  const attackers = ships.filter(s => s.type === 'attacker').length;
  const defenders = ships.filter(s => s.type === 'defender').length;
  const destroyed = ships.filter(s => s._destroyed).length;

  const fps = scene.game.loop.actualFps;
  fpsHistory.push(fps);
  if (fpsHistory.length > 60) fpsHistory.shift();
  const minFps = Math.min(...fpsHistory).toFixed(0);
  const avgFps = (fpsHistory.reduce((a, b) => a + b, 0) / fpsHistory.length).toFixed(0);

  const header = [
    `FPS: ${fps.toFixed(0)}  avg:${avgFps}  min:${minFps}`,
    `ships: ${ships.length}  atk:${attackers}  def:${defenders}  dead:${destroyed}`,
    `routes: ${routes.length}`,
    `─────────────────────────`,
  ];

  const lines = [...header, ...log.slice(-20)];

  overlay.clear();
  overlay.fillStyle(0x000000, 0.65);
  overlay.fillRect(4, 36, 340, lines.length * 14 + 8);

  textObj.setText(lines.join('\n'));
}
