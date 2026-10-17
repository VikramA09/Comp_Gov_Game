import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import { CHANCE_CARDS, GAME_RULES, SKILL_CARDS } from "@content/gameContent";
import { chanceById, skillById } from "./game/reducer";
import { clearSave, loadSaved, useGame } from "./game/useGame";
import { useGameSounds } from "./game/useGameSounds";
import { isMuted, setMuted, sfx, unlockAudio } from "./game/sound";
import { bigCelebration, burst, tierBurst } from "./game/celebrate";
import { TIERS } from "./game/tiers";
import type { LogEntry } from "./game/types";
import { Board } from "./components/Board";
import { Spinner } from "./components/Spinner";
import { PlayerCard } from "./components/PlayerCard";
import { DeckStack } from "./components/DeckStack";
import { SetupScreen } from "./components/SetupScreen";
import { ChanceCardModal } from "./components/ChanceCardModal";
import { SkillCardModal } from "./components/SkillCardModal";
import { EliminatedOverlay, TierToast, TurnIntro } from "./components/Overlays";
import { WinScreen } from "./components/WinScreen";
import { Modal } from "./components/Modal";
import { WorksCited } from "./components/WorksCited";
import { FloatingBackground } from "./components/FloatingBackground";

type Panel = "rules" | "cited" | "chronicle" | "index" | "confirmNew" | null;

const LOG_ICONS: Record<LogEntry["kind"], string> = {
  chance: "🃏",
  skill: "🎓",
  tier: "🎖️",
  eliminated: "💥",
  finished: "🏁",
  win: "🏆",
};

