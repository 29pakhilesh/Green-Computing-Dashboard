import { useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring
} from "framer-motion";

type Step = {
  title: string;
  description: string;
};

export function HomeScrollSteps({ steps }: { steps: Step[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // progress: 0..1 as the container moves through the viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Keep derived index stable without forcing React rerenders too often.
  const initialIndex = useMemo(() => 0, []);
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  const spring = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });

  useMotionValueEvent(spring, "change", (latest) => {
    const next = Math.max(
      0,
      Math.min(steps.length - 1, Math.floor(latest * steps.length))
    );
    setActiveIndex((cur) => (cur === next ? cur : next));
  });

  const active = steps[Math.min(steps.length - 1, Math.max(0, activeIndex))];

  return (
    <div
      ref={containerRef}
      className="mt-8 rounded-3xl border border-slate-800/90 bg-black/40 p-5 md:p-7"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300 md:text-sm">
          Scroll to advance
        </p>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400 md:text-xs">
            {activeIndex + 1}/{steps.length}
          </span>
        </div>
      </div>

      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-900">
        <motion.div
          className="h-full w-full bg-gradient-to-r from-emerald-400 to-cyan-400"
          style={{
            scaleX: scrollYProgress,
            transformOrigin: "left center"
          }}
        />
      </div>

      <div className="relative mt-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <h3 className="text-xl font-semibold text-slate-50 md:text-2xl">
              {active.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-300 md:text-base">
              {active.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {steps.map((s, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              key={s.title}
              type="button"
              onClick={() => {
                // minimal: allow click to jump without complex scroll logic
                setActiveIndex(i);
              }}
              className={`rounded-full border px-3 py-1.5 text-[11px] transition-colors md:text-xs ${
                isActive
                  ? "border-emerald-500/70 bg-emerald-500/15 text-emerald-200"
                  : "border-slate-800/80 bg-black/20 text-slate-300 hover:text-slate-100"
              }`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}

