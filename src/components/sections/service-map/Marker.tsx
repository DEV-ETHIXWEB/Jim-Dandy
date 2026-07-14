import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

type Props = {
  label: string;
  x: number;
  y: number;
  index: number;
  isInView: boolean;
  isActive: boolean;
  isHovered: boolean;
  waveKey: number;
  waveDelay: number;
  reduceMotion: boolean;
  onHoverChange: (hovering: boolean) => void;
  onSelect: () => void;
};

export default function Marker({
  label,
  x,
  y,
  index,
  isInView,
  isActive,
  isHovered,
  waveKey,
  waveDelay,
  reduceMotion,
  onHoverChange,
  onSelect,
}: Props) {
  const [waveGlow, setWaveGlow] = useState(false);
  const waveTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);
  const glowTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);
  const isFirstWave = useRef(true);

  useEffect(() => {
    if (isFirstWave.current) {
      isFirstWave.current = false;
      return;
    }
    if (reduceMotion) return;
    clearTimeout(waveTimeout.current);
    clearTimeout(glowTimeout.current);
    waveTimeout.current = setTimeout(() => {
      setWaveGlow(true);
      glowTimeout.current = setTimeout(() => setWaveGlow(false), 700);
    }, waveDelay * 1000);
    return () => {
      clearTimeout(waveTimeout.current);
      clearTimeout(glowTimeout.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [waveKey]);

  const emphasized = isActive || isHovered || waveGlow;

  return (
    <motion.button
      type="button"
      className="absolute z-20 flex -translate-x-1/2 -translate-y-full flex-col items-center gap-1.5 rounded-lg px-2 py-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green-400"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ opacity: 0, scale: 0.4, y: 10 }}
      animate={
        isInView
          ? { opacity: 1, scale: 1, y: 0 }
          : { opacity: 0, scale: 0.4, y: 10 }
      }
      transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.15 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
      onFocus={() => onHoverChange(true)}
      onBlur={() => onHoverChange(false)}
      onClick={onSelect}
      aria-label={`View services in ${label}`}
      aria-expanded={isActive}
    >
      {isHovered && !isActive && (
        <motion.span
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="pointer-events-none absolute -top-9 whitespace-nowrap rounded-full bg-navy-900/90 px-3 py-1 text-[11px] font-semibold text-white shadow-lg"
        >
          Click to view services
        </motion.span>
      )}

      <span
        className={`whitespace-nowrap text-xs font-semibold transition-colors duration-200 ${
          emphasized ? "text-white" : "text-navy-200"
        }`}
      >
        {label}
      </span>

      <span className="relative grid h-2.5 w-2.5 place-items-center">
        {isActive && !reduceMotion && (
          <>
            <motion.span
              className="absolute rounded-full border border-brand-green-400"
              initial={{ width: 10, height: 10, opacity: 0.7 }}
              animate={{ width: 34, height: 34, opacity: 0 }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            />
            <motion.span
              className="absolute rounded-full border border-brand-green-400"
              initial={{ width: 10, height: 10, opacity: 0.7 }}
              animate={{ width: 34, height: 34, opacity: 0 }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 1 }}
            />
          </>
        )}
        <motion.span
          className="h-2.5 w-2.5 rounded-full bg-brand-green-500"
          animate={{
            scale: emphasized ? 1.2 : 1,
            boxShadow: emphasized
              ? "0 0 0 4px rgba(105,190,40,0.22), 0 0 16px 4px rgba(105,190,40,0.65)"
              : "0 0 0 0px rgba(105,190,40,0)",
          }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        />
      </span>
    </motion.button>
  );
}
