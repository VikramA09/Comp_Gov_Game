import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GAME_RULES } from "@content/gameContent";
import { SPIN_MS } from "../game/useGame";

const MIN = GAME_RULES.moveMin;
const COUNT = GAME_RULES.moveMax - GAME_RULES.moveMin + 1;
const SEG = 360 / COUNT;
const COLORS = ["#e94560", "#2a9d8f", "#f4a261", "#457b9d", "#9b5de5", "#e76f51", "#14b8a6", "#eab308"];

type Props = {
  spinning: boolean;
  value: number | null;
  canSpin: boolean;
  onSpin: () => void;
};

export function Spinner({ spinning, value, canSpin, onSpin }: Props) {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (!spinning || value == null) return;
    const center = (value - MIN + 0.5) * SEG;
    const target = (360 - center) % 360;
    setRotation((prev) => {
      const cur = ((prev % 360) + 360) % 360;
      return prev + 360 * 5 + ((target - cur + 360) % 360);
    });
  }, [spinning, value]);

  const gradient = `conic-gradient(${Array.from({ length: COUNT }, (_, i) =>
    `${COLORS[i % COLORS.length]} ${i * SEG}deg ${(i + 1) * SEG}deg`,
  ).join(", ")})`;

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <motion.div
          className="absolute -top-2 left-1/2 z-20 -translate-x-1/2 text-3xl text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)]"
          animate={spinning ? { rotate: [0, -18, 0, -12, 0] } : { rotate: 0 }}
          transition={spinning ? { repeat: Infinity, duration: 0.18 } : {}}
        >
          ▼
        </motion.div>
        {canSpin && (
          <motion.div
            className="absolute -inset-2 rounded-full border-4 border-regime-gold"
            animate={{ scale: [1, 1.08, 1], opacity: [0.8, 0.2, 0.8] }}
            transition={{ repeat: Infinity, duration: 1.4 }}
          />
        )}
        <motion.button
          type="button"
          onClick={onSpin}
          disabled={!canSpin}
          whileHover={canSpin ? { scale: 1.04 } : undefined}
          whileTap={canSpin ? { scale: 0.94 } : undefined}
          className="relative h-40 w-40 rounded-full border-[6px] border-white/90 shadow-[0_10px_40px_rgba(0,0,0,0.6)] disabled:cursor-not-allowed sm:h-48 sm:w-48"
          aria-label={`Spin to move ${MIN} to ${GAME_RULES.moveMax} spaces`}
        >
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ background: gradient }}
            animate={{ rotate: rotation }}
            transition={{ duration: SPIN_MS / 1000, ease: [0.12, 0.8, 0.2, 1] }}
          >
            {Array.from({ length: COUNT }, (_, i) => (
              <div
                key={i}
                className="absolute inset-0"
                style={{ transform: `rotate(${(i + 0.5) * SEG}deg)` }}
              >
                <span className="absolute left-1/2 top-2 -translate-x-1/2 font-display text-xl font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] sm:top-3 sm:text-2xl">
                  {MIN + i}
                </span>
              </div>
            ))}
          </motion.div>
          <span className="absolute inset-0 m-auto flex h-14 w-14 items-center justify-center rounded-full border-4 border-white/80 bg-regime-dark font-display text-sm font-bold shadow-inner sm:h-16 sm:w-16">
            {spinning ? "🌀" : canSpin ? "SPIN" : value ?? "..."}
          </span>
        </motion.button>
      </div>
    </div>
  );
}
