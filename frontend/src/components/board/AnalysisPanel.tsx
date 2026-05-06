import CandidateMoves from "./CandidateMoves";
import MoveHistory from "./MoveHistory";
import type { CandidateMove, MoveRecord } from "../../data/mockGame";

type AnalysisPanelProps = {
  candidateMoves?: CandidateMove[];
  moveHistory?: MoveRecord[];
  botMessage?: string | null;
};

function AnalysisPanel({
  candidateMoves,
  moveHistory,
  botMessage,
}: AnalysisPanelProps) {
  return (
    <div className="rounded-lg border border-white/10 bg-panel/75 p-4 shadow-glow backdrop-blur sm:p-5">
      <div className="mb-4">
        <p className="text-sm font-medium uppercase tracking-normal text-mint">
          Analysis
        </p>
        <h2 className="text-xl font-semibold text-white">Backend bot output</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Placeholder responses come from the FastAPI API until real rules and
          model services are introduced.
        </p>
      </div>
      {botMessage ? (
        <div className="mb-4 rounded-md border border-mint/20 bg-mint/10 px-3 py-2 text-sm text-mint">
          {botMessage}
        </div>
      ) : null}
      <div className="grid gap-4">
        <CandidateMoves moves={candidateMoves} />
        <MoveHistory records={moveHistory} />
      </div>
    </div>
  );
}

export default AnalysisPanel;
