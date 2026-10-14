import { Ban, Clock, Flag } from "lucide-react";

export default function EndOverlay({ status, isWinner, ratingData }) {
  if (!status || status === "ACTIVE") return null;
  const baseDesign = {
    iconBg: isWinner ? "bg-emerald-500/15" : "bg-destructive/15",
    iconColor: isWinner ? "text-emerald-400" : "text-destructive",
  };

  const STYLE_MAP = {
    ABORTED: {
      icon: Ban,
      title: "Game Aborted",
      description: isWinner
        ? "Your opponent left before the game counted."
        : "You aborted this game before it counted.",
      ...baseDesign,
    },
    TIMEOUT: {
      icon: Clock,
      title: isWinner ? "Opponent Ran Out of Time" : "You Ran Out of Time",
      description: isWinner
        ? "Their clock hit zero. You win by timeout."
        : "Your clock hit zero. The game has ended by timeout.",
      ...baseDesign,
    },

    RESIGNED: {
      icon: Flag,
      title: isWinner ? "Opponent Resigned" : "You Resigned",
      description: isWinner
        ? "Your opponent resigned from this game."
        : "You resigned from this game.",
      ...baseDesign,
    },

    DRAW: {
      icon: Flag,
      title: "Draw",
      description: "The game has ended in a draw.",
      ...baseDesign,
    },

    FINISHED: {
      icon: Flag,
      title: isWinner ? "You Won the game" : "You Lost the",
      description: isWinner
        ? "Well Done! You won the game."
        : "Your opponent defeated you. Better luck next time.",
      ...baseDesign,
    },
  };

  const config = STYLE_MAP[status];

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
