import { Activity, Bot, Database, Gauge } from "lucide-react";
import { modelStatus } from "../../data/mockGame";

function ModelStatusCard() {
  const rows = [
    { label: "Stage", value: modelStatus.stage, icon: Activity },
    { label: "Dataset", value: modelStatus.dataset, icon: Database },
    { label: "Policy accuracy", value: modelStatus.policyAccuracy, icon: Gauge },
    { label: "Legal move rate", value: modelStatus.legalMoveRate, icon: Gauge },
  ];

  return (
    <section className="rounded-lg border border-white/10 bg-panel/75 p-4 shadow-glow backdrop-blur">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-md border border-mint/30 bg-mint/10 text-mint">
          <Bot aria-hidden="true" size={20} />
        </span>
        <div>
          <p className="text-sm font-medium uppercase tracking-normal text-slate-500">
            Bot Status
          </p>
          <h2 className="text-lg font-semibold text-white">{modelStatus.name}</h2>
        </div>
      </div>

      <div className="mb-4 rounded-md border border-ember/25 bg-ember/10 px-3 py-2 text-sm font-medium text-amber-200">
        {modelStatus.mode}
      </div>

      <div className="grid gap-2">
        {rows.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="flex items-center justify-between gap-3 rounded-md border border-white/10 bg-white/[0.035] px-3 py-3"
          >
            <span className="flex items-center gap-2 text-sm text-slate-500">
              <Icon aria-hidden="true" size={15} />
              {label}
            </span>
            <span className="text-right text-sm font-medium text-slate-100">
              {value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ModelStatusCard;
