import { ArrowRight, Bot, Database, ShieldCheck } from "lucide-react";

type HeroSectionProps = {
  onLaunch: () => void;
};

function HeroSection({ onLaunch }: HeroSectionProps) {
  return (
    <section className="grid items-center gap-10 py-10 lg:grid-cols-[1.04fr_0.96fr] lg:py-16">
      <div className="max-w-3xl">
        <div className="mb-6 inline-flex items-center gap-2 rounded-md border border-mint/25 bg-mint/10 px-3 py-1.5 text-sm font-medium text-mint">
          <ShieldCheck aria-hidden="true" size={16} />
          Mock-only frontend scaffold
        </div>
        <h1 className="max-w-3xl text-5xl font-semibold leading-tight text-white sm:text-6xl">
          GiveawayZero
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
          AI-powered Giveaway Chess engine trained on Lichess Antichess data.
        </p>
        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400">
          A clean analysis-board style interface for a capture-mandatory chess
          variant, built to grow from simple bots into model evaluation and
          self-play research.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onLaunch}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-mint px-5 text-sm font-semibold text-slate-950 shadow-glow transition hover:bg-teal-300"
          >
            Launch Board
            <ArrowRight aria-hidden="true" size={18} />
          </button>
          <div className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-5 text-sm font-medium text-slate-300">
            <Database aria-hidden="true" size={18} className="text-ember" />
            Lichess Antichess pipeline planned
          </div>
        </div>
        <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
          {["Board-first UI", "Mock engine data", "Backend-ready shape"].map(
            (item) => (
              <div
                key={item}
                className="rounded-md border border-white/10 bg-white/[0.035] px-3 py-2 text-sm font-medium text-slate-300"
              >
                {item}
              </div>
            ),
          )}
        </div>
      </div>

      <div className="relative overflow-hidden rounded-lg border border-white/10 bg-panel/80 p-5 shadow-glow sm:p-6">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-normal text-slate-500">
              Engine Console
            </p>
            <h2 className="mt-1 text-xl font-semibold text-white">
              Research-ready board loop
            </h2>
          </div>
          <span className="flex h-11 w-11 items-center justify-center rounded-md border border-ember/30 bg-ember/10 text-ember">
            <Bot aria-hidden="true" size={22} />
          </span>
        </div>

        <div className="mt-5 grid gap-3">
          {[
            ["Variant", "Giveaway / Antichess"],
            ["Rules source", "Backend authority later"],
            ["Current bot", "Mock policy preview"],
            ["Board mode", "Analysis navigation"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex items-center justify-between gap-4 rounded-md border border-white/10 bg-white/[0.035] px-4 py-3"
            >
              <span className="text-sm text-slate-500">{label}</span>
              <span className="text-right text-sm font-medium text-slate-100">
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
