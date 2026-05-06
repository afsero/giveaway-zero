import { moveHistory } from "../../data/mockGame";
import type { MoveRecord } from "../../data/mockGame";

type MoveHistoryProps = {
  records?: MoveRecord[];
};

function MoveHistory({ records = moveHistory }: MoveHistoryProps) {
  const totalPlies = records.reduce(
    (count, record) => count + 1 + (record.black ? 1 : 0),
    0,
  );

  return (
    <section>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-normal text-slate-400">
          Move History
        </h3>
        <span className="rounded-md border border-white/10 px-2 py-1 text-xs text-slate-500">
          {totalPlies} plies
        </span>
      </div>

      {records.length === 0 ? (
        <div className="rounded-md border border-dashed border-white/15 bg-white/[0.025] px-3 py-5 text-center text-sm text-slate-500">
          Moves will appear here after a game session starts.
        </div>
      ) : null}

      {records.length > 0 ? (
        <div className="overflow-hidden rounded-md border border-white/10 bg-slate-950/20">
          {records.map((record) => (
            <div
              key={record.turn}
              className="grid grid-cols-[2.25rem_minmax(0,1fr)_minmax(0,1fr)] items-center border-b border-white/10 last:border-b-0"
            >
              <span className="px-3 py-2 text-xs font-semibold text-slate-600">
                {record.turn}
              </span>
              <MoveCell
                move={record.white}
                note={record.note}
                isCurrent={record.current === "white"}
                side="white"
              />
              <MoveCell
                move={record.black}
                note={record.note}
                isCurrent={record.current === "black"}
                side="black"
              />
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}

type MoveCellProps = {
  move?: string;
  note: string;
  isCurrent: boolean;
  side: "white" | "black";
};

function MoveCell({ move, note, isCurrent, side }: MoveCellProps) {
  if (!move) {
    return <span className="px-2 py-2 text-sm text-slate-700">...</span>;
  }

  return (
    <button
      type="button"
      aria-label={`Preview ${side} move ${move}`}
      title={note}
      className={`min-w-0 px-2 py-2 text-left text-sm font-medium transition ${
        isCurrent
          ? "bg-mint/[0.12] text-mint"
          : side === "white"
            ? "text-slate-200 hover:bg-white/[0.045]"
            : "text-slate-400 hover:bg-white/[0.045]"
      }`}
    >
      <span className="block truncate">{move}</span>
    </button>
  );
}

export default MoveHistory;
