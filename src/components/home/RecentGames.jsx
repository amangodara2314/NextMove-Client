import { Link } from "react-router-dom";
import { ChevronRight, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { cn } from "../../lib/utils";
import GameRow from "./GameRow";
import GameRowSkeleton from "./GameRowSkeleton";

export default function RecentGames({
  games = [],
  loading = false,
  error = null,
  currentUsername,
  maxRows = 8,
}) {
  return (
    <>
      <h2 className="my-4 text-xs font-medium uppercase tracking-widest text-muted-foreground flex flex-row items-center justify-between space-y-0">
        Recent Games
        {!loading && !error && games.length > 0 && (
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            <Link to="/games">
              View all
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        )}
      </h2>

      <Card className="p-0">
        <CardContent className="p-0">
          {loading ? (
            <div className="divide-y divide-border">
              {Array.from({ length: 5 }).map((_, i) => (
                <GameRowSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="px-6 py-10 text-center text-sm text-muted-foreground">
              Couldn't load your recent games. Try refreshing the page.
            </div>
          ) : games.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
              <p className="text-sm text-muted-foreground">
                You haven't played any games yet.
              </p>
              <Button asChild size="sm">
                <Link to="/play">Play your first game</Link>
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {games.slice(0, maxRows).map((game) => (
                <GameRow
                  key={game.id}
                  game={game}
                  currentUsername={currentUsername}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
