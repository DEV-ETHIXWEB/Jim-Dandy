import { motion, type MotionValue } from "framer-motion";

type Props = {
  isInView: boolean;
  parallaxX: MotionValue<number>;
  parallaxY: MotionValue<number>;
};

// Parallax arrives as spring-smoothed motion values wired straight into the
// transform, so mouse movement never triggers a React re-render.
export default function GridBackground({ isInView, parallaxX, parallaxY }: Props) {
  return (
    <motion.div
      className="pointer-events-none absolute -inset-3"
      aria-hidden="true"
      style={{ x: parallaxX, y: parallaxY }}
      initial={{ opacity: 0 }}
      animate={{ opacity: isInView ? 1 : 0 }}
      transition={{ opacity: { duration: 1.1, ease: [0.16, 1, 0.3, 1] } }}
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
