import { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";

export function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);
  const shown = useRef(value);

  useEffect(() => {
    const controls = animate(shown.current, value, {
      duration: 0.9,
      ease: "easeOut",
      onUpdate: (v: number) => {
        shown.current = v;
        setDisplay(Math.round(v));
      },
    });
    return () => controls.stop();
  }, [value]);

  return <span className="tabular-nums">{display}</span>;
}
