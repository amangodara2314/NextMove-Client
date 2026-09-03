import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GameRowSkeleton from "./GameRowSkeleton";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import GameRow from "./GameRow";
import { useEffect, useRef } from "react";
import Loader from "../Loader";

export default function GamesList({
  games,
  loading,
  error,
  currentUsername,
  loaderRef,
  fetchGames,
}) {
  const fetchGamesRef = useRef(fetchGames);
  useEffect(() => {
    fetchGamesRef.current = fetchGames;
  }, [fetchGames]);

  useEffect(() => {
    const node = loaderRef?.current;
    if (!node) return;
    console.log("Setting up IntersectionObserver for loaderRef:", node);

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        console.log("Loader is visible, fetching more games...");
        fetchGamesRef.current();
      }
    });

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [loaderRef, games.length]);
  return (
    <Card className="p-0">
      <CardContent className="p-0">
        {loading && games.length === 0 ? (
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
            {games.map((game) => (
              <GameRow
                key={game.id}
                game={game}
                currentUsername={currentUsername}
              />
            ))}
            {loaderRef && (
              <div
                ref={loaderRef}
                className="min-h-0 w-full bg-transparent flex justify-center items-center"
              >
                {loading && (
                  <div className="py-6">
                    {" "}
                    <Loader />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
