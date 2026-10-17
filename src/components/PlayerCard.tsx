import { AnimatePresence, motion } from "framer-motion";
import { GAME_RULES } from "@content/gameContent";
import { getTier } from "../game/tiers";
import type { Fx, Player } from "../game/types";
import { AnimatedNumber } from "./AnimatedNumber";

type Props = {
  player: Player;
  rank: number;
  active: boolean;
  fx: Fx | null;
};

const RANGE = GAME_RULES.winPoints - GAME_RULES.minPoints;
const ZERO_PCT = ((0 - GAME_RULES.minPoints) / RANGE) * 100;
const MEDALS = ["🥇", "🥈", "🥉", "4️⃣"];

export function PlayerCard({ player: p, rank, active, fx }: Props) {
  const tier = getTier(p.points);
  const pct = Math.max(0, Math.min(100, ((p.points - GAME_RULES.minPoints) / RANGE) * 100));
  const danger = !p.eliminated && p.points <= GAME_RULES.minPoints + 5;
  const myFx = fx && fx.playerId === p.id ? fx : null;

  return (
    <motion.div
      layout
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={`relative rounded-2xl border p-3 ${
        active
          ? "border-regime-gold bg-regime-gold/10 shadow-[0_0_24px_rgba(244,162,97,0.35)]"
          : "border-white/10 bg-black/30"
      } ${p.eliminated ? "opacity-50 grayscale" : ""} ${danger ? "danger-pulse" : ""}`}
    >
      <div className="flex items-center gap-3">
        <motion.div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-white/70 text-2xl"
          style={{ backgroundColor: p.color }}
          animate={active ? { rotate: [0, -8, 8, 0] } : { rotate: 0 }}
          transition={active ? { repeat: Infinity, duration: 2, repeatDelay: 1 } : {}}
        >
          {p.avatar}
        </motion.div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">{p.eliminated ? "💀" : MEDALS[rank]}</span>
            <span className="truncate font-bold" style={{ color: p.color }}>
              {p.name}
            </span>
            {active && (
              <span className="rounded-full bg-regime-gold px-2 py-0.5 text-[10px] font-bold uppercase text-regime-dark">
                Turn
              </span>
            )}
            {p.finished && !p.eliminated && (
              <span className="rounded-full bg-emerald-500/30 px-2 py-0.5 text-[10px] font-bold uppercase">
                🏁 Finished
              </span>
            )}
          </div>
          <motion.div
            key={tier.name}
            initial={{ scale: 1.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-xs font-semibold"
            style={{ color: p.eliminated ? "#9ca3af" : tier.color }}
          >
            {p.eliminated ? "Failed State" : `${tier.emoji} ${tier.name}`}
          </motion.div>
        </div>
        <div className="relative text-right">
          <div className="font-display text-2xl font-bold leading-none">
            <AnimatedNumber value={p.points} />
          </div>
          <div className="text-[10px] uppercase text-white/50">points</div>
          <AnimatePresence>
            {myFx && (
              <motion.span
                key={myFx.id}
                className={`absolute -top-2 right-0 font-display text-lg font-bold ${
                  myFx.delta > 0 ? "text-emerald-300" : "text-red-400"
                }`}
                initial={{ y: 0, opacity: 1 }}
                animate={{ y: -28, opacity: 0 }}
                transition={{ duration: 1.6 }}
              >
                {myFx.delta > 0 ? `+${myFx.delta}` : myFx.delta}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="relative mt-2.5 h-3 w-full overflow-hidden rounded-full bg-black/50">
        <div className="absolute inset-y-0 left-0 bg-red-900/50" style={{ width: `${ZERO_PCT}%` }} />
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ background: `linear-gradient(90deg, ${p.color}aa, ${p.color})` }}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 90, damping: 16 }}
        />
        <div className="absolute inset-y-0 w-0.5 bg-white/70" style={{ left: `${ZERO_PCT}%` }} />
      </div>
      <div className="mt-0.5 flex justify-between text-[9px] text-white/40">
        <span>{GAME_RULES.minPoints} Failed State</span>
        <span>0</span>
        <span>{GAME_RULES.winPoints} Consolidation</span>
      </div>
    </motion.div>
  );
}
