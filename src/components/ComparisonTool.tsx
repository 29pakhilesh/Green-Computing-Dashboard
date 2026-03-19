import { useMemo } from "react";
import { motion } from "framer-motion";
import type { HardwareDevice } from "../data/hardware";

export function ComparisonTool({ devices }: { devices: HardwareDevice[] }) {
  const sorted = useMemo(
    () => [...devices].sort((a, b) => b.efficiencyScore - a.efficiencyScore),
    [devices]
  );

  const best = sorted[0];

  if (devices.length === 0) {
    return (
      <section
        id="compare"
        className="scroll-mt-24 mt-10 rounded-2xl border border-dashed border-slate-800/80 bg-slate-950/40 p-4 text-xs text-slate-400"
      >
        Select devices from the hardware database to compare their energy,
        emissions, and efficiency.
      </section>
    );
  }

  return (
    <section
      id="compare"
      className="scroll-mt-24 mt-10 rounded-2xl border border-slate-800 bg-slate-950/70 p-4"
    >
      <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-100">
            Comparison tool
          </h2>
          <p className="mt-1 text-[11px] text-slate-400">
            Compare energy use, emissions, and green efficiency across your
            shortlisted hardware.
          </p>
        </div>
        {best && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-[11px] text-emerald-100 shadow-[0_0_30px_rgba(16,185,129,0.35)]"
          >
            <p className="font-semibold uppercase tracking-[0.18em]">
              Most efficient
            </p>
            <p className="mt-0.5 text-xs">{best.name}</p>
            <p className="text-[10px] text-emerald-200">
              Efficiency score {best.efficiencyScore} ·{" "}
              {best.co2PerHourKg.toFixed(3)} kg CO₂/h
            </p>
          </motion.div>
        )}
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {sorted.map((d) => (
          <motion.div
            key={d.id}
            initial={{ y: 6, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.25 }}
            className={`rounded-xl border px-3 py-3 text-xs ${
              d.id === best?.id
                ? "border-emerald-500/70 bg-emerald-500/10"
                : "border-slate-800 bg-slate-950/80"
            }`}
          >
            <p className="text-[11px] font-semibold text-slate-100">
              {d.name}
            </p>
            <p className="mt-0.5 text-[10px] text-slate-400">
              {d.category.toUpperCase()} · TDP {d.tdpWatts}W
            </p>
            <dl className="mt-2 space-y-1.5">
              <Row label="Avg power" value={`${d.avgPowerWatts} W`} />
              <Row
                label="CO₂ per hour"
                value={`${d.co2PerHourKg.toFixed(3)} kg`}
              />
              <Row
                label="Efficiency"
                value={`${d.efficiencyScore}/100`}
                highlight={d.id === best?.id}
              />
            </dl>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Row({
  label,
  value,
  highlight
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-[11px] text-slate-400">{label}</span>
      <span
        className={`text-[11px] font-semibold ${
          highlight ? "text-emerald-300" : "text-slate-100"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

