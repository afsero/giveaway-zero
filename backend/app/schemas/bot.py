from pydantic import BaseModel, Field

from app.schemas.game import BotType, CandidateMove, SideToMove


class BotMoveRequest(BaseModel):
    game_id: str = "mock-game-001"
    fen: str
    bot_type: BotType = "random"
    side_to_move: SideToMove = "black"
    legal_moves: dict[str, list[str]] = Field(default_factory=dict)


class BotMoveResponse(BaseModel):
    game_id: str
    bot_type: BotType
    selected_move: str
    selected_san: str
    candidate_moves: list[CandidateMove]
    message: str
    is_mock: bool = True
