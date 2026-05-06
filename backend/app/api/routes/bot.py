from fastapi import APIRouter, HTTPException

from app.bots.heuristic_bot import select_heuristic_move
from app.bots.random_bot import select_random_move
from app.engine.variant_rules import InvalidFenError
from app.schemas.bot import BotMoveRequest, BotMoveResponse

router = APIRouter()


@router.post("/move", response_model=BotMoveResponse)
def bot_move(request: BotMoveRequest) -> BotMoveResponse:
    try:
        if request.bot_type == "heuristic":
            return select_heuristic_move(request)

        return select_random_move(request)
    except InvalidFenError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
