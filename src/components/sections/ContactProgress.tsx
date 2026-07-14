import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

type Step = { title: string };

export default function ContactProgress({ steps, current }: { steps: Step[]; current: number }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="mb-4 font-sans font-semibold text-navy-800">Progress</span>
      <div className="flex flex-col items-center">
        {steps.map((item, index) => {
          const stepNum = index + 1;
          const isDone = stepNum < current;
          const isActive = stepNum === current;

          return (
            <div key={item.title} className="relative flex flex-col items-center gap-2.5 pb-10 last:pb-0">
              {index !== steps.length - 1 && (
                <span
                  className="absolute left-1/2 top-11 bottom-0 w-[3px] -translate-x-1/2 overflow-hidden rounded-full bg-navy-100"
                  aria-hidden="true"
                >
                  <motion.span
                    className="block h-full w-full origin-top rounded-full bg-[linear-gradient(180deg,#9bd36f_0%,#69be28_100%)]"
                    initial={false}
                    animate={{ scaleY: isDone ? 1 : 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  />
                </span>
              )}

              <motion.span
                className={`z-10 grid h-11 w-11 shrink-0 place-items-center rounded-full font-display text-lg font-bold ${
                  isDone
                    ? "bg-[linear-gradient(135deg,#9bd36f_0%,#69be28_55%,#4b871c_100%)] text-navy-900"
                    : isActive
                      ? "bg-navy-800 text-white"
                      : "bg-navy-100 text-navy-400"
                }`}
                initial={false}
                animate={{
                  scale: isActive ? 1.1 : 1,
                  boxShadow: isActive
                    ? "0 0 0 6px rgba(0,34,68,0.1), 0 0 24px 2px rgba(0,34,68,0.35)"
                    : isDone
                      ? "0 0 0 5px rgba(105,190,40,0.18), 0 0 20px 2px rgba(105,190,40,0.45)"
                      : "0 0 0 0px rgba(0,0,0,0)",
                }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                {isDone ? <CheckCircle2 className="h-5 w-5" aria-hidden="true" /> : stepNum}
              </motion.span>

              <p
                className={`relative z-10 bg-white px-1.5 font-sans font-semibold transition-colors duration-300 ${
                  isActive || isDone ? "text-navy-800" : "text-navy-400"
                }`}
              >
                {item.title}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
