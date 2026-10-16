"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, Bookmark, Play, Tv } from "lucide-react";
import { AnimeItem } from "@/lib/types";
import { useWatchlist } from "./WatchlistContext";

interface AnimeCardProps {
  anime: AnimeItem;
  onOpenTrailer?: (anime: AnimeItem) => void;
  priorityRank?: number;
}

export default function AnimeCard({ anime, onOpenTrailer, priorityRank }: AnimeCardProps) {
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const [imgError, setImgError] = useState(false);
  const bookmarked = isInWatchlist(anime.mal_id);

  const displayTitle = anime.title_english || anime.title;
  const posterUrl =
    !imgError && (anime.images.webp?.large_image_url || anime.images.jpg.large_image_url || anime.images.jpg.image_url)
      ? anime.images.webp?.large_image_url || anime.images.jpg.large_image_url || anime.images.jpg.image_url
      : "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80";

  return (
    <div className="group relative flex flex-col bg-[#0e1224]/85 hover:bg-[#12172f] border border-white/[0.07] hover:border-rose-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-rose-600/20 hover:-translate-y-1.5">
      {/* Poster image container with direct link */}
      <Link
        href={`/anime/${anime.mal_id}`}
        className="relative aspect-[3/4] w-full overflow-hidden bg-[#070914] block cursor-pointer"
      >
        <img
          src={posterUrl}
          alt={displayTitle}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
          loading="lazy"
        />

        {/* Gradient overlays for authentic anime streaming feel */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e1224] via-[#0e1224]/20 to-transparent opacity-85 group-hover:opacity-50 transition-opacity" />

        {/* Priority Rank Ribbon (if passed, e.g. Top 10) */}
        {priorityRank && (
          <div className="absolute top-0 left-0 bg-gradient-to-r from-rose-600 to-red-600 text-white font-black text-xs px-2.5 py-1 rounded-br-xl shadow-lg z-10 flex items-center gap-1 shadow-rose-600/30">
            <span>#{priorityRank}</span>
          </div>
        )}

        {/* Top Badges */}
        <div className={`absolute top-2.5 right-2.5 flex items-center gap-1.5 ${priorityRank ? "" : "left-2.5 justify-between"} pointer-events-none z-10`}>
          {/* Score Badge */}
          {anime.score ? (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-black/80 backdrop-blur-md border border-amber-500/30 text-amber-300 text-xs font-bold shadow-md">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{anime.score.toFixed(1)}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-black/80 backdrop-blur-md text-slate-400 text-xs font-semibold">
              <span>N/A</span>
            </div>
          )}

          {/* Type Badge */}
          <span className="px-2 py-0.5 rounded-lg bg-gradient-to-r from-rose-600 to-red-600 backdrop-blur-md text-white text-[11px] font-black uppercase tracking-wider shadow-sm">
            {anime.type || "TV"}
          </span>
        </div>

        {/* Hover Action Overlay with Play and Bookmark */}
        <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/60 backdrop-blur-[2px] z-20">
          {onOpenTrailer && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onOpenTrailer(anime);
              }}
              title="Watch Trailer"
              className="p-3.5 rounded-full bg-gradient-to-tr from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white shadow-xl hover:scale-115 transition-all shadow-rose-600/50"
            >
              <Play className="w-5 h-5 fill-white translate-x-0.5" />
            </button>
          )}

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWatchlist(anime);
            }}
            title={bookmarked ? "Remove from Watchlist" : "Add to Watchlist"}
            className={`p-3.5 rounded-full shadow-xl hover:scale-115 transition-all ${
              bookmarked
                ? "bg-rose-600 text-white shadow-rose-600/50"
                : "bg-slate-900/95 hover:bg-slate-800 text-slate-200 border border-slate-700"
            }`}
          >
            <Bookmark className={`w-5 h-5 ${bookmarked ? "fill-white" : ""}`} />
          </button>
        </div>

        {/* Episodes & Format pill */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-slate-200 font-medium z-10 pointer-events-none">
          <span className="flex items-center gap-1 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10 font-semibold">
            <Tv className="w-3 h-3 text-rose-400" />
            {anime.episodes ? `${anime.episodes} Episodes` : "Airing"}
          </span>

          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#070914]/90 backdrop-blur-md border border-white/10 text-slate-300">
            Ratings & Info
          </span>
        </div>
      </Link>

      {/* Card Content with Link */}
      <Link
        href={`/anime/${anime.mal_id}`}
        className="p-3.5 flex flex-col flex-grow justify-between cursor-pointer"
      >
        <div>
          <h3
            title={displayTitle}
            className="text-sm sm:text-base font-bold text-white group-hover:text-rose-400 transition-colors line-clamp-2 leading-snug"
          >
            {displayTitle}
          </h3>

          {anime.title_japanese && (
            <p className="text-[11px] text-slate-400 truncate mt-1 font-sans">
              {anime.title_japanese}
            </p>
          )}
        </div>

        {/* Meta Bar */}
        <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
          <span className="truncate max-w-[110px] text-slate-300 font-medium">
            {anime.genres && anime.genres.length > 0 ? anime.genres[0].name : "Anime"}
          </span>
          <span className="text-[11px] text-slate-400 font-semibold">
            {anime.year || anime.season || "HD"}
          </span>
        </div>
      </Link>
    </div>
  );
}
