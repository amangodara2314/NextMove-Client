import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "../../lib/utils";
import { Badge } from "@/components/ui/badge";

function getGameSummary(game, currentUsername) {
  const isWhite = game.whitePlayer?.username === currentUsername;
  const opponent = isWhite ? game.blackPlayer : game.whitePlayer;
  const ratingBefore = isWhite
    ? game.whiteRatingBefore
    : game.blackRatingBefore;
  const ratingAfter = isWhite ? game.whiteRatingAfter : game.blackRatingAfter;
  const ratingDelta =
    ratingAfter != null && ratingBefore != null
      ? ratingAfter - ratingBefore
      : null;

  let outcome = "draw";
  if (game.status === "ABORTED") {
    outcome = "aborted";
  } else if (game.result === "WHITE") {
    outcome = isWhite ? "win" : "loss";
  } else if (game.result === "BLACK") {
    outcome = isWhite ? "loss" : "win";
  }

  return { isWhite, opponent, ratingDelta, outcome };
}

const OUTCOME_STYLES = {
  win: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  loss: "bg-destructive/10 text-destructive",
  draw: "bg-muted text-muted-foreground",
  aborted: "bg-muted text-muted-foreground",
};

const OUTCOME_LABELS = {
  win: "Win",
  loss: "Loss",
  draw: "Draw",
  aborted: "Aborted",
};

function formatTimeControl(timeControl) {
  if (!timeControl) return "Unknown";
  const [category, minutes, increment] = timeControl.split("_");
  const label = category.charAt(0) + category.slice(1).toLowerCase();
  return `${label} ${minutes}+${increment}`;
}

function timeAgo(dateString) {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return new Date(dateString).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export default function GameRow({ game, currentUsername }) {
  const { isWhite, opponent, ratingDelta, outcome } = getGameSummary(
    game,
    currentUsername,
  );
  const username = opponent?.username ?? "Unknown player";
  const initials = username.slice(0, 2).toUpperCase();

  return (
    <Link
      to={`/game/${game.id}`}
      className="flex items-center gap-4 px-3 py-3.5 transition-colors hover:bg-muted/50"
    >
      <Avatar className="h-9 w-9 shrink-0">
        <AvatarImage src={opponent?.profileImage ?? undefined} alt={username} />
        <AvatarFallback className="text-xs">{initials}</AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "h-2 w-2 shrink-0 rounded-full border border-border",
              isWhite ? "bg-neutral-50" : "bg-neutral-900",
            )}
            aria-hidden="true"
          />
          <span className="truncate text-sm font-medium text-foreground">
            {username}
          </span>
        </div>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {formatTimeControl(game.timeControl)} · {timeAgo(game.createdAt)}
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1">
        <Badge
          variant="secondary"
          className={cn(
            "rounded-full border-transparent px-2 py-0 text-xs font-normal",
            OUTCOME_STYLES[outcome],
          )}
        >
          {OUTCOME_LABELS[outcome]}
        </Badge>
        {ratingDelta != null ? (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-xs",
              ratingDelta > 0 && "text-emerald-600 dark:text-emerald-400",
              ratingDelta < 0 && "text-destructive",
              ratingDelta === 0 && "text-muted-foreground",
            )}
          >
            {ratingDelta > 0 && <TrendingUp className="h-3 w-3" />}
            {ratingDelta < 0 && <TrendingDown className="h-3 w-3" />}
            {ratingDelta === 0 && <Minus className="h-3 w-3" />}
            {ratingDelta > 0 ? `+${ratingDelta}` : ratingDelta}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )}
      </div>
    </Link>
  );
}
