import AnalysisPanel from "./AnalysisPanel";
import ChessBoardPanel from "./ChessBoardPanel";
import GameControls from "./GameControls";
import ModelStatusCard from "./ModelStatusCard";

function BoardPage() {
  return (
    <section className="grid gap-6 py-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <div className="flex min-w-0 flex-col gap-4">
        <div className="rounded-lg border border-white/10 bg-panel/75 p-4 shadow-glow backdrop-blur">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-normal text-mint">
                Board
              </p>
              <h1 className="text-2xl font-semibold text-white">
                Giveaway Chess Analysis
              </h1>
            </div>
            <div className="rounded-md border border-ember/30 bg-ember/10 px-3 py-2 text-sm font-medium text-amber-200">
              White to move
            </div>
          </div>
          <ChessBoardPanel />
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
