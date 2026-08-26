import React from "react";
import { Skeleton } from "../ui/skeleton";

export default function RatingStatsSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-2 divide-x divide-y divide-border rounded-xl border border-border bg-card sm:grid-cols-4 sm:divide-y-0">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-[100px] flex justify-center items-start flex-col px-4 gap-2"
        >
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-5 w-1/3" />
        </div>
      ))}
    </div>
  );
}
