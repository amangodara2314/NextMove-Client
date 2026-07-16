import {
  Swords,
  TriangleAlert,
  Zap,
  Timer,
  Clock,
  ArrowLeft,
  RotateCcw,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getErrorMessage, getResponseData } from "../utils/responseHelpers";
import { newGame } from "../services/matchmaking/matchmakingServices";
import Loader from "../components/Loader";
import { cn } from "../lib/utils";
import socket from "../configs/socket";
import { useNavigate } from "react-router-dom";
import useTimeControlSettings from "../hooks/useTimeControlSettings";

const CATEGORY_META = {
  BULLET: { icon: Zap, label: "Bullet" },
  BLITZ: { icon: Timer, label: "Blitz" },
  RAPID: { icon: Clock, label: "Rapid" },
};

function formatIncrement(increment) {
  if (!increment) return null;
  return `+${increment / 1000}s`;
}

export default function Matchmaking() {
  const [error, setError] = useState(null);
  const [noMatchFound, setNoMatchFound] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedControl, setSelectedControl] = useState(null);

  const {
    type,
    setType,
    types,
    settings,
    loadingSettings,
    error: settingsError,
  } = useTimeControlSettings();

  const navigate = useNavigate();

  // Default to the first available category once settings arrive
  useEffect(() => {
    if (!type && types?.length) {
      setType(types[1]);
    }
  }, [types, type, setType]);

  useEffect(() => {
    const handleMatchFound = (data) => {
      socket.emit("MATCH_ACK", { reservationId: data.reservationId });
    };

    const handleNoMatchFound = () => {
      setIsSearching(false);
      setNoMatchFound(true);
    };

    const handleMatchReady = (data) => {
      navigate(`/game/${data.gameId}`, { replace: true });
    };

    socket.on("MATCH_FOUND", handleMatchFound);
    socket.on("NO_MATCH_FOUND", handleNoMatchFound);
    socket.on("MATCH_READY", handleMatchReady);

    return () => {
      socket.off("MATCH_FOUND", handleMatchFound);
      socket.off("NO_MATCH_FOUND", handleNoMatchFound);
      socket.off("MATCH_READY", handleMatchReady);
      socket.emit("CANCEL_MATCHMAKING");
    };
  }, [navigate]);

  const startMatchmaking = async (control) => {
    setError(null);
    setNoMatchFound(false);
    setSelectedControl(control);
    setIsSearching(true);

    try {
      const response = await newGame({
        timeControl: control.timeControl,
      });
      const data = getResponseData(response);
      if (data?.gameId) {
        navigate(`/game/${data.gameId}`, { replace: true });
      }
    } catch (err) {
      setError(getErrorMessage(err));
      setIsSearching(false);
    }
  };

  const cancelSearch = () => {
    socket.emit("CANCEL_MATCHMAKING");
    setIsSearching(false);
    setSelectedControl(null);
  };

  const retrySearch = () => {
    setNoMatchFound(false);
    if (selectedControl) startMatchmaking(selectedControl);
  };

  const backToSelection = () => {
    setNoMatchFound(false);
    setError(null);
    setSelectedControl(null);
  };

  // Loading time control settings
  if (!settings && loadingSettings) {
    return (
      <div className="h-full bg-background flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  // Failed to load time control settings
  if (settingsError && !settings) {
    return (
      <div className="h-full bg-background text-foreground flex items-center justify-center px-6">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="p-3 rounded-2xl bg-card border border-border">
              <TriangleAlert className="size-6 text-destructive" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-destructive">
            Couldn't load time controls
          </h1>
          <p className="text-sm text-muted-foreground max-w-xs">
            {settingsError}
          </p>
          <Button
            variant="outline"
            className="rounded-xl px-6 mt-2"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // No opponent found
  if (noMatchFound) {
    return (
      <div className="h-full bg-background text-foreground flex items-center justify-center px-6">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="p-3 rounded-2xl bg-card border border-border">
              <TriangleAlert className="size-6 text-destructive" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            No players found
          </h1>
          <p className="text-sm text-muted-foreground max-w-xs">
            No active players at the moment. Please try again later.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button
              variant="outline"
              className="rounded-xl px-6"
              onClick={backToSelection}
            >
              Change time control
            </Button>
            <Button className="rounded-xl px-6" onClick={retrySearch}>
              <RotateCcw className="size-4" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Actively searching for a match
  if (isSearching) {
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
              {!error && selectedControl && (
                <p className="text-sm text-muted-foreground mt-2">
                  {CATEGORY_META[type]?.label} · {selectedControl.title}
                  {formatIncrement(selectedControl.increment) &&
                    ` (${formatIncrement(selectedControl.increment)})`}
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
                  <div
                    key={index}
                    className={isDark ? "bg-black" : "bg-white"}
                  />
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
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground animate-pulse">
                Searching for active players...
              </div>
              <Button
                variant="outline"
                className="rounded-xl px-6"
                onClick={cancelSearch}
              >
                Cancel Search
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              className="rounded-xl px-6"
              onClick={backToSelection}
            >
              Try Again
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Time control selection
  const activeSettings = settings?.[type] ?? [];

  return (
    <div className="h-full bg-background text-foreground flex items-center justify-center px-6">
      <div className="w-full max-w-lg">
        <Button
          variant="ghost"
          size="sm"
          className="mb-6 -ml-2 text-muted-foreground hover:text-foreground"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="size-4" />
          Back
        </Button>

        <div className="text-center space-y-2 mb-8">
          <div className="relative flex justify-center mb-3">
            <div className="absolute inset-0 rounded-2xl bg-primary/10 blur-2xl" />
            <div className="relative p-3 rounded-2xl bg-card border border-border">
              <Swords className="size-6" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Play Online</h1>
          <p className="text-sm text-muted-foreground">
            Choose a time control to find your opponent
          </p>
        </div>

        {/* Custom segmented control — consistent nested radius, no shadcn default clash */}
        <div className="flex items-center gap-1 rounded-2xl border border-border bg-card p-1">
          {types.map((category) => {
            const meta = CATEGORY_META[category] ?? {
              icon: Swords,
              label: category,
            };
            const Icon = meta.icon;
            const isActive = type === category;
            return (
              <button
                key={category}
                onClick={() => setType(category)}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="size-4" />
                {meta.label}
              </button>
            );
          })}
        </div>

        {/* Duration cards — flex-wrap + justify-center so uneven counts stay balanced */}
        <div className="flex flex-wrap justify-center gap-3 mt-5">
          {activeSettings.map((control) => (
            <button
              key={control.title}
              onClick={() => startMatchmaking(control)}
              className="group flex w-32 flex-col items-center justify-center gap-1 rounded-2xl border border-border bg-card px-4 py-5 transition-all hover:border-primary hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
            >
              <span className="text-xl font-semibold tracking-tight group-hover:text-primary transition-colors">
                {control.title}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatIncrement(control.increment) ?? "no increment"}
              </span>
            </button>
          ))}

          {activeSettings.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-6">
              No time controls available for this category.
            </p>
          )}
        </div>

        {error && (
          <p className="text-sm text-destructive text-center mt-4">{error}</p>
        )}
      </div>
    </div>
  );
}
