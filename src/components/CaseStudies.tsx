import { motion } from "framer-motion";

const cards = [
  {
    id: "google",
    title: "Google data centers",
    highlight: "90% carbon-free energy on an hourly basis in some regions.",
    body: "Google shifts workloads across regions and time to follow clean energy availability, while using advanced cooling and custom chips to cut electricity waste.",
    action: "Consider running batch jobs when local grids are cleanest."
  },
  {
    id: "aws",
    title: "AWS sustainability",
    highlight:
      "AWS targets 100% renewable energy and highly utilized fleets of servers.",
    body: "Right-sized instances and serverless functions avoid idle capacity. Customers that move from on‑prem to AWS typically reduce compute emissions.",
    action: "Consolidate workloads to fewer, well-utilized machines."
  },
  {
    id: "edge",
    title: "Edge-efficient workloads",
    highlight: "Sending less data is often greener than compressing more.",
    body: "Caching and running logic closer to users can reduce backbone traffic and energy use in the network.",
    action: "Use CDNs and edge compute to serve static assets efficiently."
  }
];

export function CaseStudies() {
  return (
    <section id="cases" className="scroll-mt-24 mt-12">
      <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-100">
            Case studies in sustainable compute
          </h2>
          <p className="mt-1 text-[11px] text-slate-400">
            Learn from hyperscalers and apply the same principles to your own
            workloads.
          </p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card, index) => (
          <motion.article
            key={card.id}
            initial={{ y: 10, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.25, delay: index * 0.05 }}
            className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/70 p-4"
          >
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
              <div className="absolute -left-10 -top-10 h-24 w-24 rounded-full bg-emerald-500/15 blur-2xl" />
            </div>
            <h3 className="text-xs font-semibold text-slate-100">
              {card.title}
            </h3>
            <p className="mt-2 text-[11px] text-emerald-300">
              {card.highlight}
            </p>
            <p className="mt-2 text-[11px] leading-relaxed text-slate-300">
              {card.body}
            </p>
            <p className="mt-3 text-[11px] font-medium text-slate-100">
              Try this:
            </p>
            <p className="text-[11px] text-slate-300">{card.action}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

