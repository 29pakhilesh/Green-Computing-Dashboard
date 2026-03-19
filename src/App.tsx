import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Layout, SectionKey } from "./components/Layout";
import { VoiceNarrator } from "./components/VoiceNarrator";
import { EnergyCalculator } from "./components/EnergyCalculator";
import { HardwareDatabase } from "./components/HardwareDatabase";
import { ComparisonTool } from "./components/ComparisonTool";
import { CaseStudies } from "./components/CaseStudies";
import { PhonesSection } from "./components/PhonesSection";
import { HomeScrollSteps } from "./components/HomeScrollSteps";
import {
  HARDWARE_DB,
  energyKWh,
  emissionsKg
} from "./data/hardware";
import type { HardwareDevice } from "./data/hardware";

function App() {
  const [section, setSection] = useState<SectionKey>("home");
  const [compareDevices, setCompareDevices] = useState<HardwareDevice[]>([]);

  const sampleHours = 4;
  const sampleCategory = "gpu";
  const KM_PER_KG_CO2 = 4.3;
  const TREES_PER_KG_CO2 = 1 / 21.0;
  const sampleDevice = HARDWARE_DB.find((d) => d.id === "rtx-3060")!;
  const samplePower = sampleDevice.avgPowerWatts;
  const sampleEnergy = energyKWh(samplePower, sampleHours);
  const sampleEmissions = emissionsKg(samplePower, sampleHours);
  const sampleKm = sampleEmissions * KM_PER_KG_CO2;
  const sampleTrees = sampleEmissions * TREES_PER_KG_CO2;
  const sampleScore = Math.max(
    0,
    Math.min(
      100,
      100 - (sampleEmissions * 40 + (sampleCategory === "gpu" ? 5 : 0) + (sampleHours - 2) * 4)
    )
  );

  const heroNarration =
    "Estimate the energy and carbon impact of your devices, compare greener hardware choices, " +
    "and see how large-scale operators approach sustainable infrastructure.";

  const handleToggleCompare = (device: HardwareDevice) => {
    setCompareDevices((current) => {
      const exists = current.find((d) => d.id === device.id);
      if (exists) {
        return current.filter((d) => d.id !== device.id);
      }
      if (current.length >= 3) {
        return [...current.slice(1), device];
      }
      return [...current, device];
    });
  };

  const navigateTo = (target: SectionKey) => {
    setSection(target);

    const id = target === "home" ? "home" : target;
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;

    const mapping: { key: SectionKey; id: string }[] = [
      { key: "home", id: "home" },
      { key: "calculator", id: "calculator" },
      { key: "hardware", id: "hardware" },
      { key: "compare", id: "compare" },
      { key: "cases", id: "cases" }
    ];

    const els = mapping
      .map((m) => ({ ...m, el: document.getElementById(m.id) }))
      .filter((m) => m.el) as Array<{ key: SectionKey; id: string; el: HTMLElement }>;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              (b.intersectionRatio || 0) - (a.intersectionRatio || 0)
          )[0];

        if (!visible) return;
        const match = mapping.find((m) => m.id === (visible.target as HTMLElement).id);
        if (!match) return;
        setSection((cur) => (cur === match.key ? cur : match.key));
      },
      {
        threshold: [0.25, 0.4, 0.6],
        rootMargin: "-80px 0px -55% 0px"
      }
    );

    els.forEach(({ el }) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <Layout activeSection={section} onNavigate={navigateTo}>
      <section
        id="home"
        className="scroll-mt-24 grid gap-8 rounded-3xl border border-slate-800 bg-slate-950/60 p-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]"
      >
          <motion.div
            initial={{ y: 18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <p className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-5 py-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-emerald-200 md:text-[13px]">
              Designed for green computing
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(16,185,129,0.4)]" />
            </p>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-50 sm:text-5xl md:text-6xl">
              Measure, compare, and improve the{" "}
              <span className="bg-gradient-to-r from-emerald-400 via-lime-300 to-cyan-300 bg-clip-text text-transparent">
                carbon impact
              </span>{" "}
              of your compute.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-300 md:text-lg">
              Estimate daily energy and CO₂ from your hardware and usage, compare
              devices side by side, and explore how the industry reduces emissions
              at scale.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
              <button
                className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/40 transition hover:bg-emerald-400"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.open("#topic", "_blank");
                  }
                }}
              >
                Open theory slides
                <span aria-hidden="true">→</span>
              </button>
              <button
                className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-200 hover:border-emerald-500/80 hover:text-emerald-200"
                onClick={() => navigateTo("hardware")}
              >
                Explore efficient hardware
              </button>
              <VoiceNarrator text={heroNarration} />
            </div>
            <HomeScrollSteps
              steps={[
                {
                  title: "Measure energy & CO₂",
                  description:
                    "Pick a device (including Apple + phones), enter hours/day, and instantly see kWh + emissions."
                },
                {
                  title: "Compare efficiency",
                  description:
                    "Shortlist devices from the database and see the lowest-emissions option highlighted."
                },
                {
                  title: "Improve your score",
                  description:
                    "Get usage-aware suggestions like sleep/idle tips and smarter workload timing."
                }
              ]}
            />

            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  const el = document.getElementById("calculator");
                  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-700 bg-slate-900/70 px-5 py-2.5 text-sm font-semibold text-slate-100 shadow-sm transition hover:border-emerald-500/70 hover:text-emerald-200"
              >
                <span>Scroll to calculator</span>
                <span aria-hidden="true">↓</span>
              </motion.button>
              <p className="text-xs text-slate-400 sm:text-sm">
                Steps below highlight as you move through the page.
              </p>
            </div>

            <dl className="mt-7 grid gap-4 text-sm text-slate-300 sm:grid-cols-3 md:text-base">
              <Stat
                label="Clear numbers"
                value="kWh and CO₂ from typical power draw and hours of use."
              />
              <Stat
                label="Fair comparisons"
                value="Shortlist hardware and see which option emits less."
              />
              <Stat
                label="Practical tips"
                value="Suggestions tuned to device type and daily runtime."
              />
            </dl>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="relative flex flex-col gap-4 overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-6"
          >
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute left-10 top-4 h-32 w-32 rounded-full bg-emerald-500/20 blur-3xl" />
              <div className="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-cyan-500/20 blur-3xl" />
            </div>

            <div className="relative">
              <p className="text-sm font-semibold text-slate-100 md:text-base">
                Where savings add up
              </p>
              <p className="mt-2 text-sm text-slate-400 md:text-base">
                Small changes to runtime, hardware choice, and idle behavior
                compound into meaningful energy and emissions differences.
              </p>
            </div>

            <div className="relative grid grid-cols-2 gap-3">
              <Mini
                label="Shorter active time"
                value="Cut daily hours first"
              />
              <Mini
                label="Efficient hardware"
                value="Lower W for same work"
              />
              <Mini
                label="Sleep & idle"
                value="Don’t leave gear on 24/7"
              />
              <Mini
                label="Smarter timing"
                value="Batch heavy workloads"
              />
            </div>

            <div className="relative rounded-2xl border border-slate-800 bg-black/30 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                    Example footprint preview
                  </p>
                  <p className="mt-2 text-sm text-slate-200 md:text-base">
                    RTX 3060 · {sampleHours} h/day
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    Green score
                  </p>
                  <p className="text-2xl font-semibold text-emerald-300">
                    {sampleScore.toFixed(0)}
                  </p>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-3 text-center">
                <SmallStat label="Energy" value={`${sampleEnergy.toFixed(2)} kWh`} />
                <SmallStat label="CO₂" value={`${sampleEmissions.toFixed(2)} kg`} />
                <SmallStat label="Equiv." value={`${sampleKm.toFixed(1)} km`} />
              </div>

              <div className="mt-3 flex items-center gap-3">
                <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-500"
                    style={{ width: `${sampleScore}%` }}
                  />
                </div>
                <p className="text-[11px] font-semibold text-slate-200">
                  Trees ~ {sampleTrees.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="relative rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4">
              <p className="text-[11px] font-semibold text-emerald-200 uppercase tracking-[0.18em]">
                Tip
              </p>
              <p className="mt-2 text-sm text-emerald-100 md:text-base">
                Reduce runtime by even 1 hour/day, then compare devices using
                the same workload—efficiency improvements compound.
              </p>
            </div>
          </motion.div>
      </section>

      <div className="mt-10 space-y-6">
        <EnergyCalculator />
        <HardwareDatabase onToggleCompare={handleToggleCompare} />
        <ComparisonTool devices={compareDevices} />
        <CaseStudies />
        <PhonesSection />
      </div>
    </Layout>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3">
      <dt className="text-[11px] uppercase tracking-[0.18em] text-slate-500 md:text-xs">
        {label}
      </dt>
      <dd className="mt-1 text-[12px] leading-relaxed text-slate-200 md:text-sm">
        {value}
      </dd>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-800/80 bg-black/20 px-3 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-slate-100 md:text-base">
        {value}
      </p>
    </div>
  );
}

function SmallStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-800/60 bg-black/20 p-3">
      <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-slate-100 md:text-base">
        {value}
      </p>
    </div>
  );
}

export default App;

