const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const API_BASE_URL = (
  configuredApiBaseUrl || "http://localhost:8000"
).replace(/\/$/, "");

export type BotType = "random" | "heuristic" | "model";
export type PlayableBotType = Extract<BotType, "random" | "heuristic">;
export type PlayerColor = "white" | "black" | "random";
export type SideToMove = "white" | "black";

export type HealthResponse = {
  status: string;
  service: string;
  version: string;
};

export type CandidateMoveResponse = {
  move: string;
  san: string;
  confidence: number;
  line: string[];
};

export type MoveHistoryEntryResponse = {
  turn: number;
  white: string | null;
  black: string | null;
};

export type LastMoveResponse = {
  from_square: string;
  to_square: string;
  san: string;
  uci: string;
};

export type GameStateResponse = {
  game_id: string;
  variant: string;
  fen: string;
  turn: SideToMove;
  side_to_move: SideToMove;
  status: string;
  message: string;
  player_color: PlayerColor;
  bot_type: BotType;
  legal_moves: string[];
  legal_moves_by_square: Record<string, string[]>;
  game_over: boolean;
  result: string | null;
  winner: SideToMove | null;
  termination_reason: string | null;
  move_number: number;
  ply: number;
  move_history: MoveHistoryEntryResponse[];
  last_move: LastMoveResponse | null;
  candidate_moves: CandidateMoveResponse[];
};

export type LegalMovesResponse = {
  game_id: string;
  fen: string;
  turn: SideToMove;
  legal_moves: string[];
  legal_moves_by_square: Record<string, string[]>;
  game_over: boolean;
  result: string | null;
  winner: SideToMove | null;
  termination_reason: string | null;
  move_number: number;
  ply: number;
  message: string;
};

export type ModelStatusResponse = {
  model_name: string;
  variant: string;
  engine_mode: string;
  model_loaded: boolean;
};

export type BotMoveResponse = {
  game_id: string;
  bot_type: BotType;
  selected_move: string | null;
  selected_san: string | null;
  candidate_moves: CandidateMoveResponse[];
  message: string;
  game_over: boolean;
  result: string | null;
  winner: SideToMove | null;
  termination_reason: string | null;
};

export type NewGameRequest = {
  player_color?: PlayerColor;
  bot_type?: BotType;
};

export type LegalMovesRequest = {
  game_id?: string;
  fen?: string;
};

export type GameMoveRequest = {
  fen: string;
  uci_move: string;
  player_color?: PlayerColor;
  bot_type?: BotType;
};

export type BotMoveRequest = {
  game_id: string;
  fen: string;
  bot_type?: BotType;
  side_to_move?: SideToMove;
  legal_moves?: string[];
};

async function requestJson<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(parseApiError(response, details));
  }

  return response.json() as Promise<T>;
}

function parseApiError(response: Response, details: string) {
  if (!details) {
    return `${response.status} ${response.statusText}`;
  }

  try {
    const parsed = JSON.parse(details) as { detail?: unknown };
    if (typeof parsed.detail === "string") {
      return parsed.detail;
    }
  } catch {
    return `${response.status} ${response.statusText}: ${details}`;
  }

  return `${response.status} ${response.statusText}: ${details}`;
}

export function getHealth() {
  return requestJson<HealthResponse>("/health");
}

export function getModelStatus() {
  return requestJson<ModelStatusResponse>("/api/model/status");
}

export function createNewGame(request: NewGameRequest = {}) {
  return requestJson<GameStateResponse>("/api/game/new", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export function getLegalMoves(request: LegalMovesRequest) {
  return requestJson<LegalMovesResponse>("/api/game/legal-moves", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export function makeMove(request: GameMoveRequest) {
  return requestJson<GameStateResponse>("/api/game/move", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export function getBotMove(request: BotMoveRequest) {
  return requestJson<BotMoveResponse>("/api/bot/move", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export { API_BASE_URL };
