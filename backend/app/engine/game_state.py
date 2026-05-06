from app.schemas.game import (
    CandidateMove,
    GameStateResponse,
    LastMove,
    LegalMovesResponse,
    MoveHistoryEntry,
)

MOCK_GAME_ID = "mock-game-001"
MOCK_FEN = "r1bqkbnr/pp2ppp1/2np3p/8/2P1P3/2N5/PP1P1PPP/R1BQKBNR w KQkq - 0 4"
MOCK_LEGAL_MOVES: dict[str, list[str]] = {
    "c4": ["d5"],
    "g1": ["f3"],
    "d1": ["a4"],
}
MOCK_MOVE_HISTORY = [
    MoveHistoryEntry(turn=1, white="e3", black="d6"),
    MoveHistoryEntry(turn=2, white="c4", black="Nc6"),
    MoveHistoryEntry(turn=3, white="Nc3", black="h6"),
    MoveHistoryEntry(turn=4, white="e4", black=None),
]
MOCK_CANDIDATES = [
    CandidateMove(move="c4d5", san="cxd5", confidence=0.42, line=["cxd5", "exd5", "Nxd5"]),
    CandidateMove(move="g1f3", san="Nf3", confidence=0.31, line=["Nf3", "Bg4", "Be2"]),
    CandidateMove(move="d1a4", san="Qa4", confidence=0.18, line=["Qa4", "Bd7", "Qd1"]),
]


def create_mock_game(player_color: str = "white", bot_type: str = "random") -> GameStateResponse:
    return GameStateResponse(
        game_id=MOCK_GAME_ID,
        variant="Giveaway / Antichess",
        fen=MOCK_FEN,
        side_to_move="white",
        status="active",
        message="Mock Giveaway game created. Real rules are not implemented yet.",
        player_color=player_color,
        bot_type=bot_type,
        legal_moves=MOCK_LEGAL_MOVES,
        move_history=MOCK_MOVE_HISTORY,
        last_move=LastMove(from_square="e3", to_square="e4", san="e4", uci="e3e4"),
        candidate_moves=MOCK_CANDIDATES,
        is_mock=True,
    )


def get_mock_legal_moves(fen: str | None = None, game_id: str | None = None) -> LegalMovesResponse:
    return LegalMovesResponse(
        game_id=game_id or MOCK_GAME_ID,
        fen=fen or MOCK_FEN,
        legal_moves=MOCK_LEGAL_MOVES,
        message="Mock legal moves only. Backend variant validation comes later.",
        is_mock=True,
    )
