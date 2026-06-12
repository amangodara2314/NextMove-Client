import { Loader2, Swords, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { getErrorMessage } from "../utils/responseHelpers";
import { newGame } from "../services/matchmaking.js/matchmakingServices";
import Loader from "../components/Loader";
import { cn } from "../lib/utils";

export default function Play() {
  const [error, setError] = useState(null);

  useEffect(() => {
    const initiateMatchmaking = async () => {
      try {
        // Call the API to start matchmaking
        await newGame();
      } catch (error) {
        const message = getErrorMessage(error);
        setError(message);
      }
    };
    initiateMatchmaking();
  }, []);

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
            {!error && (
              <p className="text-sm text-muted-foreground mt-2">
                Matching you with a player of similar skill...
              </p>
            )}
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 rounded-2xl bg-primary/10 blur-3xl" />

          <div className="relative grid grid-cols-8 w-72 h-72 rounded-2xl overflow-hidden border border-border shadow-xl">
            {Array.from({ length: 64 }, (_, index) => {
              const row = Math.floor(index / 8);
              const col = index % 8;
              const isDark = (row + col) % 2 === 1;

              return (
                <div key={index} className={isDark ? "bg-black" : "bg-white"} />
              );
            })}
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="size-15 rounded-full border border-border bg-card/80 backdrop-blur-md flex items-center justify-center animate-pulse">
              {error ? (
                <TriangleAlert className="size-6 text-destructive" />
              ) : (
                <Loader />
              )}
            </div>
          </div>
        </div>
        {!error ? (
          <>
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground animate-pulse">
                Searching for active players...
              </div>
            </div>

            <Button variant="outline" className="rounded-xl px-6">
              Cancel Search
            </Button>
          </>
        ) : (
          <div className="text-destructive">
            Something went wrong. Please try again later...
          </div>
        )}
      </div>
    </div>
  );
}
