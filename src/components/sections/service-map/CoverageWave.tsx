import { AnimatePresence, motion } from "framer-motion";

type Props = { x: number; y: number; waveKey: number; reduceMotion: boolean };

export default function CoverageWave({ x, y, waveKey, reduceMotion }: Props) {
  if (reduceMotion) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <AnimatePresence>
        <motion.div
          key={waveKey}
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
          style={{ left: `${x}%`, top: `${y}%`, borderColor: "rgba(135,203,83,0.6)" }}
          initial={{ width: 0, height: 0, opacity: 0.8 }}
          animate={{ width: 1000, height: 1000, opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2.6, ease: "easeOut" }}
        />
      </AnimatePresence>
    </div>
  );
}
