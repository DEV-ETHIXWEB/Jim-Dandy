import { useMemo } from "react";
import { motion } from "framer-motion";
import type { CityPin } from "./types";

type Props = {
  from: CityPin;
  to: CityPin;
  isInView: boolean;
  delay: number;
};

function quadraticPoint(t: number, p0: CityPin, p1: { x: number; y: number }, p2: CityPin) {
  const mt = 1 - t;
  return {
    x: mt * mt * p0.x + 2 * mt * t * p1.x + t * t * p2.x,
    y: mt * mt * p0.y + 2 * mt * t * p1.y + t * t * p2.y,
  };
}

const SAMPLES = 30;

// Renders as a real HTML element (not SVG) so the dot stays perfectly round even
// though the map's SVG layer is stretched non-uniformly via preserveAspectRatio="none".
// The path is walked by translating a full-size wrapper (transform percentages of a
// 100%-sized element equal container percentages), so the animation never touches
// left/top and stays entirely on the compositor.
export default function TravelingDot({ from, to, isInView, delay }: Props) {
  const { xs, ys } = useMemo(() => {
    const control = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 - 9 };
    const xs: string[] = [];
    const ys: string[] = [];
    for (let i = 0; i <= SAMPLES; i++) {
      const t = i / SAMPLES;
      const p = quadraticPoint(t, from, control, to);
      xs.push(`${p.x}%`);
      ys.push(`${p.y}%`);
    }
    return { xs, ys };
  }, [from, to]);

  if (!isInView) return null;

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 will-change-transform"
      initial={{ x: xs[0], y: ys[0], opacity: 0 }}
      animate={{ x: xs, y: ys, opacity: [0, 1, 1, 0] }}
      transition={{
        x: { duration: 3.2, delay: delay + 1.3, repeat: Infinity, ease: "linear" },
        y: { duration: 3.2, delay: delay + 1.3, repeat: Infinity, ease: "linear" },
        opacity: {
          duration: 3.2,
          delay: delay + 1.3,
          repeat: Infinity,
          times: [0, 0.08, 0.92, 1],
          ease: "linear",
        },
      }}
      aria-hidden="true"
    >
      <span
        className="absolute left-0 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: "#d7f2b8", boxShadow: "0 0 6px 2px rgba(199,235,158,0.85)" }}
      />
    </motion.div>
  );
}
