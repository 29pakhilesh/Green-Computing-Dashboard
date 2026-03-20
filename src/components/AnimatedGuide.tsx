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
  const startRef = useRef(0);
  const facingRef = useRef(1);
  const [, setRender] = useState(0);
  const progressRef = useRef(0);
  const displayProgressRef = useRef(0);

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
    displayProgressRef.current = progressRef.current;

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
      // Low-pass filter to add intentional latency.
      // This makes the climber feel like it's reacting with momentum.
      displayProgressRef.current =
        displayProgressRef.current +
        (progressRef.current - displayProgressRef.current) * 0.12;

      // Update UI every frame for smoother movement of man + rope + dialog.
      setRender((n) => n + 1);

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
    scrollProgress: displayProgressRef.current,
    facing: facingRef.current,
    velocity: v
  };
}

/** Stick figure; rotated 90° mid-page so walking reads as vertical; upright at scroll extremes */
function StickFigure({
  phase,
  mode,
  facing,
  standStraight,
  gesturePulse
}: {
  phase: number;
  mode: WalkMode;
  facing: number;
  standStraight: boolean;
  gesturePulse: number;
}) {
  const isRun = mode === "run" && !standStraight;
  const isIdle = mode === "idle" || standStraight;

  const rad = phase * Math.PI * 2;
  const legAngle = isRun ? 34 : isIdle ? 10 : 26;
  const armAngle = isRun ? 42 : isIdle ? 6 : 26;

  const legL = Math.sin(rad) * legAngle;
  const legR = -Math.sin(rad) * legAngle;

  const baseArmL = -Math.sin(rad) * armAngle;
  const baseArmR = Math.sin(rad) * armAngle;

  // When the section message changes, do a quick “wave” to feel more alive.
  const wave = gesturePulse * (0.75 + 0.25 * Math.sin(rad * 6));
  const armL = baseArmL + wave * (isIdle ? 6 : 14);
  const armR = baseArmR - wave * (isIdle ? 6 : 14);

  const bounce = standStraight
    ? Math.sin(rad * 2) * 1.2
    : isRun
      ? Math.abs(Math.sin(rad * 2)) * 4.2
      : isIdle
        ? Math.sin(rad * 2) * 1.6
        : Math.abs(Math.sin(rad)) * 2.2;

  const sway = Math.sin(rad) * (isRun ? 3.5 : isIdle ? 1 : 2.8);
  const step = (Math.sin(rad) + 1) / 2; // 0..1
  const footLift = (isRun ? 6 : isIdle ? 2 : 4) * (1 - step);

  const cx = 50;
  const headY = 22 + bounce;
  const shoulderY = 38 + bounce + sway;
  const hipY = 68 + bounce + sway * 0.4;

  const rotationDeg = standStraight ? 0 : facing >= 0 ? 90 : -90;

  const eyeY = headY + 1;
  const blink = Math.abs(Math.sin(rad * 4 + 0.25)) > 0.95 ? 0.12 : 1;

  return (
    <svg
      width="80"
      height="96"
      viewBox="0 0 100 120"
      className="shrink-0 text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.4)]"
      style={{ transform: `rotate(${rotationDeg}deg)` }}
      aria-hidden
    >
      <defs>
        <radialGradient id="headGlow" cx="50%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#34d399" stopOpacity="0.55" />
          <stop offset="65%" stopColor="#0ea5e9" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ground shadow that tightens when the “foot” is closer */}
      <ellipse
        cx={cx}
        cy={105 + bounce * 0.3}
        rx={16 - footLift * 0.6}
        ry={5 - footLift * 0.25}
        fill="rgba(0,0,0,0.45)"
      />

      <circle
        cx={cx}
        cy={headY}
        r="10"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        className="text-emerald-300"
      />

      <circle cx={cx} cy={headY} r="12" fill="url(#headGlow)" opacity={0.9} />

      {/* Simple eyes for a “more realistic” feel */}
      <g
        transform={`translate(${cx}, ${eyeY}) scaleY(${blink}) translate(${-cx}, ${-eyeY})`}
      >
        <circle cx={cx - 3} cy={eyeY + 1} r="1.1" fill="#d1fae5" opacity="0.95" />
        <circle cx={cx + 3} cy={eyeY + 1} r="1.1" fill="#d1fae5" opacity="0.95" />
      </g>

      <line
        x1={cx}
        y1={headY + 10}
        x2={cx}
        y2={hipY}
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Torso (rounded) */}
      <rect
        x={cx - 10}
        y={shoulderY - 6}
        width={20}
        height={28}
        rx={10}
        fill="rgba(16, 185, 129, 0.12)"
        stroke="currentColor"
        strokeWidth="2"
      />

      {/* Arms */}
      <g transform={`translate(${cx}, ${shoulderY}) rotate(${armL})`}>
        <path
          d="M0,0 C-10,5 -17,11 -18,22"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M-18,22 C-19,26 -17,28 -14,29"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>

      <g transform={`translate(${cx}, ${shoulderY}) rotate(${armR})`}>
        <path
          d="M0,0 C10,5 17,11 18,22"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M18,22 C19,26 17,28 14,29"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>

      {/* Legs + feet (rounded contact) */}
      <g transform={`translate(${cx}, ${hipY}) rotate(${legL})`}>
        <path
          d={`M0,0 C-2,10 -2,18 0,24 C2,30 4,34 4,38`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <rect
          x={-4}
          y={38 - footLift}
          width={8}
          height={4}
          rx={2}
          fill="currentColor"
          opacity="0.95"
        />
      </g>

      <g transform={`translate(${cx}, ${hipY}) rotate(${legR})`}>
        <path
          d={`M0,0 C2,10 2,18 0,24 C-2,30 -4,34 -4,38`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <rect
          x={-4}
          y={38 - footLift * 0.6}
          width={8}
          height={4}
          rx={2}
          fill="currentColor"
          opacity="0.95"
        />
      </g>
    </svg>
  );
}

