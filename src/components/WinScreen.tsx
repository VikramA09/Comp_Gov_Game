import { motion } from "framer-motion";
import { getTier } from "../game/tiers";
import type { Player, WinReason } from "../game/types";

type Props = {
  players: Player[];
  winners: number[];
  reason: WinReason;
  message: string;
  onRematch: () => void;
  onNewGame: () => void;
};

const PODIUM_HEIGHTS = ["h-28", "h-20", "h-14", "h-10"];
const MEDALS = ["🥇", "🥈", "🥉", "4️⃣"];

export function WinScreen({ players, winners, reason, message, onRematch, onNewGame }: Props) {
  const ranked = [...players].sort((a, b) => {
    if (a.eliminated !== b.eliminated) return a.eliminated ? 1 : -1;
    return b.points - a.points;
  });
  const podiumOrder = [ranked[1], ranked[0], ranked[2], ranked[3]].filter(Boolean) as Player[];

  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 p-4 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="mx-auto flex min-h-full max-w-3xl flex-col items-center justify-center py-6 text-center">
        <motion.div
          className="text-7xl"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0, y: [0, -10, 0] }}
          transition={{
            scale: { type: "spring", stiffness: 180, damping: 10 },
            rotate: { type: "spring", stiffness: 180, damping: 10 },
            y: { repeat: Infinity, duration: 1.5, delay: 0.8 },
          }}
        >
          {reason === "consolidation" ? "🗳️" : winners.length ? "🏆" : "🏚️"}
        </motion.div>
        <motion.h2
          className="mt-2 bg-gradient-to-r from-regime-gold via-yellow-200 to-emerald-300 bg-clip-text font-display text-4xl font-bold text-transparent sm:text-5xl"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {reason === "consolidation" ? "Democratic Consolidation!" : "End of the Board!"}
        </motion.h2>
        <motion.p
          className="mt-2 text-lg text-white/90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {message}
        </motion.p>

        <div className="mt-8 flex items-end justify-center gap-3">
          {podiumOrder.map((p) => {
            const place = ranked.indexOf(p);
            const isWinner = winners.includes(p.id);
            return (
              <motion.div
                key={p.id}
                className="flex w-20 flex-col items-center sm:w-28"
                initial={{ y: 200, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 + (3 - place) * 0.2, type: "spring", stiffness: 140 }}
              >
                {isWinner && (
                  <motion.span
                    className="text-3xl"
                    animate={{ y: [0, -6, 0], rotate: [0, -10, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 1.4 }}
                  >
                    👑
                  </motion.span>
                )}
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-full border-4 border-white text-3xl ${
                    p.eliminated ? "grayscale" : ""
                  }`}
                  style={{ backgroundColor: p.color }}
                >
                  {p.avatar}
                </div>
                <span className="mt-1 truncate text-sm font-bold" style={{ color: p.color }}>
                  {p.name}
                </span>
                <span className="text-xs text-white/70">{p.points} pts</span>
                <div
                  className={`mt-1 flex w-full items-start justify-center rounded-t-xl border-t-4 bg-white/10 pt-1 text-2xl ${PODIUM_HEIGHTS[place]}`}
                  style={{ borderColor: p.color }}
                >
                  {p.eliminated ? "💀" : MEDALS[place]}
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-8 grid w-full gap-3 sm:grid-cols-2">
          {ranked.map((p, i) => {
            const tier = getTier(p.points);
            const acc = p.stats.skillTotal
              ? `${p.stats.skillCorrect}/${p.stats.skillTotal}`
              : "none";
            return (
              <motion.div
                key={p.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left"
                initial={{ x: i % 2 ? 60 : -60, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.4 + i * 0.12 }}
              >
                <p className="mb-2 font-bold" style={{ color: p.color }}>
                  {p.avatar} {p.name}
                </p>
                <ul className="space-y-1 text-sm text-white/85">
                  <li>
                    🏛️ Final regime:{" "}
                    <strong style={{ color: p.eliminated ? "#9ca3af" : tier.color }}>
                      {p.eliminated ? "Failed State" : tier.name}
                    </strong>
                  </li>
                  <li>🃏 Chance cards drawn: {p.stats.chanceDrawn}</li>
                  <li>🎓 Quiz record: {acc}</li>
                  <li>
                    📊 Range: {p.stats.low} to {p.stats.peak} pts
                  </li>
                  {p.stats.best && (
                    <li className="text-emerald-300">
                      📈 Best moment (+{p.stats.best.delta}): <span className="text-white/70">{p.stats.best.text}</span>
                    </li>
                  )}
                  {p.stats.worst && (
                    <li className="text-red-300">
                      📉 Worst moment ({p.stats.worst.delta}): <span className="text-white/70">{p.stats.worst.text}</span>
                    </li>
                  )}
                </ul>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRematch}
            className="rounded-2xl bg-regime-gold px-8 py-3 font-bold text-regime-dark shadow-lg"
          >
            🔁 Rematch
          </motion.button>
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNewGame}
            className="rounded-2xl bg-white/15 px-8 py-3 font-bold"
          >
            🆕 New players
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
