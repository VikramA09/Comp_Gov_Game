import { motion } from "framer-motion";

type Props = {
  label: string;
  icon: string;
  remaining: number;
  total: number;
  color: string;
};

export function DeckStack({ label, icon, remaining, total, color }: Props) {
  const layers = Math.min(4, remaining);
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative h-20 w-14">
        {remaining === 0 && (
          <div className="absolute inset-0 rounded-lg border-2 border-dashed border-white/20" />
        )}
        {Array.from({ length: layers }, (_, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 flex items-center justify-center rounded-lg border-2 border-white/70 text-2xl shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${color}, #111827)`,
              transform: `translate(${i * 2}px, ${-i * 3}px) rotate(${(i - 1.5) * 2}deg)`,
              zIndex: i,
            }}
          >
            {i === layers - 1 ? icon : ""}
          </motion.div>
        ))}
      </div>
      <motion.span
        key={remaining}
        initial={{ scale: 1.5, color: "#f4a261" }}
        animate={{ scale: 1, color: "#ffffff" }}
        className="font-display text-sm font-bold"
      >
        {remaining}/{total}
      </motion.span>
      <span className="text-[10px] uppercase tracking-wider text-white/50">{label}</span>
    </div>
  );
}