/** Rope climber: holds an (SVG) rope and alternates hands/feet like climbing */
function RopeClimber({
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
  const rad = phase * Math.PI * 2;
  const climbSpeed = mode === "run" ? 1 : mode === "walk" ? 0.85 : 0.65;

  // When scrolling down vs up, swap who leads slightly for realism.
  const dir = facing >= 0 ? 1 : -1;

  const cx = 50;
  const bounce = Math.sin(rad * 2) * 1.6 * climbSpeed * (standStraight ? 0.6 : 1);

  const headY = 20 + bounce;
  const torsoTop = 40 + bounce;
  const hipY = 72 + bounce;

  const handLead = dir * Math.sin(rad) * 7 * climbSpeed;
  const handL_Y = torsoTop + 8 + handLead;
  const handR_Y = torsoTop + 16 - handLead;

  const footLead = dir * Math.sin(rad * 1.1) * 10 * climbSpeed;
  const footL_Y = hipY + 8 + footLead * 0.2;
  const footR_Y = hipY + 14 - footLead * 0.2;

  const blink = Math.abs(Math.sin(rad * 4 + 0.3)) > 0.95 ? 0.2 : 1;
  const eyeY = headY + 2;

  return (
    <svg
      width="92"
      height="110"
      viewBox="0 0 100 120"
      className="shrink-0 text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.45)]"
      aria-hidden
    >
      <defs>
        <radialGradient id="ropeHeadGlow" cx="50%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#34d399" stopOpacity="0.55" />
          <stop offset="60%" stopColor="#06b6d4" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Head */}
      <circle
        cx={cx}
        cy={headY}
        r="10"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <circle cx={cx} cy={headY} r="12" fill="url(#ropeHeadGlow)" opacity={0.85} />

      {/* Eyes */}
      <g
        transform={`translate(${cx}, ${eyeY}) scaleY(${blink}) translate(${-cx}, ${-eyeY})`}
      >
        <circle cx={cx - 3} cy={eyeY + 1} r="1.1" fill="#d1fae5" opacity="0.95" />
        <circle cx={cx + 3} cy={eyeY + 1} r="1.1" fill="#d1fae5" opacity="0.95" />
      </g>

      {/* Torso */}
      <rect
        x={cx - 10}
        y={torsoTop - 6}
        width={20}
        height={28}
        rx={10}
        fill="rgba(16,185,129,0.12)"
        stroke="currentColor"
        strokeWidth={2}
      />

      {/* Hands gripping the rope */}
      <path
        d={`M ${cx - 8} ${torsoTop + 10} L ${cx - 2} ${handL_Y} L ${cx} ${handL_Y}`}
        fill="none"
        stroke="currentColor"
        strokeWidth={2.6}
        strokeLinecap="round"
      />
      <path
        d={`M ${cx + 8} ${torsoTop + 10} L ${cx + 2} ${handR_Y} L ${cx} ${handR_Y}`}
        fill="none"
        stroke="currentColor"
        strokeWidth={2.6}
        strokeLinecap="round"
      />

      {/* Arms to torso */}
      <path
        d={`M ${cx - 10} ${torsoTop + 10} Q ${cx - 14} ${handL_Y + 4} ${cx - 2} ${handL_Y}`}
        fill="none"
        stroke="currentColor"
        strokeWidth={2.6}
        strokeLinecap="round"
        opacity={0.9}
      />
      <path
        d={`M ${cx + 10} ${torsoTop + 10} Q ${cx + 14} ${handR_Y + 4} ${cx + 2} ${handR_Y}`}
        fill="none"
        stroke="currentColor"
        strokeWidth={2.6}
        strokeLinecap="round"
        opacity={0.9}
      />

      {/* Legs */}
      <path
        d={`M ${cx - 6} ${hipY + 2} Q ${cx - 10} ${footL_Y} ${cx - 4} ${footL_Y}`}
        fill="none"
        stroke="currentColor"
        strokeWidth={2.6}
        strokeLinecap="round"
      />
      <path
        d={`M ${cx + 6} ${hipY + 2} Q ${cx + 10} ${footR_Y} ${cx + 4} ${footR_Y}`}
        fill="none"
        stroke="currentColor"
        strokeWidth={2.6}
        strokeLinecap="round"
      />

      {/* Foot pads */}
      <rect x={cx - 6} y={footL_Y - 2} width={12} height={5} rx={2.5} fill="currentColor" opacity={0.95} />
      <rect x={cx - 6} y={footR_Y - 2} width={12} height={5} rx={2.5} fill="currentColor" opacity={0.78} />
    </svg>
  );
}

