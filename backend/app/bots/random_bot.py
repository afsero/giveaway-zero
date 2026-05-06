import random

from app.engine.variant_rules import (
    board_from_fen,
    candidate_moves_from_board,
    serialize_board_state,
)
from app.schemas.bot import BotMoveRequest, BotMoveResponse
from app.schemas.game import CandidateMove


def select_random_move(request: BotMoveRequest) -> BotMoveResponse:
    board = board_from_fen(request.fen)
    state = serialize_board_state(board)

    if state.game_over or not state.legal_moves:
        return BotMoveResponse(
            game_id=request.game_id,
            bot_type="random",
            message="No bot move available because the Antichess game is over.",
            game_over=state.game_over,
            result=state.result,
            winner=state.winner,
            termination_reason=state.termination_reason,
        )

    legal_moves = list(board.legal_moves)
    selected = random.choice(legal_moves)
    selected_san = board.san(selected)

    return BotMoveResponse(
        game_id=request.game_id,
        bot_type="random",
        selected_move=selected.uci(),
        selected_san=selected_san,
        candidate_moves=_candidate_responses(board),
        message="RandomBot selected from real Antichess legal moves.",
        game_over=False,
        result=None,
        winner=None,
        termination_reason=None,
    )


def _candidate_responses(board) -> list[CandidateMove]:
    candidates: list[CandidateMove] = []
    for index, (move, san) in enumerate(candidate_moves_from_board(board), start=1):
        candidates.append(
            CandidateMove(
                move=move.uci(),
                san=san,
                confidence=max(0.1, 1 - (index - 1) * 0.25),
                line=[san],
            )
        )
    return candidates
