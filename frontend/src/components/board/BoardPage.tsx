import { useEffect, useMemo, useRef, useState } from "react";
import { Clock3, Wifi, WifiOff } from "lucide-react";
import { mockBoardState } from "../../data/mockGame";
import type { BoardArrow, CandidateMove } from "../../data/mockGame";
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
  PlayableBotType,
  SideToMove,
} from "../../lib/api";
import AnalysisPanel from "./AnalysisPanel";
import ChessBoardPanel from "./ChessBoardPanel";
import GameControls from "./GameControls";
import ModelStatusCard from "./ModelStatusCard";
import type { LocalMoveEntry } from "./MoveHistory";

type ApiStatus = "checking" | "connected" | "disconnected";
type RequestPhase = "initializing" | "new-game" | "user-move" | "bot-move" | null;
type BoardOrientation = "white" | "black";

type HistorySnapshot = {
  state: GameStateResponse;
};

type PendingPromotion = {
  sourceSquare: string;
  targetSquare: string;
  moves: string[];
};

const PLAYER_COLOR = "white";
const DEFAULT_BOT_TYPE: PlayableBotType = "random";

function BoardPage() {
  const [apiStatus, setApiStatus] = useState<ApiStatus>("checking");
  const [requestPhase, setRequestPhase] =
    useState<RequestPhase>("initializing");
  const [apiError, setApiError] = useState<string | null>(null);
  const [lastApiMessage, setLastApiMessage] = useState(
    "Connecting to backend rules API...",
  );
  const [gameState, setGameState] = useState<GameStateResponse | null>(null);
  const [modelStatus, setModelStatus] = useState<ModelStatusResponse | null>(
    null,
  );
  const [botResponse, setBotResponse] = useState<BotMoveResponse | null>(null);
  const [botType, setBotType] =
    useState<PlayableBotType>(DEFAULT_BOT_TYPE);
  const [orientation, setOrientation] = useState<BoardOrientation>("white");
  const [moveHistory, setMoveHistory] = useState<LocalMoveEntry[]>([]);
  const [snapshots, setSnapshots] = useState<HistorySnapshot[]>([]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [pendingPromotion, setPendingPromotion] =
    useState<PendingPromotion | null>(null);
  const requestSequenceRef = useRef(0);
  const interactionLockedRef = useRef(false);

  const isLoading = requestPhase !== null;
  const activeGameState = snapshots[historyIndex]?.state ?? gameState;
  const isViewingLatest =
    snapshots.length === 0 || historyIndex === snapshots.length - 1;
  const currentFen = activeGameState?.fen ?? mockBoardState.fen;
  const legalMoves =
    activeGameState?.legal_moves_by_square ??
    (gameState ? {} : mockBoardState.legalMoves);
  const legalMovesList = activeGameState?.legal_moves ?? [];
  const lastMove =
    toBoardLastMove(activeGameState?.last_move) ??
    (activeGameState ? null : mockBoardState.lastMove);
  const selectedBoardSquare =
    selectedSquare && legalMoves[selectedSquare] ? selectedSquare : null;
  const candidateMoves = toCandidateMoves(
    botResponse?.candidate_moves ?? activeGameState?.candidate_moves,
  );
  const candidateArrows = useMemo(
    () =>
      toCandidateArrows(
        botResponse?.candidate_moves ?? activeGameState?.candidate_moves,
      ),
    [botResponse?.candidate_moves, activeGameState?.candidate_moves],
  );
  const displayedPly = activeGameState?.ply ?? mockBoardState.ply;
  const gameOverSummary = formatGameOverSummary(activeGameState);
  const reviewNotice =
    activeGameState && !isViewingLatest
      ? `Viewing history at ply ${activeGameState.ply}. The board is read-only until you return to the latest position.`
      : null;
  const emptyLegalMovesNotice =
    activeGameState &&
    !activeGameState.game_over &&
    isViewingLatest &&
    activeGameState.legal_moves.length === 0
      ? "No backend legal moves are available for this position."
      : null;
  const isPlayerTurn =
    activeGameState?.player_color !== "random" &&
    activeGameState?.turn === activeGameState?.player_color;
  const canUserMove = Boolean(
    activeGameState &&
      isViewingLatest &&
      !isLoading &&
      !activeGameState.game_over &&
      legalMovesList.length > 0 &&
      isPlayerTurn,
  );
  const canBotMove = Boolean(
    activeGameState &&
      isViewingLatest &&
      !isLoading &&
      !activeGameState.game_over &&
      legalMovesList.length > 0 &&
      activeGameState.player_color !== "random" &&
      activeGameState.turn !== activeGameState.player_color,
  );
  const canBoardInteract = canUserMove && !pendingPromotion;
  const canUndo = isViewingLatest && !isLoading && moveHistory.length > 0;
  const canPrevious = historyIndex > 0;
  const canNext = historyIndex < snapshots.length - 1;

  function beginRequest() {
    requestSequenceRef.current += 1;
    interactionLockedRef.current = true;
    return requestSequenceRef.current;
  }

  function isCurrentRequest(requestId: number) {
    return requestSequenceRef.current === requestId;
  }

  function finishRequest(requestId: number) {
    if (!isCurrentRequest(requestId)) {
      return;
    }

    interactionLockedRef.current = false;
    setRequestPhase(null);
  }

  useEffect(() => {
    setSelectedSquare((current) =>
      current && legalMoves[current] ? current : null,
    );
  }, [currentFen, legalMoves]);

  useEffect(() => {
    let isMounted = true;

    async function loadBoard() {
      const requestId = beginRequest();
      setRequestPhase("initializing");
      setApiError(null);
      setSelectedSquare(null);

      try {
        const health = await getHealth();
        if (!isMounted || !isCurrentRequest(requestId)) {
          return;
        }
        setApiStatus("connected");
        setLastApiMessage(`${health.service} ${health.version} is online`);
      } catch (error) {
        if (!isMounted || !isCurrentRequest(requestId)) {
          return;
        }
        setApiStatus("disconnected");
        setApiError(formatApiError(error));
        setLastApiMessage("Backend API is disconnected; showing local fallback.");
      }

      try {
        const [status, game] = await Promise.all([
          getModelStatus(),
          loadNewGame(DEFAULT_BOT_TYPE),
        ]);
        if (!isMounted || !isCurrentRequest(requestId)) {
          return;
        }
        setModelStatus(status);
        resetGameSession(game);
        setLastApiMessage(game.message);
      } catch (error) {
        if (!isMounted || !isCurrentRequest(requestId)) {
          return;
        }
        setApiError(formatApiError(error));
        if (isApiDisconnectedError(error)) {
          setApiStatus("disconnected");
        }
      } finally {
        if (isMounted) {
          finishRequest(requestId);
        }
      }
    }

    void loadBoard();

    return () => {
      isMounted = false;
    };
  }, []);

  async function loadNewGame(selectedBotType: PlayableBotType) {
    const game = await createNewGame({
      player_color: PLAYER_COLOR,
      bot_type: selectedBotType,
    });

    try {
      const legalMovesResponse = await getLegalMoves({
        game_id: game.game_id,
        fen: game.fen,
      });

      return {
        ...game,
        legal_moves: legalMovesResponse.legal_moves,
        legal_moves_by_square: legalMovesResponse.legal_moves_by_square,
      };
    } catch {
      return game;
    }
  }

  function resetGameSession(game: GameStateResponse) {
    setGameState(game);
    setSnapshots([{ state: game }]);
    setHistoryIndex(0);
    setMoveHistory([]);
    setBotResponse(null);
    setPendingPromotion(null);
    setSelectedSquare(null);
  }

  function commitGameProgress(
    state: GameStateResponse,
    entries: LocalMoveEntry[],
    nextSnapshots: HistorySnapshot[],
  ) {
    setGameState(state);
    setMoveHistory(entries);
    setSnapshots(nextSnapshots);
    setHistoryIndex(nextSnapshots.length - 1);
    setPendingPromotion(null);
    setSelectedSquare(null);
  }

  const handleNewGame = async () => {
    if (interactionLockedRef.current) {
      return;
    }

    const requestId = beginRequest();
    setRequestPhase("new-game");
    setApiError(null);
    setBotResponse(null);
    setPendingPromotion(null);
    setSelectedSquare(null);
    try {
      const game = await loadNewGame(botType);
      if (!isCurrentRequest(requestId)) {
        return;
      }
      resetGameSession(game);
      setLastApiMessage(game.message);
      setApiStatus("connected");
    } catch (error) {
      if (!isCurrentRequest(requestId)) {
        return;
      }
      if (isApiDisconnectedError(error)) {
        setApiStatus("disconnected");
      }
      setApiError(formatApiError(error));
      setLastApiMessage("Could not start a new backend game.");
    } finally {
      finishRequest(requestId);
    }
  };

  const handleBoardMove = ({
    sourceSquare,
    targetSquare,
  }: {
    sourceSquare: string;
    targetSquare: string;
  }) => {
    if (!activeGameState || isLoading || interactionLockedRef.current) {
      return;
    }

    if (!isViewingLatest) {
      // Simpler review policy: historical snapshots are read-only, so a drag
      // cannot fork the game or truncate future history.
      setSelectedSquare(null);
      setPendingPromotion(null);
      setApiError("Viewing history: return to the latest position before moving.");
      setLastApiMessage("Move input is disabled while viewing history.");
      return;
    }

    if (activeGameState.game_over) {
      setSelectedSquare(null);
      setPendingPromotion(null);
      setApiError("Game over: use Undo or start a new game before moving.");
      return;
    }

    if (!isPlayerTurn) {
      setSelectedSquare(null);
      setPendingPromotion(null);
      setApiError("Waiting for the backend bot move to finish.");
      return;
    }

    if (legalMovesList.length === 0) {
      setSelectedSquare(null);
      setPendingPromotion(null);
      setApiError("No backend legal moves are available for this position.");
      return;
    }

    const attemptedMove = resolveAttemptedUciMove(
      sourceSquare,
      targetSquare,
      legalMovesList,
    );

    if (attemptedMove.type === "promotion") {
      setPendingPromotion({
        sourceSquare,
        targetSquare,
        moves: attemptedMove.moves,
      });
      setSelectedSquare(sourceSquare);
      setLastApiMessage("Choose a promotion piece to send the UCI move.");
      return;
    }

    if (attemptedMove.type === "illegal") {
      setSelectedSquare(null);
      setPendingPromotion(null);
      setApiError(formatIllegalMoveMessage(attemptedMove.uciMove));
      setLastApiMessage("Move was not sent because it is not in the backend legal move list.");
      return;
    }

    void submitUserMove(attemptedMove.uciMove);
  };

  const submitUserMove = async (uciMove: string) => {
    if (!activeGameState || interactionLockedRef.current) {
      return;
    }

    const requestId = beginRequest();
    const startingState = activeGameState;
    let nextHistory = moveHistory.slice(0, historyIndex);
    let nextSnapshots = snapshots.slice(0, historyIndex + 1);
    let userMoveApplied = false;

    setPendingPromotion(null);
    setSelectedSquare(null);
    setBotResponse(null);
    setApiError(null);
    setRequestPhase("user-move");
    setLastApiMessage(`Applying ${uciMove} with backend Antichess rules...`);

    try {
      const userState = await makeMove({
        fen: startingState.fen,
        uci_move: uciMove,
        player_color: startingState.player_color,
        bot_type: botType,
      });
      if (!isCurrentRequest(requestId)) {
        return;
      }
      setApiStatus("connected");
      const userEntry = createLocalMoveEntry({
        actor: "user",
        afterState: userState,
        fallbackUci: uciMove,
        side: startingState.turn,
      });
      nextHistory = [...nextHistory, userEntry];
      nextSnapshots = [...nextSnapshots, { state: userState }];
      commitGameProgress(userState, nextHistory, nextSnapshots);
      userMoveApplied = true;

      if (userState.game_over) {
        setLastApiMessage(formatGameOverSummary(userState) ?? userState.message);
        return;
      }

      setRequestPhase("bot-move");
      setLastApiMessage(
        `${formatBotLabel(botType)} is choosing from backend legal moves...`,
      );

      const response = await getBotMove({
        game_id: userState.game_id,
        fen: userState.fen,
        bot_type: botType,
        side_to_move: userState.turn,
        legal_moves: userState.legal_moves,
      });
      if (!isCurrentRequest(requestId)) {
        return;
      }
      setApiStatus("connected");
      setBotResponse(response);

      if (!response.selected_move) {
        setLastApiMessage(
          response.game_over
            ? formatBotGameOverMessage(response) ?? response.message
            : response.message || "Bot returned no legal move for this position.",
        );
        return;
      }

      const botState = await makeMove({
        fen: userState.fen,
        uci_move: response.selected_move,
        player_color: userState.player_color,
        bot_type: botType,
      });
      if (!isCurrentRequest(requestId)) {
        return;
      }
      setApiStatus("connected");
      const botEntry = createLocalMoveEntry({
        actor: "bot",
        afterState: botState,
        fallbackSan: response.selected_san,
        fallbackUci: response.selected_move,
        side: userState.turn,
      });
      nextHistory = [...nextHistory, botEntry];
      nextSnapshots = [...nextSnapshots, { state: botState }];
      commitGameProgress(botState, nextHistory, nextSnapshots);
      setLastApiMessage(
        botState.game_over
          ? formatGameOverSummary(botState) ?? response.message
          : `${response.message} Applied ${botEntry.san || botEntry.uci}.`,
      );
    } catch (error) {
      if (!isCurrentRequest(requestId)) {
        return;
      }
      if (isApiDisconnectedError(error)) {
        setApiStatus("disconnected");
      }
      setApiError(formatApiError(error));
      setLastApiMessage(
        userMoveApplied
          ? "Your move was accepted, but the bot reply failed; the board stays after your move."
          : "Move rejected by the backend; the board is unchanged.",
      );
    } finally {
      finishRequest(requestId);
    }
  };

  const handleBotMove = async () => {
    if (!activeGameState || !canBotMove || interactionLockedRef.current) {
      return;
    }

    const requestId = beginRequest();
    const startingState = activeGameState;
    let nextHistory = moveHistory.slice(0, historyIndex);
    let nextSnapshots = snapshots.slice(0, historyIndex + 1);

    setSelectedSquare(null);
    setPendingPromotion(null);
    setBotResponse(null);
    setApiError(null);
    setRequestPhase("bot-move");
    setLastApiMessage(
      `${formatBotLabel(botType)} is choosing from backend legal moves...`,
    );

    try {
      const response = await getBotMove({
        game_id: startingState.game_id,
        fen: startingState.fen,
        bot_type: botType,
        side_to_move: startingState.turn,
        legal_moves: startingState.legal_moves,
      });
      if (!isCurrentRequest(requestId)) {
        return;
      }
      setApiStatus("connected");
      setBotResponse(response);

      if (!response.selected_move) {
        setLastApiMessage(
          response.game_over
            ? formatBotGameOverMessage(response) ?? response.message
            : response.message || "Bot returned no legal move for this position.",
        );
        return;
      }

      const botState = await makeMove({
        fen: startingState.fen,
        uci_move: response.selected_move,
        player_color: startingState.player_color,
        bot_type: botType,
      });
      if (!isCurrentRequest(requestId)) {
        return;
      }
      setApiStatus("connected");
      const botEntry = createLocalMoveEntry({
        actor: "bot",
        afterState: botState,
        fallbackSan: response.selected_san,
        fallbackUci: response.selected_move,
        side: startingState.turn,
      });
      nextHistory = [...nextHistory, botEntry];
      nextSnapshots = [...nextSnapshots, { state: botState }];
      commitGameProgress(botState, nextHistory, nextSnapshots);
      setLastApiMessage(
        botState.game_over
          ? formatGameOverSummary(botState) ?? response.message
          : `${response.message} Applied ${botEntry.san || botEntry.uci}.`,
      );
    } catch (error) {
      if (!isCurrentRequest(requestId)) {
        return;
      }
      if (isApiDisconnectedError(error)) {
        setApiStatus("disconnected");
      }
      setApiError(formatApiError(error));
      setLastApiMessage("Bot move failed; board remains on the current FEN.");
    } finally {
      finishRequest(requestId);
    }
  };

  const handleUndo = () => {
    if (!canUndo || interactionLockedRef.current) {
      return;
    }

    const lastEntry = moveHistory[moveHistory.length - 1];
    const removeCount =
      lastEntry?.actor === "bot" && moveHistory.length >= 2 ? 2 : 1;
    const nextHistory = moveHistory.slice(0, -removeCount);
    const nextSnapshots = snapshots.slice(0, nextHistory.length + 1);
    const nextState = nextSnapshots[nextSnapshots.length - 1]?.state;

    if (!nextState) {
      return;
    }

    setBotResponse(null);
    setPendingPromotion(null);
    commitGameProgress(nextState, nextHistory, nextSnapshots);
    setApiError(null);
    setLastApiMessage(
      removeCount === 2
        ? "Undid the last user move and bot reply."
        : "Undid the last move.",
    );
  };

  const handleHistoryIndexChange = (nextIndex: number) => {
    if (
      isLoading ||
      interactionLockedRef.current ||
      nextIndex < 0 ||
      nextIndex >= snapshots.length
    ) {
      return;
    }

    const snapshot = snapshots[nextIndex];
    setHistoryIndex(nextIndex);
    setGameState(snapshot.state);
    setBotResponse(null);
    setPendingPromotion(null);
    setSelectedSquare(null);
    setApiError(null);
    setLastApiMessage(
      nextIndex === snapshots.length - 1
        ? "Returned to the latest position."
        : `Viewing history at ply ${snapshot.state.ply}; moves are disabled until you return to latest.`,
    );
  };

  const handleBotTypeChange = (nextBotType: PlayableBotType) => {
    if (interactionLockedRef.current) {
      return;
    }

    setBotType(nextBotType);
    setBotResponse(null);
    setPendingPromotion(null);
    setSelectedSquare(null);
    setLastApiMessage(
      `${formatBotLabel(nextBotType)} selected for future backend bot moves.`,
    );
  };

  const handleSelectSquare = (square: string | null) => {
    if (!canBoardInteract) {
      setSelectedSquare(null);
      return;
    }

    setSelectedSquare(square);
  };

  return (
    <section className="grid gap-5 py-5 lg:py-7 xl:grid-cols-[minmax(0,1fr)_25rem]">
      <div className="flex min-w-0 flex-col gap-4">
        <div className="rounded-lg border border-white/10 bg-panel/75 p-4 shadow-glow backdrop-blur sm:p-5 lg:p-6">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-sm font-medium uppercase tracking-normal text-mint">
                  {activeGameState ? "Antichess rules active" : mockBoardState.phase}
                </p>
                <ApiStatusBadge status={apiStatus} />
              </div>
              <h1 className="mt-1 text-2xl font-semibold text-white sm:text-3xl">
                Giveaway Chess Analysis
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Board state, legal moves, bot candidates, and model status come
                from the FastAPI backend.
              </p>
            </div>
            <div className="grid gap-2 text-sm sm:min-w-44">
              <div className="rounded-md border border-ember/30 bg-ember/10 px-3 py-2 font-medium text-amber-200">
                {formatGameStatus(activeGameState)}
              </div>
              <div className="flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.035] px-3 py-2 text-slate-400">
                <Clock3 aria-hidden="true" size={15} className="text-mint" />
                Ply {displayedPly}
              </div>
            </div>
          </div>
          <ChessBoardPanel
            fen={currentFen}
            orientation={orientation}
            legalMoves={legalMoves}
            selectedSquare={selectedBoardSquare}
            disabled={!canBoardInteract}
            lastMove={lastMove}
            arrows={candidateArrows}
            onSelectSquare={handleSelectSquare}
            onMove={handleBoardMove}
          />
          {pendingPromotion ? (
            <PromotionChooser
              pendingPromotion={pendingPromotion}
              disabled={isLoading}
              onCancel={() => {
                setPendingPromotion(null);
                setSelectedSquare(null);
              }}
              onSelect={(uciMove) => {
                void submitUserMove(uciMove);
              }}
            />
          ) : null}
        </div>
        <div className="rounded-lg border border-white/10 bg-panel/70 px-4 py-3 text-sm text-slate-400">
          <span className="font-medium text-slate-200">Game event:</span>{" "}
          {requestPhase ? formatRequestPhase(requestPhase, botType) : lastApiMessage}
          {reviewNotice ? (
            <p className="mt-2 text-sm text-amber-200">{reviewNotice}</p>
          ) : null}
          {emptyLegalMovesNotice ? (
            <p className="mt-2 text-sm text-amber-200">
              {emptyLegalMovesNotice}
            </p>
          ) : null}
          {gameOverSummary ? (
            <p className="mt-2 text-sm text-mint">{gameOverSummary}</p>
          ) : null}
          {apiError ? (
            <p className="mt-2 text-sm text-amber-200">{apiError}</p>
          ) : null}
        </div>
        <GameControls
          isLoading={isLoading}
          canUndo={canUndo}
          canPrevious={canPrevious}
          canNext={canNext}
          canBotMove={canBotMove}
          onBotMove={handleBotMove}
          onNewGame={handleNewGame}
          onUndo={handleUndo}
          onPrevious={() => handleHistoryIndexChange(historyIndex - 1)}
          onNext={() => handleHistoryIndexChange(historyIndex + 1)}
          onFlipBoard={() =>
            setOrientation((current) => (current === "white" ? "black" : "white"))
          }
        />
      </div>

      <aside className="grid min-w-0 gap-4 xl:content-start">
        <ModelStatusCard
          status={modelStatus}
          isLoading={requestPhase === "initializing" && !modelStatus}
          isBusy={isLoading}
          botType={botType}
          onBotTypeChange={handleBotTypeChange}
        />
        <AnalysisPanel
          botMessage={
            botResponse?.selected_san
              ? `Bot selected ${botResponse.selected_san}`
              : botResponse?.message ?? null
          }
          candidateMoves={candidateMoves}
          moveHistory={moveHistory}
          historyIndex={historyIndex}
          onSelectHistoryIndex={handleHistoryIndexChange}
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

function PromotionChooser({
  pendingPromotion,
  disabled,
  onCancel,
  onSelect,
}: {
  pendingPromotion: PendingPromotion;
  disabled: boolean;
  onCancel: () => void;
  onSelect: (uciMove: string) => void;
}) {
  return (
    <div className="mx-auto mt-4 max-w-[44rem] rounded-lg border border-mint/25 bg-mint/10 p-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-mint">
            Promotion on {pendingPromotion.targetSquare}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {pendingPromotion.sourceSquare}
            {pendingPromotion.targetSquare}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {pendingPromotion.moves.map((move) => (
            <button
              key={move}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(move)}
              className="rounded-md border border-white/10 bg-slate-950/60 px-3 py-2 text-sm font-medium text-slate-100 transition hover:border-mint/40 hover:bg-mint/15 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {formatPromotionLabel(move)}
            </button>
          ))}
          <button
            type="button"
            disabled={disabled}
            onClick={onCancel}
            className="rounded-md border border-white/10 bg-white/[0.045] px-3 py-2 text-sm font-medium text-slate-400 transition hover:border-ember/35 hover:text-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function toBoardLastMove(lastMove?: LastMoveResponse | null) {
  if (!lastMove) {
    return null;
  }

  return {
    from: lastMove.from_square,
    to: lastMove.to_square,
    san: lastMove.san || lastMove.uci,
  };
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
    return [];
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

function createLocalMoveEntry({
  actor,
  afterState,
  fallbackSan,
  fallbackUci,
  side,
}: {
  actor: LocalMoveEntry["actor"];
  afterState: GameStateResponse;
  fallbackSan?: string | null;
  fallbackUci: string;
  side: SideToMove;
}): LocalMoveEntry {
  const uci = afterState.last_move?.uci ?? fallbackUci;
  const ply = afterState.ply;

  return {
    id: `${ply}-${actor}-${uci}`,
    actor,
    fenAfter: afterState.fen,
    moveNumber: Math.max(1, Math.floor((ply - 1) / 2) + 1),
    ply,
    san: afterState.last_move?.san ?? fallbackSan ?? null,
    side,
    uci,
  };
}

function resolveAttemptedUciMove(
  sourceSquare: string,
  targetSquare: string,
  legalMoves: string[],
) {
  const movePrefix = `${sourceSquare}${targetSquare}`;

  if (legalMoves.includes(movePrefix)) {
    return { type: "move" as const, uciMove: movePrefix };
  }

  const promotionMoves = legalMoves.filter(
    (move) => move.startsWith(movePrefix) && move.length > movePrefix.length,
  );

  if (promotionMoves.length === 1) {
    return { type: "move" as const, uciMove: promotionMoves[0] };
  }

  if (promotionMoves.length > 1) {
    return { type: "promotion" as const, moves: promotionMoves };
  }

  return { type: "illegal" as const, uciMove: movePrefix };
}

function formatGameStatus(state: GameStateResponse | null) {
  if (!state) {
    return mockBoardState.status;
  }

  if (state.game_over) {
    return `Game over${state.result ? `: ${state.result}` : ""}`;
  }

  if (state.legal_moves.length === 0) {
    return "No legal moves";
  }

  return formatSideToMove(state.turn ?? state.side_to_move) ?? "Active game";
}

function formatGameOverSummary(state?: GameStateResponse | null) {
  if (!state?.game_over) {
    return null;
  }

  const result = state.result ?? "result unavailable";
  const winner = state.winner
    ? `${formatSideName(state.winner)} wins`
    : "Draw or no winner";
  const reason = state.termination_reason
    ? formatTerminationReason(state.termination_reason)
    : "termination reason unavailable";

  return `Game over: ${winner} (${result}). ${reason}.`;
}

function formatBotGameOverMessage(response: BotMoveResponse) {
  if (!response.game_over) {
    return null;
  }

  const result = response.result ?? "result unavailable";
  const winner = response.winner
    ? `${formatSideName(response.winner)} wins`
    : "Draw or no winner";
  const reason = response.termination_reason
    ? formatTerminationReason(response.termination_reason)
    : "termination reason unavailable";

  return `Game over before bot move: ${winner} (${result}). ${reason}.`;
}

function formatRequestPhase(phase: Exclude<RequestPhase, null>, botType: PlayableBotType) {
  if (phase === "initializing") {
    return "Loading backend game state...";
  }
  if (phase === "new-game") {
    return "Starting a new backend Antichess game...";
  }
  if (phase === "user-move") {
    return "Applying your move through the backend...";
  }
  return `${formatBotLabel(botType)} is moving through the backend...`;
}

function formatSideToMove(side?: SideToMove) {
  if (!side) {
    return null;
  }

  return `${formatSideName(side)} to move`;
}

function formatSideName(side: SideToMove) {
  return `${side[0].toUpperCase()}${side.slice(1)}`;
}

function formatReason(reason: string) {
  return reason.replace(/_/g, " ");
}

function formatTerminationReason(reason: string) {
  const readableReason = formatReason(reason);
  const labels: Record<string, string> = {
    insufficient_material: "drawn by insufficient material",
    stalemate: "ended by stalemate or no legal move",
    variant_draw: "drawn by Antichess variant rules",
    variant_loss: "ended by Antichess loss condition",
    variant_win: "ended by Antichess win condition",
  };

  return labels[reason] ?? `ended by ${readableReason}`;
}

function formatBotLabel(botType: PlayableBotType) {
  return botType === "heuristic" ? "HeuristicBot" : "RandomBot";
}

function formatPromotionLabel(uciMove: string) {
  const promotion = uciMove.slice(-1);
  const labels: Record<string, string> = {
    b: "Bishop",
    n: "Knight",
    q: "Queen",
    r: "Rook",
  };

  return labels[promotion] ?? promotion.toUpperCase();
}

function formatApiError(error: unknown) {
  const message = error instanceof Error ? error.message : "Unknown API error";
  const trimmedMessage = message.split(" Legal moves:")[0];

  if (trimmedMessage.startsWith("Illegal Antichess move:")) {
    const uciMove = trimmedMessage.replace("Illegal Antichess move:", "").trim();
    return formatIllegalMoveMessage(uciMove.replace(/\.$/, ""));
  }

  if (trimmedMessage === "Game is already over.") {
    return "Game over: use Undo or start a new game before moving.";
  }

  return trimmedMessage;
}

function formatIllegalMoveMessage(uciMove: string) {
  return `Illegal Giveaway move: ${uciMove}. Use a highlighted backend legal move; captures may be mandatory.`;
}

function isApiDisconnectedError(error: unknown) {
  return (
    error instanceof Error &&
    error.message.startsWith("Cannot reach backend API")
  );
}

export default BoardPage;
