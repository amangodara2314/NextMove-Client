import MoveList from "./MoveList";

export default function SidePanel({
  game,
  moves,
  loadingMoves,
  hasMore,
  fetchMore,
  selectedMove,
  setSelectedMove,
}) {
  const started = new Date(game.createdAt);
  const startedStr =
    started.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) +
    " · " +
    started.toLocaleDateString([], { month: "short", day: "numeric" });

  return (
    <div className="flex flex-col shrink-0 pb-2 rounded-lg border border-border/60 bg-card/60 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border/60 shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-lg text-foreground tracking-tight">Moves</h2>
          <span
            className={[
              "text-xs uppercase tracking-wider px-1.5 py-0.5 rounded-full",
              game.result
                ? "bg-muted text-muted-foreground"
                : "bg-emerald-500/15 text-emerald-400",
            ].join(" ")}
          >
            {game.result ? "Finished" : "Live"}
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
          selectedMove={selectedMove}
          setSelectedMove={setSelectedMove}
        />
      </div>
    </div>
  );
}
