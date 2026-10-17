import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { ChanceCard } from "@content/gameContent";
import type { Player } from "../game/types";
import { canSpeak, speak, stopSpeaking } from "../game/speech";

type Props = {
  card: ChanceCard | null;
  player: Player | undefined;
  onApply: () => void;
};

export function ChanceCardModal({ card, player, onApply }: Props) {
  const [flipped, setFlipped] = useState(false);
  const [showIndex, setShowIndex] = useState(false);

  useEffect(() => {
    setFlipped(false);
    setShowIndex(false);
    return stopSpeaking;
  }, [card?.id]);

  const good = card ? card.points >= 0 : true;

  return (
    <AnimatePresence>
      {card && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-3 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-xl"
            style={{ perspective: 1400 }}
            initial={{ y: 260, scale: 0.4, rotate: -12 }}
            animate={{ y: 0, scale: 1, rotate: 0 }}
            exit={{ y: -200, scale: 0.6, opacity: 0, rotate: 8 }}
            transition={{ type: "spring", stiffness: 180, damping: 18 }}
          >
            <motion.div
              className="relative"
              style={{ transformStyle: "preserve-3d" }}
              initial={{ rotateY: 180 }}
              animate={{ rotateY: 0 }}
              transition={{ delay: 0.45, duration: 0.8, ease: "easeInOut" }}
              onAnimationComplete={() => setFlipped(true)}
            >
              <div
                className="overflow-hidden rounded-3xl border-4 border-white/80 bg-regime-mid shadow-2xl"
                style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
              >
                <div
                  className={`flex items-center justify-between px-5 py-3 ${
                    good
                      ? "bg-gradient-to-r from-emerald-600 to-teal-500"
                      : "bg-gradient-to-r from-red-700 to-rose-500"
                  }`}
                >
                  <span className="font-display text-lg font-bold tracking-wide">
                    {good ? "📈" : "📉"} CHANCE CARD
                  </span>
                  {player && (
                    <span className="text-sm font-semibold">
                      {player.avatar} {player.name}
                    </span>
                  )}
                </div>

                <div className="p-5">
                  <p className="mb-5 text-lg font-semibold leading-relaxed sm:text-xl">{card.text}</p>

                  <motion.div
                    className="mb-5 flex justify-center"
                    initial={{ scale: 0 }}
                    animate={flipped ? { scale: 1, rotate: [0, -6, 6, 0] } : { scale: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 12 }}
                  >
                    <span
                      className={`rounded-2xl px-6 py-2 font-display text-4xl font-bold shadow-lg ${
                        good ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300"
                      }`}
                    >
                      {card.points > 0 ? `+${card.points}` : card.points} pts
                    </span>
                  </motion.div>

                  <div className="mb-4 flex flex-wrap gap-2">
                    {canSpeak() && (
                      <button
                        type="button"
                        onClick={() => speak(card.text)}
                        className="rounded-xl bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/20"
                      >
                        🔊 Read aloud
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowIndex((v) => !v)}
                      className="rounded-xl bg-regime-gold/20 px-3 py-2 text-sm font-semibold text-regime-gold hover:bg-regime-gold/30"
                    >
                      🔍 {showIndex ? "Hide" : "Show"} real-world history
                    </button>
                  </div>

                  <AnimatePresence>
                    {showIndex && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mb-4 rounded-xl border-l-4 border-regime-gold bg-black/30 p-3 text-sm leading-relaxed text-white/90">
                          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-regime-gold">
                            Index notes
                          </p>
                          {card.indexNote}
                          {canSpeak() && (
                            <button
                              type="button"
                              onClick={() => speak(card.indexNote)}
                              className="ml-2 text-xs text-regime-gold underline"
                            >
                              🔊 read
                            </button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={onApply}
                    className={`w-full rounded-2xl py-3.5 text-lg font-bold shadow-lg ${
                      good ? "bg-emerald-500 hover:bg-emerald-400" : "bg-red-600 hover:bg-red-500"
                    }`}
                  >
                    {good ? `Collect +${card.points} points` : `Accept ${card.points} points`}
                    <span className="ml-2 text-xs font-normal opacity-70">(Space)</span>
                  </motion.button>
                </div>
              </div>

              <div
                className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl border-4 border-white/80 bg-gradient-to-br from-sky-700 via-indigo-800 to-regime-dark shadow-2xl"
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                <span className="text-7xl">🃏</span>
                <span className="mt-2 font-display text-3xl font-bold tracking-widest">CHANCE</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
