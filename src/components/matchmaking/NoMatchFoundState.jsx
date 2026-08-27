import { TriangleAlert, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NoMatchFoundState({ onChangeTimeControl, onRetry }) {
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
            onClick={onChangeTimeControl}
          >
            Change time control
          </Button>
          <Button className="rounded-xl px-6" onClick={onRetry}>
            <RotateCcw className="size-4" />
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}
