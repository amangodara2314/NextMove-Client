const DEFAULT_TIME_SPENT = 10;

const PIECE_LABELS = { q: "Queen", r: "Rook", n: "Knight", b: "Bishop" };
const PROMOTION_PIECES = ["q", "r", "n", "b"];
const PIECE_UNICODE = {
  wq: "♕",
  wr: "♖",
  wn: "♘",
  wb: "♗",
  bq: "♛",
  br: "♜",
  bn: "♞",
  bb: "♝",
};

function pieceSymbol(piece) {
  const map = {
    PAWN: "",
    KNIGHT: "N",
    BISHOP: "B",
    ROOK: "R",
    QUEEN: "Q",
    KING: "K",
  };
  return map[piece] ?? "";
}

export {
  DEFAULT_TIME_SPENT,
  PIECE_LABELS,
  PROMOTION_PIECES,
  PIECE_UNICODE,
  pieceSymbol,
};
