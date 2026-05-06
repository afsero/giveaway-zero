import CandidateMoves from "./CandidateMoves";
import MoveHistory from "./MoveHistory";

function AnalysisPanel() {
  return (
    <div className="rounded-lg border border-white/10 bg-panel/75 p-4 shadow-glow backdrop-blur sm:p-5">
      <div className="mb-4">
        <p className="text-sm font-medium uppercase tracking-normal text-mint">
          Analysis
        </p>
        <h2 className="text-xl font-semibold text-white">Mock bot output</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Candidate lines and history are static until the backend and model
          services are introduced.
        </p>
      </div>
      <div className="grid gap-4">
        <CandidateMoves />
        <MoveHistory />
      </div>
    </div>
  );
}

export default AnalysisPanel;
