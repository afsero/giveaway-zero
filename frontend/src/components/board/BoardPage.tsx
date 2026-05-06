import { useEffect, useMemo, useState } from "react";
import { Clock3, Wifi, WifiOff } from "lucide-react";
import { mockBoardState } from "../../data/mockGame";
import type { BoardArrow, CandidateMove, MoveRecord } from "../../data/mockGame";
import {
  createNewGame,
  getBotMove,
  getHealth,
  getLegalMoves,
  getModelStatus,
  makeMove,
} from "../../lib/api";
import type {
  BotMoveResponse,
  CandidateMoveResponse,
  GameStateResponse,
  LastMoveResponse,
  ModelStatusResponse,
} from "../../lib/api";
import AnalysisPanel from "./AnalysisPanel";
import ChessBoardPanel from "./ChessBoardPanel";
import GameControls from "./GameControls";
import ModelStatusCard from "./ModelStatusCard";

type ApiStatus = "checking" | "connected" | "disconnected";

function BoardPage() {
  const [apiStatus, setApiStatus] = useState<ApiStatus>("checking");
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [lastApiMessage, setLastApiMessage] = useState(
    "Connecting to backend placeholder API...",
  );
  const [gameState, setGameState] = useState<GameStateResponse | null>(null);
  const [modelStatus, setModelStatus] = useState<ModelStatusResponse | null>(
    null,
  );
  const [botResponse, setBotResponse] = useState<BotMoveResponse | null>(null);

  const loadNewGame = async () => {
    const game = await createNewGame({
      player_color: "white",
      bot_type: "random",
    });

    try {
      const legalMoves = await getLegalMoves({
        game_id: game.game_id,
        fen: game.fen,
      });

      return {
        ...game,
        legal_moves: legalMoves.legal_moves,
      };
    } catch {
      return game;
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function loadBoard() {
      setIsLoading(true);
      setApiError(null);

      try {
        const health = await getHealth();
        if (!isMounted) {
          return;
        }
        setApiStatus("connected");
        setLastApiMessage(`${health.service} ${health.version} is online`);
      } catch (error) {
        if (!isMounted) {
          return;
        }
        setApiStatus("disconnected");
        setApiError(formatApiError(error));
        setLastApiMessage("Backend API is unavailable; showing local fallback.");
      }

      try {
        const [status, game] = await Promise.all([
          getModelStatus(),
          loadNewGame(),
        ]);
        if (!isMounted) {
          return;
        }
        setModelStatus(status);
        setGameState(game);
        setBotResponse(null);
        setLastApiMessage(game.message);
      } catch (error) {
        if (!isMounted) {
          return;
        }
        setApiError(formatApiError(error));
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadBoard();

    return () => {
      isMounted = false;
    };
  }, []);

  const currentFen = gameState?.fen ?? mockBoardState.fen;
  const legalMoves = gameState?.legal_moves ?? mockBoardState.legalMoves;
  const selectedSquare =
    Object.keys(legalMoves)[0] ?? mockBoardState.selectedSquare;
  const lastMove =
    toBoardLastMove(gameState?.last_move) ?? mockBoardState.lastMove;
  const moveHistory = toMoveHistory(gameState);
  const candidateMoves = toCandidateMoves(
    botResponse?.candidate_moves ?? gameState?.candidate_moves,
  );
  const candidateArrows = useMemo(
    () =>
      toCandidateArrows(botResponse?.candidate_moves ?? gameState?.candidate_moves),
    [botResponse?.candidate_moves, gameState?.candidate_moves],
  );
  const totalPlies = moveHistory.reduce(
    (count, record) => count + 1 + (record.black ? 1 : 0),
    0,
  );

  const handleNewGame = async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const game = await loadNewGame();
      setGameState(game);
      setBotResponse(null);
      setLastApiMessage(game.message);
      setApiStatus("connected");
    } catch (error) {
      setApiStatus("disconnected");
      setApiError(formatApiError(error));
      setLastApiMessage("Could not create a new backend game.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBoardMove = async ({
    sourceSquare,
    targetSquare,
  }: {
    sourceSquare: string;
    targetSquare: string;
  }) => {
    setIsLoading(true);
    setApiError(null);
    try {
      const updatedGame = await makeMove({
        game_id: gameState?.game_id,
        fen: currentFen,
        from_square: sourceSquare,
        to_square: targetSquare,
        uci: `${sourceSquare}${targetSquare}`,
        side_to_move: gameState?.side_to_move ?? "white",
        player_color: gameState?.player_color ?? "white",
        bot_type: gameState?.bot_type ?? "random",
      });
      setGameState(updatedGame);
      setBotResponse(null);
      setLastApiMessage(updatedGame.message);
      setApiStatus("connected");
    } catch (error) {
      setApiError(formatApiError(error));
      setLastApiMessage(`${sourceSquare}-${targetSquare} failed at API boundary.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBotMove = async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const response = await getBotMove({
        game_id: gameState?.game_id ?? "mock-game-001",
        fen: currentFen,
        bot_type: gameState?.bot_type ?? "random",
        side_to_move: gameState?.side_to_move === "white" ? "black" : "white",
        legal_moves: legalMoves,
      });
      setBotResponse(response);
      setLastApiMessage(
        `${response.message} Selected ${response.selected_san} (${response.selected_move}).`,
      );
      setApiStatus("connected");
    } catch (error) {
      setApiError(formatApiError(error));
      setLastApiMessage("Could not fetch a placeholder bot move.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="grid gap-5 py-5 lg:py-7 xl:grid-cols-[minmax(0,1fr)_25rem]">
      <div className="flex min-w-0 flex-col gap-4">
        <div className="rounded-lg border border-white/10 bg-panel/75 p-4 shadow-glow backdrop-blur sm:p-5 lg:p-6">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-sm font-medium uppercase tracking-normal text-mint">
                  {gameState?.is_mock
                    ? "Backend mock position"
                    : mockBoardState.phase}
                </p>
                <ApiStatusBadge status={apiStatus} />
              </div>
              <h1 className="mt-1 text-2xl font-semibold text-white sm:text-3xl">
                Giveaway Chess Analysis
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Board state, move history, bot candidates, and model status now
                come from the FastAPI placeholder API.
              </p>
            </div>
            <div className="grid gap-2 text-sm sm:min-w-44">
              <div className="rounded-md border border-ember/30 bg-ember/10 px-3 py-2 font-medium text-amber-200">
                {formatSideToMove(gameState?.side_to_move) ??
                  mockBoardState.status}
              </div>
              <div className="flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.035] px-3 py-2 text-slate-400">
                <Clock3 aria-hidden="true" size={15} className="text-mint" />
                Ply {totalPlies || mockBoardState.ply} /{" "}
                {totalPlies || mockBoardState.totalPlies}
              </div>
            </div>
          </div>
          <ChessBoardPanel
            fen={currentFen}
            orientation={mockBoardState.orientation}
            legalMoves={legalMoves}
            selectedSquare={selectedSquare}
            lastMove={lastMove}
            arrows={candidateArrows}
            onMove={(move) => {
              void handleBoardMove(move);
            }}
          />
        </div>
        <div className="rounded-lg border border-white/10 bg-panel/70 px-4 py-3 text-sm text-slate-400">
          <span className="font-medium text-slate-200">API event:</span>{" "}
          {isLoading ? "Request in flight..." : lastApiMessage}
          {apiError ? (
            <p className="mt-2 text-sm text-amber-200">{apiError}</p>
          ) : null}
        </div>
        <GameControls
          isLoading={isLoading}
          onBotMove={handleBotMove}
          onNewGame={handleNewGame}
        />
      </div>

      <aside className="grid min-w-0 gap-4 xl:content-start">
        <ModelStatusCard
          status={modelStatus}
          isLoading={isLoading && !modelStatus}
        />
        <AnalysisPanel
          botMessage={botResponse ? `Bot selected ${botResponse.selected_san}` : null}
          candidateMoves={candidateMoves}
          moveHistory={moveHistory}
        />
      </aside>
    </section>
  );
}

function ApiStatusBadge({ status }: { status: ApiStatus }) {
  const isConnected = status === "connected";
  const isDisconnected = status === "disconnected";
  const Icon = isConnected ? Wifi : WifiOff;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium ${
        isConnected
          ? "border-mint/25 bg-mint/10 text-mint"
          : isDisconnected
            ? "border-ember/25 bg-ember/10 text-amber-200"
            : "border-white/10 bg-white/[0.035] text-slate-400"
      }`}
    >
      <Icon aria-hidden="true" size={13} />
      {status === "checking"
        ? "API checking"
        : isConnected
          ? "API connected"
          : "API disconnected"}
    </span>
  );
}

function toBoardLastMove(lastMove?: LastMoveResponse | null) {
  if (!lastMove) {
    return null;
  }

  return {
    from: lastMove.from_square,
    to: lastMove.to_square,
    san: lastMove.san,
  };
}

function toMoveHistory(gameState: GameStateResponse | null): MoveRecord[] {
  if (!gameState) {
    return [];
  }

  return gameState.move_history.map((entry, index, entries) => ({
    turn: entry.turn,
    white: entry.white ?? "",
    black: entry.black ?? undefined,
    note: "Backend placeholder move",
    current:
      index === entries.length - 1 && !entry.black
        ? "white"
        : index === entries.length - 1
          ? "black"
          : undefined,
  }));
}

function toCandidateMoves(
  moves: CandidateMoveResponse[] | undefined,
): CandidateMove[] {
  if (!moves) {
    return [];
  }

  return moves.map((move) => ({
    move: move.san || move.move,
    confidence: Math.round(move.confidence * 100),
    line: move.line.join(" "),
    tag: move.move,
  }));
}

function toCandidateArrows(
  moves: CandidateMoveResponse[] | undefined,
): BoardArrow[] {
  if (!moves) {
    return mockBoardState.candidateArrows;
  }

  return moves
    .map((move, index) => ({
      startSquare: move.move.slice(0, 2),
      endSquare: move.move.slice(2, 4),
      color:
        index === 0
          ? "rgba(45, 212, 191, 0.78)"
          : "rgba(245, 158, 11, 0.62)",
    }))
    .filter(
      (arrow) => arrow.startSquare.length === 2 && arrow.endSquare.length === 2,
    );
}

function formatSideToMove(side?: "white" | "black") {
  if (!side) {
    return null;
  }

  return `${side[0].toUpperCase()}${side.slice(1)} to move`;
}

function formatApiError(error: unknown) {
  return error instanceof Error ? error.message : "Unknown API error";
}

export default BoardPage;
