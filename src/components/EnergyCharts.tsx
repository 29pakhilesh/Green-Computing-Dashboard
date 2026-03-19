import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

interface EnergyChartsProps {
  dailyEnergy: number;
  monthlyEnergy: number;
  dailyEmissions: number;
  monthlyEmissions: number;
}

const tooltipStyle = {
  backgroundColor: "#020617",
  borderRadius: 12,
  border: "1px solid #1e293b",
  fontSize: 11,
  padding: "6px 9px"
};

export default function EnergyCharts({
  dailyEnergy,
  monthlyEnergy,
  dailyEmissions,
  monthlyEmissions
}: EnergyChartsProps) {
  const energyData = [
    { label: "Day", kwh: Number(dailyEnergy.toFixed(2)) },
    { label: "Month", kwh: Number(monthlyEnergy.toFixed(2)) }
  ];

  const emissionsData = [
    { label: "Day", kg: Number(dailyEmissions.toFixed(2)) },
    { label: "Month", kg: Number(monthlyEmissions.toFixed(2)) }
  ];

  return (
    <div className="grid gap-3 grid-cols-1">
      <ChartCard title="Energy (kWh)">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={energyData}
            // With only 2 bars, reduce category gap so bars look thicker.
            barCategoryGap={12}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#1e293b"
            />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "#94a3b8" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "#64748b" }}
            />
            <Tooltip
              cursor={{ fill: "rgba(15,23,42,0.6)" }}
              contentStyle={tooltipStyle}
            />
            <Bar
              dataKey="kwh"
              radius={[999, 999, 0, 0]}
              barSize={54}
              fill="url(#energyGradient)"
            />
            <defs>
              <linearGradient id="energyGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#22c55e" stopOpacity={0.2} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="CO₂ (kg)">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={emissionsData} barCategoryGap={12}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#1e293b"
            />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "#94a3b8" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "#64748b" }}
            />
            <Tooltip
              cursor={{ fill: "rgba(15,23,42,0.6)" }}
              contentStyle={tooltipStyle}
            />
            <Bar
              dataKey="kg"
              radius={[999, 999, 0, 0]}
              barSize={54}
              fill="url(#emissionsGradient)"
            />
            <defs>
              <linearGradient id="emissionsGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.2} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
}

function ChartCard({ title, children }: ChartCardProps) {
  return (
    <div className="flex flex-col rounded-xl border border-slate-800/80 bg-slate-950/80 p-4">
      <h4 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
        {title}
      </h4>
      {/* Give Recharts a real height so `height="100%"` doesn't collapse */}
      <div className="mt-3 flex min-h-[190px] w-full flex-1">
        {children}
      </div>
    </div>
  );
}

