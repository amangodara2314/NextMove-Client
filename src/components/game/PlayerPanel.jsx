import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { WifiOff } from "lucide-react";
import Clock from "./Clock";

function PlayerPanel({
  player,
  color,
  active,
  isYou,
  borderSide = "left",
  isConnected,
  gameStatus,
  timeLeft = 0, // in ms
}) {
  const isRunning = active && gameStatus === "ACTIVE";

  return (
    <div
      className={[
        "relative h-14 shrink-0 flex items-center gap-2 ml-1 pl-2 pr-1",
        "transition-colors duration-300",
        borderSide === "right" ? "border-r-2 pr-2" : "border-l-2 pl-2",
        isRunning ? "border-primary" : "border-transparent",
      ].join(" ")}
    >
      <div className="relative shrink-0">
        <Avatar
          className={[
            active && gameStatus === "ACTIVE" ? "ring-1 ring-primary" : "",
            !isConnected ? "grayscale opacity-50" : "",
          ].join(" ")}
          size="lg"
        >
          <AvatarFallback className="text-secondary-foreground">
            {player.username[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {/* presence dot, bottom-right of avatar */}
        {gameStatus === "ACTIVE" && (
          <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
            {!isConnected && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" />
            )}
            <span
              title={isConnected ? "Connected" : "Disconnected"}
              className={[
                "relative inline-flex h-3 w-3 rounded-full ring-2 ring-background",
                isConnected ? "bg-emerald-500" : "bg-destructive",
              ].join(" ")}
            />
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0 space-x-0">
        <div className="flex items-center gap-1.5">
          <div
            className={[
              "text-lg leading-none truncate transition-colors duration-300",
              isConnected ? "text-foreground" : "text-muted-foreground",
            ].join(" ")}
          >
            {player.username}
          </div>
          {isYou && (
            <span className="text-[10px] uppercase tracking-wide text-muted-foreground/70 leading-none">
              you
            </span>
          )}
        </div>

        {isConnected ? (
          <span className="text-sm text-muted-foreground leading-none">
            #{player.rating}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-sm font-medium text-destructive leading-none animate-pulse">
            <WifiOff className="h-3.5 w-3.5" />
            Disconnected
          </span>
        )}
      </div>

      <Clock timeLeft={timeLeft} isRunning={isRunning} />
    </div>
  );
}

export default PlayerPanel;
