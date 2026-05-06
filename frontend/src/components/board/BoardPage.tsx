import { useState } from "react";
import { Clock3 } from "lucide-react";
import { mockBoardState } from "../../data/mockGame";
import AnalysisPanel from "./AnalysisPanel";
import ChessBoardPanel from "./ChessBoardPanel";
import GameControls from "./GameControls";
import ModelStatusCard from "./ModelStatusCard";

function BoardPage() {
  const [mockMoveNote, setMockMoveNote] = useState(
    "Waiting for future backend move handling",
  );

  return (
    <section className="grid gap-5 py-5 lg:py-7 xl:grid-cols-[minmax(0,1fr)_25rem]">
      <div className="flex min-w-0 flex-col gap-4">
        <div className="rounded-lg border border-white/10 bg-panel/75 p-4 shadow-glow backdrop-blur sm:p-5 lg:p-6">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-normal text-mint">
                {mockBoardState.phase}
              </p>
              <h1 className="mt-1 text-2xl font-semibold text-white sm:text-3xl">
                Giveaway Chess Analysis
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                A real chessboard surface with mock state, ready for FEN,
                orientation, legal move hints, and backend move submission.
              </p>
            </div>
            <div className="grid gap-2 text-sm sm:min-w-44">
              <div className="rounded-md border border-ember/30 bg-ember/10 px-3 py-2 font-medium text-amber-200">
                {mockBoardState.status}
              </div>
              <div className="flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.035] px-3 py-2 text-slate-400">
                <Clock3 aria-hidden="true" size={15} className="text-mint" />
                Ply {mockBoardState.ply} / {mockBoardState.totalPlies}
              </div>
            </div>
          </div>
          <ChessBoardPanel
            fen={mockBoardState.fen}
            orientation={mockBoardState.orientation}
            legalMoves={mockBoardState.legalMoves}
            selectedSquare={mockBoardState.selectedSquare}
            lastMove={mockBoardState.lastMove}
            arrows={mockBoardState.candidateArrows}
            onMove={({ sourceSquare, targetSquare }) => {
              setMockMoveNote(
                `${sourceSquare}-${targetSquare} captured for future API handoff`,
              );
            }}
          />
        </div>
        <div className="rounded-lg border border-white/10 bg-panel/70 px-4 py-3 text-sm text-slate-400">
          <span className="font-medium text-slate-200">Mock interaction:</span>{" "}
          {mockMoveNote}
        </div>
        <GameControls />
      </div>

      <aside className="grid min-w-0 gap-4 xl:content-start">
        <ModelStatusCard />
        <AnalysisPanel />
      </aside>
    </section>
  );
}

export default BoardPage;
