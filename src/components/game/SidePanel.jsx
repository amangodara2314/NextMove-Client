import { Flag, Handshake } from "lucide-react";
import { Button } from "../ui/button";
import MoveList from "./MoveList";
import StatusBadge from "./StatusBadge";

export default function SidePanel({
  game,
  moves,
  myColor,
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
        <div className="flex flex-col gap-3 px-3 py-3">
          <Button>
            Resign <Flag />
          </Button>
          <Button>
            Offer Draw <Handshake />
          </Button>
        </div>
      )}
    </div>
  );
}
