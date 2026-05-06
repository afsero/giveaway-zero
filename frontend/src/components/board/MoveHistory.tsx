import type { SideToMove } from "../../lib/api";

export type LocalMoveEntry = {
  id: string;
  moveNumber: number;
  ply: number;
  side: SideToMove;
  actor: "user" | "bot";
  uci: string;
  san?: string | null;
  fenAfter: string;
};

type MoveHistoryProps = {
  entries?: LocalMoveEntry[];
  currentIndex?: number;
  onSelectIndex?: (historyIndex: number) => void;
};

type MoveCellData = {
  entry: LocalMoveEntry;
  historyIndex: number;
};

function MoveHistory({
  entries = [],
  currentIndex = entries.length,
  onSelectIndex,
}: MoveHistoryProps) {
  const groupedRecords = groupMoveEntries(entries);
  const currentMoveEntryIndex = currentIndex > 0 ? currentIndex - 1 : null;

  return (
    <section>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-normal text-slate-400">
          Move History
        </h3>
        <span className="rounded-md border border-white/10 px-2 py-1 text-xs text-slate-500">
          {entries.length} plies
        </span>
      </div>

      {entries.length === 0 ? (
        <div className="rounded-md border border-dashed border-white/15 bg-white/[0.025] px-3 py-5 text-center text-sm text-slate-500">
          Moves will appear here after a game session starts.
        </div>
      ) : null}

      {groupedRecords.length > 0 ? (
        <div className="overflow-hidden rounded-md border border-white/10 bg-slate-950/20">
          <button
            type="button"
            aria-label="Preview start position"
            className={`flex w-full items-center justify-between gap-3 border-b border-white/10 px-3 py-2 text-left text-sm transition ${
              currentIndex === 0
                ? "bg-mint/[0.12] text-mint ring-1 ring-inset ring-mint/35"
                : "text-slate-400 hover:bg-white/[0.045] hover:text-slate-200"
            }`}
            onClick={() => onSelectIndex?.(0)}
          >
            <span className="font-semibold">Start</span>
            <span className="text-xs opacity-70">Initial board</span>
          </button>

          {groupedRecords.map((record) => (
            <div
              key={record.moveNumber}
              className="grid grid-cols-[2.25rem_minmax(0,1fr)_minmax(0,1fr)] items-center border-b border-white/10 last:border-b-0"
            >
              <span className="px-3 py-2 text-xs font-semibold text-slate-600">
                {record.moveNumber}
              </span>
              <MoveCell
                data={record.white}
                isCurrent={record.white?.historyIndex === currentMoveEntryIndex}
                side="white"
                onSelectIndex={onSelectIndex}
              />
              <MoveCell
                data={record.black}
                isCurrent={record.black?.historyIndex === currentMoveEntryIndex}
                side="black"
                onSelectIndex={onSelectIndex}
              />
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}

type MoveCellProps = {
  data?: MoveCellData;
  isCurrent: boolean;
  side: "white" | "black";
  onSelectIndex?: (historyIndex: number) => void;
};

function MoveCell({ data, isCurrent, side, onSelectIndex }: MoveCellProps) {
  if (!data) {
    return <span className="px-2 py-2 text-sm text-slate-700">...</span>;
  }

  const label = data.entry.san || data.entry.uci;
  const actorLabel = data.entry.actor === "user" ? "You" : "Bot";
  const actorClass =
    data.entry.actor === "user"
      ? "border-mint/25 bg-mint/10 text-mint"
      : "border-ember/25 bg-ember/10 text-amber-200";

  return (
    <button
      type="button"
      aria-label={`Preview ${side} move ${label}`}
      title={`Ply ${data.entry.ply}: ${data.entry.uci}`}
      className={`min-w-0 px-2 py-2 text-left text-sm font-medium transition ${
        isCurrent
          ? "bg-mint/[0.12] text-mint ring-1 ring-inset ring-mint/35"
          : side === "white"
            ? "text-slate-200 hover:bg-white/[0.045]"
            : "text-slate-400 hover:bg-white/[0.045]"
      }`}
      onClick={() => onSelectIndex?.(data.historyIndex + 1)}
    >
      <span className="flex min-w-0 items-center gap-2">
        <span className="truncate">{label}</span>
        <span
          className={`shrink-0 rounded border px-1.5 py-0.5 text-[0.65rem] font-semibold uppercase leading-none ${actorClass}`}
        >
          {actorLabel}
        </span>
      </span>
      <span className="block truncate text-xs font-normal opacity-60">
        ply {data.entry.ply} / {data.entry.uci}
      </span>
    </button>
  );
}

function groupMoveEntries(entries: LocalMoveEntry[]) {
  const grouped = new Map<
    number,
    {
      moveNumber: number;
      white?: MoveCellData;
      black?: MoveCellData;
    }
  >();

  entries.forEach((entry, index) => {
    const record = grouped.get(entry.moveNumber) ?? {
      moveNumber: entry.moveNumber,
    };
    record[entry.side] = {
      entry,
      historyIndex: index,
    };
    grouped.set(entry.moveNumber, record);
  });

  return [...grouped.values()].sort((a, b) => a.moveNumber - b.moveNumber);
}

export default MoveHistory;
