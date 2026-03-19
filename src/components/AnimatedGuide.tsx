import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface AnimatedGuideProps {
  message: string;
}

type WalkMode = "idle" | "walk" | "run";

/** Past this fraction from top or bottom, the figure “runs” vertically; at edges it stands upright */
const SCROLL_EDGE = 0.11;

function useScrollWalkAndProgress() {
  const phaseRef = useRef(0);
  const velocityRef = useRef(0);
  const lastYRef = useRef(0);
  const lastTRef = useRef(0);
  const rafRef = useRef(0);
  const frameCountRef = useRef(0);
  const startRef = useRef(0);
  const facingRef = useRef(1);
  const [, setRender] = useState(0);
  const progressRef = useRef(0);

  useEffect(() => {
    startRef.current = performance.now();
    lastYRef.current = window.scrollY;
    lastTRef.current = performance.now();

    const updateProgress = () => {
      const el = document.documentElement;
      const max = Math.max(1, el.scrollHeight - window.innerHeight);
      progressRef.current = Math.min(1, Math.max(0, window.scrollY / max));
    };
    updateProgress();

    const loop = () => {
      velocityRef.current *= 0.94;
      if (velocityRef.current < 0.008) velocityRef.current = 0;

      if (velocityRef.current === 0) {
        const t = (performance.now() - startRef.current) / 1200;
        phaseRef.current = t % 1;
      } else {
        phaseRef.current += velocityRef.current * 0.02;
        phaseRef.current %= 1;
      }

      updateProgress();

      frameCountRef.current += 1;
      if (frameCountRef.current % 2 === 0) {
        setRender((n) => n + 1);
      }

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    const onScroll = () => {
      const y = window.scrollY;
      const t = performance.now();
      const dt = Math.max(16, t - lastTRef.current);
      const dy = y - lastYRef.current;
      lastYRef.current = y;
      lastTRef.current = t;

      if (dy !== 0) {
        facingRef.current = dy >= 0 ? 1 : -1;
      }

      const speed = Math.abs(dy) / dt;
      const boost = Math.min(2.6, 0.12 + speed * 3.8);
      velocityRef.current = Math.min(3.2, velocityRef.current + boost);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateProgress, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateProgress);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const v = velocityRef.current;
  let mode: WalkMode = "idle";
  if (v > 1.15) mode = "run";
  else if (v > 0.06) mode = "walk";

  return {
    phase: phaseRef.current,
    mode,
    scrollProgress: progressRef.current,
    facing: facingRef.current
  };
}

/** Stick figure; rotated 90° mid-page so walking reads as vertical; upright at scroll extremes */
function StickFigure({
  phase,
  mode,
  facing,
  standStraight
}: {
  phase: number;
  mode: WalkMode;
  facing: number;
  standStraight: boolean;
}) {
  const isRun = mode === "run" && !standStraight;
  const isIdle = mode === "idle" || standStraight;

  const rad = phase * Math.PI * 2;
  const amp = isRun ? 48 : isIdle ? 5 : 28;
  const legL = Math.sin(rad) * amp;
  const legR = -Math.sin(rad) * amp;
  const armL = -Math.sin(rad) * (isRun ? 42 : isIdle ? 6 : 26);
  const armR = Math.sin(rad) * (isRun ? 42 : isIdle ? 6 : 26);
  const bounce = standStraight
    ? Math.sin(rad * 2) * 1
    : isRun
      ? Math.abs(Math.sin(rad * 2)) * 4
      : isIdle
        ? Math.sin(rad * 2) * 1.5
        : Math.abs(Math.sin(rad)) * 2;

  const cx = 50;
  const headY = 22 + bounce;
  const shoulderY = 38 + bounce;
  const hipY = 68 + bounce;

  const rotationDeg = standStraight ? 0 : facing >= 0 ? 90 : -90;

  return (
    <svg
      width="80"
      height="96"
      viewBox="0 0 100 120"
      className="shrink-0 text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.4)]"
      style={{ transform: `rotate(${rotationDeg}deg)` }}
      aria-hidden
    >
      <circle
        cx={cx}
        cy={headY}
        r="10"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        className="text-emerald-300"
      />
      <line
        x1={cx}
        y1={headY + 10}
        x2={cx}
        y2={hipY}
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <g transform={`translate(${cx}, ${shoulderY}) rotate(${armL})`}>
        <line
          x1={0}
          y1={0}
          x2={-22}
          y2={18}
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>
      <g transform={`translate(${cx}, ${shoulderY}) rotate(${armR})`}>
        <line
          x1={0}
          y1={0}
          x2={22}
          y2={18}
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>
      <g transform={`translate(${cx}, ${hipY}) rotate(${legL})`}>
        <line
          x1={0}
          y1={0}
          x2={0}
          y2={32}
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>
      <g transform={`translate(${cx}, ${hipY}) rotate(${legR})`}>
        <line
          x1={0}
          y1={0}
          x2={0}
          y2={32}
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

function modeLabel(mode: WalkMode, standStraight: boolean) {
  if (standStraight) return "Standing";
  if (mode === "run") return "Running";
  if (mode === "walk") return "Walking";
  return "Scroll";
}

/** Text sits inside a soft “cloud” cluster (puffs + main body) */
function CloudTextBox({ children }: { children: React.ReactNode }) {
  const puff =
    "pointer-events-none absolute rounded-full border border-emerald-500/25 bg-slate-950/90 shadow-sm";

  return (
    <div className="relative max-w-[200px] shrink md:max-w-[240px]">
      <div className={`${puff} -left-3 top-1/2 h-9 w-9 -translate-y-1/2`} />
      <div className={`${puff} -right-1 -top-2 h-6 w-6`} />
      <div className={`${puff} right-2 -top-4 h-5 w-5 opacity-90`} />
      <div className={`${puff} -bottom-2 left-4 h-7 w-7`} />
      <div className={`${puff} -bottom-1 right-6 h-5 w-5 opacity-95`} />
      <div className="relative z-10 rounded-[1.65rem] border border-emerald-500/35 bg-slate-950/92 px-3.5 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md">
        {children}
      </div>
    </div>
  );
}

export function AnimatedGuide({ message }: AnimatedGuideProps) {
  const { phase, mode, scrollProgress, facing } = useScrollWalkAndProgress();

  const standStraight =
    scrollProgress <= SCROLL_EDGE || scrollProgress >= 1 - SCROLL_EDGE;

  // Move along the right edge: top → bottom as user scrolls down
  const topPercent = 22 + scrollProgress * 68;

  return (
    <div
      className="pointer-events-none fixed inset-y-0 right-0 z-40 w-[min(100vw,300px)]"
      aria-live="polite"
    >
      {/* faint vertical “track” */}
      <div
        className="pointer-events-none absolute bottom-8 right-3 top-24 w-px bg-gradient-to-b from-transparent via-emerald-500/25 to-transparent md:right-4"
        aria-hidden
      />

      <div
        className="pointer-events-none absolute right-2 flex -translate-y-1/2 flex-row-reverse items-center gap-2 md:right-3"
        style={{ top: `${topPercent}%` }}
      >
        <div className="flex flex-col items-center">
          <motion.div
            animate={
              standStraight
                ? { x: 0 }
                : mode === "run"
                  ? { x: [0, 3, 0] }
                  : mode === "walk"
                    ? { x: [0, 1.5, 0] }
                    : { x: 0 }
            }
            transition={{
              duration: mode === "run" ? 0.22 : 0.32,
              repeat:
                !standStraight && (mode === "run" || mode === "walk")
                  ? Infinity
                  : 0,
              ease: "easeInOut"
            }}
            className="flex flex-col items-center"
          >
            <div className="pointer-events-auto flex flex-col items-center">
              <StickFigure
                phase={phase}
                mode={mode}
                facing={facing}
                standStraight={standStraight}
              />
              <span className="mt-0.5 max-w-[4.5rem] text-center text-[7px] font-semibold uppercase leading-tight tracking-wider text-emerald-500/90 md:text-[8px]">
                {modeLabel(mode, standStraight)}
              </span>
            </div>
          </motion.div>
        </div>

        <CloudTextBox>
          <AnimatePresence mode="wait">
            <motion.p
              key={message}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="text-left text-[11px] leading-snug text-slate-100 md:text-xs"
            >
              {message}
            </motion.p>
          </AnimatePresence>
        </CloudTextBox>
      </div>
    </div>
  );
}