function modeLabel(mode: WalkMode, standStraight: boolean, facing: number) {
  if (standStraight) return mode === "run" ? "Climbing fast" : "Climbing";
  const dirLabel = facing >= 0 ? "down" : "up";
  if (mode === "run") return `Climbing ${dirLabel} (fast)`;
  if (mode === "walk") return `Climbing ${dirLabel}`;
  return `Climbing ${dirLabel}`;
}

/** Text sits inside a soft “cloud” cluster (puffs + main body) */
function CloudTextBox({ children }: { children: React.ReactNode }) {
  const puff =
    "pointer-events-none absolute rounded-full border border-emerald-500/25 bg-slate-950/90 shadow-sm";

  return (
    <div className="relative w-[280px] md:w-[360px]">
      <div className={`${puff} -left-3 top-1/2 h-10 w-10 -translate-y-1/2`} />
      <div className={`${puff} -right-1 -top-2 h-7 w-7`} />
      <div className={`${puff} right-2 -top-4 h-6 w-6 opacity-90`} />
      <div className={`${puff} -bottom-2 left-5 h-8 w-8`} />
      <div className={`${puff} -bottom-1 right-6 h-6 w-6 opacity-95`} />
      <div className="relative z-10 rounded-[2.25rem] border border-emerald-500/35 bg-slate-950/92 px-4 py-3 shadow-[0_10px_40px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md">
        {children}
      </div>
    </div>
  );
}

