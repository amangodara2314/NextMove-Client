import { Link } from "react-router-dom";
import { ChevronRight, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { cn } from "../../lib/utils";
import GameRow from "./GameRow";
import GameRowSkeleton from "./GameRowSkeleton";
import GamesList from "./GamesList";

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

      <GamesList
        games={games}
        loading={loading}
        error={error}
        currentUsername={currentUsername}
        maxRows={maxRows}
      />
    </>
  );
}
