import { TriangleAlert } from "lucide-react";
import Loader from "../Loader";

export default function MatchmakingBoard({ active }) {
  return (
    <div className="relative">
      <div className="absolute inset-0 rounded-2xl bg-primary/10 blur-3xl" />

      <div className="relative grid grid-cols-8 w-72 h-72 rounded-2xl overflow-hidden border border-border shadow-xl">
        {Array.from({ length: 64 }, (_, index) => {
          const row = Math.floor(index / 8);
          const col = index % 8;
          const isDark = (row + col) % 2 === 1;
          return (
            <div key={index} className={isDark ? "bg-black" : "bg-white"} />
          );
        })}

        {active && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-tr from-transparent via-primary/20 to-transparent" />
        )}
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="size-15 rounded-full border border-border bg-card/80 backdrop-blur-md flex items-center justify-center animate-pulse">
          {active ? (
            <Loader />
          ) : (
            <TriangleAlert className="size-6 text-destructive" />
          )}
        </div>
      </div>
    </div>
  );
}
