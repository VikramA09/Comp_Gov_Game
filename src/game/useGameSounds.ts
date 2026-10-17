import { useEffect, useRef } from "react";
import { skillById } from "./reducer";
import { sfx } from "./sound";
import type { GameState } from "./types";

export function useGameSounds(s: GameState) {
  const prev = useRef<GameState | null>(null);

  useEffect(() => {
    const p = prev.current;
    prev.current = s;
    if (!p) return;

    if (s.phase !== p.phase) {
      switch (s.phase) {
        case "rolling":
          sfx.spin();
          break;
        case "chance":
        case "skill":
          sfx.flip();
          break;
        case "skillResult": {
          const card = skillById(s.activeSkillId);
          if (card) {
            if (s.skillChoice === card.correctIndex) sfx.correct();
            else sfx.wrong();
          }
          break;
        }
        case "eliminated":
          sfx.collapse();
          break;
        case "ended":
          window.setTimeout(sfx.win, 300);
          break;
        case "turnIntro":
          sfx.turn();
          break;
        case "idle":
          if (p.phase !== "turnIntro") sfx.turn();
          break;
      }
    }

    const cp = s.players[s.current];
    const pp = p.players[p.current];
    if (cp && pp && cp.id === pp.id && cp.position !== pp.position) {
      sfx.step(cp.position);
    }

    if (s.fx && s.fx.id !== p.fx?.id) {
      if (s.fx.delta > 0) sfx.good();
      else sfx.bad();
      if (s.fx.tierUp) window.setTimeout(sfx.levelUp, 450);
    }
  }, [s]);
}
