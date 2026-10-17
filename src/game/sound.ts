const MUTE_KEY = "democratization-board-game-muted";

let ctx: AudioContext | null = null;
let muted = localStorage.getItem(MUTE_KEY) === "1";

function audio(): AudioContext {
  if (!ctx) {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    ctx = new Ctor();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

/** Browsers only allow audio after a user gesture, so call this from click handlers. */
export function unlockAudio() {
  try {
    audio();
  } catch {
    /* audio unsupported */
  }
}

export const isMuted = () => muted;

export function setMuted(m: boolean) {
  muted = m;
  localStorage.setItem(MUTE_KEY, m ? "1" : "0");
}

type ToneOpts = {
  type?: OscillatorType;
  vol?: number;
  delay?: number;
  slideTo?: number;
};

function tone(freq: number, dur: number, opts: ToneOpts = {}) {
  if (muted) return;
  try {
    const c = audio();
    const t0 = c.currentTime + (opts.delay ?? 0);
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = opts.type ?? "sine";
    osc.frequency.setValueAtTime(freq, t0);
    if (opts.slideTo) osc.frequency.exponentialRampToValueAtTime(opts.slideTo, t0 + dur);
    const v = opts.vol ?? 0.12;
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(v, t0 + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain).connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  } catch {
    /* audio unsupported */
  }
}

function arpeggio(notes: number[], gap: number, dur: number, type: OscillatorType, vol: number) {
  notes.forEach((f, i) => tone(f, dur, { type, vol, delay: i * gap }));
}

export const sfx = {
  click: () => tone(660, 0.06, { type: "triangle", vol: 0.08 }),
  spin: () => {
    let t = 0;
    let gap = 0.03;
    for (let i = 0; i < 18; i++) {
      tone(1200 - i * 25, 0.03, { type: "square", vol: 0.035, delay: t });
      t += gap;
      gap *= 1.09;
    }
  },
  step: (n: number) => tone(420 + (n % 8) * 45, 0.08, { type: "triangle", vol: 0.1 }),
  flip: () => tone(260, 0.18, { type: "sawtooth", vol: 0.04, slideTo: 900 }),
  good: () => arpeggio([523, 659, 784], 0.08, 0.25, "triangle", 0.1),
  bad: () => {
    tone(320, 0.45, { type: "sawtooth", vol: 0.07, slideTo: 90 });
    tone(160, 0.45, { type: "square", vol: 0.035, slideTo: 60, delay: 0.05 });
  },
  correct: () => arpeggio([784, 1047, 1319], 0.09, 0.22, "sine", 0.12),
  wrong: () => arpeggio([233, 185], 0.16, 0.28, "square", 0.06),
  levelUp: () => arpeggio([523, 659, 784, 1047, 1319], 0.07, 0.2, "triangle", 0.1),
  collapse: () => {
    tone(140, 1.3, { type: "sawtooth", vol: 0.1, slideTo: 30 });
    tone(90, 1.3, { type: "square", vol: 0.05, slideTo: 25, delay: 0.12 });
  },
  win: () => {
    const notes = [523, 523, 523, 659, 784, 659, 784, 1047];
    const times = [0, 0.12, 0.24, 0.4, 0.6, 0.8, 0.95, 1.15];
    notes.forEach((f, i) =>
      tone(f, i === notes.length - 1 ? 0.7 : 0.18, { type: "triangle", vol: 0.12, delay: times[i] }),
    );
  },
  turn: () => {
    tone(880, 0.12, { type: "sine", vol: 0.06 });
    tone(1320, 0.14, { type: "sine", vol: 0.05, delay: 0.08 });
  },
  tick: () => tone(1000, 0.04, { type: "square", vol: 0.03 }),
};
