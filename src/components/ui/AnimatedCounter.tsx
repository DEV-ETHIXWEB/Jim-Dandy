import { useEffect, useRef } from "react";
import { animate, useInView, useMotionValue, useMotionValueEvent } from "framer-motion";

type Props = {
  target: number;
  duration?: number;
  className?: string;
  decimals?: number;
};

export default function AnimatedCounter({ target, duration = 1.4, className, decimals = 0 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  const count = useMotionValue(0);

  useMotionValueEvent(count, "change", (latest) => {
    if (ref.current) ref.current.textContent = latest.toFixed(decimals);
  });

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(count, target, { duration, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [isInView, target, duration, count]);

  return <span ref={ref} className={className}>0</span>;
}
