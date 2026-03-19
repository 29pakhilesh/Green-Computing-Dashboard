import { ReactNode, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AnimatedGuide } from "./AnimatedGuide";

interface LayoutProps {
  children: ReactNode;
  onNavigate: (section: SectionKey) => void;
  activeSection: SectionKey;
}

export type SectionKey =
  | "home"
  | "calculator"
  | "hardware"
  | "compare"
  | "cases";

const guideMessages: Record<SectionKey, string> = {
  home: "Welcome! Start with “Theory view” to learn the concepts, then use the calculator to estimate your digital carbon footprint.",
  calculator:
    "Enter the device, hours of use, and power to see your energy use and emissions.",
  hardware:
    "Browse efficient CPUs, GPUs, and laptops. Filter and search to find greener options.",
  compare:
    "Compare devices side by side to see which delivers the lowest emissions.",
  cases:
    "Explore how hyperscalers like Google and AWS optimize for sustainability."
};

export function Layout({ children, onNavigate, activeSection }: LayoutProps) {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-slate-50">
      {/* Dark background visuals: glows + grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 15% 0%, rgba(34, 197, 94, 0.18), transparent 45%),
            radial-gradient(circle at 90% 10%, rgba(56, 189, 248, 0.14), transparent 48%),
            radial-gradient(ellipse at center, transparent 35%, rgba(0, 0, 0, 0.55) 70%)
          `,
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-55"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(148,163,184,0.10) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.10) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(circle at 50% 20%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.2) 65%, rgba(0,0,0,0) 100%)",
          WebkitMaskImage:
            "radial-gradient(circle at 50% 20%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.2) 65%, rgba(0,0,0,0) 100%)",
        }}
      />

      <header className="sticky top-0 z-30 relative border-b border-slate-800/80 bg-black/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
          <div className="flex items-center gap-2">
            <img
              src="/logo.svg"
              alt="Smart Green"
              className="h-8 w-8"
              loading="eager"
            />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-400">
                Smart Green
              </p>
              <p className="text-sm font-medium text-slate-100">
                Computing Dashboard
              </p>
            </div>
          </div>
          <nav className="hidden items-center gap-6 text-xs font-medium text-slate-300 md:flex">
            <NavLink
              label="Home"
              active={activeSection === "home"}
              onClick={() => onNavigate("home")}
            />
            <NavLink
              label="Energy & Carbon"
              active={activeSection === "calculator"}
              onClick={() => onNavigate("calculator")}
            />
            <NavLink
              label="Hardware DB"
              active={activeSection === "hardware"}
              onClick={() => onNavigate("hardware")}
            />
            <NavLink
              label="Compare"
              active={activeSection === "compare"}
              onClick={() => onNavigate("compare")}
            />
            <NavLink
              label="Case Studies"
              active={activeSection === "cases"}
              onClick={() => onNavigate("cases")}
            />
          </nav>
          <button
            className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-100 shadow-sm hover:border-emerald-500/60 hover:bg-emerald-500/15 hover:text-emerald-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 md:text-xs"
            onClick={() => {
              if (typeof window !== "undefined") {
                window.open("#topic", "_blank");
              }
            }}
          >
            <span aria-hidden="true">📘</span>
            Theory View
          </button>
          <button
            className="ml-2 inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-200 md:hidden"
            onClick={() => setNavOpen((v) => !v)}
            aria-label="Toggle navigation"
          >
            ☰
          </button>
        </div>
        <AnimatePresence>
          {navOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-slate-800 bg-slate-950/95 px-4 pb-3 pt-2 md:hidden"
            >
              <div className="flex flex-col gap-1 text-xs font-medium text-slate-200">
                <NavLink
                  label="Home"
                  active={activeSection === "home"}
                  onClick={() => {
                    onNavigate("home");
                    setNavOpen(false);
                  }}
                />
                <NavLink
                  label="Energy & Carbon"
                  active={activeSection === "calculator"}
                  onClick={() => {
                    onNavigate("calculator");
                    setNavOpen(false);
                  }}
                />
                <NavLink
                  label="Hardware DB"
                  active={activeSection === "hardware"}
                  onClick={() => {
                    onNavigate("hardware");
                    setNavOpen(false);
                  }}
                />
                <NavLink
                  label="Compare"
                  active={activeSection === "compare"}
                  onClick={() => {
                    onNavigate("compare");
                    setNavOpen(false);
                  }}
                />
                <NavLink
                  label="Case Studies"
                  active={activeSection === "cases"}
                  onClick={() => {
                    onNavigate("cases");
                    setNavOpen(false);
                  }}
                />
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-4 pb-24 pr-20 pt-6 sm:pr-24 md:pb-28 md:pl-6 md:pr-36 md:pt-10">
        {children}
      </main>

      <AnimatedGuide message={guideMessages[activeSection]} />
    </div>
  );
}

interface NavLinkProps {
  label: string;
  active?: boolean;
  onClick: () => void;
}

function NavLink({ label, active, onClick }: NavLinkProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 transition-colors ${
        active
          ? "bg-emerald-500/15 text-emerald-300"
          : "text-slate-300 hover:text-emerald-300"
      }`}
    >
      <span>{label}</span>
      {active && (
        <span className="h-1 w-1 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/70" />
      )}
    </button>
  );
}

