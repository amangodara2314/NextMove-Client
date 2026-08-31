import { Skeleton } from "../ui/skeleton";

export default function GameRowSkeleton() {
  return (
    <div className="flex items-center gap-4 px-6 py-3.5">
      <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
      <div className="min-w-0 flex-1 space-y-1.5">
        <Skeleton className="h-3.5 w-28" />
        <Skeleton className="h-3 w-36" />
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <Skeleton className="h-4 w-12 rounded-full" />
        <Skeleton className="h-3 w-8" />
      </div>
    </div>
  );
}
