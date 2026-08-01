import {
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Puzzle,
  Eye,
  LineChart,
  GraduationCap,
  ChessKing,
  ChessQueen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "../lib/utils";
import { useSelector } from "react-redux";
import { selectUser } from "../features/auth/authSelectors";
import { Link } from "react-router-dom";

function ChessEmblem({ className }) {
  return (
    <div className={cn("relative", className)}>
      <ChessKing className="absolute inset-0 h-1/2 w-1/2" />
    </div>
  );
}

const QUICK_ACTIONS = [
  {
    label: "Puzzles",
    desc: "Sharpen your tactics",
    icon: Puzzle,
    to: "/puzzles",
  },
  { label: "Watch", desc: "Live games right now", icon: Eye, to: "/watch" },
  { label: "Analyze", desc: "Review a game", icon: LineChart, to: "/analysis" },
  {
    label: "Learn",
    desc: "Lessons & openings",
    icon: GraduationCap,
    to: "/learn",
  },
];

export default function Home() {
  const user = useSelector(selectUser);
  const isPositive = (user?.ratingDelta ?? 0) >= 0;
  const DeltaIcon = isPositive ? TrendingUp : TrendingDown;

  const stats = [
    { label: "Rating", value: user?.rating ?? "—" },
    { label: "Games played", value: user?.gamesPlayed ?? "—" },
    {
      label: "Win rate",
      value: user?.winRate != null ? `${user.winRate}%` : "—",
    },
    {
      label: "Current streak",
      value: user?.streak != null ? `${user.streak} wins` : "—",
    },
  ];

  return (
    <div className="h-full bg-background">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap');`}</style>

      <div className="mx-auto max-w-5xl px-6 py-14 sm:px-10 sm:py-20">
        {/* Hero */}
        <div className="relative overflow-hidden">
          <ChessEmblem className="pointer-events-none absolute -right-32 top-0 h-[16rem] w-[16rem] text-foreground sm:h-[22rem] sm:w-[22rem] hidden lg:block" />

          <div className="relative space-y-6">
            <h1
              className="text-5xl leading-[1.1] text-foreground sm:text-6xl"
              style={{ fontFamily: "'Newsreader', serif" }}
            >
              Welcome back,{" "}
              <span className="italic">{user?.username || "Player"}</span>
            </h1>

            <div className="flex flex-wrap items-center gap-3">
              {user?.rating != null && (
                <Badge
                  variant="secondary"
                  className="gap-1.5 rounded-full px-3 py-1 text-sm font-normal"
                >
                  {user.rating} ELO
                  {typeof user.ratingDelta === "number" && (
                    <span
                      className={cn(
                        "inline-flex items-center gap-0.5",
                        isPositive
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-destructive",
                      )}
                    >
                      <DeltaIcon className="h-3.5 w-3.5" />
                      {Math.abs(user.ratingDelta)}
                    </span>
                  )}
                </Badge>
              )}
              <p className="text-muted-foreground">Ready for your next move?</p>
            </div>

            <Button asChild size="lg" className="gap-1.5">
              <Link to="/play">
                Play now
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <Separator className="my-12" />

        {/* Stats */}
        <section>
          <h2 className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Your standing
          </h2>
          <div className="grid grid-cols-2 divide-x divide-y divide-border rounded-xl border border-border bg-card sm:grid-cols-4 sm:divide-y-0">
            {stats.map((s) => (
              <div key={s.label} className="px-5 py-6">
                <p
                  className="text-3xl text-card-foreground"
                  style={{ fontFamily: "'Newsreader', serif" }}
                >
                  {s.value}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