export function AnimatedGuide({ message }: AnimatedGuideProps) {
  const { phase, mode, scrollProgress, facing, velocity } = useScrollWalkAndProgress();

  // Add intentional latency so the text change feels synced with
  // the man/rope (which already uses a low-pass filtered scroll progress).
  const [displayMessage, setDisplayMessage] = useState(message);

  useEffect(() => {
    // Keep small latency (for sync with the man), but avoid noticeable “lagging text”.
    const t = window.setTimeout(() => setDisplayMessage(message), 70);
    return () => window.clearTimeout(t);
  }, [message]);

  const [gesturePulse, setGesturePulse] = useState(0);

  // Pulse when the visible message changes.
  useEffect(() => {
    setGesturePulse(1);
    const t = window.setTimeout(() => setGesturePulse(0), 350);
    return () => window.clearTimeout(t);
  }, [displayMessage]);

  const standStraight =
    scrollProgress <= SCROLL_EDGE || scrollProgress >= 1 - SCROLL_EDGE;

  // Move along the right edge: top → bottom as user scrolls down
  const topPercent = 22 + scrollProgress * 68;
  const ropeSwayPx =
    Math.sin(phase * Math.PI * 2) * (mode === "run" ? 4 : mode === "walk" ? 2.6 : 1.6);
  const ropeSwayDeg = ropeSwayPx * 0.28;

  // Rebound offset: scroll down -> small "up" bump; scroll up -> small "down" bump.
  // The offset decays naturally as `velocity` decays in the RAF scroll loop.
  const reboundPercent = (() => {
    // Make rebound strongly visible, but still scroll-speed dependent.
    const speedCurve = Math.pow(Math.max(0, velocity), 1.05);
    const cap = mode === "run" ? 6.6 : mode === "walk" ? 5.2 : 3.6;
    const scale = mode === "run" ? 1.45 : mode === "walk" ? 1.15 : 0.92;
    return -facing * Math.min(cap, speedCurve * scale);
  })();

  // Apply the same visible latency to the man + dialog motion.
  // This keeps the box movement synchronized with when the text changes.
  const [delayedTopPercent, setDelayedTopPercent] = useState(topPercent);
  const latestTopPercentRef = useRef(topPercent);
  const topDelayTimerRef = useRef<number | null>(null);

  useEffect(() => {
    latestTopPercentRef.current = topPercent;
    if (topDelayTimerRef.current != null) return;

    topDelayTimerRef.current = window.setTimeout(() => {
      setDelayedTopPercent(latestTopPercentRef.current);
      topDelayTimerRef.current = null;
    }, 35);

    return () => {
      // Don’t cancel on every render; we only want one active timer.
    };
  }, [topPercent]);

  useEffect(() => {
    return () => {
      if (topDelayTimerRef.current != null) {
        window.clearTimeout(topDelayTimerRef.current);
      }
    };
  }, []);

  return (
    <div
      className="hidden md:block pointer-events-none fixed inset-y-0 right-0 z-20 w-[180px] overflow-visible"
      aria-live="polite"
    >
      {/* Rope (full-height) - slightly sways based on scroll speed */}
      <div
        className="pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 w-[18px]"
        aria-hidden
      >
        <motion.div
          className="absolute inset-y-0 left-[8px] w-px bg-gradient-to-b from-transparent via-emerald-500/65 to-transparent"
          style={{
            transform: `rotate(${ropeSwayDeg}deg)`,
            transformOrigin: "50% 0%",
            filter: "drop-shadow(0 0 8px rgba(52,211,153,0.25))"
          }}
        />
        <motion.div
          className="absolute inset-y-0 left-[10px] w-px bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent"
          style={{
            transform: `rotate(${ropeSwayDeg * 0.85}deg)`,
            transformOrigin: "50% 0%",
            width: "1px",
            opacity: 0.9
          }}
        />

        {/* Moving shimmer segment along rope */}
        <motion.div
          className="absolute left-[9px] w-px rounded-full bg-emerald-400/70"
          style={{
            top: `${(phase % 1) * 85}%`,
            height: 70,
            transform: "translateY(-50%)"
          }}
          animate={{ opacity: [0.25, 0.85, 0.25] }}
          transition={{ duration: 0.55, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Man wrapper moves along the rope; dialog stays attached to the head */}
      <div
        className="pointer-events-none absolute left-1/2 -translate-x-1/2"
        style={{ top: `${delayedTopPercent + reboundPercent}%` }}
      >
        <div className="relative pointer-events-auto flex flex-col items-center">
          <div className="absolute -top-28 -left-[250px] md:-left-[370px] z-50">
            <CloudTextBox>
              <AnimatePresence mode="sync">
                <motion.p
                  key={displayMessage}
                  layout
                  initial={{ opacity: 0, y: 4, scale: 0.99 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.99 }}
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  className="text-left text-[12px] leading-snug text-slate-100 md:text-[13px]"
                >
                  {displayMessage}
                </motion.p>
              </AnimatePresence>
            </CloudTextBox>
          </div>

          <RopeClimber
            phase={phase}
            mode={mode}
            facing={facing}
            standStraight={standStraight}
          />
          <span className="mt-1 max-w-[5.5rem] text-center text-[7px] font-semibold uppercase leading-tight tracking-wider text-emerald-500/90 md:text-[8px]">
            {modeLabel(mode, standStraight, facing)}
          </span>
        </div>
      </div>
    </div>
  );
}
