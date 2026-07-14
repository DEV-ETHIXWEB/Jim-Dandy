import { motion } from "framer-motion";

type Props = {
  isInView: boolean;
  parallaxX: number;
  parallaxY: number;
  reduceMotion: boolean;
};

export default function GridBackground({ isInView, parallaxX, parallaxY, reduceMotion }: Props) {
  return (
    <motion.div
      className="pointer-events-none absolute -inset-3"
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{
        opacity: isInView ? 1 : 0,
        x: reduceMotion ? 0 : parallaxX,
        y: reduceMotion ? 0 : parallaxY,
      }}
      transition={{
        opacity: { duration: 1.1, ease: [0.16, 1, 0.3, 1] },
        x: { type: "spring", stiffness: 40, damping: 18 },
        y: { type: "spring", stiffness: 40, damping: 18 },
      }}
    >
      <svg className="h-full w-full opacity-25">
        <defs>
          <pattern id="service-area-dots" width="18" height="18" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.5" fill="white" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#service-area-dots)" />
      </svg>
    </motion.div>
  );
}
