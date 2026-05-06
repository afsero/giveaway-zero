import {
  Bot,
  ChevronsLeft,
  ChevronsRight,
  FlipHorizontal2,
  RotateCcw,
  Undo2,
} from "lucide-react";

const controls = [
  { label: "New Game", icon: RotateCcw, action: "newGame" },
  { label: "Bot Move", icon: Bot, action: "botMove" },
  { label: "Undo", icon: Undo2, action: "undo" },
  { label: "Previous", icon: ChevronsLeft, action: "previous" },
  { label: "Next", icon: ChevronsRight, action: "next" },
  { label: "Flip Board", icon: FlipHorizontal2, action: "flipBoard" },
];

type GameControlAction = (typeof controls)[number]["action"];

type GameControlsProps = {
  isLoading?: boolean;
  onNewGame?: () => void;
  onBotMove?: () => void;
};

function GameControls({
  isLoading = false,
  onNewGame,
  onBotMove,
}: GameControlsProps) {
  const handlers: Partial<Record<GameControlAction, () => void>> = {
    newGame: onNewGame,
    botMove: onBotMove,
  };

  return (
    <div className="rounded-lg border border-white/10 bg-panel/75 p-3 shadow-glow backdrop-blur">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
        {controls.map(({ label, icon: Icon, action }) => {
          const handler = handlers[action];
          const isActiveAction = action === "newGame" || action === "botMove";

          return (
            <button
              key={label}
              type="button"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.045] px-3 text-sm font-medium text-slate-200 transition hover:border-mint/35 hover:bg-mint/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={label}
              disabled={isLoading && isActiveAction}
              onClick={handler}
              title={label}
            >
              <Icon aria-hidden="true" size={17} />
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default GameControls;
