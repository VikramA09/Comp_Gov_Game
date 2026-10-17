import { useMemo } from "react";
import { motion } from "framer-motion";

const ICONS = ["🗳️", "📜", "⚖️", "🏛️", "🕊️", "📰", "🎓", "🌎"];

export function FloatingBackground() {
  const items = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        icon: ICONS[i % ICONS.length],
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 20 + Math.random() * 30,
        duration: 8 + Math.random() * 10,
        delay: Math.random() * 5,
      })),
    [],
  );

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {items.map((it, i) => (
        <motion.span
          key={i}
          className="absolute opacity-[0.08]"
          style={{ left: `${it.left}%`, top: `${it.top}%`, fontSize: it.size }}
          animate={{ y: [0, -40, 0], rotate: [0, 15, -15, 0] }}
          transition={{ repeat: Infinity, duration: it.duration, delay: it.delay, ease: "easeInOut" }}
        >
          {it.icon}
        </motion.span>
      ))}
    </div>
  );
}
