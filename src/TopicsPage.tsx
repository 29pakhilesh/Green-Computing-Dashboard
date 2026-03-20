import { motion } from "framer-motion";

function TopicsPage() {
  return (
    <div className="min-h-screen bg-black text-slate-50">
      <header className="border-b border-slate-800/80 bg-black/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 md:px-6">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-emerald-400 via-lime-300 to-cyan-300 shadow-lg shadow-emerald-500/40" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-400">
                Green computing
              </p>
              <p className="text-sm font-medium text-slate-100">
                Concepts & future scope
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              // If the page was opened from the dashboard via `window.open`,
              // return focus to the opener tab and close this tab.
              try {
                if (window.opener) {
                  window.opener.focus();
                }
              } catch {
                // Ignore cross-origin/focus errors.
              }
              window.close();
            }}
            className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-[10px] text-slate-300 hover:border-emerald-500/70 hover:text-emerald-200 sm:text-[11px] md:inline-flex"
            aria-label="Back to dashboard (closes this tab)"
          >
            Dashboard
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-20 pt-6 md:px-6 md:pt-10">
        <motion.section
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="mb-8 grid gap-6 rounded-3xl border border-slate-800 bg-slate-950/60 p-6 shadow-[0_0_40px_rgba(16,185,129,0.25)] md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]"
        >
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-50 md:text-4xl">
              Green Computing & Sustainable IT
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-slate-300 md:text-base">
              Green computing is about designing, using, and disposing of computer
              systems in a way that minimizes their environmental impact while
              still delivering the performance people need. It covers hardware,
              software, data centers, networks, and the decisions engineers make
              every day.
            </p>
          </div>
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-emerald-500/25 via-cyan-500/10 to-transparent blur-3xl" />
            <div className="relative flex h-44 w-full max-w-sm items-center justify-center rounded-3xl border border-emerald-500/40 bg-black/60 p-5">
              <div className="grid grid-cols-2 gap-4 text-xs text-slate-200">
                <IconTile label="Less power" />
                <IconTile label="Less e‑waste" />
                <IconTile label="Smart data centers" />
                <IconTile label="Greener software" />
              </div>
            </div>
          </div>
        </motion.section>

        <div className="mt-4 flex gap-3 overflow-x-auto pb-3 text-xs text-slate-200">
          <QuickNav label="What is green computing?" targetId="topic-what" />
          <QuickNav label="Problems" targetId="topic-problems" />
          <QuickNav label="Efficient hardware" targetId="topic-hardware" />
          <QuickNav label="Green software" targetId="topic-software" />
          <QuickNav label="Cloud & virtualization" targetId="topic-cloud" />
          <QuickNav label="Data centers" targetId="topic-dc" />
          <QuickNav label="E‑waste" targetId="topic-ewaste" />
          <QuickNav label="Engineer role" targetId="topic-role" />
          <QuickNav label="Advantages" targetId="topic-advantages" />
          <QuickNav label="Challenges" targetId="topic-challenges" />
          <QuickNav label="Future scope" targetId="topic-future" />
        </div>

        <div className="mt-4 grid gap-8 md:grid-cols-1">
          <TopicCard
            id="topic-what"
            title="What is green computing?"
            subtitle="Environmentally responsible use of computers"
            points={[
              "Reduces power consumption across devices and infrastructure.",
              "Minimizes electronic waste (e‑waste) through reuse and recycling.",
              "Promotes sustainable IT practices from design to disposal."
            ]}
            footer="In short: green computing focuses on reducing the environmental impact of IT systems over their entire life cycle."
          />

          <TopicCard
            id="topic-problems"
            title="Problems with traditional computing"
            subtitle="Why we need sustainable IT"
            points={[
              "High power consumption from inefficient hardware and always‑on systems.",
              "Significant heat generation → heavy cooling requirements in data centers.",
              "Short hardware life cycles lead to frequent upgrades and more waste.",
              "Toxic e‑waste (lead, mercury, plastics) harms soil and water.",
              "Overall increase in carbon emissions from manufacturing and energy use."
            ]}
          />

          <TopicCard
            id="topic-hardware"
            title="Energy‑efficient hardware"
            subtitle="Using the right components"
            points={[
              "Low‑power processors and SoCs that deliver more performance per watt.",
              "Solid State Drives (SSDs) instead of spinning Hard Disk Drives (HDDs).",
              "Energy‑rated devices (e.g., ENERGY STAR) that meet efficiency standards.",
              "Efficient cooling systems and airflow design to reduce fan power."
            ]}
            footer="Result: less electricity used and less heat generated for the same work."
          />

          <TopicCard
            id="topic-software"
            title="Green software"
            subtitle="Efficient code = energy saving"
            points={[
              "Optimized algorithms that finish work in fewer CPU cycles.",
              "Reducing CPU usage by avoiding busy‑waiting and unnecessary polling.",
              "Minimizing background processes and network calls.",
              "Efficient memory management to lower disk swapping and cache misses."
            ]}
            footer="When millions of users run an app, small code optimizations can translate into huge energy savings."
          />

          <TopicCard
            id="topic-cloud"
            title="Virtualization & cloud computing"
            subtitle="Doing more with fewer servers"
            points={[
              "Multiple virtual machines or containers run on a single physical server.",
              "Reduces the number of physical servers needed for the same workload.",
              "Improves resource utilization by sharing CPU, memory, and storage."
            ]}
            footer="Benefits: power savings, less hardware to manufacture, and reduced cooling needs in data centers."
          />

          <TopicCard
            id="topic-dc"
            title="Green data centers"
            subtitle="Making large‑scale infrastructure sustainable"
            points={[
              "Smart cooling systems (free‑air cooling, liquid cooling, hot/cold aisles).",
              "Use of renewable energy sources such as solar and wind where possible.",
              "AI‑based monitoring to tune power usage in real time.",
              "Hot and cold aisle containment to keep cooling efficient."
            ]}
            footer="Data centers are among the biggest power consumers, so improvements here have a massive impact."
          />

          <TopicCard
            id="topic-ewaste"
            title="E‑waste management"
            subtitle="Handling old hardware responsibly"
            points={[
              "Recycling old hardware instead of sending it to landfills.",
              "Reusing components or donating working devices where possible.",
              "Safe disposal of toxic materials to protect soil and water.",
              "Following certified e‑waste recycling programs and local regulations."
            ]}
          />

          <TopicCard
            id="topic-role"
            title="Role of a computer engineer"
            subtitle="Professional responsibility in green IT"
            points={[
              "Write energy‑efficient, well‑optimized code.",
              "Design systems and architectures that avoid over‑provisioning.",
              "Select sustainable, energy‑rated hardware and cloud options.",
              "Support and advocate for green IT policies in organizations."
            ]}
            footer="Green computing is not just a topic—it is part of ethical and professional responsibility for engineers."
          />
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-[1.2fr,1fr]">
          <TopicCard
            id="topic-advantages"
            title="Advantages of green computing"
            subtitle="Why organizations care"
            points={[
              "Reduced power consumption, especially in data centers.",
              "Lower carbon footprint and progress towards sustainability goals.",
              "Cost savings over the long term on electricity and cooling.",
              "Better corporate image and compliance with environmental regulations."
            ]}
          />
          <TopicCard
            id="topic-challenges"
            title="Challenges and trade‑offs"
            subtitle="Why it is not always easy"
            points={[
              "High initial investment in efficient hardware and retrofitting old systems.",
              "Lack of awareness or training about green IT best practices.",
              "Performance vs. energy trade‑offs when tuning systems."
            ]}
          />
        </div>

        <div className="mt-10">
          <TopicCard
            id="topic-future"
            title="Future scope"
            subtitle="Where green computing is heading"
            points={[
              "AI‑based energy optimization for workloads, networks, and cooling.",
              "Carbon‑aware computing that schedules work when grids are cleaner.",
              "Data centers powered entirely by renewable energy.",
              "Green coding standards and tools that measure the energy footprint of software."
            ]}
          />
        </div>
      </main>
    </div>
  );
}

