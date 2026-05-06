import { Sparkles } from "lucide-react";
import { candidateMoves } from "../../data/mockGame";

function CandidateMoves() {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-normal text-slate-400">
          Candidate Moves
        </h3>
        <Sparkles aria-hidden="true" size={17} className="text-ember" />
      </div>
      <div className="grid gap-2">
        {candidateMoves.map((candidate) => (
          <article
            key={candidate.move}
            className="rounded-md border border-white/10 bg-white/[0.035] p-3"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="font-semibold text-white">{candidate.move}</span>
              <span className="rounded-md bg-mint/10 px-2 py-1 text-xs font-semibold text-mint">
                {candidate.score}
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-400">{candidate.line}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default CandidateMoves;
