from typing import Literal

from pydantic import BaseModel, Field

BotType = Literal["random", "heuristic", "model"]
PlayerColor = Literal["white", "black", "random"]
SideToMove = Literal["white", "black"]


class MoveHistoryEntry(BaseModel):
    turn: int
    white: str | None = None
    black: str | None = None


class LastMove(BaseModel):
    from_square: str = Field(..., examples=["e2"])
    to_square: str = Field(..., examples=["e4"])
    san: str = Field(..., examples=["e4"])
    uci: str = Field(..., examples=["e2e4"])


class CandidateMove(BaseModel):
    move: str = Field(..., description="Move in UCI format.")
    san: str
    confidence: float = Field(..., ge=0, le=1)
    line: list[str] = Field(default_factory=list)


class NewGameRequest(BaseModel):
    player_color: PlayerColor = "white"
    bot_type: BotType = "random"


class LegalMovesRequest(BaseModel):
    game_id: str | None = None
    fen: str | None = None


class LegalMovesResponse(BaseModel):
    game_id: str
    fen: str
    legal_moves: dict[str, list[str]]
    message: str
    is_mock: bool = True


class GameMoveRequest(BaseModel):
    game_id: str | None = None
    fen: str | None = None
    from_square: str = Field(..., examples=["c4"])
    to_square: str = Field(..., examples=["d5"])
    uci: str = Field(..., examples=["c4d5"])
    san: str | None = Field(default=None, examples=["cxd5"])
    side_to_move: SideToMove = "white"
    player_color: PlayerColor = "white"
    bot_type: BotType = "random"


class GameStateResponse(BaseModel):
    game_id: str
    variant: str
    fen: str
    side_to_move: SideToMove
    status: str
    message: str
    player_color: PlayerColor
    bot_type: BotType
    legal_moves: dict[str, list[str]]
    move_history: list[MoveHistoryEntry]
    last_move: LastMove | None = None
    candidate_moves: list[CandidateMove] = Field(default_factory=list)
    is_mock: bool = True
