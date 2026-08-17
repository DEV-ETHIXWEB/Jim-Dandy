import { AnimatePresence, motion } from "framer-motion";

type Props = { x: number; y: number; visible: boolean };

export default function RegionHighlight({ x, y, visible }: Props) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${x}%`, top: `${y}%`, width: 320, height: 320 }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden="true"
        >
          <div
            className="h-full w-full rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(105,190,40,0.32) 0%, rgba(105,190,40,0.12) 45%, rgba(105,190,40,0) 72%)",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
