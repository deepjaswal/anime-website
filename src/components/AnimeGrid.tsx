"use client";

import React, { useState } from "react";
import AnimeCard from "./AnimeCard";
import TrailerModal from "./TrailerModal";
import { GridSkeleton } from "./Skeletons";
import { AnimeItem } from "@/lib/types";
import { AlertCircle, RotateCcw, SearchX } from "lucide-react";

interface AnimeGridProps {
  animeList: AnimeItem[];
  isLoading: boolean;
  error?: string | null;
  onRetry?: () => void;
  emptyMessage?: string;
}

export default function AnimeGrid({
  animeList,
  isLoading,
  error,
  onRetry,
  emptyMessage = "No anime found matching your criteria.",
}: AnimeGridProps) {
  const [selectedTrailer, setSelectedTrailer] = useState<AnimeItem | null>(null);

  if (isLoading) {
    return <GridSkeleton count={12} />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-10 bg-[#0e1224]/85 rounded-3xl border border-rose-900/40 text-center my-8 shadow-2xl">
        <div className="p-3.5 bg-rose-950/60 rounded-full text-rose-400 mb-4 border border-rose-800/40 shadow-lg shadow-rose-950/50">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-white mb-1">Anime Database Notice</h3>
        <p className="text-sm text-slate-400 max-w-md mb-5 leading-relaxed">
          {error}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white rounded-xl text-sm font-semibold transition shadow-md shadow-rose-600/35 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>
        )}
      </div>
    );
  }

  if (animeList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-[#0e1224]/85 rounded-3xl border border-white/[0.08] text-center my-8 shadow-2xl">
        <div className="p-3 bg-white/[0.05] rounded-full text-slate-400 mb-3 border border-white/10">
          <SearchX className="w-8 h-8" />
        </div>
        <h3 className="text-base font-semibold text-white mb-1">No Anime Found</h3>
        <p className="text-sm text-slate-400 max-w-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-5">
        {animeList.map((anime) => (
          <AnimeCard
            key={`${anime.mal_id}-${anime.title}`}
            anime={anime}
            onOpenTrailer={(item) => setSelectedTrailer(item)}
          />
        ))}
      </div>

      {/* Trailer Modal */}
      {selectedTrailer && (
        <TrailerModal
          isOpen={!!selectedTrailer}
          onClose={() => setSelectedTrailer(null)}
          anime={selectedTrailer}
          title={selectedTrailer.title_english || selectedTrailer.title}
        />
      )}
    </>
  );
}
