"use client";

import React, { useState } from "react";
import Link from "next/link";
import AnimeCard from "@/components/AnimeCard";
import TrailerModal from "@/components/TrailerModal";
import { useWatchlist } from "@/components/WatchlistContext";
import { Bookmark, Sparkles, Trash2, ArrowLeft } from "lucide-react";
import { AnimeItem } from "@/lib/types";

export default function WatchlistPage() {
  const { watchlist, removeFromWatchlist } = useWatchlist();
  const [selectedTrailer, setSelectedTrailer] = useState<AnimeItem | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bookmark className="w-5 h-5 text-rose-400 fill-rose-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
              Personal Collection
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            My Watchlist
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {watchlist.length} {watchlist.length === 1 ? "anime" : "animes"} saved in your library
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0e1224] hover:bg-[#161d38] text-slate-200 border border-white/[0.08] text-sm font-semibold transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Continue Browsing
        </Link>
      </div>

      {watchlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 bg-[#0e1224]/60 rounded-3xl border border-white/[0.08] text-center my-6 shadow-2xl">
          <div className="p-4 bg-white/[0.05] rounded-2xl text-slate-400 mb-4 border border-white/10">
            <Bookmark className="w-10 h-10 text-rose-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Your Watchlist is Empty</h2>
          <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
            Explore top-airing or popular series on AnimeVault and click the bookmark icon on any card to save it for later.
          </p>
          <Link
            href="/"
            className="px-6 py-3 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-rose-600/35 transition"
          >
            Discover Popular Anime
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
          {watchlist.map((anime) => (
            <div key={anime.mal_id} className="relative group">
              <AnimeCard
                anime={anime}
                onOpenTrailer={(item) => setSelectedTrailer(item)}
              />
            </div>
          ))}
        </div>
      )}

      {selectedTrailer && (
        <TrailerModal
          isOpen={!!selectedTrailer}
          onClose={() => setSelectedTrailer(null)}
          anime={selectedTrailer}
          title={selectedTrailer.title_english || selectedTrailer.title}
        />
      )}
    </div>
  );
}
