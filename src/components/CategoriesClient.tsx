"use client";

import React, { useState } from "react";
import AnimeGrid from "./AnimeGrid";
import Pagination from "./Pagination";
import { AnimeItem, PaginationInfo } from "@/lib/types";
import { Compass, Sparkles, Filter } from "lucide-react";

interface CategoriesClientProps {
  genres: Array<{ mal_id: number; name: string; count?: number }>;
  initialGenreId: number;
  initialAnime: AnimeItem[];
  initialPagination?: PaginationInfo;
}

export default function CategoriesClient({
  genres,
  initialGenreId,
  initialAnime,
  initialPagination,
}: CategoriesClientProps) {
  const [selectedGenreId, setSelectedGenreId] = useState<number>(initialGenreId);
  const [animeList, setAnimeList] = useState<AnimeItem[]>(initialAnime);
  const [pagination, setPagination] = useState<PaginationInfo | undefined>(initialPagination);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeGenre = genres.find((g) => g.mal_id === selectedGenreId) || genres[0];

  const fetchGenreAnime = async (id: number, page = 1) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/anime?type=search&genre=${id}&page=${page}&limit=18`);
      if (!res.ok) throw new Error("Failed to load anime for this category");
      const json = await res.json();
      setAnimeList(json.data || []);
      if (json.pagination) {
        setPagination(json.pagination);
      }
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Error fetching anime for this category");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectGenre = (id: number) => {
    if (id === selectedGenreId) return;
    setSelectedGenreId(id);
    setCurrentPage(1);
    fetchGenreAnime(id, 1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    fetchGenreAnime(selectedGenreId, newPage);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Compass className="w-5 h-5 text-rose-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
            Genre & Category Explorer
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Anime Categories & Genres
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-xl">
          Browse through the global anime database by genre. Click any category tag below to explore top rated titles.
        </p>
      </div>

      {/* Genre Pills Grid */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0e1224]/80 border border-white/[0.08] mb-10 shadow-xl">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          <Filter className="w-3.5 h-3.5 text-rose-400" />
          Select Category
        </div>
        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => {
            const isSelected = genre.mal_id === selectedGenreId;
            return (
              <button
                key={genre.mal_id}
                onClick={() => handleSelectGenre(genre.mal_id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-lg shadow-rose-600/35 ring-1 ring-rose-300/40 scale-102"
                    : "bg-[#070914] hover:bg-[#161d38] text-slate-300 border border-white/[0.08] hover:text-white"
                }`}
              >
                <span>{genre.name}</span>
                {genre.count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? "bg-rose-950 text-rose-200" : "bg-white/[0.08] text-slate-400"
                    }`}
                  >
                    {genre.count > 1000 ? `${(genre.count / 1000).toFixed(1)}k` : genre.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Genre Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-rose-400" />
            Top {activeGenre?.name || "Genre"} Anime
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Showing verified titles and user ratings classified under {activeGenre?.name}
          </p>
        </div>
      </div>

      {/* Anime Grid */}
      <AnimeGrid
        animeList={animeList}
        isLoading={isLoading}
        error={error}
        onRetry={() => fetchGenreAnime(selectedGenreId, currentPage)}
        emptyMessage={`No anime found in the ${activeGenre?.name} category.`}
      />

      {/* Pagination Controls */}
      <Pagination
        pagination={pagination}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        isLoading={isLoading}
      />
    </div>
  );
}
