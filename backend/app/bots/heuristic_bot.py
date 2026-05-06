from app.engine.game_state import MOCK_CANDIDATES
from app.schemas.bot import BotMoveRequest, BotMoveResponse


def select_heuristic_move(request: BotMoveRequest) -> BotMoveResponse:
    selected = MOCK_CANDIDATES[1]
    return BotMoveResponse(
        game_id=request.game_id,
        bot_type="heuristic",
        selected_move=selected.move,
        selected_san=selected.san,
        candidate_moves=MOCK_CANDIDATES,
        message="HeuristicBot placeholder selected a deterministic mock move.",
        is_mock=True,
    )
