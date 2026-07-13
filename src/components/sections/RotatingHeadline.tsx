import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Line = { question: string; answer: string };

const lines: Line[] = [
  { question: "Plumbing problems?", answer: "Jim Dandy to the rescue!" },
  { question: "Burst pipe emergency?", answer: "We're there in a flash!" },
  { question: "Clogged drains again?", answer: "Jim Dandy clears the way!" },
  { question: "No hot water today?", answer: "Dandy turns up the heat!" },
  { question: "Sewer backup nightmare?", answer: "Dandy digs you out!" },
];

const INTERVAL_MS = 2000;

export default function RotatingHeadline({ className }: { className?: string }) {
  const [index, setIndex] = useState(0);
  const [minHeight, setMinHeight] = useState<number>();
  const measureRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % lines.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  useLayoutEffect(() => {
    const measure = () => {
      const container = measureRef.current;
      if (!container) return;
      const heights = Array.from(container.children).map((el) => (el as HTMLElement).offsetHeight);
      setMinHeight(Math.max(...heights));
    };
    measure();
    window.addEventListener("resize", measure);
    document.fonts?.ready?.then(measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const current = lines[index];

  return (
    <h1 className={className}>
      <span className="relative block" style={minHeight ? { minHeight } : undefined}>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="block"
          >
            {current.question}
            <br />
            {current.answer}
          </motion.span>
        </AnimatePresence>

        <span ref={measureRef} className="invisible absolute inset-x-0 top-0" aria-hidden="true">
          {lines.map((line, i) => (
            <span key={i} className="block">
              {line.question}
              <br />
              {line.answer}
            </span>
          ))}
        </span>
      </span>
    </h1>
  );
}
