/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Fredoka"', "system-ui", "sans-serif"],
        body: ['"Nunito"', "system-ui", "sans-serif"],
      },
      colors: {
        regime: {
          dark: "#1a1a2e",
          mid: "#16213e",
          accent: "#e94560",
          gold: "#f4a261",
          democracy: "#2a9d8f",
          chance: "#457b9d",
          skill: "#9b5de5",
        },
      },
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 12px rgba(244, 162, 97, 0.4)" },
          "50%": { boxShadow: "0 0 24px rgba(244, 162, 97, 0.8)" },
        },
      },
    },
  },
  plugins: [],
};