export default function App() {
  const { state, dispatch } = useGame();
  const [saved, setSaved] = useState(() => loadSaved());
  const [panel, setPanel] = useState<Panel>(null);
  const [muted, setMutedState] = useState(isMuted());
  const shake = useAnimationControls();
  useGameSounds(state);

  const current = state.players[state.current];
  const canSpin = state.phase === "idle" && !!current && !current.eliminated;

  const spin = useCallback(() => {
    if (!canSpin) return;
    unlockAudio();
    const v =
      GAME_RULES.moveMin + Math.floor(Math.random() * (GAME_RULES.moveMax - GAME_RULES.moveMin + 1));
    dispatch({ type: "ROLL", value: v });
  }, [canSpin, dispatch]);

  const answerSkill = useCallback(
    (choice: number) => dispatch({ type: "ANSWER_SKILL", choice }),
    [dispatch],
  );

  useEffect(() => {
    const fx = state.fx;
    if (!fx) return;
    if (fx.delta > 0) burst(fx.delta);
    else void shake.start({ x: [0, -14, 14, -10, 10, -5, 5, 0], transition: { duration: 0.55 } });
    if (fx.tierUp) {
      const t = window.setTimeout(tierBurst, 500);
      return () => window.clearTimeout(t);
    }
  }, [state.fx?.id]);

  useEffect(() => {
    if (state.phase === "ended" && state.winners.length > 0) bigCelebration();
  }, [state.phase, state.winners.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (panel || (e.target as HTMLElement)?.tagName === "INPUT") return;
      if (e.key !== " " && e.key !== "Enter") return;
      e.preventDefault();
      unlockAudio();
      switch (state.phase) {
        case "turnIntro":
          dispatch({ type: "BEGIN_TURN" });
          break;
        case "idle":
          spin();
          break;
        case "chance":
          dispatch({ type: "RESOLVE_CHANCE" });
          break;
        case "skillResult":
          dispatch({ type: "CONTINUE_SKILL" });
          break;
        case "eliminated":
          dispatch({ type: "DISMISS_ELIMINATED" });
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state.phase, panel, spin, dispatch]);

  const toggleMute = () => {
    setMuted(!muted);
    setMutedState(!muted);
    if (muted) {
      unlockAudio();
      sfx.click();
    }
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void document.documentElement.requestFullscreen?.();
  };

  const newGame = () => {
    clearSave();
    setSaved(null);
    setPanel(null);
    dispatch({ type: "RESET" });
  };

  const rematch = () => {
    clearSave();
    dispatch({
      type: "START",
      players: state.players.map((p) => ({ name: p.name, avatar: p.avatar })),
      settings: state.settings,
    });
  };

  if (state.phase === "setup") {
    return (
      <>
        <FloatingBackground />
        <SetupScreen
          saved={saved}
          onResume={() => saved && dispatch({ type: "LOAD", state: saved })}
          onStart={(players, settings) => {
            clearSave();
            setSaved(null);
            dispatch({ type: "START", players, settings });
          }}
        />
      </>
    );
  }

  const ranked = [...state.players].sort((a, b) => {
    if (a.eliminated !== b.eliminated) return a.eliminated ? 1 : -1;
    return b.points - a.points;
  });

  const headerButtons: { icon: string; label: string; onClick: () => void }[] = [
    { icon: muted ? "🔇" : "🔊", label: muted ? "Sound off" : "Sound on", onClick: toggleMute },
    { icon: "📜", label: "Chronicle", onClick: () => setPanel("chronicle") },
    { icon: "📖", label: "Index", onClick: () => setPanel("index") },
    { icon: "❓", label: "Rules", onClick: () => setPanel("rules") },
    { icon: "📚", label: "Works Cited", onClick: () => setPanel("cited") },
    { icon: "⛶", label: "Fullscreen", onClick: toggleFullscreen },
    { icon: "🔄", label: "New game", onClick: () => setPanel("confirmNew") },
  ];

  return (
    <>
      <FloatingBackground />
      <motion.div animate={shake} className="mx-auto flex min-h-full max-w-7xl flex-col px-3 py-3 pb-8">
        <header className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <motion.span
              className="text-4xl"
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ repeat: Infinity, duration: 3, repeatDelay: 2 }}
            >
              🗳️
            </motion.span>
            <div>
              <h1 className="font-display text-xl font-bold leading-tight sm:text-2xl">Democratization Board Game</h1>
              <p className="text-xs text-white/60">
                Round {state.round} · First to {GAME_RULES.winPoints} points achieves Democratic Consolidation
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {headerButtons.map((b) => (
              <motion.button
                key={b.label}
                type="button"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  unlockAudio();
                  sfx.click();
                  b.onClick();
                }}
                title={b.label}
                className="flex items-center gap-1 rounded-xl bg-white/10 px-2.5 py-1.5 text-sm hover:bg-white/20"
              >
                <span>{b.icon}</span>
                <span className="hidden md:inline">{b.label}</span>
              </motion.button>
            ))}
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={state.message}
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8 }}
            className="mb-3 rounded-2xl border border-white/10 bg-black/40 px-4 py-2.5 text-center font-semibold sm:text-lg"
          >
            {current && !current.eliminated && <span className="mr-2">{current.avatar}</span>}
            {state.message}
          </motion.div>
        </AnimatePresence>

        <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
          <section className="rounded-3xl border border-white/10 bg-black/25 p-2 shadow-2xl sm:p-3">
            <Board players={state.players} currentId={current?.id ?? null} phase={state.phase} fx={state.fx} />
            <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] text-white/60">
              <span>🏛️ Start</span>
              <span>🃏 Chance: real event from a course country</span>
              <span>🎓 Skill: AP question (+{GAME_RULES.skillCorrectBonus} / {GAME_RULES.skillWrongPenalty})</span>
              <span>🗳️ End of the board</span>
            </div>
          </section>

          <aside className="flex flex-col gap-4">
            <div className="flex flex-col items-center rounded-3xl border border-white/10 bg-black/30 p-4">
              {current && (
                <p className="mb-3 text-center font-display text-lg font-bold" style={{ color: current.color }}>
                  {current.avatar} {current.name}'s turn
                </p>
              )}
              <Spinner spinning={state.phase === "rolling"} value={state.lastRoll} canSpin={canSpin} onSpin={spin} />
              <div className="mt-3 h-8">
                <AnimatePresence mode="wait">
                  {state.lastRoll != null && state.phase !== "rolling" ? (
                    <motion.p
                      key="rolled"
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0 }}
                      className="font-display text-2xl font-bold text-regime-gold"
                    >
                      🎯 Moving {state.lastRoll}!
                    </motion.p>
                  ) : canSpin ? (
                    <motion.p
                      key="hint"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 1.6 }}
                      className="text-sm text-white/70"
                    >
                      Tap the wheel or press Space
                    </motion.p>
                  ) : null}
                </AnimatePresence>
              </div>
              <div className="mt-3 flex gap-6">
                <DeckStack
                  label="Chance"
                  icon="🃏"
                  remaining={state.chanceDeck.length}
                  total={CHANCE_CARDS.length}
                  color="#457b9d"
                />
                <DeckStack
                  label="Skill"
                  icon="🎓"
                  remaining={state.skillDeck.length}
                  total={SKILL_CARDS.length}
                  color="#9b5de5"
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <p className="px-1 text-xs font-bold uppercase tracking-widest text-white/50">Standings</p>
              {ranked.map((p) => (
                <PlayerCard
                  key={p.id}
                  player={p}
                  rank={ranked.indexOf(p)}
                  active={p.id === current?.id && state.phase !== "ended"}
                  fx={state.fx}
                />
              ))}
            </div>
          </aside>
        </div>
      </motion.div>

      <AnimatePresence>
        {state.fx && (
          <motion.div
            key={state.fx.id}
            className="pointer-events-none fixed inset-0 z-40"
            style={{
              background:
                state.fx.delta > 0
                  ? "radial-gradient(circle, transparent 40%, rgba(52,211,153,0.35) 100%)"
                  : "radial-gradient(circle, transparent 35%, rgba(239,68,68,0.55) 100%)",
            }}
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 1.1 }}
          />
        )}
      </AnimatePresence>

      <TierToast fx={state.fx} players={state.players} />

      <TurnIntro
        open={state.phase === "turnIntro"}
        player={current}
        round={state.round}
        onBegin={() => {
          unlockAudio();
          dispatch({ type: "BEGIN_TURN" });
        }}
      />

      <ChanceCardModal
        card={state.phase === "chance" ? chanceById(state.activeChanceId) : null}
        player={current}
        onApply={() => dispatch({ type: "RESOLVE_CHANCE" })}
      />

      <SkillCardModal
        card={state.phase === "skill" || state.phase === "skillResult" ? skillById(state.activeSkillId) : null}
        player={current}
        choice={state.skillChoice}
        timerSeconds={state.settings.skillTimer}
        onAnswer={answerSkill}
        onContinue={() => dispatch({ type: "CONTINUE_SKILL" })}
      />

      <EliminatedOverlay
        open={state.phase === "eliminated"}
        player={current}
        onContinue={() => dispatch({ type: "DISMISS_ELIMINATED" })}
      />

      {state.phase === "ended" && (
        <WinScreen
          players={state.players}
          winners={state.winners}
          reason={state.winReason}
          message={state.message}
          onRematch={rematch}
          onNewGame={newGame}
        />
      )}

      <Modal open={panel === "rules"} onClose={() => setPanel(null)} title="❓ How to play" wide>
        <ul className="space-y-2.5 text-sm leading-relaxed text-white/90">
          <li>🏛️ Everyone starts as an Authoritarian Regime with 0 points.</li>
          <li>
            🎡 On your turn, spin the wheel to move {GAME_RULES.moveMin} to {GAME_RULES.moveMax} spaces.
          </li>
          <li>
            🃏 Chance square: draw a Chance card, read it aloud, and gain or lose points. Each card is removed from
            the deck once drawn. Tap "real-world history" to see the Index notes.
          </li>
          <li>
            🎓 Skill square: answer an AP Comparative Government question. Correct is +{GAME_RULES.skillCorrectBonus},
            incorrect is {GAME_RULES.skillWrongPenalty}.
          </li>
          <li>
            🗳️ Hit {GAME_RULES.winPoints} points and you achieve Democratic Consolidation and win instantly.
          </li>
          <li>💥 Drop to {GAME_RULES.minPoints} points and your country becomes a Failed State. You are eliminated.</li>
          <li>
            🏁 Reach the end of the board and you wait there. When every remaining player has finished, the highest
            score wins. Ties share the victory.
          </li>
        </ul>
        <p className="mb-2 mt-5 text-xs font-bold uppercase tracking-widest text-white/50">Regime ladder</p>
        <div className="grid gap-1.5 sm:grid-cols-2">
          {TIERS.map((t, i) => {
            const nextMin = TIERS[i + 1]?.min;
            const range =
              t.min === -Infinity
                ? `${GAME_RULES.minPoints} to ${nextMin - 1}`
                : nextMin === undefined
                  ? `${t.min}+`
                  : `${t.min} to ${nextMin - 1}`;
            return (
              <div key={t.name} className="flex items-center gap-2 rounded-lg bg-black/30 px-3 py-1.5 text-sm">
                <span>{t.emoji}</span>
                <span className="font-semibold" style={{ color: t.color }}>
                  {t.name}
                </span>
                <span className="ml-auto text-xs text-white/50">{range} pts</span>
              </div>
            );
          })}
        </div>
        <p className="mt-4 text-xs text-white/50">
          Keyboard: Space or Enter to spin and continue. A to D (or 1 to 4) to answer questions.
        </p>
      </Modal>

      <Modal open={panel === "cited"} onClose={() => setPanel(null)} title="📚 Works Cited" wide>
        <WorksCited />
      </Modal>

      <Modal open={panel === "index"} onClose={() => setPanel(null)} title="📖 Index: Events and History" wide>
        <ul className="space-y-3">
          {CHANCE_CARDS.map((c) => {
            const drawn = !state.chanceDeck.includes(c.id) && c.id !== state.activeChanceId;
            return (
              <li key={c.id} className="rounded-xl bg-black/30 p-3 text-sm">
                <div className="mb-1 flex items-start justify-between gap-3">
                  <span className="font-semibold">{c.text}</span>
                  <span
                    className={`shrink-0 rounded-lg px-2 py-0.5 font-bold ${
                      c.points >= 0 ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300"
                    }`}
                  >
                    {c.points > 0 ? `+${c.points}` : c.points}
                  </span>
                </div>
                <p className="text-white/70">{c.indexNote}</p>
                {drawn && <p className="mt-1 text-xs text-regime-gold">✓ Drawn this game</p>}
              </li>
            );
          })}
        </ul>
      </Modal>

      <Modal open={panel === "chronicle"} onClose={() => setPanel(null)} title="📜 Chronicle of the Game" wide>
        {state.log.length === 0 ? (
          <p className="text-sm text-white/60">Nothing has happened yet. Spin the wheel to make history!</p>
        ) : (
          <ul className="space-y-2">
            {[...state.log].reverse().map((e) => {
              const p = state.players.find((x) => x.id === e.playerId);
              return (
                <motion.li
                  key={e.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-3 rounded-xl bg-black/30 p-3 text-sm"
                >
                  <span className="text-xl">{LOG_ICONS[e.kind]}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-white/50">
                      Round {e.round} ·{" "}
                      <span style={{ color: p?.color }}>
                        {p?.avatar} {p?.name}
                      </span>
                    </p>
                    <p>{e.text}</p>
                  </div>
                  {e.delta !== undefined && (
                    <span className={`shrink-0 font-bold ${e.delta >= 0 ? "text-emerald-300" : "text-red-300"}`}>
                      {e.delta > 0 ? `+${e.delta}` : e.delta}
                    </span>
                  )}
                </motion.li>
              );
            })}
          </ul>
        )}
      </Modal>

      <Modal open={panel === "confirmNew"} onClose={() => setPanel(null)} title="🔄 Start a new game?">
        <p className="mb-5 text-sm text-white/80">This ends the current game and returns to the setup screen.</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={newGame}
            className="flex-1 rounded-xl bg-regime-accent py-2.5 font-bold hover:brightness-110"
          >
            Yes, new game
          </button>
          <button
            type="button"
            onClick={() => setPanel(null)}
            className="flex-1 rounded-xl bg-white/10 py-2.5 font-bold hover:bg-white/20"
          >
            Keep playing
          </button>
        </div>
      </Modal>
    </>
  );
}
