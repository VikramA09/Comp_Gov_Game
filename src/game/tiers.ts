export type Tier = {
  min: number;
  name: string;
  emoji: string;
  color: string;
};

/** Regime classifications from the AP Comp Gov course, ordered from least to most democratic. */
export const TIERS: Tier[] = [
  { min: -Infinity, name: "Failing State", emoji: "🔥", color: "#ef4444" },
  { min: -9, name: "Backsliding Regime", emoji: "📉", color: "#f97316" },
  { min: 0, name: "Authoritarian Regime", emoji: "🏛️", color: "#e94560" },
  { min: 6, name: "Hybrid Regime", emoji: "⚖️", color: "#f4a261" },
  { min: 12, name: "Illiberal Democracy", emoji: "🗳️", color: "#eab308" },
  { min: 18, name: "Liberal Democracy", emoji: "🕊️", color: "#34d399" },
  { min: 25, name: "Consolidated Democracy", emoji: "🏆", color: "#2dd4bf" },
];

export function tierIndex(points: number): number {
  let idx = 0;
  TIERS.forEach((t, i) => {
    if (points >= t.min) idx = i;
  });
  return idx;
}

export function getTier(points: number): Tier {
  return TIERS[tierIndex(points)];
}
