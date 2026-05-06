import { LineChart } from "lucide-react";
import { candidateMoves } from "../../data/mockGame";
import type { CandidateMove } from "../../data/mockGame";

type CandidateMovesProps = {
  moves?: CandidateMove[];
};

function CandidateMoves({ moves = candidateMoves }: CandidateMovesProps) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-normal text-slate-400">
          Candidate Moves
        </h3>
        <LineChart aria-hidden="true" size={17} className="text-ember" />
      </div>

      {moves.length === 0 ? (
        <div className="rounded-md border border-dashed border-white/15 bg-white/[0.025] px-3 py-5 text-center text-sm text-slate-500">
          Candidate moves will appear here when a model endpoint is connected.
        </div>
      ) : null}

      {moves.length > 0 ? (
        <div className="grid gap-2">
          {moves.map((candidate, index) => (
            <article
              key={candidate.move}
              className="rounded-md border border-white/10 bg-white/[0.035] p-3 transition hover:border-mint/25 hover:bg-white/[0.055]"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-slate-950/50 px-1.5 py-0.5 text-xs font-semibold text-slate-500">
                      #{index + 1}
                    </span>
                    <span className="font-semibold text-white">
                      {candidate.move}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{candidate.tag}</p>
                </div>
                <span className="rounded-md bg-mint/10 px-2 py-1 text-xs font-semibold text-mint">
                  {candidate.confidence}%
                </span>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-950/70">
                <div
                  className="h-full rounded-full bg-mint"
                  style={{ width: `${candidate.confidence}%` }}
                />
              </div>
              <p className="mt-3 truncate font-mono text-xs text-slate-400">
                {candidate.line}
              </p>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}

export default CandidateMoves;
