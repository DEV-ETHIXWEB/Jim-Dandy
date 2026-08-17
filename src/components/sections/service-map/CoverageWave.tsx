import { AnimatePresence, motion } from "framer-motion";

type Props = { x: number; y: number; waveKey: number; reduceMotion: boolean };

// One large sweep ring every WAVE_INTERVAL_MS (driven by waveKey from Map).
// The element is a fixed 1000px circle animated with scale + opacity only -
// animating width/height here forced layout on every frame.
export default function CoverageWave({ x, y, waveKey, reduceMotion }: Props) {
  if (reduceMotion) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <AnimatePresence>
        <motion.div
          key={waveKey}
          className="absolute h-[1000px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 will-change-transform"
          style={{ left: `${x}%`, top: `${y}%`, borderColor: "rgba(135,203,83,0.6)" }}
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2.6, ease: "easeOut" }}
        />
      </AnimatePresence>
    </div>
  );
}
