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
] as const;

type GameControlAction = (typeof controls)[number]["action"];

type GameControlsProps = {
  isLoading?: boolean;
  canUndo?: boolean;
  canPrevious?: boolean;
  canNext?: boolean;
  canBotMove?: boolean;
  onNewGame?: () => void;
  onBotMove?: () => void;
  onUndo?: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  onFlipBoard?: () => void;
};

function GameControls({
  isLoading = false,
  canUndo = false,
  canPrevious = false,
  canNext = false,
  canBotMove = false,
  onNewGame,
  onBotMove,
  onUndo,
  onPrevious,
  onNext,
  onFlipBoard,
}: GameControlsProps) {
  const handlers: Partial<Record<GameControlAction, () => void>> = {
    newGame: onNewGame,
    botMove: onBotMove,
    undo: onUndo,
    previous: onPrevious,
    next: onNext,
    flipBoard: onFlipBoard,
  };

  const enabled: Record<GameControlAction, boolean> = {
    newGame: !isLoading,
    botMove: canBotMove && !isLoading,
    undo: canUndo && !isLoading,
    previous: canPrevious && !isLoading,
    next: canNext && !isLoading,
    flipBoard: !isLoading,
  };

  return (
    <div className="rounded-lg border border-white/10 bg-panel/75 p-3 shadow-glow backdrop-blur">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
        {controls.map(({ label, icon: Icon, action }) => {
          const handler = handlers[action];

          return (
            <button
              key={label}
              type="button"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.045] px-3 text-sm font-medium text-slate-200 transition hover:border-mint/35 hover:bg-mint/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={label}
              disabled={!enabled[action]}
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
