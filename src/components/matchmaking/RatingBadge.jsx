import { cn } from "../../lib/utils";

const TIERS = [
  { max: 1199, label: "Beginner", className: "bg-slate-500/10 text-slate-500" },
  { max: 1499, label: "Intermediate", className: "bg-sky-500/10 text-sky-500" },
  {
    max: 1799,
    label: "Advanced",
    className: "bg-violet-500/10 text-violet-500",
  },
  { max: 2099, label: "Expert", className: "bg-amber-500/10 text-amber-500" },
  { max: Infinity, label: "Master", className: "bg-rose-500/10 text-rose-500" },
];

function getTier(rating) {
  return TIERS.find((tier) => rating <= tier.max) ?? TIERS[TIERS.length - 1];
}

export default function RatingBadge({ rating, className }) {
  if (!Number.isFinite(rating)) {
    return (
      <span
        className={cn("text-xs font-medium text-muted-foreground", className)}
      >
        Unrated
      </span>
    );
  }

  const tier = getTier(rating);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        tier.className,
        className,
      )}
    >
      {rating}
      <span className="font-normal opacity-70">{tier.label}</span>
    </span>
  );
}
