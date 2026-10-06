import { cn } from "@/lib/utils";
import { Swords } from "lucide-react";

export default function MoveCell({
  move,
  isLast,
  isSelected,
  onClick = () => {},
}) {
  if (!move)
    return <div className="h-7 flex-1 rounded px-2" aria-hidden="true" />;

  return (
    <button
      type="button"
      onClick={() => onClick({ ...move, isLast })}
      className={cn(
        "flex h-7 flex-1 items-center gap-1.5 rounded px-2 font-mono text-sm transition-colors",
        "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
        isSelected && "bg-accent text-accent-foreground",
        isLast && "bg-board-accent/15 font-semibold text-foreground",
        isLast && isSelected && "bg-accent",
        move.isCheckmate && "text-destructive font-semibold",
      )}
    >
      <span>{move.san}</span>
      {move.isCheckmate && <Swords className="" size={15} />}
    </button>
  );
}
