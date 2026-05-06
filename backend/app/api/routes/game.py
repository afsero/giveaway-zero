from fastapi import APIRouter, Body

from app.engine.game_state import create_mock_game, get_mock_legal_moves
from app.engine.variant_rules import apply_mock_move
from app.schemas.game import (
    GameMoveRequest,
    GameStateResponse,
    LegalMovesRequest,
    LegalMovesResponse,
    NewGameRequest,
)

router = APIRouter()


@router.post("/new", response_model=GameStateResponse)
def new_game(
    request: NewGameRequest = Body(default_factory=NewGameRequest),
) -> GameStateResponse:
    return create_mock_game(
        player_color=request.player_color,
        bot_type=request.bot_type,
    )


@router.post("/legal-moves", response_model=LegalMovesResponse)
def legal_moves(
    request: LegalMovesRequest = Body(default_factory=LegalMovesRequest),
) -> LegalMovesResponse:
    return get_mock_legal_moves(fen=request.fen, game_id=request.game_id)


@router.post("/move", response_model=GameStateResponse)
def make_move(request: GameMoveRequest) -> GameStateResponse:
    return apply_mock_move(request)
