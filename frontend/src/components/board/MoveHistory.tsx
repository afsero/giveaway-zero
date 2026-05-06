import { moveHistory } from "../../data/mockGame";

function MoveHistory() {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-normal text-slate-400">
          Move History
        </h3>
        <span className="rounded-md border border-white/10 px-2 py-1 text-xs text-slate-500">
          4 plies
        </span>
      </div>
      <div className="overflow-hidden rounded-md border border-white/10">
        {moveHistory.map((record) => (
          <div
            key={record.turn}
            className="grid grid-cols-[2rem_1fr_1fr] gap-2 border-b border-white/10 bg-white/[0.025] px-3 py-3 last:border-b-0"
          >
            <span className="text-sm text-slate-500">{record.turn}.</span>
            <span className="text-sm font-medium text-slate-100">{record.white}</span>
            <span className="text-sm font-medium text-slate-300">
              {record.black ?? "..."}
            </span>
            <span className="col-span-3 pl-8 text-xs text-slate-500">
              {record.note}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default MoveHistory;
