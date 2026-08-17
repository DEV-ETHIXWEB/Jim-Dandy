import { motion } from "framer-motion";

type Props = { x: number; y: number; reduceMotion: boolean };

const RING_COUNT = 3;
const DURATION_S = 3.4;

// Continuous radar rings emanating from the hub pin. Fixed-size elements
// animated with scale + opacity only, so every frame is compositor work -
// no layout or paint (unlike animating width/height).
export default function RadarPulse({ x, y, reduceMotion }: Props) {
  if (reduceMotion) return null;

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {Array.from({ length: RING_COUNT }, (_, i) => (
        <motion.span
          key={i}
          className="absolute h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border will-change-transform"
          style={{ left: `${x}%`, top: `${y}%`, borderColor: "rgba(135,203,83,0.5)" }}
          initial={{ scale: 0.18, opacity: 0 }}
          animate={{ scale: [0.18, 1], opacity: [0, 0.5, 0] }}
          transition={{
            scale: {
              duration: DURATION_S,
              delay: (i * DURATION_S) / RING_COUNT,
              repeat: Infinity,
              ease: "easeOut",
            },
            opacity: {
              duration: DURATION_S,
              delay: (i * DURATION_S) / RING_COUNT,
              repeat: Infinity,
              times: [0, 0.25, 1],
              ease: "easeOut",
            },
          }}
        />
      ))}
    </div>
  );
}
