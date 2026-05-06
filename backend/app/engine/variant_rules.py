import chess
import chess.variant

from app.schemas.game import BoardState, LastMove, Winner

ANTICHESS_VARIANT_NAME = "Giveaway / Antichess"
LOCAL_GAME_ID = "antichess-local"


class VariantRulesError(ValueError):
    """Base class for expected Antichess input errors."""


class InvalidFenError(VariantRulesError):
    """Raised when a FEN cannot be parsed as an Antichess position."""


class InvalidUciMoveError(VariantRulesError):
    """Raised when a move is not valid UCI notation."""


class IllegalMoveError(VariantRulesError):
    """Raised when a UCI move is not legal in the Antichess position."""


def create_new_game() -> chess.variant.AntichessBoard:
    return chess.variant.AntichessBoard()


def board_from_fen(fen: str) -> chess.variant.AntichessBoard:
    if not fen or not fen.strip():
        raise InvalidFenError("FEN is required.")

    try:
        return chess.variant.AntichessBoard(fen.strip())
    except ValueError as exc:
        raise InvalidFenError(f"Invalid Antichess FEN: {fen}") from exc


def get_legal_moves(fen: str) -> list[str]:
    board = board_from_fen(fen)
    return legal_moves_as_uci(board)


def apply_move(fen: str, uci_move: str) -> tuple[chess.variant.AntichessBoard, LastMove]:
    board = board_from_fen(fen)

    if board.is_game_over(claim_draw=True):
        raise IllegalMoveError("Game is already over.")

    try:
        move = chess.Move.from_uci(uci_move)
    except ValueError as exc:
        raise InvalidUciMoveError(f"Invalid UCI move: {uci_move}") from exc

    if move not in board.legal_moves:
        legal_moves = ", ".join(legal_moves_as_uci(board))
        detail = f" Legal moves: {legal_moves}" if legal_moves else ""
        raise IllegalMoveError(f"Illegal Antichess move: {uci_move}.{detail}")

    san = board.san(move)
    board.push(move)
    last_move = LastMove(
        from_square=chess.square_name(move.from_square),
        to_square=chess.square_name(move.to_square),
        san=san,
        uci=move.uci(),
    )
    return board, last_move


def check_game_over(board: chess.variant.AntichessBoard) -> dict[str, object]:
    outcome = board.outcome(claim_draw=True)
    winner = _winner_from_outcome(outcome)
    return {
        "game_over": outcome is not None,
        "result": board.result(claim_draw=True) if outcome else None,
        "winner": winner,
        "termination_reason": (
            outcome.termination.name.lower() if outcome is not None else None
        ),
    }


def serialize_board_state(board: chess.variant.AntichessBoard) -> BoardState:
    legal_moves = [] if board.is_game_over(claim_draw=True) else legal_moves_as_uci(board)
    game_status = check_game_over(board)
    return BoardState(
        fen=board.fen(),
        turn=_side_name(board.turn),
        legal_moves=legal_moves,
        legal_moves_by_square=legal_moves_by_square(legal_moves),
        game_over=bool(game_status["game_over"]),
        result=game_status["result"] if isinstance(game_status["result"], str) else None,
        winner=game_status["winner"] if _is_winner(game_status["winner"]) else None,
        termination_reason=(
            game_status["termination_reason"]
            if isinstance(game_status["termination_reason"], str)
            else None
        ),
        move_number=board.fullmove_number,
        ply=board.ply(),
    )


def legal_moves_as_uci(board: chess.variant.AntichessBoard) -> list[str]:
    return sorted(move.uci() for move in board.legal_moves)


def legal_moves_by_square(legal_moves: list[str]) -> dict[str, list[str]]:
    moves_by_square: dict[str, list[str]] = {}
    for move in legal_moves:
        if len(move) < 4:
            continue
        moves_by_square.setdefault(move[:2], []).append(move[2:4])
    return moves_by_square


def candidate_moves_from_board(
    board: chess.variant.AntichessBoard,
    limit: int = 3,
) -> list[tuple[chess.Move, str]]:
    candidates: list[tuple[chess.Move, str]] = []
    for move in list(board.legal_moves)[:limit]:
        candidates.append((move, board.san(move)))
    return candidates


def _side_name(turn: bool) -> str:
    return "white" if turn == chess.WHITE else "black"


def _winner_from_outcome(outcome: chess.Outcome | None) -> Winner | None:
    if outcome is None or outcome.winner is None:
        return None
    return "white" if outcome.winner == chess.WHITE else "black"


def _is_winner(value: object) -> bool:
    return value == "white" or value == "black"
