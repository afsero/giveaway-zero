import { Chessboard } from "react-chessboard";
import type {
  Arrow,
  ChessboardOptions,
  PieceDropHandlerArgs,
} from "react-chessboard";
import { mockBoardState } from "../../data/mockGame";
import type { BoardOrientation, LegalMoveMap } from "../../data/mockGame";

type BoardMove = {
  sourceSquare: string;
  targetSquare: string;
  piece: string;
};

export type ChessBoardPanelProps = {
  fen?: string;
  orientation?: BoardOrientation;
  legalMoves?: LegalMoveMap;
  selectedSquare?: string | null;
  lastMove?: {
    from: string;
    to: string;
    san: string;
  } | null;
  arrows?: Arrow[];
  onMove?: (move: BoardMove) => void;
};

const lastMoveStyle = {
  boxShadow: "inset 0 0 0 9999px rgba(245, 158, 11, 0.24)",
};

const selectedSquareStyle = {
  boxShadow:
    "inset 0 0 0 3px rgba(45, 212, 191, 0.92), inset 0 0 0 9999px rgba(45, 212, 191, 0.12)",
};

const legalTargetStyle = {
  background:
    "radial-gradient(circle, rgba(45, 212, 191, 0.72) 0 17%, transparent 18%)",
};

function buildSquareStyles({
  legalMoves,
  selectedSquare,
  lastMove,
}: Pick<
  ChessBoardPanelProps,
  "legalMoves" | "selectedSquare" | "lastMove"
>): ChessboardOptions["squareStyles"] {
  const squareStyles: NonNullable<ChessboardOptions["squareStyles"]> = {};

  const mergeStyle = (square: string, style: React.CSSProperties) => {
    squareStyles[square] = {
      ...(squareStyles[square] ?? {}),
      ...style,
    };
  };

  if (lastMove) {
    mergeStyle(lastMove.from, lastMoveStyle);
    mergeStyle(lastMove.to, lastMoveStyle);
  }

  if (selectedSquare) {
    mergeStyle(selectedSquare, selectedSquareStyle);
    legalMoves?.[selectedSquare]?.forEach((targetSquare) => {
      mergeStyle(targetSquare, legalTargetStyle);
    });
  }

  return squareStyles;
}

function ChessBoardPanel({
  fen = mockBoardState.fen,
  orientation = mockBoardState.orientation,
  legalMoves = mockBoardState.legalMoves,
  selectedSquare = mockBoardState.selectedSquare,
  lastMove = mockBoardState.lastMove,
  arrows = mockBoardState.candidateArrows,
  onMove,
}: ChessBoardPanelProps) {
  const squareStyles = buildSquareStyles({
    legalMoves,
    selectedSquare,
    lastMove,
  });

  const handlePieceDrop = ({
    piece,
    sourceSquare,
    targetSquare,
  }: PieceDropHandlerArgs) => {
    if (!targetSquare || sourceSquare === targetSquare) {
      return false;
    }

    onMove?.({
      sourceSquare,
      targetSquare,
      piece: piece.pieceType,
    });

    return false;
  };

  const chessboardOptions: ChessboardOptions = {
    id: "giveaway-zero-analysis-board",
    position: fen,
    boardOrientation: orientation,
    squareStyles,
    arrows,
    showNotation: true,
    showAnimations: true,
    animationDurationInMs: 120,
    allowDragging: Boolean(onMove),
    allowDrawingArrows: true,
    clearArrowsOnClick: false,
    clearArrowsOnPositionChange: false,
    onPieceDrop: handlePieceDrop,
    boardStyle: {
      borderRadius: "8px",
      boxShadow: "0 24px 70px rgba(0, 0, 0, 0.38)",
      overflow: "hidden",
    },
    lightSquareStyle: {
      backgroundColor: "#d7cfbd",
      color: "#334155",
    },
    darkSquareStyle: {
      backgroundColor: "#5f7463",
      color: "#e2e8f0",
    },
    darkSquareNotationStyle: {
      color: "rgba(226, 232, 240, 0.72)",
      fontWeight: 700,
    },
    lightSquareNotationStyle: {
      color: "rgba(15, 23, 42, 0.62)",
      fontWeight: 700,
    },
  };

  return (
    <div className="mx-auto flex w-full max-w-[44rem] flex-col gap-4">
      <div className="rounded-lg border border-white/10 bg-slate-950/70 p-2 shadow-2xl sm:p-3">
        <div className="aspect-square w-full">
          <Chessboard options={chessboardOptions} />
        </div>
      </div>
      <div className="grid gap-3 text-sm text-slate-400 sm:grid-cols-3">
        <div className="rounded-md border border-white/10 bg-white/[0.035] px-3 py-2">
          Variant: <span className="font-medium text-slate-100">Giveaway</span>
        </div>
        <div className="rounded-md border border-white/10 bg-white/[0.035] px-3 py-2">
          Rules: <span className="font-medium text-slate-100">Not validated</span>
        </div>
        <div className="rounded-md border border-white/10 bg-white/[0.035] px-3 py-2">
          Last move:{" "}
          <span className="font-medium text-slate-100">
            {lastMove?.san ?? "None"}
          </span>
        </div>
      </div>
      <p className="text-center text-xs leading-5 text-slate-500">
        Drag and drop is sent to the placeholder API; this board still does not
        validate Giveaway rules locally.
      </p>
    </div>
  );
}

export default ChessBoardPanel;
