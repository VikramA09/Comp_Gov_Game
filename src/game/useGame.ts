import { useEffect, useReducer } from "react";
import { CHANCE_CARDS, SKILL_CARDS } from "@content/gameContent";
import { initialState, reducer } from "./reducer";
import type { GameState } from "./types";

const SAVE_KEY = "democratization-board-game-save-v2";

export const SPIN_MS = 1400;
const STEP_MS = 280;
const LAND_MS = 550;

export function loadSaved(): GameState | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as GameState;
    if (!s || !Array.isArray(s.players) || s.players.length === 0) return null;
    if (s.phase === "setup" || s.phase === "ended") return null;
    const chanceIds = new Set(CHANCE_CARDS.map((c) => c.id));
    const skillIds = new Set(SKILL_CARDS.map((c) => c.id));
    const fixed: GameState = {
      ...s,
      chanceDeck: s.chanceDeck.filter((id) => chanceIds.has(id)),
      skillDeck: s.skillDeck.filter((id) => skillIds.has(id)),
      fx: null,
    };
    if (
      (fixed.phase === "chance" && !chanceIds.has(fixed.activeChanceId ?? "")) ||
      ((fixed.phase === "skill" || fixed.phase === "skillResult") &&
        !skillIds.has(fixed.activeSkillId ?? ""))
    ) {
      fixed.phase = "idle";
    }
    return fixed;
  } catch {
    return null;
  }
}

export function clearSave() {
  localStorage.removeItem(SAVE_KEY);
}

export function useGame() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    let t: number | undefined;
    if (state.phase === "rolling") {
      t = window.setTimeout(() => dispatch({ type: "START_MOVE" }), SPIN_MS);
    } else if (state.phase === "moving") {
      t = window.setTimeout(() => dispatch({ type: "STEP" }), STEP_MS);
    } else if (state.phase === "landing") {
      t = window.setTimeout(() => dispatch({ type: "LAND" }), LAND_MS);
    }
    return () => window.clearTimeout(t);
  }, [state.phase, state.stepsLeft]);

  useEffect(() => {
    if (state.phase === "setup") return;
    if (state.phase === "ended") {
      clearSave();
      return;
    }
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  }, [state]);

  return { state, dispatch };
}
