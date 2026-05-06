from pathlib import Path
import sys

from fastapi import HTTPException

BACKEND_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BACKEND_ROOT))

from app.api.routes.game import make_move  # noqa: E402
from app.engine.variant_rules import apply_move, create_new_game, serialize_board_state  # noqa: E402
from app.schemas.game import GameMoveRequest  # noqa: E402


def main() -> None:
    board = create_new_game()
    state = serialize_board_state(board)
    assert state.legal_moves, "New Antichess game should expose legal moves."
    assert "e2e3" in state.legal_moves, "Expected e2e3 to be legal at game start."

    board, _ = apply_move(board.fen(), "e2e3")
    state = serialize_board_state(board)
    assert state.turn == "black", "Turn should change after a legal move."

    try:
        make_move(GameMoveRequest(fen=create_new_game().fen(), uci_move="e2e5"))
    except HTTPException as exc:
        assert exc.status_code == 400
        assert "Illegal Antichess move" in str(exc.detail)
    else:
        raise AssertionError("Illegal move should return a clean HTTP 400.")

    capture_board = create_new_game()
    capture_board, _ = apply_move(capture_board.fen(), "e2e4")
    capture_board, _ = apply_move(capture_board.fen(), "d7d5")
    capture_state = serialize_board_state(capture_board)
    assert capture_state.legal_moves == ["e4d5"], (
        "When a capture is available, non-captures should not be legal."
    )

    try:
        make_move(GameMoveRequest(fen=capture_board.fen(), uci_move="g1f3"))
    except HTTPException as exc:
        assert exc.status_code == 400
        assert "Illegal Antichess move" in str(exc.detail)
    else:
        raise AssertionError("Non-capture should be illegal when capture is mandatory.")

    print("Antichess rule checks passed.")


if __name__ == "__main__":
    main()
