import { boardSquares } from "../../data/mockGame";

const pieceGlyphs: Record<string, string> = {
  K: "♔",
  Q: "♕",
  R: "♖",
  B: "♗",
  N: "♘",
  P: "♙",
  k: "♚",
  q: "♛",
  r: "♜",
  b: "♝",
  n: "♞",
  p: "♟",
};

function ChessBoardPanel() {
  return (
    <div className="mx-auto w-full max-w-[42rem]">
      <div className="grid aspect-square grid-cols-8 overflow-hidden rounded-lg border border-white/15 bg-slate-950 shadow-2xl">
        {boardSquares.map((square, index) => {
          const rank = Math.floor(index / 8);
          const file = index % 8;
          const isLight = (rank + file) % 2 === 0;

          return (
            <div
              key={square.square}
              className={`relative flex aspect-square items-center justify-center ${
                isLight ? "bg-slate-300 text-slate-950" : "bg-slate-800 text-slate-50"
              }`}
            >
              <span className="absolute left-1.5 top-1 text-[10px] font-semibold uppercase text-current opacity-45 sm:text-xs">
                {square.square}
              </span>
              {square.isCandidate ? (
                <span className="absolute h-5 w-5 rounded-full bg-mint/55 ring-4 ring-mint/15" />
              ) : null}
              {square.isLastMove ? (
                <span className="absolute inset-0 border-4 border-ember/75" />
              ) : null}
              {square.piece ? (
                <span
                  className={`relative text-3xl leading-none sm:text-5xl ${
                    square.piece === square.piece.toUpperCase()
                      ? "drop-shadow-[0_2px_2px_rgba(0,0,0,0.35)]"
                      : "text-slate-950 drop-shadow-[0_1px_1px_rgba(255,255,255,0.35)]"
                  }`}
                  aria-label={`${square.piece === square.piece.toUpperCase() ? "White" : "Black"} piece on ${square.square}`}
                >
                  {pieceGlyphs[square.piece]}
                </span>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="mt-4 grid gap-3 text-sm text-slate-400 sm:grid-cols-3">
        <div className="rounded-md border border-white/10 bg-white/[0.035] px-3 py-2">
          Variant: <span className="font-medium text-slate-100">Giveaway</span>
        </div>
        <div className="rounded-md border border-white/10 bg-white/[0.035] px-3 py-2">
          Rule engine: <span className="font-medium text-slate-100">Mock</span>
        </div>
        <div className="rounded-md border border-white/10 bg-white/[0.035] px-3 py-2">
          Move index: <span className="font-medium text-slate-100">4 / 4</span>
        </div>
      </div>
    </div>
  );
}

export default ChessBoardPanel;
