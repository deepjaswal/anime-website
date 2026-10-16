import React from "react";

export function AnimeCardSkeleton() {
  return (
    <div className="flex flex-col bg-[#0e1224]/80 rounded-2xl overflow-hidden border border-white/[0.06] animate-pulse">
      {/* Poster Skeleton */}
      <div className="relative aspect-[3/4] w-full bg-[#141a33]" />
      {/* Content Skeleton */}
      <div className="p-3.5 space-y-2.5">
        <div className="h-4 bg-[#1a213f] rounded-lg w-3/4" />
        <div className="h-3 bg-[#141a33] rounded-lg w-1/2" />
        <div className="flex items-center justify-between pt-1">
          <div className="h-3.5 bg-[#141a33] rounded w-12" />
          <div className="h-3.5 bg-[#141a33] rounded w-16" />
        </div>
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <AnimeCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function HeroBannerSkeleton() {
  return (
    <div className="relative w-full h-[450px] md:h-[550px] bg-[#0e1224] rounded-3xl overflow-hidden animate-pulse border border-white/[0.08]">
      <div className="absolute inset-0 bg-gradient-to-t from-[#060813] via-[#060813]/60 to-transparent" />
      <div className="absolute bottom-10 left-6 md:left-12 max-w-2xl space-y-4">
        <div className="h-6 bg-rose-600/30 rounded-full w-28" />
        <div className="h-10 bg-[#161d3a] rounded-xl w-3/4" />
        <div className="h-4 bg-[#141a33] rounded w-full" />
        <div className="h-4 bg-[#141a33] rounded w-2/3" />
        <div className="flex gap-4 pt-3">
          <div className="h-11 bg-rose-600/50 rounded-2xl w-36" />
          <div className="h-11 bg-[#161d3a] rounded-2xl w-32" />
        </div>
      </div>
    </div>
  );
}
