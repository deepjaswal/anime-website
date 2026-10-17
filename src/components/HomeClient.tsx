"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import HeroBanner from "./HeroBanner";
import AnimeGrid from "./AnimeGrid";
import AnimeCard from "./AnimeCard";
import FilterTabs, { FilterTabType } from "./FilterTabs";
import SearchBar from "./SearchBar";
import TrailerModal from "./TrailerModal";
import Pagination from "./Pagination";
import SeoContentSection from "./SeoContentSection";
import { AnimeItem, PaginationInfo } from "@/lib/types";
import { Sparkles, Trophy, Flame, Play, ArrowRight, Dices, Layers } from "lucide-react";
import Link from "next/link";

interface HomeClientProps {
  initialAnime: AnimeItem[];
  genres: Array<{ mal_id: number; name: string }>;
  initialPagination?: PaginationInfo;
}

function HomeContent({ initialAnime, genres, initialPagination }: HomeClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read initial values from URL searchParams
  const urlTab = (searchParams.get("tab") as FilterTabType) || "airing";
  const urlSearch = searchParams.get("search") || searchParams.get("q") || "";
  const urlGenre = searchParams.get("genre") ? parseInt(searchParams.get("genre")!, 10) : undefined;
  const urlPage = searchParams.get("page") ? parseInt(searchParams.get("page")!, 10) : 1;

  const [activeTab, setActiveTab] = useState<FilterTabType>(urlTab);
  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [selectedGenre, setSelectedGenre] = useState<number | undefined>(urlGenre);
  const [currentPage, setCurrentPage] = useState<number>(urlPage);
  const [animeList, setAnimeList] = useState<AnimeItem[]>(initialAnime);
  const [pagination, setPagination] = useState<PaginationInfo | undefined>(initialPagination);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTrailer, setSelectedTrailer] = useState<AnimeItem | null>(null);

  // Fetch data with full pagination support
  const fetchAnime = useCallback(
    async (query: string, tab: FilterTabType, genre: number | undefined, page: number) => {
      setIsLoading(true);
      setError(null);
      try {
        let url = `/api/anime?page=${page}&limit=18&`;
        if (query.trim()) {
          url += `type=search&q=${encodeURIComponent(query.trim())}`;
          if (genre !== undefined) url += `&genre=${genre}`;
        } else {
          url += `type=top&filter=${tab}`;
          if (genre !== undefined) url += `&genre=${genre}`;
        }

        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`Failed to load anime (HTTP ${res.status})`);
        }
        const json = await res.json();
        setAnimeList(json.data || []);
        if (json.pagination) {
          setPagination(json.pagination);
        }
      } catch (err: unknown) {
        console.error("Error fetching anime:", err);
        setError(err instanceof Error ? err.message : "Failed to load live anime database.");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Sync state if URL searchParams change
  useEffect(() => {
    const newTab = (searchParams.get("tab") as FilterTabType) || "airing";
    const newSearch = searchParams.get("search") || searchParams.get("q") || "";
    const newGenre = searchParams.get("genre") ? parseInt(searchParams.get("genre")!, 10) : undefined;
    const newPage = searchParams.get("page") ? parseInt(searchParams.get("page")!, 10) : 1;

    setActiveTab(newTab);
    setSearchQuery(newSearch);
    setSelectedGenre(newGenre);
    setCurrentPage(newPage);

    fetchAnime(newSearch, newTab, newGenre, newPage);
  }, [searchParams, fetchAnime]);

  // Handle Tab Switch (clears search, resets genre, sets page to 1 without top scroll)
  const handleTabChange = (newTab: FilterTabType) => {
    setActiveTab(newTab);
    setSearchQuery("");
    setSelectedGenre(undefined);
    setCurrentPage(1);
    fetchAnime("", newTab, undefined, 1);
    router.push(`/?tab=${newTab}&page=1`, { scroll: false });
  };

  // Handle Genre Switch (without top scroll)
  const handleGenreChange = (newGenre: number | undefined) => {
    setSelectedGenre(newGenre);
    setCurrentPage(1);
    fetchAnime(searchQuery, activeTab, newGenre, 1);
    if (newGenre !== undefined) {
      router.push(`/?tab=${activeTab}&genre=${newGenre}&page=1`, { scroll: false });
    } else {
      router.push(`/?tab=${activeTab}&page=1`, { scroll: false });
    }
  };

  // Handle Search input from bar
  const handleSearchSubmit = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    fetchAnime(query, activeTab, selectedGenre, 1);
    if (query.trim()) {
      router.push(`/?search=${encodeURIComponent(query.trim())}&page=1`, { scroll: false });
    } else {
      router.push(`/?tab=${activeTab}&page=1`, { scroll: false });
    }
  };

  // Handle Pagination change (without jumping to top)
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    fetchAnime(searchQuery, activeTab, selectedGenre, newPage);
    let url = `/?page=${newPage}`;
    if (searchQuery.trim()) {
      url += `&search=${encodeURIComponent(searchQuery.trim())}`;
    } else {
      url += `&tab=${activeTab}`;
      if (selectedGenre !== undefined) url += `&genre=${selectedGenre}`;
    }
    router.push(url, { scroll: false });
  };

  // Featured highlights for hero carousel
  const featuredHighlights = initialAnime.slice(0, 5);

  // Top 6 Spotlight for Anime leaderboard
  const topRanked = initialAnime.slice(0, 6);

  return (
    <div className="min-h-screen pb-24">
      {/* Featured Anime Hero Banner (on page 1 without search) */}
      {!searchQuery && currentPage === 1 && featuredHighlights.length > 0 && (
        <HeroBanner
          featuredAnime={featuredHighlights}
          onOpenTrailer={(anime) => setSelectedTrailer(anime)}
        />
      )}

      {/* Top 6 Global Spotlight (Pure English) */}
      {!searchQuery && currentPage === 1 && topRanked.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-gradient-to-tr from-rose-600 to-red-500 rounded-2xl text-white shadow-lg shadow-rose-600/30 ring-1 ring-white/10">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  Top Trending Spotlight
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-rose-950/70 text-rose-300 border border-rose-800/40 font-bold uppercase tracking-wider">
                    Global Ranking
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  Most popular and highly rated anime series worldwide this season
                </p>
              </div>
            </div>

            <Link
              href="/categories"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-rose-400 hover:text-rose-300 transition"
            >
              Browse All Categories <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3.5 sm:gap-4">
            {topRanked.map((anime, idx) => (
              <AnimeCard
                key={`top-${anime.mal_id}`}
                anime={anime}
                priorityRank={idx + 1}
                onOpenTrailer={(item) => setSelectedTrailer(item)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Main Grid Section Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shadow-sm shadow-rose-500" />
              <span className="text-xs font-black uppercase tracking-wider text-rose-400">
                Live Anime Engine
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {searchQuery ? (
                <>
                  Search Results for &quot;
                  <span className="text-rose-400">{searchQuery}</span>&quot;
                </>
              ) : activeTab === "airing" ? (
                "Top Airing Anime Releases"
              ) : activeTab === "bypopularity" ? (
                "Most Popular of All Time"
              ) : activeTab === "favorite" ? (
                "Fan Favorites Collection"
              ) : (
                "Upcoming Releases & New Seasons"
              )}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {searchQuery
                ? `Showing real-time results from the global anime database`
                : `Explore verified ratings, critical reviews, trailers, and official streaming options`}
            </p>
          </div>

          {/* Quick Search */}
          <div className="w-full md:w-80">
            <SearchBar
              initialQuery={searchQuery}
              onSearchSubmit={handleSearchSubmit}
            />
          </div>
        </div>

        {/* Filters and Genre Selector */}
        {!searchQuery && (
          <FilterTabs
            activeTab={activeTab}
            onTabChange={handleTabChange}
            selectedGenre={selectedGenre}
            onGenreChange={handleGenreChange}
            genres={genres}
          />
        )}

        {/* Search Active Notification / Clear Filter */}
        {searchQuery && (
          <div className="flex items-center justify-between bg-gray-900/90 border border-gray-800 rounded-2xl px-5 py-3.5 mb-6 shadow-md">
            <span className="text-sm text-gray-200">
              Showing search results for: <strong className="text-white">&quot;{searchQuery}&quot;</strong>
            </span>
            <button
              onClick={() => handleSearchSubmit("")}
              className="text-xs text-red-400 hover:text-red-300 font-bold underline underline-offset-4"
            >
              Clear Search Filter
            </button>
          </div>
        )}

        {/* Anime Grid */}
        <AnimeGrid
          animeList={animeList}
          isLoading={isLoading}
          error={error}
          onRetry={() => fetchAnime(searchQuery, activeTab, selectedGenre, currentPage)}
          emptyMessage={
            searchQuery
              ? `No anime found matching "${searchQuery}". Please check your spelling or try another title.`
              : "No anime available in this category."
          }
        />

        {/* Pagination Section */}
        <Pagination
          pagination={pagination}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          isLoading={isLoading}
        />
      </section>

      {/* SEO Content & FAQ Accordion Section (Boosts Google Keyword Rankings & Rich Snippets) */}
      <SeoContentSection />

      {/* Trailer Modal (Always plays working video) */}
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

export default function HomeClient(props: HomeClientProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-950" />}>
      <HomeContent {...props} />
    </Suspense>
  );
}
