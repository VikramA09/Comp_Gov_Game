import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GAME_RULES, type McqCard } from "@content/gameContent";
import type { Player } from "../game/types";
import { sfx } from "../game/sound";

type Props = {
  card: McqCard | null;
  player: Player | undefined;
  choice: number | null;
  timerSeconds: number;
  onAnswer: (choice: number) => void;
  onContinue: () => void;
};

const LETTERS = ["A", "B", "C", "D"];

export function SkillCardModal({ card, player, choice, timerSeconds, onAnswer, onContinue }: Props) {
  const answered = choice !== null;
  const [left, setLeft] = useState(timerSeconds);

  useEffect(() => {
    setLeft(timerSeconds);
  }, [card?.id, timerSeconds]);

  useEffect(() => {
    if (!card || answered || timerSeconds <= 0) return;
    if (left <= 0) {
      onAnswer(-1);
      return;
    }
    const t = window.setTimeout(() => {
      if (left <= 6) sfx.tick();
      setLeft((v) => v - 1);
    }, 1000);
    return () => window.clearTimeout(t);
  }, [card, answered, left, timerSeconds, onAnswer]);

  useEffect(() => {
    if (!card || answered) return;
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      const idx = ["a", "b", "c", "d"].indexOf(k);
      const num = ["1", "2", "3", "4"].indexOf(k);
      const pick = idx >= 0 ? idx : num;
      if (pick >= 0 && pick < card.choices.length) onAnswer(pick);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [card, answered, onAnswer]);

  const correct = card && choice === card.correctIndex;
  const timedOut = choice === -1;

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
            className="w-full max-w-2xl overflow-hidden rounded-3xl border-4 border-violet-300/80 bg-regime-mid shadow-[0_0_60px_rgba(155,93,229,0.45)]"
            initial={{ scale: 0.5, rotateX: 60, y: 120 }}
            animate={{ scale: 1, rotateX: 0, y: 0 }}
            exit={{ scale: 0.7, opacity: 0, y: -120 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
          >
            <div className="flex items-center justify-between bg-gradient-to-r from-violet-700 to-fuchsia-600 px-5 py-3">
              <span className="font-display text-lg font-bold tracking-wide">🎓 SKILL QUESTION</span>
              <div className="flex items-center gap-3">
                {player && (
                  <span className="text-sm font-semibold">
                    {player.avatar} {player.name}
                  </span>
                )}
                {timerSeconds > 0 && !answered && (
                  <motion.span
                    key={left}
                    initial={{ scale: 1.4 }}
                    animate={{ scale: 1 }}
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-display font-bold ${
                      left <= 5 ? "border-red-300 bg-red-600" : "border-white/70 bg-black/30"
                    }`}
                  >
                    {left}
                  </motion.span>
                )}
              </div>
            </div>

            {timerSeconds > 0 && !answered && (
              <div className="h-1.5 bg-black/40">
                <motion.div
                  className="h-full bg-fuchsia-400"
                  animate={{ width: `${(left / timerSeconds) * 100}%` }}
                  transition={{ duration: 1, ease: "linear" }}
                />
              </div>
            )}

            <div className="p-5">
              <p className="mb-5 text-lg font-semibold leading-relaxed sm:text-xl">{card.question}</p>

              <ul className="space-y-2.5">
                {card.choices.map((text, i) => {
                  const isCorrect = i === card.correctIndex;
                  const isPicked = i === choice;
                  let cls = "border-violet-400/40 bg-violet-950/40 hover:border-violet-200 hover:bg-violet-800/50";
                  if (answered) {
                    if (isCorrect) cls = "border-emerald-300 bg-emerald-600/40";
                    else if (isPicked) cls = "border-red-400 bg-red-700/40";
                    else cls = "border-white/10 bg-black/20 opacity-50";
                  }
                  return (
                    <motion.li
                      key={i}
                      initial={{ x: -40, opacity: 0 }}
                      animate={
                        answered && isPicked && !isCorrect
                          ? { x: [0, -10, 10, -8, 8, 0], opacity: 1 }
                          : answered && isCorrect
                            ? { x: 0, opacity: 1, scale: [1, 1.04, 1] }
                            : { x: 0, opacity: 1 }
                      }
                      transition={{ delay: answered ? 0 : 0.15 + i * 0.08 }}
                    >
                      <button
                        type="button"
                        disabled={answered}
                        onClick={() => onAnswer(i)}
                        className={`flex w-full items-start gap-3 rounded-2xl border-2 px-4 py-3 text-left transition ${cls}`}
                      >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/15 font-bold">
                          {answered && isCorrect ? "✓" : answered && isPicked ? "✗" : LETTERS[i]}
                        </span>
                        <span className="pt-0.5 text-sm sm:text-base">{text}</span>
                      </button>
                    </motion.li>
                  );
                })}
              </ul>

              <AnimatePresence mode="wait">
                {answered ? (
                  <motion.div
                    key="result"
                    initial={{ y: 20, opacity: 0, scale: 0.9 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    className="mt-5"
                  >
                    <div
                      className={`rounded-2xl p-4 text-center ${
                        correct ? "bg-emerald-500/20 text-emerald-200" : "bg-red-500/20 text-red-200"
                      }`}
                    >
                      <p className="font-display text-2xl font-bold">
                        {correct
                          ? `✅ Correct! +${GAME_RULES.skillCorrectBonus} points`
                          : timedOut
                            ? `⏰ Time's up! ${GAME_RULES.skillWrongPenalty} points`
                            : `❌ Not quite! ${GAME_RULES.skillWrongPenalty} points`}
                      </p>
                      {!correct && (
                        <p className="mt-2 text-sm text-white/90">
                          The correct answer is{" "}
                          <strong className="text-emerald-300">
                            {LETTERS[card.correctIndex]}. {card.choices[card.correctIndex]}
                          </strong>
                        </p>
                      )}
                    </div>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={onContinue}
                      className="mt-4 w-full rounded-2xl bg-violet-500 py-3.5 text-lg font-bold shadow-lg hover:bg-violet-400"
                    >
                      Continue <span className="ml-1 text-xs font-normal opacity-70">(Space)</span>
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.p key="hint" className="mt-4 text-center text-xs text-white/50">
                    Correct: +{GAME_RULES.skillCorrectBonus} pts · Incorrect: {GAME_RULES.skillWrongPenalty} pts · Press A to D or 1 to 4
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
