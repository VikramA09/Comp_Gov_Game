import { useState } from "react";
import { motion } from "framer-motion";
import { GAME_RULES } from "@content/gameContent";
import { WorksCited } from "./WorksCited";
import { AVATARS, PLAYER_COLORS, type SetupPlayer } from "../game/reducer";
import type { GameState, Settings } from "../game/types";
import { sfx, unlockAudio } from "../game/sound";

type Props = {
  saved: GameState | null;
  onStart: (players: SetupPlayer[], settings: Settings) => void;
  onResume: () => void;
};

const TITLE = "Democratization";

export function SetupScreen({ saved, onStart, onResume }: Props) {
  const [count, setCount] = useState(2);
  const [players, setPlayers] = useState<SetupPlayer[]>(
    [0, 1, 2, 3].map((i) => ({ name: "", avatar: AVATARS[i] })),
  );
  const [passScreen, setPassScreen] = useState(true);
  const [timer, setTimer] = useState(0);

  const cycleAvatar = (i: number) => {
    unlockAudio();
    sfx.click();
    setPlayers((prev) => {
      const used = new Set(prev.slice(0, count).map((p) => p.avatar));
      let idx = AVATARS.indexOf(prev[i].avatar);
      for (let n = 0; n < AVATARS.length; n++) {
        idx = (idx + 1) % AVATARS.length;
        if (!used.has(AVATARS[idx])) break;
      }
      return prev.map((p, j) => (j === i ? { ...p, avatar: AVATARS[idx] } : p));
    });
  };

  return (
    <div className="mx-auto flex min-h-full max-w-xl flex-col justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 120 }}
        className="rounded-3xl border border-white/10 bg-regime-mid/90 p-6 shadow-2xl backdrop-blur"
      >
        <p className="mb-1 text-center text-xs font-bold uppercase tracking-[0.3em] text-regime-gold">
          AP Comparative Government
        </p>
        <h1 className="mb-1 text-center font-display text-4xl font-bold leading-tight sm:text-5xl">
          {TITLE.split("").map((ch, i) => (
            <motion.span
              key={i}
              className="inline-block"
              initial={{ y: -40, opacity: 0 }}
              animate={{ y: [0, -6, 0], opacity: 1 }}
              transition={{
                opacity: { delay: i * 0.04 },
                y: { delay: 1 + i * 0.08, repeat: Infinity, repeatDelay: 3, duration: 0.5 },
              }}
              style={{ color: i < TITLE.length / 2 ? "#ff8fa3" : "#5eead4" }}
            >
              {ch}
            </motion.span>
          ))}
        </h1>
        <motion.p
          className="mb-5 text-center font-display text-xl text-white/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          🏛️ From Authoritarian Regime to Democratic Consolidation 🗳️
        </motion.p>

        <div className="mb-5 grid grid-cols-3 gap-2 text-center text-xs">
          <div className="rounded-xl bg-black/30 p-2">
            <div className="text-2xl">🏛️</div>Start at <strong>0 pts</strong>
          </div>
          <div className="rounded-xl bg-black/30 p-2">
            <div className="text-2xl">🗳️</div>Reach <strong>{GAME_RULES.winPoints} pts</strong> to win
          </div>
          <div className="rounded-xl bg-black/30 p-2">
            <div className="text-2xl">💥</div>Hit <strong>{GAME_RULES.minPoints}</strong> and you collapse
          </div>
        </div>

        {saved && (
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              unlockAudio();
              onResume();
            }}
            className="mb-5 w-full rounded-2xl border-2 border-regime-gold bg-regime-gold/15 py-3 font-bold text-regime-gold"
          >
            ▶️ Resume saved game ({saved.players.map((p) => p.avatar + " " + p.name).join(", ")})
          </motion.button>
        )}

        <p className="mb-2 text-sm font-semibold">Number of players</p>
        <div className="mb-4 flex gap-2">
          {[2, 3, 4].map((n) => (
            <motion.button
              key={n}
              type="button"
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                unlockAudio();
                sfx.click();
                setCount(n);
              }}
              className={`flex-1 rounded-xl py-2.5 text-lg font-bold transition ${
                count === n ? "bg-regime-accent text-white shadow-lg" : "bg-white/10 hover:bg-white/15"
              }`}
            >
              {n}
            </motion.button>
          ))}
        </div>

        <div className="mb-5 space-y-2">
          {players.slice(0, count).map((p, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-2"
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <motion.button
                type="button"
                whileTap={{ scale: 0.8, rotate: 20 }}
                onClick={() => cycleAvatar(i)}
                title="Tap to change avatar"
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-white/70 text-2xl"
                style={{ backgroundColor: PLAYER_COLORS[i] }}
              >
                {p.avatar}
              </motion.button>
              <input
                value={p.name}
                maxLength={16}
                onChange={(e) =>
                  setPlayers((prev) => prev.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))
                }
                placeholder={`Player ${i + 1} name`}
                className="w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 outline-none focus:ring-2"
                style={{ ["--tw-ring-color" as string]: PLAYER_COLORS[i] }}
              />
            </motion.div>
          ))}
          <p className="text-center text-[11px] text-white/40">Tap an avatar to change it</p>
        </div>

        <div className="mb-5 space-y-3 rounded-2xl bg-black/25 p-4 text-sm">
          <label className="flex cursor-pointer items-center justify-between gap-3">
            <span>
              📱 <strong>Pass-the-device screen</strong>
              <span className="block text-xs text-white/50">Big turn announcement between players</span>
            </span>
            <input
              type="checkbox"
              checked={passScreen}
              onChange={(e) => setPassScreen(e.target.checked)}
              className="h-5 w-5 accent-teal-500"
            />
          </label>
          <div className="flex items-center justify-between gap-3">
            <span>
              ⏱️ <strong>Skill question timer</strong>
              <span className="block text-xs text-white/50">Run out of time and it counts as wrong</span>
            </span>
            <div className="flex gap-1">
              {[0, 30, 60].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTimer(t)}
                  className={`rounded-lg px-2.5 py-1 font-semibold ${
                    timer === t ? "bg-violet-500" : "bg-white/10 hover:bg-white/15"
                  }`}
                >
                  {t === 0 ? "Off" : `${t}s`}
                </button>
              ))}
            </div>
          </div>
        </div>

        <motion.button
          type="button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          animate={{ boxShadow: ["0 0 0px #2a9d8f", "0 0 30px #2a9d8f", "0 0 0px #2a9d8f"] }}
          transition={{ boxShadow: { repeat: Infinity, duration: 2 } }}
          onClick={() => {
            unlockAudio();
            sfx.good();
            onStart(players.slice(0, count), { passScreen, skillTimer: timer });
          }}
          className="mb-5 w-full rounded-2xl bg-gradient-to-r from-regime-democracy to-teal-500 py-4 font-display text-xl font-bold"
        >
          🚀 Start the revolution
        </motion.button>

        <details className="rounded-xl bg-black/25 p-3 text-sm">
          <summary className="cursor-pointer font-semibold text-regime-gold">📚 Works Cited</summary>
          <div className="mt-2">
            <WorksCited />
          </div>
        </details>
      </motion.div>
    </div>
  );
}
