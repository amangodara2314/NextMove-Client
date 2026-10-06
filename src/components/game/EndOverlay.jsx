import { Ban, Clock, Flag } from "lucide-react";

export default function EndOverlay({
  type,
  abortedBy,
  timedOutBy,
  resignedBy,
  myColor,
  ratingData,
}) {
  const isAborted = type === "ABORTED";
  const isTimeout = type === "TIMEOUT";
  const isResigned = type === "RESIGNED";
  let byYou = false;

  if (isAborted) {
    byYou = abortedBy === myColor;
  } else if (isTimeout) {
    byYou = timedOutBy === myColor;
  } else if (isResigned) {
    byYou = resignedBy === myColor;
  }

  const STYLE_MAP = {
    ABORTED: {
      icon: Ban,
      iconBg: "bg-amber-500/15",
      iconColor: "text-amber-400",
      title: "Game Aborted",
      description: byYou
        ? "You aborted this game before it counted."
        : "Your opponent left before the game counted.",
    },
    TIMEOUT: {
      icon: Clock,
      iconBg: byYou ? "bg-destructive/15" : "bg-emerald-500/15",
      iconColor: byYou ? "text-destructive" : "text-emerald-400",
      title: byYou ? "You Ran Out of Time" : "Opponent Ran Out of Time",
      description: byYou
        ? "Your clock hit zero. The game has ended by timeout."
        : "Their clock hit zero. You win by timeout.",
    },

    RESIGNED: {
      icon: Flag,
      iconBg: byYou ? "bg-destructive/15" : "bg-emerald-500/15",
      iconColor: byYou ? "text-destructive" : "text-emerald-400",
      title: byYou ? "You Resigned" : "Opponent Resigned",
      description: byYou
        ? "You resigned from this game."
        : "Your opponent resigned from this game.",
    },
  };

  const config = STYLE_MAP[type];

  const Icon = config.icon;

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/90 backdrop-blur-sm rounded-md">
      <div className="flex flex-col items-center gap-4 px-8 py-7 rounded-lg border border-border bg-card shadow-xl max-w-[280px] text-center">
        <div
          className={`flex items-center justify-center h-11 w-11 rounded-full ${config.iconBg}`}
        >
          <Icon className={`h-5 w-5 ${config.iconColor}`} />
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-semibold text-foreground tracking-tight">
            {config.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-snug">
            {config.description}
          </p>
          <p className="text-xs text-muted-foreground">
            {ratingData && (
              <span>
                Your rating: {ratingData.myRatingBefore} →{" "}
                {ratingData.myRatingAfter} (
                {ratingData.myRatingChange >= 0 ? "+" : ""}
                {ratingData.myRatingChange})
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
