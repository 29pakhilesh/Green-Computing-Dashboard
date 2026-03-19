import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  HARDWARE_DB,
  DeviceCategory,
  energyKWh,
  emissionsKg
} from "../data/hardware";
import { lazy, Suspense } from "react";

const Charts = lazy(() => import("./EnergyCharts"));

const KM_PER_KG_CO2 = 4.3; // very rough car emission equivalence
const TREES_PER_KG_CO2 = 1 / 21.0; // 21 kg CO2 absorbed per tree per year (approx, scaled)

function recommendations({
  hours,
  dailyEmissions,
  category,
  deviceName
}: {
  hours: number;
  dailyEmissions: number;
  category: DeviceCategory;
  deviceName: string;
}): string {
  if (hours > 10) {
    return "Your runtime is very high. Enable aggressive sleep/idle timeouts and batch heavy work into shorter windows.";
  }
  if (dailyEmissions > 3) {
    return "This workload emits several kg of CO₂ per day. Run it when the grid mix is cleaner and avoid leaving it idle.";
  }
  if (category === "gpu") {
    return `GPUs like ${deviceName} are powerful but energy hungry. Prefer shorter training runs, mixed precision, and spot instances when possible.`;
  }
  if (category === "laptop" || category === "desktop") {
    return "You are on powerful desktop or laptop hardware. Use efficient power plans, avoid running heavy apps together, and let the system sleep when idle.";
  }
  if (category === "phone") {
    return "Phones are very efficient per hour, but streaming HD video and gaming can still add up. Prefer Wi‑Fi over cellular, and enable low‑power mode when possible.";
  }
  return "You are in a good range. Maintain short active sessions and keep firmware, drivers, and power plans tuned for efficiency.";
}

