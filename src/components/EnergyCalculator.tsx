import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  HARDWARE_DB,
  DeviceCategory,
  ELECTRICITY_MIXES,
  type ElectricityMixKey,
  energyKWh,
  emissionsKg
} from "../data/hardware";
import { lazy, Suspense } from "react";

const Charts = lazy(() => import("./EnergyCharts"));

const KM_PER_KG_CO2 = 4.3; // very rough car emission equivalence
const TREES_PER_KG_CO2 = 1 / 21.0; // approx: one tree absorbs ~21 kg CO2/year (very rough)

function recommendations({
  hours,
  dailyEmissions,
  category,
  deviceName,
  deviceEfficiency,
  usedPowerWatts,
  avgPowerWatts,
  reducedHours
}: {
  hours: number;
  dailyEmissions: number;
  category: DeviceCategory;
  deviceName: string;
  deviceEfficiency: number;
  usedPowerWatts: number;
  avgPowerWatts: number;
  reducedHours: number;
}): string {
  if (hours > 10) {
    return "Your runtime is very high. Enable aggressive sleep/idle timeouts and batch heavy work into shorter windows.";
  }
  if (dailyEmissions > 3) {
    return "This workload emits several kg of CO₂ per day. Run it when the grid mix is cleaner and avoid leaving it idle.";
  }
  if (usedPowerWatts > avgPowerWatts + 15) {
    return `Your current power draw (~${usedPowerWatts}W) is above the device average (${avgPowerWatts}W). Lower power by enabling a power-saver plan, reducing background tasks, and limiting max boost states.`;
  }
  if (category === "gpu") {
    return deviceEfficiency < 70
      ? `GPUs like ${deviceName} can consume a lot of energy. Consider switching to a more efficient model, using mixed precision, and shortening training runs.`
      : `GPUs like ${deviceName} are powerful but energy hungry. Prefer shorter training runs, mixed precision, and schedule heavy jobs in efficient windows.`;
  }
  if (category === "laptop" || category === "desktop") {
    if (reducedHours < hours) {
      const saved = hours - reducedHours;
      return `Reducing usage by ${saved} hour(s)/day improves efficiency immediately. Keep background apps minimal and let the system sleep when idle.`;
    }
    return "You are on powerful desktop or laptop hardware. Use efficient power plans, avoid running heavy apps together, and let the system sleep when idle.";
  }
  if (category === "phone") {
    return reducedHours < hours
      ? "Even on phones, reducing streaming/screen time helps. Try lowering playback quality when possible and enable low-power mode."
      : "Phones are very efficient per hour, but streaming HD video and gaming can still add up. Prefer Wi‑Fi over cellular, and enable low‑power mode when possible.";
  }
  return "You are in a good range. Maintain short active sessions and keep firmware, drivers, and power plans tuned for efficiency.";
}

