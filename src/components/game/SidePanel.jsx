import MoveList from "./MoveList";

export default function SidePanel({
  game,
  moves,
  loadingMoves,
  hasMore,
  fetchMore,
}) {
  const started = new Date(game.createdAt);
  const startedStr =
    started.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) +
    " · " +
    started.toLocaleDateString([], { month: "short", day: "numeric" });

  return (
    <div className="flex flex-col w-64 shrink-0 h-full rounded-lg border border-border/60 bg-card/60 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border/60 shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground tracking-tight">
            Moves
          </h2>
          <span className="text-[11px] text-muted-foreground/60 font-mono">
            {startedStr}
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-1.5">
          <span
            className={[
              "text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full",
              game.result
                ? "bg-muted text-muted-foreground"
                : "bg-emerald-500/15 text-emerald-400",
            ].join(" ")}
          >
            {game.result ? "Finished" : "Live"}
          </span>
          <span className="text-[11px] text-muted-foreground/60">
            {moves.length} {moves.length === 1 ? "move" : "moves"}
          </span>
        </div>
      </div>

      {/* Move list */}
      <div className="flex-1 min-h-0">
        <MoveList
          moves={moves}
          loadingMoves={loadingMoves}
          hasMore={hasMore}
          fetchMore={fetchMore}
        />
      </div>
    </div>
  );
}