export function EnergyCalculator() {
  const [category, setCategory] = useState<DeviceCategory>("gpu");
  const [deviceId, setDeviceId] = useState<string>("rtx-3060");
  const [hours, setHours] = useState(4);
  const [manualPower, setManualPower] = useState<number | undefined>();

  const device = useMemo(
    () => HARDWARE_DB.find((d) => d.id === deviceId)!,
    [deviceId]
  );

  const power = manualPower ?? device.avgPowerWatts;
  const dailyEnergy = energyKWh(power, hours);
  const dailyEmissions = emissionsKg(power, hours);

  const monthlyEnergy = dailyEnergy * 30;
  const monthlyEmissions = dailyEmissions * 30;

  const kmDriven = dailyEmissions * KM_PER_KG_CO2;
  const treesNeeded = dailyEmissions * TREES_PER_KG_CO2;

  const score = Math.max(
    0,
    Math.min(
      100,
      100 -
        (dailyEmissions * 40 + (category === "gpu" ? 5 : 0) + (hours - 2) * 4)
    )
  );

  return (
    <section
      id="calculator"
      className="scroll-mt-24 grid gap-8 lg:grid-cols-1"
    >
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.995 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
        className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 shadow-[0_0_0_1px_rgba(15,23,42,0.9)]"
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold tracking-wide text-slate-100">
              Energy & Carbon Calculator
            </h2>
            <p className="mt-1 text-[11px] text-slate-400">
              Estimate how much energy and CO₂ your daily compute consumes.
            </p>
          </div>
          <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
            Live · Local only
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-2 md:items-start">
          <div className="min-w-0 space-y-3 text-xs">
            <label className="block text-[11px] font-medium text-slate-300">
              Device type
            </label>
            <div className="grid grid-cols-5 gap-1 rounded-full bg-slate-900/80 p-1 text-[10px] md:text-[11px]">
              {(["cpu", "gpu", "laptop", "desktop", "phone"] as DeviceCategory[]).map(
                (c) => (
                  <button
                    key={c}
                    type="button"
                    className={`min-w-0 truncate rounded-full px-1 py-1.5 text-center capitalize transition-colors ${
                      c === category
                        ? "bg-emerald-500/20 text-emerald-200"
                        : "text-slate-300 hover:text-emerald-200"
                    }`}
                    onClick={() => {
                      setCategory(c);
                      const first = HARDWARE_DB.find((d) => d.category === c);
                      if (first) setDeviceId(first.id);
                    }}
                  >
                    {c}
                  </button>
                )
              )}
            </div>

            <label className="block text-[11px] font-medium text-slate-300">
              Device model
            </label>
            <select
              className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-100 outline-none focus:border-emerald-500"
              value={deviceId}
              onChange={(e) => setDeviceId(e.target.value)}
            >
              {HARDWARE_DB.filter((d) => d.category === category).map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>

            <label className="mt-3 block text-[11px] font-medium text-slate-300">
              Daily active usage (hours)
            </label>
            <input
              type="range"
              min={1}
              max={16}
              step={1}
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="w-full accent-emerald-400"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>{hours} h/day</span>
              <span className="text-slate-500">
                Tip: reducing by 1 h can save ~
                {emissionsKg(power, 1).toFixed(2)} kg CO₂/day
              </span>
            </div>

            <label className="mt-3 block text-[11px] font-medium text-slate-300">
              Power draw (W)
              <span className="ml-1 text-[10px] font-normal text-slate-500">
                auto-filled from database, editable
              </span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={5}
                max={600}
                value={power}
                onChange={(e) =>
                  setManualPower(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="w-28 rounded-xl border border-slate-800 bg-slate-900 px-2 py-1.5 text-xs text-slate-100 outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                className="text-[11px] text-emerald-300 hover:text-emerald-200"
                onClick={() => setManualPower(undefined)}
              >
                Reset to avg ({device.avgPowerWatts}W)
              </button>
            </div>
          </div>

          <div className="min-w-0 space-y-3 rounded-xl border border-slate-800/80 bg-slate-950/70 p-4 text-xs">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Today&apos;s footprint
            </h3>
            <dl className="grid grid-cols-2 gap-3">
              <Stat label="Energy" value={`${dailyEnergy.toFixed(2)} kWh`} />
              <Stat
                label="CO₂ emitted"
                value={`${dailyEmissions.toFixed(2)} kg`}
              />
              <Stat
                label="Car travel"
                value={`${kmDriven.toFixed(1)} km equivalent`}
              />
              <Stat
                label="Trees to offset"
                value={`${treesNeeded.toFixed(2)} trees / year`}
              />
            </dl>
            <div className="mt-2 rounded-lg bg-slate-900/70 p-3">
              <p className="text-[11px] font-medium text-slate-300">
                Green score today
              </p>
              <div className="mt-1 flex items-center gap-3">
                <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-500"
                    style={{ width: `${score}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-emerald-300">
                  {score.toFixed(0)}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-slate-400">
                Higher is better. Aim for 80+ by reducing runtime and choosing
                efficient hardware.
              </p>
            </div>
            <div className="mt-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3">
              <p className="text-[11px] font-semibold text-emerald-200">
                Smart suggestion
              </p>
              <p className="mt-1 text-[11px] text-emerald-100">
                {recommendations({
                  hours,
                  dailyEmissions,
                  category,
                  deviceName: device.name
                })}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.995 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 shadow-[0_0_0_1px_rgba(15,23,42,0.9)]"
      >
        <div className="mb-2 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-100">
              Daily vs monthly impact
            </h3>
            <p className="mt-1 text-[11px] text-slate-400">
              Visualize how small daily choices compound over time.
            </p>
          </div>
        </div>
        <Suspense
          fallback={
            <div className="flex min-h-[280px] items-center justify-center py-12 text-xs text-slate-500">
              Loading lightweight charts…
            </div>
          }
        >
          <Charts
            dailyEnergy={dailyEnergy}
            monthlyEnergy={monthlyEnergy}
            dailyEmissions={dailyEmissions}
            monthlyEmissions={monthlyEmissions}
          />
        </Suspense>
      </motion.div>
    </section>
  );
}

interface StatProps {
  label: string;
  value: string;
}

function Stat({ label, value }: StatProps) {
  return (
    <div className="rounded-lg border border-slate-800/80 bg-slate-950/80 px-3 py-2.5">
      <dt className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 text-[14px] font-semibold leading-tight text-slate-100 md:text-[16px]">
        {value}
      </dd>
    </div>
  );
}