interface TopicCardProps {
  id: string;
  title: string;
  subtitle: string;
  points: string[];
  footer?: string;
}

function TopicCard({ id, title, subtitle, points, footer }: TopicCardProps) {
  return (
    <motion.section
      id={id}
      initial={{ y: 14, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/70 p-5 shadow-[0_0_25px_rgba(15,23,42,0.9)]"
    >
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -left-16 -top-20 h-40 w-40 rounded-full bg-emerald-500/12 blur-3xl" />
        <div className="absolute -right-10 bottom-[-40px] h-32 w-32 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>
      <div className="relative flex items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-2xl border border-emerald-500/40 bg-black/60 text-xs text-emerald-300">
          <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-tr from-emerald-400 to-lime-300 shadow-[0_0_10px_rgba(34,197,94,0.9)]" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-100 md:text-lg">
            {title}
          </h2>
          <p className="mt-1 text-xs text-emerald-300 md:text-sm">{subtitle}</p>
          <ul className="mt-4 space-y-2 text-xs leading-relaxed text-slate-200 md:text-sm">
            {points.map((p) => (
              <li key={p} className="flex gap-2">
                <span className="mt-[3px] h-1 w-1 rounded-full bg-emerald-400" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
          {footer && (
            <p className="mt-4 text-xs text-slate-400 md:text-sm">
              {footer}
            </p>
          )}
        </div>
      </div>
    </motion.section>
  );
}

function IconTile({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-start gap-1 rounded-2xl border border-emerald-500/40 bg-black/70 px-3 py-2.5">
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-400 to-cyan-300 text-[10px] text-slate-950">
        ⚡
      </span>
      <span className="text-[11px] text-slate-200">{label}</span>
    </div>
  );
}

function QuickNav({ label, targetId }: { label: string; targetId: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }}
      className="whitespace-nowrap rounded-full border border-slate-700 bg-slate-950/60 px-3 py-1.5 text-[11px] text-slate-200 hover:border-emerald-500/70 hover:text-emerald-200"
    >
      {label}
    </button>
  );
}

export default TopicsPage;

