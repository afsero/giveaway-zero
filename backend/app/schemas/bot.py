from pydantic import BaseModel, Field

from app.schemas.game import BotType, CandidateMove, SideToMove, Winner


class BotMoveRequest(BaseModel):
    game_id: str = "antichess-local"
    fen: str
    bot_type: BotType = "random"
    side_to_move: SideToMove | None = None
    legal_moves: list[str] = Field(default_factory=list)


class BotMoveResponse(BaseModel):
    game_id: str
    bot_type: BotType
    selected_move: str | None = None
    selected_san: str | None = None
    candidate_moves: list[CandidateMove] = Field(default_factory=list)
    message: str
    game_over: bool
    result: str | None = None
    winner: Winner | None = None
    termination_reason: str | None = None
