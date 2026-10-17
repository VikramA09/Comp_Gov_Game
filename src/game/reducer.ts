import { buildBoardLayout } from "@content/boardLayout";
import { CHANCE_CARDS, GAME_RULES, SKILL_CARDS } from "@content/gameContent";
import { getTier, tierIndex } from "./tiers";
import type { GameState, LogEntry, Player, Settings } from "./types";

export const BOARD = buildBoardLayout();
export const LAST_SPACE = BOARD.length - 1;

export const PLAYER_COLORS = ["#e94560", "#2a9d8f", "#f4a261", "#9b5de5"];
export const AVATARS = ["🦅", "🦁", "🐻", "🐉", "🦉", "🐺", "🐢", "🦊", "🐘", "🦈"];

export const chanceById = (id: string | null) =>
  CHANCE_CARDS.find((c) => c.id === id) ?? null;
export const skillById = (id: string | null) =>
  SKILL_CARDS.find((c) => c.id === id) ?? null;

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export const initialState: GameState = {
  phase: "setup",
  players: [],
  current: 0,
  round: 1,
  lastRoll: null,
  stepsLeft: 0,
  chanceDeck: [],
  skillDeck: [],
  activeChanceId: null,
  activeSkillId: null,
  skillChoice: null,
  winners: [],
  winReason: null,
  message: "",
  log: [],
  fx: null,
  settings: { skillTimer: 0, passScreen: true },
  seq: 1,
};

export type SetupPlayer = { name: string; avatar: string };

export type Action =
  | { type: "START"; players: SetupPlayer[]; settings: Settings }
  | { type: "BEGIN_TURN" }
  | { type: "ROLL"; value: number }
  | { type: "START_MOVE" }
  | { type: "STEP" }
  | { type: "LAND" }
  | { type: "RESOLVE_CHANCE" }
  | { type: "ANSWER_SKILL"; choice: number }
  | { type: "CONTINUE_SKILL" }
  | { type: "DISMISS_ELIMINATED" }
  | { type: "RESET" }
  | { type: "LOAD"; state: GameState };

function addLog(
  s: GameState,
  entry: Omit<LogEntry, "id" | "round">,
): GameState {
  return {
    ...s,
    log: [...s.log, { ...entry, id: s.seq, round: s.round }],
    seq: s.seq + 1,
  };
}

function endOfBoard(s: GameState): GameState {
  const alive = s.players.filter((p) => !p.eliminated);
  if (alive.length === 0) {
    return {
      ...s,
      phase: "ended",
      winReason: "endOfBoard",
      winners: [],
      message: "Every government collapsed. Nobody wins this time!",
    };
  }
  const top = Math.max(...alive.map((p) => p.points));
  const tied = alive.filter((p) => p.points === top);
  return {
    ...s,
    phase: "ended",
    winReason: "endOfBoard",
    winners: tied.map((p) => p.id),
    message:
      tied.length > 1
        ? `${tied.map((p) => p.name).join(" & ")} share the victory with ${top} points!`
        : `${tied[0].name} wins with the highest score: ${top} points!`,
  };
}

function nextTurn(s: GameState, prefix?: string): GameState {
  const n = s.players.length;
  for (let step = 1; step <= n; step++) {
    const idx = (s.current + step) % n;
    const p = s.players[idx];
    if (!p.eliminated && !p.finished) {
      const round = idx <= s.current ? s.round + 1 : s.round;
      const turnMsg = `${p.name}'s turn. Spin to move!`;
      return {
        ...s,
        current: idx,
        round,
        lastRoll: null,
        stepsLeft: 0,
        activeChanceId: null,
        activeSkillId: null,
        skillChoice: null,
        phase: s.settings.passScreen ? "turnIntro" : "idle",
        message: prefix ? `${prefix} ${turnMsg}` : turnMsg,
      };
    }
  }
  return endOfBoard(s);
}

function applyDelta(
  s: GameState,
  delta: number,
  text: string,
  kind: "chance" | "skill",
): GameState {
  const p = s.players[s.current];
  const before = p.points;
  const raw = before + delta;
  const eliminated = raw <= GAME_RULES.minPoints;
  const points = Math.max(
    GAME_RULES.minPoints,
    Math.min(GAME_RULES.maxPoints, raw),
  );
  const st = p.stats;
  const moment = { text, delta };
  const updated: Player = {
    ...p,
    points,
    eliminated,
    stats: {
      chanceDrawn: st.chanceDrawn + (kind === "chance" ? 1 : 0),
      skillTotal: st.skillTotal + (kind === "skill" ? 1 : 0),
      skillCorrect: st.skillCorrect + (kind === "skill" && delta > 0 ? 1 : 0),
      peak: Math.max(st.peak, points),
      low: Math.min(st.low, points),
      best: delta > 0 && (!st.best || delta > st.best.delta) ? moment : st.best,
      worst:
        delta < 0 && (!st.worst || delta < st.worst.delta) ? moment : st.worst,
    },
  };

  const tFrom = getTier(before);
  const tTo = getTier(points);
  const tierChanged = tFrom.name !== tTo.name;

  let next: GameState = {
    ...s,
    players: s.players.map((x) => (x.id === p.id ? updated : x)),
    activeChanceId: null,
    activeSkillId: null,
    skillChoice: null,
    fx: {
      id: s.seq,
      playerId: p.id,
      delta,
      tierFrom: tFrom.name,
      tierTo: tTo.name,
      tierUp: tierChanged ? tierIndex(points) > tierIndex(before) : null,
    },
  };
  next = addLog(next, { playerId: p.id, kind, text, delta });

  if (points >= GAME_RULES.winPoints) {
    next = addLog(next, {
      playerId: p.id,
      kind: "win",
      text: "Achieved Democratic Consolidation!",
    });
    return {
      ...next,
      phase: "ended",
      winReason: "consolidation",
      winners: [p.id],
      message: `${p.name} achieved Democratic Consolidation!`,
    };
  }
  if (eliminated) {
    next = addLog(next, {
      playerId: p.id,
      kind: "eliminated",
      text: "Government collapsed into a Failed State",
    });
    return {
      ...next,
      phase: "eliminated",
      message: `${p.name}'s government collapsed into a Failed State!`,
    };
  }
  if (tierChanged) {
    next = addLog(next, {
      playerId: p.id,
      kind: "tier",
      text: `Regime change: now a ${tTo.name}`,
    });
  }
  return nextTurn(next);
}

