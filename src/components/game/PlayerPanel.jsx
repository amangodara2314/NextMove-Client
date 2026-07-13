import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { WifiOff } from "lucide-react";
function PlayerPanel({
  player,
  color,
  active,
  isYou,
  borderSide,
  isConnected,
  gameStatus,
}) {
  return (
    <div className="relative h-14 shrink-0 flex items-center gap-2 ml-1">
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

      <div className="space-x-0">
        <div
          className={[
            "text-lg leading-none truncate transition-colors duration-300",
            isConnected ? "text-foreground" : "text-muted-foreground",
          ].join(" ")}
        >
          {player.username}
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
    </div>
  );
}

export default PlayerPanel;
