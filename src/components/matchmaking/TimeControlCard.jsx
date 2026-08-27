import { cn } from "../../lib/utils";
import { formatIncrement } from "../../utils/helper";
import RatingBadge from "./RatingBadge";

export default function TimeControlCard({ control, rating, onSelect }) {
  const onlinePlayers = control.onlinePlayers;

  return (
    <button
      onClick={() => onSelect(control)}
      className={cn(
        "group relative flex w-36 flex-col items-start gap-3 rounded-2xl border border-border bg-card px-4 py-4 text-left transition-all outline-none",
        "hover:border-primary hover:shadow-md hover:-translate-y-0.5 active:translate-y-0",
        "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      )}
    >
      {Number.isFinite(onlinePlayers) && (
        <span className="absolute right-3 top-3 flex items-center gap-1 text-[11px] text-muted-foreground">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          {onlinePlayers}
        </span>
      )}

      <div className="flex w-full items-baseline justify-between pr-6">
        <span className="text-2xl font-semibold tracking-tight group-hover:text-primary transition-colors">
          {control.title}
        </span>
      </div>

      <span className="text-xs text-muted-foreground">
        {formatIncrement(control.increment) ?? "no increment"}
      </span>

      <RatingBadge rating={rating} />
    </button>
  );
}
