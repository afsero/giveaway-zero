import {
  ChevronsLeft,
  ChevronsRight,
  FlipHorizontal2,
  RotateCcw,
  Undo2,
} from "lucide-react";

const controls = [
  { label: "New Game", icon: RotateCcw },
  { label: "Undo", icon: Undo2 },
  { label: "Previous", icon: ChevronsLeft },
  { label: "Next", icon: ChevronsRight },
  { label: "Flip Board", icon: FlipHorizontal2 },
];

function GameControls() {
  return (
    <div className="rounded-lg border border-white/10 bg-panel/75 p-3 shadow-glow backdrop-blur">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {controls.map(({ label, icon: Icon }) => (
          <button
            key={label}
            type="button"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.045] px-3 text-sm font-medium text-slate-200 transition hover:border-mint/35 hover:bg-mint/10 hover:text-white first:col-span-2 sm:first:col-span-1"
            aria-label={label}
            title={label}
          >
            <Icon aria-hidden="true" size={17} />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default GameControls;
