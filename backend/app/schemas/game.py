from typing import Literal

from pydantic import BaseModel, Field

BotType = Literal["random", "heuristic", "model"]
PlayerColor = Literal["white", "black", "random"]
SideToMove = Literal["white", "black"]
Winner = Literal["white", "black"]


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


class BoardState(BaseModel):
    fen: str
    turn: SideToMove
    legal_moves: list[str]
    legal_moves_by_square: dict[str, list[str]]
    game_over: bool
    result: str | None = None
    winner: Winner | None = None
    termination_reason: str | None = None
    move_number: int
    ply: int


class LegalMovesResponse(BoardState):
    game_id: str
    message: str


class GameMoveRequest(BaseModel):
    fen: str
    uci_move: str | None = Field(default=None, examples=["c4d5"])
    # Kept briefly for compatibility with the previous frontend request shape.
    uci: str | None = Field(default=None, examples=["c4d5"])
    from_square: str | None = Field(default=None, examples=["c4"])
    to_square: str | None = Field(default=None, examples=["d5"])
    player_color: PlayerColor = "white"
    bot_type: BotType = "random"

    def move_uci(self) -> str | None:
        if self.uci_move:
            return self.uci_move
        if self.uci:
            return self.uci
        if self.from_square and self.to_square:
            return f"{self.from_square}{self.to_square}"
        return None


class GameStateResponse(BoardState):
    game_id: str
    variant: str
    status: str
    message: str
    side_to_move: SideToMove
    player_color: PlayerColor
    bot_type: BotType
    move_history: list[MoveHistoryEntry] = Field(default_factory=list)
    last_move: LastMove | None = None
    candidate_moves: list[CandidateMove] = Field(default_factory=list)
