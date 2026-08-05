import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Check, X } from "lucide-react";

function DrawOfferToast({ ttl, toastId, onAccept, onDecline }) {
  const [timeLeft, setTimeLeft] = useState(ttl);

  useEffect(() => {
    if (timeLeft <= 0) {
      toast.dismiss(toastId);
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  return (
    <div className="flex w-full max-w-sm items-center gap-3 rounded-lg border border-border bg-popover px-4 py-3 text-popover-foreground shadow-lg">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium leading-none">Draw offer</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Expires in {timeLeft}s
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          aria-label="Accept draw"
          onClick={() => {
            onAccept?.();
            toast.dismiss(toastId);
          }}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <Check className="h-4 w-4" />
        </button>

        <button
          type="button"
          aria-label="Decline draw"
          onClick={() => {
            onDecline?.();
            toast.dismiss(toastId);
          }}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function showDrawOfferToast({ ttl, onAccept, onDecline }) {
  toast.custom(
    (id) => (
      <DrawOfferToast
        ttl={ttl}
        toastId={id}
        onAccept={onAccept}
        onDecline={onDecline}
      />
    ),
    {
      id: "draw-offer",
      duration: ttl * 1000,
    },
  );
}
