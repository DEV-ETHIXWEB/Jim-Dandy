import { motion } from "framer-motion";

type Props = { isInView: boolean; reduceMotion: boolean };

const GREEN = "rgba(135,203,83,0.9)";
const GREEN_GLOW = "0 0 10px 3px rgba(135,203,83,0.4)";
const WHITE = "rgba(255,255,255,0.85)";
const WHITE_GLOW = "0 0 8px 2px rgba(255,255,255,0.3)";

// Positions steer clear of the hub text block and the five city markers so the
// dots read as distant lights, not stray UI.
const DOTS = [
  { left: "8%", top: "22%", size: 4, color: GREEN, glow: GREEN_GLOW, duration: 6.5, delay: 0, drift: 7 },
  { left: "16%", top: "60%", size: 3, color: WHITE, glow: WHITE_GLOW, duration: 7.5, delay: 1.2, drift: 5 },
  { left: "30%", top: "12%", size: 3, color: WHITE, glow: WHITE_GLOW, duration: 5.5, delay: 2.1, drift: 6 },
  { left: "38%", top: "82%", size: 4, color: GREEN, glow: GREEN_GLOW, duration: 8, delay: 0.7, drift: 8 },
  { left: "60%", top: "90%", size: 3, color: WHITE, glow: WHITE_GLOW, duration: 6, delay: 1.8, drift: 5 },
  { left: "74%", top: "8%", size: 3, color: GREEN, glow: GREEN_GLOW, duration: 7, delay: 0.4, drift: 6 },
  { left: "88%", top: "20%", size: 4, color: WHITE, glow: WHITE_GLOW, duration: 8.5, delay: 2.6, drift: 8 },
  { left: "92%", top: "62%", size: 3, color: GREEN, glow: GREEN_GLOW, duration: 6.8, delay: 1.5, drift: 6 },
];

// Slow "breathing" lights scattered over the map so it never feels static.
// The glow is baked into a static box-shadow; only opacity and translateY
// animate, keeping the whole field on the compositor.
export default function AmbientDots({ isInView, reduceMotion }: Props) {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {DOTS.map((dot, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full will-change-transform"
          style={{
            left: dot.left,
            top: dot.top,
            width: dot.size,
            height: dot.size,
            background: dot.color,
            boxShadow: dot.glow,
          }}
          initial={{ opacity: 0 }}
          animate={
            !isInView
              ? { opacity: 0 }
              : reduceMotion
                ? { opacity: 0.35 }
                : { opacity: [0.12, 0.55, 0.12], y: [0, -dot.drift, 0] }
          }
          transition={
            reduceMotion
              ? { duration: 0.8 }
              : { duration: dot.duration, delay: dot.delay, repeat: Infinity, ease: "easeInOut" }
          }
        />
      ))}
    </div>
  );
}
