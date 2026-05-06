from fastapi import APIRouter

from app.bots.heuristic_bot import select_heuristic_move
from app.bots.random_bot import select_random_move
from app.schemas.bot import BotMoveRequest, BotMoveResponse

router = APIRouter()


@router.post("/move", response_model=BotMoveResponse)
def bot_move(request: BotMoveRequest) -> BotMoveResponse:
    if request.bot_type == "heuristic":
        return select_heuristic_move(request)

    return select_random_move(request)
