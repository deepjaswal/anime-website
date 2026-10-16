"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { AnimeItem } from "@/lib/types";

interface WatchlistContextType {
  watchlist: AnimeItem[];
  addToWatchlist: (anime: AnimeItem) => void;
  removeFromWatchlist: (mal_id: number) => void;
  isInWatchlist: (mal_id: number) => boolean;
  toggleWatchlist: (anime: AnimeItem) => void;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const [watchlist, setWatchlist] = useState<AnimeItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("animevault_watchlist");
      if (saved) {
        setWatchlist(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load watchlist from localStorage:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("animevault_watchlist", JSON.stringify(watchlist));
      } catch (e) {
        console.error("Failed to save watchlist to localStorage:", e);
      }
    }
  }, [watchlist, isLoaded]);

  const addToWatchlist = (anime: AnimeItem) => {
    setWatchlist((prev) => {
      if (prev.some((item) => item.mal_id === anime.mal_id)) return prev;
      return [anime, ...prev];
    });
  };

  const removeFromWatchlist = (mal_id: number) => {
    setWatchlist((prev) => prev.filter((item) => item.mal_id !== mal_id));
  };

  const isInWatchlist = (mal_id: number) => {
    return watchlist.some((item) => item.mal_id === mal_id);
  };

  const toggleWatchlist = (anime: AnimeItem) => {
    if (isInWatchlist(anime.mal_id)) {
      removeFromWatchlist(anime.mal_id);
    } else {
      addToWatchlist(anime);
    }
  };

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        toggleWatchlist,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error("useWatchlist must be used within a WatchlistProvider");
  }
  return context;
}
