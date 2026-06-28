import { pieceSymbol } from "../../constants/pieces";

export default function MoveCell({
  move,
  isLast,
  isSelected,
  onClick = () => {},
}) {
  if (!move) return <span className="flex-1 px-2 py-1.5 text-sm font-mono" />;

  const badge = move.isCheckmate
    ? { label: "#", cls: "bg-red-500/20 text-red-400" }
    : move.isCheck
      ? { label: "+", cls: "bg-amber-500/20 text-amber-400" }
      : null;
  const handleClick = () => {
    onClick({ ...move, isLast });
  };
  return (
    <span
      onClick={handleClick}
      className={[
        "flex-1 flex items-center gap-1.5 px-2 py-1.5 rounded text-sm font-mono",
        "transition-colors duration-100 select-none",
        isLast
          ? "bg-[#B58863]/20 text-foreground font-semibold"
          : isSelected
            ? "bg-accent text-accent-foreground"
            : "text-muted-foreground hover:text-foreground hover:bg-accent/50 cursor-default",
      ].join(" ")}
    >
      {/* Piece glyph */}
      {pieceSymbol(move.piece) && (
        <span className="text-[#B58863] text-xs font-bold">
          {pieceSymbol(move.piece)}
        </span>
      )}
      {/* SAN notation */}
      <span>{move.san}</span>
      {/* Check / checkmate badge */}
      {badge && (
        <span className={`text-[10px] font-bold px-1 rounded ${badge.cls}`}>
          {badge.label}
        </span>
      )}
      {/* Capture dot */}
      {move.captured && (
        <span className="ml-auto text-[10px] text-rose-400 opacity-70">×</span>
      )}
    </span>
  );
}
