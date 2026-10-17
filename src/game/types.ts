export type Moment = { text: string; delta: number };

export type PlayerStats = {
  chanceDrawn: number;
  skillCorrect: number;
  skillTotal: number;
  peak: number;
  low: number;
  best: Moment | null;
  worst: Moment | null;
};

export type Player = {
  id: number;
  name: string;
  avatar: string;
  color: string;
  position: number;
  points: number;
  eliminated: boolean;
  finished: boolean;
  stats: PlayerStats;
};

export type Phase =
  | "setup"
  | "turnIntro"
  | "idle"
  | "rolling"
  | "moving"
  | "landing"
  | "chance"
  | "skill"
  | "skillResult"
  | "eliminated"
  | "ended";

export type WinReason = "consolidation" | "endOfBoard" | null;

export type Settings = {
  /** Seconds to answer a skill question; 0 = no timer */
  skillTimer: number;
  passScreen: boolean;
};

export type LogKind = "chance" | "skill" | "tier" | "eliminated" | "finished" | "win";

export type LogEntry = {
  id: number;
  round: number;
  playerId: number;
  kind: LogKind;
  text: string;
  delta?: number;
};

export type Fx = {
  id: number;
  playerId: number;
  delta: number;
  tierFrom: string;
  tierTo: string;
  /** null when the regime tier did not change */
  tierUp: boolean | null;
};

export type GameState = {
  phase: Phase;
  players: Player[];
  current: number;
  round: number;
  lastRoll: number | null;
  stepsLeft: number;
  chanceDeck: string[];
  skillDeck: string[];
  activeChanceId: string | null;
  activeSkillId: string | null;
  /** -1 means the timer ran out */
  skillChoice: number | null;
  winners: number[];
  winReason: WinReason;
  message: string;
  log: LogEntry[];
  fx: Fx | null;
  settings: Settings;
  seq: number;
};
