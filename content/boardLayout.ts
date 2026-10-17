import { GAME_RULES } from "./gameContent";

export type SquareType = "start" | "chance" | "skill" | "end";

export type BoardSquare = {
  index: number;
  type: SquareType;
  label: string;
};

/** Start, 25 chance, 3 skill (evenly spaced), End */
export function buildBoardLayout(): BoardSquare[] {
  const { totalBoardSpaces, skillSquareCount } = GAME_RULES;
  const innerCount = totalBoardSpaces - 2;
  const skillInner = new Set<number>();
  for (let s = 1; s <= skillSquareCount; s++) {
    const pos = Math.round((innerCount * s) / (skillSquareCount + 1));
    skillInner.add(pos);
  }

  const squares: BoardSquare[] = [];
  for (let i = 0; i < totalBoardSpaces; i++) {
    if (i === 0) {
      squares.push({ index: i, type: "start", label: "Authoritarian Regime" });
      continue;
    }
    if (i === totalBoardSpaces - 1) {
      squares.push({ index: i, type: "end", label: "Democratic Consolidation" });
      continue;
    }
    if (skillInner.has(i)) {
      squares.push({ index: i, type: "skill", label: "Skill Square" });
    } else {
      squares.push({ index: i, type: "chance", label: "Chance Square" });
    }
  }

  return squares;
}
