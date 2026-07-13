import { useEffect, useRef } from "react";
import { ChevronUp } from "lucide-react";
import groupMovePairs from "../../utils/groupMovePairs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import MoveCell from "./MoveCell";

export default function MoveList({
  moves,
  myColor,
  loadingMoves,
  hasMore,
  fetchMore,
  selectedMove,
  setSelectedMove,
  status = "ACTIVE",
}) {
  const pairs = groupMovePairs(moves);
  const lastMoveIndex = moves.length - 1;
  const viewportRef = useRef(null);

  useEffect(() => {
    viewportRef.current?.scrollTo({
      top: viewportRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [moves.length]);

  return (
    <div className="flex h-full max-h-full min-h-0 flex-col">
      <div className="flex shrink-0 items-center gap-1 border-b border-border/50 px-3 py-2">
        <span className="w-8 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          #
        </span>
        <span className="flex-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          White
        </span>
        <span className="flex-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Black
        </span>
      </div>

      <div className="min-h-0 flex-1">
        <ScrollArea className="h-full" viewportRef={viewportRef}>
          <div className="px-2 py-1.5">
            {!loadingMoves && pairs.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                <span className="text-2xl text-muted-foreground/40">♟</span>
                {status === "ACTIVE" ? (
                  <p className="text-sm text-muted-foreground">
                    No moves yet –{" "}
                    {myColor === "WHITE"
                      ? "make the first move"
                      : "waiting for your opponent"}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No moves were made in this game.
                  </p>
                )}
              </div>
            )}

            {pairs.map((pair, pairIdx) => {
              const whiteIdx = pairIdx * 2;
              const blackIdx = pairIdx * 2 + 1;
              return (
                <div key={pair.num} className="mb-0.5 flex items-center gap-1">
                  <span className="w-8 shrink-0 px-1 font-mono text-sm text-muted-foreground">
                    {pair.num}.
                  </span>
                  <MoveCell
                    move={pair.white}
                    isLast={whiteIdx === lastMoveIndex}
                    isSelected={selectedMove === pair.white}
                    onClick={setSelectedMove}
                  />
                  <MoveCell
                    move={pair.black}
                    isLast={blackIdx === lastMoveIndex}
                    isSelected={selectedMove === pair.black}
                    onClick={setSelectedMove}
                  />
                </div>
              );
            })}

            {loadingMoves &&
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="mb-0.5 flex items-center gap-1">
                  <Skeleton className="h-5 w-8 rounded" />
                  <Skeleton className="h-7 flex-1 rounded" />
                  <Skeleton className="h-7 flex-1 rounded" />
                </div>
              ))}

            {hasMore && !loadingMoves && moves.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchMore}
                className="mt-1 w-full gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <ChevronUp className="h-3 w-3" />
                Load earlier moves
              </Button>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