export function EnergyCalculator() {
  const [category, setCategory] = useState<DeviceCategory>("gpu");
  const [deviceId, setDeviceId] = useState<string>("rtx-3060");
  const [hours, setHours] = useState(4);
  const [manualPower, setManualPower] = useState<number | undefined>();
  const [mixKey, setMixKey] = useState<ElectricityMixKey>("global_avg");
  const [reducedHours, setReducedHours] = useState<number>(3);
  const [checks, setChecks] = useState<Record<string, boolean>>({
    sleep: true,
    powerPlan: true,
    background: false,
    rightSize: false,
    ssd: false,
    eWaste: false,
    workloadSchedule: true
  });

  const device = useMemo(
    () => HARDWARE_DB.find((d) => d.id === deviceId)!,
    [deviceId]
  );

  // Keep reducedHours within [1..hours]
  useEffect(() => {
    setReducedHours((v) => Math.min(Math.max(1, v), hours));
  }, [hours]);

  const power = manualPower ?? device.avgPowerWatts;
  const emissionFactor = ELECTRICITY_MIXES[mixKey].emissionFactorKgPerKwh;
  const dailyEnergy = energyKWh(power, hours);
  const dailyEmissions = emissionsKg(power, hours, emissionFactor);

  const monthlyEnergy = dailyEnergy * 30;
  const monthlyEmissions = dailyEmissions * 30;

  const kmDriven = dailyEmissions * KM_PER_KG_CO2;
  const treesNeeded = dailyEmissions * 365 * TREES_PER_KG_CO2;

  const savedHours = Math.max(0, hours - reducedHours);
  const savedEnergy = energyKWh(power, savedHours);
  const savedEmissions = emissionsKg(power, savedHours, emissionFactor);

  const emissionsPenalty = dailyEmissions * 40;
  const runtimePenalty = (hours - 2) * 4;
  const hardwarePenalty = category === "gpu" ? 5 : 0;
  const scoreRaw = 100 - (emissionsPenalty + runtimePenalty + hardwarePenalty);

  const score = Math.max(
    0,
    Math.min(
      100,
      100 -
        (dailyEmissions * 40 + (category === "gpu" ? 5 : 0) + (hours - 2) * 4)
    )
  );

  const smartSuggestion = recommendations({
    hours,
    dailyEmissions,
    category,
    deviceName: device.name,
    deviceEfficiency: device.efficiencyScore,
    usedPowerWatts: power,
    avgPowerWatts: device.avgPowerWatts,
    reducedHours
  });

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

        <div className="mb-3 flex flex-wrap gap-2">
          <Badge text="Local-first calc" />
          <Badge text="Lazy-loaded charts" />
          <Badge text="Dark UI (OLED-friendly)" />
          <Badge text="Low-motion ready" />
        </div>

        <div className="mb-4 rounded-2xl border border-slate-800/70 bg-black/20 p-4 text-xs">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
            Green Computing UI Proof
          </p>
          <div className="mt-2 grid gap-2 md:grid-cols-2">
            <ProofItem title="Local-first" detail="Energy/CO₂ math runs in your browser." />
            <ProofItem title="Fewer bytes" detail="Charts are lazy-loaded to reduce initial JS." />
            <ProofItem title="Less motion" detail="Animations respect lightweight behavior; no heavy assets." />
            <ProofItem title="Dark by default" detail="Optimized dark theme for display efficiency." />
          </div>
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
                {emissionsKg(power, 1, emissionFactor).toFixed(2)} kg CO₂/day
              </span>
            </div>

            <label className="mt-3 block text-[11px] font-medium text-slate-300">
              What-if: reduced usage (hours/day)
            </label>
            <input
              type="range"
              min={1}
              max={hours}
              step={1}
              value={reducedHours}
              onChange={(e) => setReducedHours(Number(e.target.value))}
              className="w-full accent-cyan-400"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>{reducedHours} h/day</span>
              <span className="text-slate-500">
                Save ~{savedEnergy.toFixed(2)} kWh & {savedEmissions.toFixed(2)} kg/day
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

            <label className="mt-3 block text-[11px] font-medium text-slate-300">
              Electricity mix (CO₂ factor)
            </label>
            <select
              className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-100 outline-none focus:border-emerald-500"
              value={mixKey}
              onChange={(e) => setMixKey(e.target.value as ElectricityMixKey)}
            >
              {Object.entries(ELECTRICITY_MIXES).map(([key, v]) => (
                <option key={key} value={key}>
                  {v.label} ({v.emissionFactorKgPerKwh} kg/kWh)
                </option>
              ))}
            </select>

            <details className="rounded-lg border border-slate-800 bg-black/20 px-3 py-2">
              <summary className="cursor-pointer select-none text-[11px] font-medium text-slate-200">
                Assumptions & formulas
              </summary>
              <div className="mt-2 space-y-1 text-[11px] leading-relaxed text-slate-400">
                <p>
                  CO₂ = kWh × {emissionFactor} kg/kWh (selected electricity mix)
                </p>
                <p>Energy = (power watts × hours) / 1000</p>
                <p>
                  Power defaults to device “avg power usage” from the local hardware DB.
                </p>
              </div>
            </details>
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

              <div className="mt-2 grid gap-2 text-[11px]">
                <ScoreLine label="Emissions penalty" value={`${emissionsPenalty.toFixed(2)}`} />
                <ScoreLine label="Runtime penalty" value={`${runtimePenalty.toFixed(2)}`} />
                <ScoreLine
                  label="Hardware penalty"
                  value={`${hardwarePenalty.toFixed(2)}`}
                />
                <ScoreLine label="Raw score" value={`${scoreRaw.toFixed(1)}`} highlight />
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
              <p className="mt-1 text-[11px] text-emerald-100">{smartSuggestion}</p>
            </div>

            <div className="mt-2 rounded-lg border border-slate-800 bg-black/20 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                Sustainable IT checklist
              </p>
              <div className="mt-2 space-y-2">
                <CheckBox
                  label="Use sleep/hibernate & auto-timeouts"
                  checked={checks.sleep}
                  onChange={() => setChecks((c) => ({ ...c, sleep: !c.sleep }))}
                />
                <CheckBox
                  label="Enable efficient power plan"
                  checked={checks.powerPlan}
                  onChange={() =>
                    setChecks((c) => ({ ...c, powerPlan: !c.powerPlan }))
                  }
                />
                <CheckBox
                  label="Reduce background apps & idle"
                  checked={checks.background}
                  onChange={() =>
                    setChecks((c) => ({ ...c, background: !c.background }))
                  }
                />
                <CheckBox
                  label="Right-size workloads / avoid over-provisioning"
                  checked={checks.rightSize}
                  onChange={() =>
                    setChecks((c) => ({ ...c, rightSize: !c.rightSize }))
                  }
                />
                <CheckBox
                  label="Prefer SSDs over HDDs"
                  checked={checks.ssd}
                  onChange={() => setChecks((c) => ({ ...c, ssd: !c.ssd }))}
                />
                <CheckBox
                  label="Recycle or responsibly dispose e‑waste"
                  checked={checks.eWaste}
                  onChange={() =>
                    setChecks((c) => ({ ...c, eWaste: !c.eWaste }))
                  }
                />
                <CheckBox
                  label="Schedule heavy jobs in efficient windows"
                  checked={checks.workloadSchedule}
                  onChange={() =>
                    setChecks((c) => ({
                      ...c,
                      workloadSchedule: !c.workloadSchedule
                    }))
                  }
                />
              </div>
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

function CheckBox({
  label,
  checked,
  onChange
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-2 rounded-lg border border-slate-800/60 bg-slate-950/30 px-3 py-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="mt-0.5 h-4 w-4 accent-emerald-400"
      />
      <span className="text-[11px] leading-relaxed text-slate-200">{label}</span>
    </label>
  );
}

function Badge({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-800/80 bg-black/20 px-3 py-1 text-[10px] font-semibold tracking-[0.18em] text-slate-200">
      {text}
    </span>
  );
}

function ScoreLine({
  label,
  value,
  highlight
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-800/40 bg-black/10 px-3 py-2">
      <span className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
        {label}
      </span>
      <span
        className={`text-[12px] font-semibold ${
          highlight ? "text-emerald-300" : "text-slate-100"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function ProofItem({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="flex gap-3 rounded-xl border border-slate-800/40 bg-slate-950/30 px-3 py-2">
      <span className="mt-0.5 h-2 w-2 flex-none rounded-full bg-emerald-400" />
      <div>
        <p className="text-[11px] font-semibold text-slate-100">{title}</p>
        <p className="mt-0.5 text-[10px] leading-relaxed text-slate-400">
          {detail}
        </p>
      </div>
    </div>
  );
}

