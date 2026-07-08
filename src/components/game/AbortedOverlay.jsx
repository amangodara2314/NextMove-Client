import { Ban } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AbortedOverlay({ abortedByYou }) {
  const navigate = useNavigate();

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/90 backdrop-blur-sm rounded-md">
      <div className="flex flex-col items-center gap-4 px-8 py-7 rounded-lg border border-border bg-card shadow-xl max-w-[280px] text-center">
        <div className="flex items-center justify-center h-11 w-11 rounded-full bg-amber-500/15">
          <Ban className="h-5 w-5 text-amber-400" />
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-semibold text-foreground tracking-tight">
            Game Aborted
          </h3>
          <p className="text-sm text-muted-foreground leading-snug">
            {abortedByYou
              ? "You aborted this game before it counted."
              : "Your opponent left before the game counted."}
          </p>
        </div>
      </div>
    </div>
  );
}
