import { pieceSymbol } from "../../constants/pieces";
import { cn } from "@/lib/utils";

export default function MoveCell({
  move,
  isLast,
  isSelected,
  onClick = () => {},
}) {
  if (!move)
    return <div className="h-7 flex-1 rounded px-2" aria-hidden="true" />;

  const badge = move.isCheckmate
    ? { label: "#", className: "bg-destructive/15 text-destructive" }
    : move.isCheck
      ? { label: "+", className: "bg-board-accent/15 text-board-accent" }
      : null;

  return (
    <button
      type="button"
      onClick={() => onClick({ ...move, isLast })}
      className={cn(
        "flex h-7 flex-1 items-center gap-1.5 rounded px-2 font-mono text-sm transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
        isLast
          ? "bg-board-accent/15 font-semibold text-foreground"
          : isSelected
            ? "bg-accent text-accent-foreground"
            : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
      )}
    >
      {pieceSymbol(move.piece) && (
        <span className="text-xs font-bold text-board-accent">
          {pieceSymbol(move.piece)}
        </span>
      )}
      <span>{move.san}</span>
      {badge && (
        <span
          className={cn("rounded px-1 text-[10px] font-bold", badge.className)}
        >
          {badge.label}
        </span>
      )}
      {move.captured && (
        <span className="ml-auto text-[10px] text-destructive/70">×</span>
      )}
    </button>
  );
}
