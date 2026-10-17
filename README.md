# Democratization Board Game (AP Comparative Government)

Single-device board game for **2–4 players**: spin, move, draw chance & skill cards, and race from **Authoritarian Regime (0)** to **Democratic Consolidation (25+)** without hitting **−15** (Failed State).

## Run locally

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`). For class demo, use full-screen on a laptop or tablet and pass the device each turn.

## Replace events, MCQs, index, or works cited

Edit **`content/gameContent.ts`** only:

- `CHANCE_CARDS` — event text, points, and matching `indexNote`
- `SKILL_CARDS` — AP MCQs (choices + `correctIndex` 0–3)
- `WORKS_CITED` — one string per line, shown exactly as written (lines starting with `http` become links)
- `GAME_RULES` — numeric rules (movement range, win/lose thresholds)

Board layout (25 chance / 3 skill squares) is generated from `GAME_RULES` in **`content/boardLayout.ts`**.

## Build for static hosting

```bash
npm run build
npm run preview
```

Output is in `dist/` — can be uploaded to any static host or opened after build.
