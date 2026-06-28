import { useEffect, useRef } from "react";
import groupMovePairs from "../../utils/groupMovePairs";
import { ScrollArea } from "../ui/scroll-area";
import { Skeleton } from "../ui/skeleton";
import MoveCell from "./MoveCell";

export default function MoveList({
  moves,
  loadingMoves,
  hasMore,
  fetchMore,
  selectedMove,
  setSelectedMove,
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
    <div className="h-full max-h-full flex flex-col min-h-0">
      {/* Column headers */}
      <div className="flex items-center gap-1 px-3 py-1.5 border-b border-border/50 shrink-0">
        <span className="w-8 text-xs text-muted-foreground uppercase tracking-wider">
          #
        </span>
        <span className="flex-1 text-xs text-muted-foreground uppercase tracking-wider">
          White
        </span>
        <span className="flex-1 text-xs text-muted-foreground uppercase tracking-wider">
          Black
        </span>
      </div>
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full" viewportRef={viewportRef}>
          {" "}
          <div className="px-2 py-1">
            {/* Empty state */}
            {!loadingMoves && pairs.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 gap-2 text-center">
                <span className="text-2xl">♟</span>
                <p className="text-sm text-muted-foreground">No moves yet.</p>
              </div>
            )}

            {/* Move rows */}
            {pairs.map((pair, pairIdx) => {
              const whiteIdx = pairIdx * 2;
              const blackIdx = pairIdx * 2 + 1;
              return (
                <div
                  key={pair.num}
                  className="flex items-center gap-1 mb-0.5 rounded"
                >
                  {/* Move number */}
                  <span className="w-8 text-sm text-muted-foreground font-mono shrink-0 px-1">
                    {pair.num}.
                  </span>
                  <MoveCell
                    move={pair.white}
                    isLast={whiteIdx === lastMoveIndex}
                    isSelected={selectedMove === pair.white}
                    onClick={() => setSelectedMove(pair.white)}
                  />
                  <MoveCell
                    move={pair.black}
                    isLast={blackIdx === lastMoveIndex}
                    isSelected={selectedMove === pair.black}
                    onClick={() => setSelectedMove(pair.black)}
                  />
                </div>
              );
            })}

            {/* Loading skeletons */}
            {loadingMoves &&
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-1 mb-0.5">
                  <Skeleton className="w-8 h-5 rounded" />
                  <Skeleton className="flex-1 h-7 rounded" />
                  <Skeleton className="flex-1 h-7 rounded" />
                </div>
              ))}

            {/* Load more */}
            {hasMore && !loadingMoves && moves.length > 0 && (
              <button
                onClick={fetchMore}
                className="w-full mt-1 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded transition-colors"
              >
                Load earlier moves
              </button>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