export function reducer(s: GameState, a: Action): GameState {
  switch (a.type) {
    case "START": {
      const players: Player[] = a.players.map((p, i) => ({
        id: i,
        name: p.name.trim() || `Player ${i + 1}`,
        avatar: p.avatar,
        color: PLAYER_COLORS[i % PLAYER_COLORS.length],
        position: 0,
        points: 0,
        eliminated: false,
        finished: false,
        stats: {
          chanceDrawn: 0,
          skillCorrect: 0,
          skillTotal: 0,
          peak: 0,
          low: 0,
          best: null,
          worst: null,
        },
      }));
      return {
        ...initialState,
        settings: a.settings,
        players,
        chanceDeck: shuffle(CHANCE_CARDS.map((c) => c.id)),
        skillDeck: shuffle(SKILL_CARDS.map((c) => c.id)),
        phase: a.settings.passScreen ? "turnIntro" : "idle",
        message: `${players[0].name} goes first. Spin to move!`,
      };
    }
    case "BEGIN_TURN":
      return s.phase === "turnIntro" ? { ...s, phase: "idle" } : s;
    case "ROLL":
      if (s.phase !== "idle") return s;
      return {
        ...s,
        phase: "rolling",
        lastRoll: a.value,
        message: `${s.players[s.current].name} is spinning...`,
      };
    case "START_MOVE": {
      if (s.phase !== "rolling" || s.lastRoll == null) return s;
      const p = s.players[s.current];
      const steps = Math.min(s.lastRoll, LAST_SPACE - p.position);
      return {
        ...s,
        phase: steps > 0 ? "moving" : "landing",
        stepsLeft: steps,
        message: `${p.name} spun a ${s.lastRoll}!`,
      };
    }
    case "STEP": {
      if (s.phase !== "moving" || s.stepsLeft <= 0) return s;
      const p = s.players[s.current];
      const stepsLeft = s.stepsLeft - 1;
      return {
        ...s,
        stepsLeft,
        phase: stepsLeft === 0 ? "landing" : "moving",
        players: s.players.map((x) =>
          x.id === p.id ? { ...x, position: x.position + 1 } : x,
        ),
      };
    }
    case "LAND": {
      if (s.phase !== "landing") return s;
      const p = s.players[s.current];
      const square = BOARD[p.position];
      if (square.type === "end") {
        let next: GameState = {
          ...s,
          players: s.players.map((x) =>
            x.id === p.id ? { ...x, finished: true } : x,
          ),
        };
        next = addLog(next, {
          playerId: p.id,
          kind: "finished",
          text: `Reached the end of the board with ${p.points} points`,
        });
        return nextTurn(
          next,
          `${p.name} reached the end of the board and waits for the others.`,
        );
      }
      if (square.type === "chance") {
        if (s.chanceDeck.length === 0) {
          return nextTurn(s, "The Chance deck is empty!");
        }
        const [id, ...rest] = s.chanceDeck;
        return {
          ...s,
          chanceDeck: rest,
          activeChanceId: id,
          phase: "chance",
          message: `${p.name} drew a Chance card!`,
        };
      }
      if (square.type === "skill") {
        if (s.skillDeck.length === 0) {
          return nextTurn(s, "The Skill deck is empty!");
        }
        const [id, ...rest] = s.skillDeck;
        return {
          ...s,
          skillDeck: rest,
          activeSkillId: id,
          skillChoice: null,
          phase: "skill",
          message: `${p.name} landed on a Skill square. Quiz time!`,
        };
      }
      return nextTurn(s);
    }
    case "RESOLVE_CHANCE": {
      if (s.phase !== "chance") return s;
      const card = chanceById(s.activeChanceId);
      if (!card) return nextTurn(s);
      return applyDelta(s, card.points, card.text, "chance");
    }
    case "ANSWER_SKILL":
      if (s.phase !== "skill") return s;
      return { ...s, phase: "skillResult", skillChoice: a.choice };
    case "CONTINUE_SKILL": {
      if (s.phase !== "skillResult") return s;
      const card = skillById(s.activeSkillId);
      if (!card) return nextTurn(s);
      const correct = s.skillChoice === card.correctIndex;
      return applyDelta(
        s,
        correct ? GAME_RULES.skillCorrectBonus : GAME_RULES.skillWrongPenalty,
        `${correct ? "Answered correctly" : "Missed"}: ${card.question}`,
        "skill",
      );
    }
    case "DISMISS_ELIMINATED":
      return s.phase === "eliminated" ? nextTurn(s) : s;
    case "RESET":
      return { ...initialState, settings: s.settings };
    case "LOAD":
      return a.state;
  }
}
