import CandidateMoves from "./CandidateMoves";
import MoveHistory from "./MoveHistory";
import type { LocalMoveEntry } from "./MoveHistory";
import type { CandidateMove } from "../../data/mockGame";

type AnalysisPanelProps = {
  candidateMoves?: CandidateMove[];
  moveHistory?: LocalMoveEntry[];
  historyIndex?: number;
  onSelectHistoryIndex?: (historyIndex: number) => void;
  botMessage?: string | null;
};

function AnalysisPanel({
  candidateMoves,
  moveHistory,
  historyIndex,
  onSelectHistoryIndex,
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
          Bot choices, candidate lines, and legal move feedback come from the
          FastAPI backend.
        </p>
      </div>
      {botMessage ? (
        <div className="mb-4 rounded-md border border-mint/20 bg-mint/10 px-3 py-2 text-sm text-mint">
          {botMessage}
        </div>
      ) : null}
      <div className="grid gap-4">
        <CandidateMoves moves={candidateMoves} />
        <MoveHistory
          entries={moveHistory}
          currentIndex={historyIndex}
          onSelectIndex={onSelectHistoryIndex}
        />
      </div>
    </div>
  );
}

export default AnalysisPanel;
