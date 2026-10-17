import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getTier } from "../game/tiers";
import type { Fx, Player } from "../game/types";

export function TurnIntro({
  player,
  round,
  open,
  onBegin,
}: {
  player: Player | undefined;
  round: number;
  open: boolean;
  onBegin: () => void;
}) {
  const tier = player ? getTier(player.points) : null;
  return (
    <AnimatePresence>
      {open && player && tier && (
        <motion.button
          type="button"
          onClick={onBegin}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 p-6 text-center backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
        >
          <motion.p
            className="mb-2 text-sm font-bold uppercase tracking-[0.3em] text-white/60"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            Round {round} · Pass the device to
          </motion.p>
          <motion.div
            className="mb-4 flex h-32 w-32 items-center justify-center rounded-full border-4 border-white text-7xl shadow-2xl"
            style={{ backgroundColor: player.color, boxShadow: `0 0 80px ${player.color}` }}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0, y: [0, -12, 0] }}
            transition={{
              scale: { type: "spring", stiffness: 200, damping: 12 },
              rotate: { type: "spring", stiffness: 200, damping: 12 },
              y: { repeat: Infinity, duration: 1.6, delay: 0.6 },
            }}
          >
            {player.avatar}
          </motion.div>
          <motion.h2
            className="font-display text-5xl font-bold sm:text-6xl"
            style={{ color: player.color }}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, type: "spring" }}
          >
            {player.name}
          </motion.h2>
          <motion.p
            className="mt-3 text-lg font-semibold"
            style={{ color: tier.color }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {tier.emoji} {tier.name} · {player.points} pts
          </motion.p>
          <motion.p
            className="mt-10 text-white/70"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
          >
            Tap anywhere or press Space to start your turn
          </motion.p>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

export function EliminatedOverlay({
  player,
  open,
  onContinue,
}: {
  player: Player | undefined;
  open: boolean;
  onContinue: () => void;
}) {
  return (
    <AnimatePresence>
      {open && player && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-red-950/90 p-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="text-8xl"
            initial={{ scale: 3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 150, damping: 10 }}
          >
            💥
          </motion.div>
          <motion.h2
            className="mt-4 font-display text-5xl font-bold tracking-widest text-red-300 sm:text-7xl"
            initial={{ y: -80, rotate: -8, opacity: 0 }}
            animate={{ y: 0, rotate: [-8, 4, -3, 0], opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            FAILED STATE
          </motion.h2>
          <motion.div
            className="mt-6 text-6xl"
            animate={{ y: [0, 10, 60], rotate: [0, 20, 90], opacity: [1, 1, 0.3] }}
            transition={{ delay: 0.9, duration: 1.5 }}
          >
            {player.avatar}
          </motion.div>
          <motion.p
            className="mt-4 max-w-md text-lg text-white/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {player.name}'s country fell to {player.points} points. The government has collapsed and they are
            eliminated from the game.
          </motion.p>
          <motion.button
            type="button"
            onClick={onContinue}
            className="mt-8 rounded-2xl bg-white px-8 py-3 font-bold text-red-900"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            Continue <span className="text-xs opacity-60">(Space)</span>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function TierToast({ fx, players }: { fx: Fx | null; players: Player[] }) {
  const [visible, setVisible] = useState<Fx | null>(null);

  useEffect(() => {
    if (!fx || fx.tierUp === null) return;
    const p = players.find((x) => x.id === fx.playerId);
    if (!p || p.eliminated) return;
    const t1 = window.setTimeout(() => setVisible(fx), 400);
    const t2 = window.setTimeout(() => setVisible(null), 3400);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [fx?.id]);

  const p = visible ? players.find((x) => x.id === visible.playerId) : undefined;

  return (
    <AnimatePresence>
      {visible && p && (
        <motion.div
          key={visible.id}
          className={`fixed left-1/2 top-6 z-[60] -translate-x-1/2 rounded-2xl border-2 px-6 py-3 text-center shadow-2xl ${
            visible.tierUp ? "border-regime-gold bg-amber-900/95" : "border-red-400 bg-red-950/95"
          }`}
          initial={{ y: -100, opacity: 0, scale: 0.6 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
        >
          <p className="text-xs font-bold uppercase tracking-widest text-white/70">
            {visible.tierUp ? "🎖️ Regime change!" : "⚠️ Democratic backsliding!"}
          </p>
          <p className="font-display text-lg font-bold">
            {p.avatar} {p.name} is now {/^[AEIOU]/i.test(visible.tierTo) ? "an" : "a"}{" "}
            <span className={visible.tierUp ? "text-regime-gold" : "text-red-300"}>{visible.tierTo}</span>
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
