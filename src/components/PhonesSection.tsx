import { motion } from "framer-motion";
import { HARDWARE_DB } from "../data/hardware";

export function PhonesSection() {
  const phones = HARDWARE_DB.filter((d) => d.category === "phone");

  return (
    <section
      id="phones"
      className="scroll-mt-24 mt-10 rounded-2xl border border-slate-800 bg-slate-950/70 p-4"
    >
      <div className="mb-3 flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-100">
            Mobile devices & phones
          </h2>
          <p className="mt-1 text-[11px] text-slate-400">
            Phones are extremely efficient per hour, but constant streaming and gaming still consume energy.
          </p>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {phones.map((phone, index) => (
          <motion.article
            key={phone.id}
            initial={{ y: 8, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.25, delay: index * 0.03 }}
            className="rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-xs"
          >
            <p className="text-[11px] font-semibold text-slate-100">
              {phone.name}
            </p>
            <p className="mt-0.5 text-[10px] text-slate-400">
              {phone.manufacturer} · {phone.year}
            </p>
            <dl className="mt-2 space-y-1.5">
              <Row label="Avg power" value={`${phone.avgPowerWatts} W`} />
              <Row
                label="CO₂ per hour"
                value={`${phone.co2PerHourKg.toFixed(3)} kg`}
              />
              <Row
                label="Efficiency"
                value={`${phone.efficiencyScore}/100`}
                highlight={phone.efficiencyScore >= 95}
              />
            </dl>
          </motion.article>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-slate-400">
        For greener mobile usage, favor Wi‑Fi over cellular, lower screen brightness, and download media instead of streaming repeatedly.
      </p>
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

