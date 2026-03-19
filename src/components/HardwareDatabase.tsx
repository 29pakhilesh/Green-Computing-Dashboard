import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { HARDWARE_DB, HardwareDevice, DeviceCategory } from "../data/hardware";

export function HardwareDatabase({
  onToggleCompare
}: {
  onToggleCompare: (device: HardwareDevice) => void;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<DeviceCategory | "all">("all");

  const filtered = useMemo(() => {
    return HARDWARE_DB.filter((d) => {
      if (category !== "all" && d.category !== category) return false;
      if (query && !d.name.toLowerCase().includes(query.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [category, query]);

  return (
    <section
      id="hardware"
      className="scroll-mt-24 mt-10 space-y-4"
    >
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h2 className="text-sm font-semibold text-slate-100">
            Hardware efficiency database
          </h2>
          <p className="mt-1 text-[11px] text-slate-400">
            Explore typical power draw and emissions for popular CPUs, GPUs, and
            laptops.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <input
            type="search"
            placeholder="Search by model…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-40 rounded-full border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-100 outline-none focus:border-emerald-500 md:w-52"
          />
          <div className="inline-flex rounded-full bg-slate-900/90 p-1">
            <FilterChip
              label="All"
              active={category === "all"}
              onClick={() => setCategory("all")}
            />
            <FilterChip
              label="CPUs"
              active={category === "cpu"}
              onClick={() => setCategory("cpu")}
            />
            <FilterChip
              label="GPUs"
              active={category === "gpu"}
              onClick={() => setCategory("gpu")}
            />
            <FilterChip
              label="Laptops"
              active={category === "laptop"}
              onClick={() => setCategory("laptop")}
            />
            <FilterChip
              label="Mac & desktop"
              active={category === "desktop"}
              onClick={() => setCategory("desktop")}
            />
            <FilterChip
              label="Phones"
              active={category === "phone"}
              onClick={() => setCategory("phone")}
            />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 10, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/60"
      >
        <div className="hidden grid-cols-[2fr,1fr,1fr,1fr,1fr,auto] bg-slate-950/95 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 md:grid">
          <span>Device</span>
          <span className="text-right">Category</span>
          <span className="text-right">TDP (W)</span>
          <span className="text-right">Avg power (W)</span>
          <span className="text-right">CO₂ / hour (kg)</span>
          <span className="text-right">Efficiency</span>
        </div>
        <div className="divide-y divide-slate-900/80">
          {filtered.map((d) => (
            <button
              key={d.id}
              onClick={() => onToggleCompare(d)}
              className="flex w-full flex-col gap-1 px-4 py-3 text-left text-xs text-slate-100 transition-colors hover:bg-slate-900/70 md:grid md:grid-cols-[2fr,1fr,1fr,1fr,1fr,auto] md:items-center"
            >
              <div>
                <p className="font-medium">{d.name}</p>
                <p className="mt-0.5 text-[11px] text-slate-400 md:hidden">
                  {d.category.toUpperCase()} · {d.avgPowerWatts}W avg ·{" "}
                  {d.co2PerHourKg.toFixed(3)} kg CO₂/h
                </p>
              </div>
              <span className="hidden text-right text-slate-400 md:block">
                {d.category.toUpperCase()}
              </span>
              <span className="hidden text-right text-slate-200 md:block">
                {d.tdpWatts}
              </span>
              <span className="hidden text-right text-slate-200 md:block">
                {d.avgPowerWatts}
              </span>
              <span className="hidden text-right text-emerald-300 md:block">
                {d.co2PerHourKg.toFixed(3)}
              </span>
              <span className="hidden text-right md:block">
                <EfficiencyPill score={d.efficiencyScore} />
              </span>
              <span className="mt-1 inline-flex items-center justify-end text-[11px] text-emerald-300 md:mt-0">
                Add to comparison →
              </span>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="px-4 py-5 text-center text-xs text-slate-500">
              No hardware matches your filters. Try broadening your search.
            </p>
          )}
        </div>
      </motion.div>
    </section>
  );
}

function FilterChip({
  label,
  active,
  onClick
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`rounded-full px-3 py-1 text-[11px] transition-colors ${
        active
          ? "bg-emerald-500/25 text-emerald-200"
          : "text-slate-300 hover:text-emerald-200"
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function EfficiencyPill({ score }: { score: number }) {
  const color =
    score >= 85
      ? "bg-emerald-500/20 text-emerald-200"
      : score >= 70
      ? "bg-amber-500/20 text-amber-200"
      : "bg-rose-500/10 text-rose-200";

  return (
    <span
      className={`inline-flex items-center justify-end rounded-full px-2 py-0.5 text-[11px] font-semibold ${color}`}
    >
      {score}
    </span>
  );
}

