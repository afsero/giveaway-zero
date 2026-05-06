import { ArrowRight, FlaskConical } from "lucide-react";
import { pipelineSteps } from "../../data/mockGame";

function PipelinePreview() {
  return (
    <section className="rounded-lg border border-white/10 bg-panel/75 p-5 shadow-glow backdrop-blur">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-md border border-ember/30 bg-ember/10 text-ember">
          <FlaskConical aria-hidden="true" size={20} />
        </span>
        <div>
          <p className="text-sm font-medium uppercase tracking-normal text-slate-500">
            AI Pipeline
          </p>
          <h2 className="text-xl font-semibold text-white">
            From game data to stronger play
          </h2>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-4">
        {pipelineSteps.map((step, index) => (
          <div
            key={step.label}
            className="relative rounded-md border border-white/10 bg-white/[0.035] p-4"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="text-xs font-semibold uppercase tracking-normal text-mint">
                Step {index + 1}
              </span>
              {index < pipelineSteps.length - 1 ? (
                <ArrowRight
                  aria-hidden="true"
                  className="hidden text-slate-600 lg:block"
                  size={17}
                />
              ) : null}
            </div>
            <h3 className="text-sm font-semibold text-white">{step.label}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              {step.detail}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default PipelinePreview;
