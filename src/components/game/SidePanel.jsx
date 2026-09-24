import MoveList from "./MoveList";
import StatusBadge from "./StatusBadge";
import DrawResignButtons from "./DrawResignButtons";

export default function SidePanel({
  game,
  moves,
  myColor,
  loadingMoves,
  hasMore,
  fetchMore,
  selectedMove,
  setSelectedMove,
  handleOfferDraw,
  handleResign,
}) {
  return (
    <div className="h-full flex flex-col min-h-0 bg-muted/10 border border-border rounded-lg">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border/60 shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-lg text-foreground tracking-tight">Moves</h2>
          <StatusBadge status={game.status} />
        </div>
      </div>

      {/* Move list */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <MoveList
          moves={moves}
          myColor={myColor}
          status={game.status}
          loadingMoves={loadingMoves}
          hasMore={hasMore}
          fetchMore={fetchMore}
          selectedMove={selectedMove}
          setSelectedMove={setSelectedMove}
          abortedBy={game.abortedBy}
        />
      </div>

      {/* Draw and Resign buttons */}
      {game.status === "ACTIVE" && (
        <DrawResignButtons
          handleOfferDraw={handleOfferDraw}
          handleResign={handleResign}
        />
      )}
    </div>
  );
}
