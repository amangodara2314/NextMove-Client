import { Swords, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "../../lib/utils";
import useElapsedSeconds from "../../hooks/useElapsedSeconds.js";
import MatchmakingBoard from "./MatchmakingBoard";
import { CATEGORY_META } from "./CategorySwitcher";
import { formatIncrement } from "../../utils/helper";

function formatElapsed(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function getRatingSpread(seconds) {
  return Math.min(50 + Math.floor(seconds / 5) * 25, 400);
}

export default function SearchingState({
  type,
  selectedControl,
  rating,
  error,
  onCancel,
  onRetry,
}) {
  const elapsed = useElapsedSeconds(!error);
  const increment = formatIncrement(selectedControl?.increment);

  return (
    <div className="h-full bg-background text-foreground flex items-center justify-center px-6">
      <div className="w-full max-w-md flex flex-col items-center gap-8">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="p-3 rounded-2xl bg-card border border-border">
              {error ? (
                <TriangleAlert className="size-6 text-destructive" />
              ) : (
                <Swords className="size-6" />
              )}
            </div>
          </div>

          <div>
            <h1
              className={cn(
                "text-2xl font-semibold tracking-tight",
                error && "text-destructive",
              )}
            >
              {error ? error : "Finding your opponent"}
            </h1>
            {!error && selectedControl && (
              <p className="text-sm text-muted-foreground mt-2">
                {CATEGORY_META[type]?.label} · {selectedControl.title}
                {increment && ` (${increment})`}
              </p>
            )}
          </div>
        </div>

        <MatchmakingBoard active={!error} />

        {!error ? (
          <>
            <div className="flex flex-col items-center gap-1 text-sm text-muted-foreground">
              <span className="font-mono text-base text-foreground">
                {formatElapsed(elapsed)}
              </span>
              <span>
                Matching within ±{getRatingSpread(elapsed)}
                {Number.isFinite(rating) ? ` of ${rating}` : ""}
              </span>
            </div>
            <Button
              variant="outline"
              className="rounded-xl px-6"
              onClick={onCancel}
            >
              Cancel Search
            </Button>
          </>
        ) : (
          <Button
            variant="outline"
            className="rounded-xl px-6"
            onClick={onRetry}
          >
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
}
