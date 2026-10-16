"use client";

import React from "react";
import { Flame, Star, Trophy, Clock } from "lucide-react";

export type FilterTabType = "airing" | "bypopularity" | "favorite" | "upcoming";

interface FilterTabsProps {
  activeTab: FilterTabType;
  onTabChange: (tab: FilterTabType) => void;
  selectedGenre?: number;
  onGenreChange?: (genreId: number | undefined) => void;
  genres?: Array<{ mal_id: number; name: string }>;
}

export default function FilterTabs({
  activeTab,
  onTabChange,
  selectedGenre,
  onGenreChange,
  genres = [],
}: FilterTabsProps) {
  const tabs: Array<{ id: FilterTabType; label: string; icon: React.ElementType }> = [
    { id: "airing", label: "Top Airing", icon: Flame },
    { id: "bypopularity", label: "Most Popular", icon: Trophy },
    { id: "favorite", label: "Fan Favorites", icon: Star },
    { id: "upcoming", label: "Upcoming", icon: Clock },
  ];

  return (
    <div className="space-y-4 mb-8">
      {/* Primary Category Tabs */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-1.5 scrollbar-none no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold tracking-wide whitespace-nowrap transition-all duration-250 cursor-pointer ${
                isActive
                  ? "bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 text-white shadow-lg shadow-rose-600/35 ring-1 ring-rose-300/40 scale-102"
                  : "bg-[#0e1224]/90 hover:bg-[#161d38] text-slate-300 border border-white/[0.08] hover:text-white hover:border-white/20"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-rose-400"}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Genre Filter Pills */}
      {genres.length > 0 && onGenreChange && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs scrollbar-none">
          <button
            onClick={() => onGenreChange(undefined)}
            className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedGenre === undefined
                ? "bg-white text-slate-950 shadow-md ring-2 ring-white/40"
                : "bg-[#0e1224]/80 text-slate-400 hover:text-white hover:bg-[#161d38] border border-white/[0.07]"
            }`}
          >
            All Genres
          </button>
          {genres.slice(0, 12).map((genre) => {
            const isGenreActive = selectedGenre === genre.mal_id;
            return (
              <button
                key={genre.mal_id}
                onClick={() => onGenreChange(isGenreActive ? undefined : genre.mal_id)}
                className={`px-3.5 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isGenreActive
                    ? "bg-gradient-to-r from-rose-600 to-red-600 text-white font-bold shadow-md shadow-rose-600/30 ring-1 ring-rose-400/40"
                    : "bg-[#0e1224]/80 text-slate-400 hover:text-white hover:bg-[#161d38] border border-white/[0.07]"
                }`}
              >
                {genre.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
