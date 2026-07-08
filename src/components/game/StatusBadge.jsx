import { Circle, Ban, Flag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STATUS_MAP = {
  ACTIVE: {
    label: "Live",
    icon: Circle,
    badgeClassName: "border-emerald-500/20 bg-emerald-500/10 text-emerald-500",
    iconClassName: "fill-emerald-500 text-emerald-500 animate-pulse",
  },
  ABORTED: {
    label: "Aborted",
    icon: Ban,
    badgeClassName:
      "border-board-accent/20 bg-board-accent/10 text-board-accent",
    iconClassName: "text-board-accent",
  },
  FINISHED: {
    label: "Finished",
    icon: Flag,
    badgeClassName: "border-border bg-muted text-muted-foreground",
    iconClassName: "text-muted-foreground",
  },
};

export default function StatusBadge({ status, className }) {
  const key = status === "ACTIVE" || status === "ABORTED" ? status : "FINISHED";
  const { label, icon: Icon, badgeClassName, iconClassName } = STATUS_MAP[key];

  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 py-0.5 font-medium tracking-wide",
        badgeClassName,
        className,
      )}
    >
      <Icon className={cn("h-2 w-2", iconClassName)} />
      {label}
    </Badge>
  );
}
