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

// Each headline sits fully visible for ~2.6s (interval minus the transition),
// then crossfades into the next as one complete sentence. The incoming line
// starts slightly after the outgoing one begins to clear, with a long
// expo-style settle, so the swap reads as one continuous motion.
const ROTATE_MS = 3600;
const ENTER_EASE = [0.16, 1, 0.3, 1] as const;
const EXIT_EASE = [0.4, 0, 1, 1] as const;

function Highlight({ text }: { text: string }) {
  return (
    <>
      {text.split(/(Jim Dandy|Dandy)/).map((part, i) =>
        part === "Jim Dandy" || part === "Dandy" ? (
          <span key={i} className="text-brand-green-500">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

export default function RotatingHeadline({ className }: { className?: string }) {
  const [minHeight, setMinHeight] = useState<number>();
  const [reducedMotion, setReducedMotion] = useState(false);
  const [index, setIndex] = useState(0);
  const measureRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
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

  useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % lines.length), ROTATE_MS);
    return () => clearInterval(id);
  }, [reducedMotion]);

  const line = lines[index];

  return (
    <h1 className={className}>
      {/* minHeight reserves the tallest of the five headlines, so shorter and
          longer lines swap with zero layout shift. */}
      <span className="relative block" style={minHeight ? { minHeight } : undefined}>
        {reducedMotion ? (
          <span className="block">
            <Highlight text={lines[0].question} />
            <br />
            <Highlight text={lines[0].answer} />
          </span>
        ) : (
          // popLayout keeps the incoming headline in normal flow (natural
          // height, no CLS before minHeight resolves) while the outgoing one
          // is popped out to crossfade over it.
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={index}
              className="block will-change-transform"
              initial={{ opacity: 0, y: 16, filter: "blur(5px)" }}
              animate={{
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: { duration: 0.9, ease: ENTER_EASE, delay: 0.15 },
              }}
              exit={{
                opacity: 0,
                y: -12,
                filter: "blur(5px)",
                transition: { duration: 0.5, ease: EXIT_EASE },
              }}
            >
              <Highlight text={line.question} />
              <br />
              <Highlight text={line.answer} />
            </motion.span>
          </AnimatePresence>
        )}

        <span ref={measureRef} className="invisible absolute inset-x-0 top-0" aria-hidden="true">
          {lines.map((l, i) => (
            <span key={i} className="block">
              {l.question}
              <br />
              {l.answer}
            </span>
          ))}
        </span>
      </span>
    </h1>
  );
}
