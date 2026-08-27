import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SettingsErrorState({ message, onRetry }) {
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
        <p className="text-sm text-muted-foreground max-w-xs">{message}</p>
        <Button
          variant="outline"
          className="rounded-xl px-6 mt-2"
          onClick={onRetry}
        >
          Try Again
        </Button>
      </div>
    </div>
  );
}
