from app.engine.game_state import create_mock_game
from app.schemas.game import (
    GameMoveRequest,
    GameStateResponse,
    LastMove,
    MoveHistoryEntry,
)


def apply_mock_move(request: GameMoveRequest) -> GameStateResponse:
    state = create_mock_game(
        player_color=request.player_color,
        bot_type=request.bot_type,
    )
    state.game_id = request.game_id or state.game_id
    state.status = "active"
    state.side_to_move = "black" if request.side_to_move == "white" else "white"
    state.message = (
        "Move accepted by placeholder handler. No Giveaway rules were validated."
    )
    state.last_move = LastMove(
        from_square=request.from_square,
        to_square=request.to_square,
        san=request.san or request.uci,
        uci=request.uci,
    )
    state.move_history = [
        *state.move_history,
        MoveHistoryEntry(turn=5, white=request.san or request.uci, black=None),
    ]
    return state
