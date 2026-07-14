import { motion } from "framer-motion";
import type { CityPin } from "./types";

type Props = {
  from: CityPin;
  to: CityPin;
  isInView: boolean;
  delay: number;
  emphasized: boolean;
};

export function connectionPath(from: CityPin, to: CityPin) {
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2 - 9;
  return `M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`;
}

export default function AnimatedConnection({ from, to, isInView, delay, emphasized }: Props) {
  const d = connectionPath(from, to);

  return (
    <motion.path
      d={d}
      fill="none"
      stroke={emphasized ? "rgba(135,203,83,0.95)" : "rgba(105,190,40,0.4)"}
      strokeWidth={emphasized ? 1.6 : 1}
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
      transition={{
        pathLength: { duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] },
        opacity: { duration: 0.4, delay },
      }}
    />
  );
}
