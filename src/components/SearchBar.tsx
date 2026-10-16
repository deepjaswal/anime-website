"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, X, Loader2, Star } from "lucide-react";
import { AnimeItem } from "@/lib/types";

interface SearchBarProps {
  initialQuery?: string;
  onSearchSubmit?: (query: string) => void;
  isHeader?: boolean;
}

export default function SearchBar({ initialQuery = "", onSearchSubmit, isHeader = false }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [previewResults, setPreviewResults] = useState<AnimeItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounce input by 350ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 350);
    return () => clearTimeout(timer);
  }, [query]);

  // Fetch quick preview when debounced query changes
  useEffect(() => {
    if (!debouncedQuery.trim() || debouncedQuery.length < 2) {
      setPreviewResults([]);
      setIsOpen(false);
      return;
    }

    let isCancelled = false;
    async function fetchPreview() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/anime?q=${encodeURIComponent(debouncedQuery)}&limit=5`);
        if (!res.ok) throw new Error("Search failed");
        const json = await res.json();
        if (!isCancelled && json.data) {
          setPreviewResults(json.data.slice(0, 5));
          setIsOpen(true);
        }
      } catch (err) {
        console.error("Preview search error:", err);
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }

    fetchPreview();
    return () => {
      isCancelled = true;
    };
  }, [debouncedQuery]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOpen(false);
    if (onSearchSubmit) {
      onSearchSubmit(query);
    } else if (query.trim()) {
      router.push(`/?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleClear = () => {
    setQuery("");
    setPreviewResults([]);
    setIsOpen(false);
    if (onSearchSubmit) onSearchSubmit("");
  };

  return (
    <div ref={containerRef} className={`relative w-full ${isHeader ? "max-w-md" : "max-w-xl mx-auto"}`}>
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <div className="absolute left-3.5 text-slate-400 pointer-events-none">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (previewResults.length > 0) setIsOpen(true);
          }}
          placeholder="Search anime series, movies, ratings..."
          className="w-full pl-10 pr-10 py-2 sm:py-2.5 bg-[#0e1224]/80 hover:bg-[#131830] focus:bg-[#131830] border border-white/[0.08] focus:border-rose-500/80 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-400 outline-none transition-all duration-200 shadow-inner focus:ring-2 focus:ring-rose-500/20"
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 text-slate-400 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* Dropdown Live Preview */}
      {isOpen && previewResults.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-[#090d1f]/98 backdrop-blur-2xl border border-rose-900/30 rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-white/[0.05] animate-fade-in">
          <div className="px-4 py-2.5 text-[11px] font-bold tracking-wider text-slate-400 uppercase bg-[#060814]/80 flex items-center justify-between">
            <span>Instant Results</span>
            <span className="text-rose-400 font-semibold">Live Database</span>
          </div>

          {previewResults.map((item) => {
            const title = item.title_english || item.title;
            const img = item.images.jpg.image_url;
            return (
              <Link
                key={item.mal_id}
                href={`/anime/${item.mal_id}`}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.05] transition-colors group"
              >
                <img
                  src={img}
                  alt={title}
                  className="w-10 h-14 object-cover rounded-lg bg-slate-900 flex-shrink-0 border border-white/10"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-slate-200 group-hover:text-rose-400 truncate transition-colors">
                    {title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                    <span className="px-2 py-0.5 rounded-md bg-white/[0.06] text-[10px] uppercase font-bold text-slate-300">
                      {item.type || "TV"}
                    </span>
                    {item.score && (
                      <span className="flex items-center gap-0.5 text-amber-400 font-bold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {item.score.toFixed(1)}
                      </span>
                    )}
                    <span>{item.episodes ? `${item.episodes} eps` : "Ongoing"}</span>
                  </div>
                </div>
              </Link>
            );
          })}

          <button
            onClick={handleSubmit}
            className="w-full text-center py-2.5 text-xs font-bold text-rose-400 hover:text-rose-300 bg-[#060814]/60 hover:bg-[#060814] transition-colors cursor-pointer"
          >
            See all results for &quot;{query}&quot; →
          </button>
        </div>
      )}
    </div>
  );
}
