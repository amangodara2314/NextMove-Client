import { Zap, Timer, Clock } from "lucide-react";
import { cn } from "../../lib/utils";

export const CATEGORY_META = {
  BULLET: { icon: Zap, label: "Bullet" },
  BLITZ: { icon: Timer, label: "Blitz" },
  RAPID: { icon: Clock, label: "Rapid" },
};

export default function CategorySwitcher({
  types,
  activeType,
  onChange,
  ratings,
}) {
  return (
    <div className="flex items-center gap-1 rounded-2xl border border-border bg-card p-1">
      {types.map((category) => {
        const meta = CATEGORY_META[category] ?? { icon: Zap, label: category };
        const Icon = meta.icon;
        const isActive = activeType === category;
        const rating = ratings?.[category];

        return (
          <button
            key={category}
            onClick={() => onChange(category)}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-0.5 rounded-xl py-2.5 text-sm font-medium transition-colors outline-none",
              "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <span className="flex items-center gap-2">
              <Icon className="size-4" />
              {meta.label}
            </span>
            <span
              className={cn(
                "text-[11px] font-normal",
                isActive
                  ? "text-primary-foreground/80"
                  : "text-muted-foreground/70",
              )}
            >
              {Number.isFinite(rating) ? rating : "—"}
            </span>
          </button>
        );
      })}
    </div>
  );
}
