import { AnimatePresence, motion } from "framer-motion";
import type { BoardSquare } from "@content/boardLayout";
import { BOARD } from "../game/reducer";
import type { Fx, Phase, Player } from "../game/types";

const COLS = 6;
const ROWS = Math.ceil(BOARD.length / COLS);
const TOKEN_OFFSETS: [number, number][] = [
  [-1, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
];

function cell(i: number) {
  const row = Math.floor(i / COLS);
  const k = i % COLS;
  const col = row % 2 === 0 ? k : COLS - 1 - k;
  return { col, yRow: ROWS - 1 - row };
}

const ICONS: Record<BoardSquare["type"], string> = {
  start: "🏛️",
  chance: "🃏",
  skill: "🎓",
  end: "🗳️",
};

type Props = {
  players: Player[];
  currentId: number | null;
  phase: Phase;
  fx: Fx | null;
};

export function Board({ players, currentId, phase, fx }: Props) {
  const pathPoints = BOARD.map((_, i) => {
    const { col, yRow } = cell(i);
    return `${(col + 0.5) * 100},${(yRow + 0.5) * 100}`;
  }).join(" ");

  const current = players.find((p) => p.id === currentId);
  const landed =
    current && ["landing", "chance", "skill", "skillResult"].includes(phase)
      ? current.position
      : null;

  return (
    <div
      className="relative w-full select-none"
      style={{ aspectRatio: `${COLS} / ${ROWS}` }}
    >
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox={`0 0 ${COLS * 100} ${ROWS * 100}`}
        preserveAspectRatio="none"
      >
        <polyline
          points={pathPoints}
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="22"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <polyline
          points={pathPoints}
          fill="none"
          stroke="rgba(244,162,97,0.55)"
          strokeWidth="4"
          strokeLinejoin="round"
          strokeLinecap="round"
          className="path-flow"
        />
      </svg>

      {BOARD.map((sq) => {
        const { col, yRow } = cell(sq.index);
        const t = sq.index / (BOARD.length - 1);
        const hue = 350 + (160 - 350) * t;
        const special = sq.type === "start" || sq.type === "end";
        return (
          <motion.div
            key={sq.index}
            className="absolute p-[3px] sm:p-1.5"
            style={{
              left: `${(col / COLS) * 100}%`,
              top: `${(yRow / ROWS) * 100}%`,
              width: `${100 / COLS}%`,
              height: `${100 / ROWS}%`,
            }}
            initial={{ scale: 0, opacity: 0, rotate: -8 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ delay: sq.index * 0.025, type: "spring", stiffness: 260, damping: 18 }}
          >
            <div
              className={`relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-xl border text-center shadow-lg ${
                sq.type === "skill"
                  ? "border-violet-300/70 shadow-violet-500/30"
                  : sq.type === "chance"
                    ? "border-white/15"
                    : "border-regime-gold/80 shadow-regime-gold/30"
              }`}
              style={{
                background: `linear-gradient(145deg, hsla(${hue},65%,34%,0.95), hsla(${hue},60%,16%,0.95))`,
              }}
              title={sq.label}
            >
              {sq.type === "skill" && (
                <div className="absolute inset-0 animate-pulse bg-violet-500/20" />
              )}
              <span className={special ? "text-xl sm:text-3xl" : "text-base sm:text-2xl"}>
                {ICONS[sq.type]}
              </span>
              {special ? (
                <span className="px-1 font-display text-[8px] font-bold leading-tight sm:text-[11px]">
                  {sq.label}
                </span>
              ) : (
                <span className="text-[8px] font-semibold uppercase tracking-wider text-white/60 sm:text-[10px]">
                  {sq.type === "skill" ? "Skill" : "Chance"}
                </span>
              )}
              <span className="absolute left-1 top-0.5 text-[8px] text-white/40 sm:text-[10px]">
                {sq.index}
              </span>
            </div>

            {landed === sq.index && (
              <motion.div
                className="pointer-events-none absolute inset-1 rounded-xl border-4 border-regime-gold"
                initial={{ scale: 0.7, opacity: 1 }}
                animate={{ scale: 1.25, opacity: 0 }}
                transition={{ repeat: Infinity, duration: 1.1 }}
              />
            )}
          </motion.div>
        );
      })}

      {players.map((p) => {
        const { col, yRow } = cell(p.position);
        const [ox, oy] = TOKEN_OFFSETS[p.id % TOKEN_OFFSETS.length];
        const active = p.id === currentId && phase !== "ended";
        const showFx = fx && fx.playerId === p.id;
        return (
          <motion.div
            key={p.id}
            className="pointer-events-none absolute"
            style={{
              width: `${100 / COLS}%`,
              height: `${100 / ROWS}%`,
              zIndex: active ? 30 : 20,
            }}
            initial={false}
            animate={{
              left: `${(col / COLS) * 100}%`,
              top: `${(yRow / ROWS) * 100}%`,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
          >
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${50 + ox * 24}%`, top: `${50 + oy * 22}%` }}
            >
              <motion.div
                key={p.position}
                initial={{ y: 0 }}
                animate={{ y: [0, -22, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="relative"
              >
                {active && (
                  <span
                    className="absolute inset-0 animate-ping rounded-full"
                    style={{ backgroundColor: p.color, opacity: 0.6 }}
                  />
                )}
                <span
                  className={`relative flex h-7 w-7 items-center justify-center rounded-full border-2 text-sm shadow-xl sm:h-10 sm:w-10 sm:text-xl ${
                    p.eliminated ? "grayscale opacity-50" : ""
                  }`}
                  style={{
                    backgroundColor: p.color,
                    borderColor: active ? "#fff" : "rgba(255,255,255,0.6)",
                    boxShadow: active ? `0 0 18px ${p.color}` : undefined,
                  }}
                >
                  {p.avatar}
                </span>
                {p.eliminated && (
                  <span className="absolute -right-2 -top-2 text-sm">💀</span>
                )}
                {p.finished && !p.eliminated && (
                  <span className="absolute -right-2 -top-3 text-sm">🏁</span>
                )}
              </motion.div>

              <AnimatePresence>
                {showFx && (
                  <motion.span
                    key={fx.id}
                    className={`absolute left-1/2 top-0 -translate-x-1/2 whitespace-nowrap font-display text-xl font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] sm:text-3xl ${
                      fx.delta > 0 ? "text-emerald-300" : "text-red-400"
                    }`}
                    initial={{ y: 0, opacity: 0, scale: 0.4 }}
                    animate={{ y: -60, opacity: [0, 1, 1, 0], scale: 1.2 }}
                    transition={{ duration: 1.8, ease: "easeOut" }}
                  >
                    {fx.delta > 0 ? `+${fx.delta}` : fx.delta}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
