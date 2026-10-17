import confetti from "canvas-confetti";

const COLORS = ["#2a9d8f", "#f4a261", "#ffffff", "#9b5de5", "#34d399"];

export function burst(intensity: number) {
  confetti({
    particleCount: 30 + intensity * 14,
    spread: 60 + intensity * 6,
    startVelocity: 38,
    origin: { y: 0.65 },
    colors: COLORS,
    zIndex: 9999,
  });
}

export function tierBurst() {
  confetti({
    particleCount: 140,
    spread: 110,
    startVelocity: 45,
    origin: { y: 0.35 },
    colors: ["#f4a261", "#ffd166", "#ffffff"],
    shapes: ["star"],
    scalar: 1.2,
    zIndex: 9999,
  });
}

export function bigCelebration(ms = 3000) {
  const end = Date.now() + ms;
  (function frame() {
    confetti({ particleCount: 6, angle: 60, spread: 65, origin: { x: 0, y: 0.75 }, colors: COLORS, zIndex: 9999 });
    confetti({ particleCount: 6, angle: 120, spread: 65, origin: { x: 1, y: 0.75 }, colors: COLORS, zIndex: 9999 });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}
