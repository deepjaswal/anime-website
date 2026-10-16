"use client";

import React, { useEffect, useState } from "react";
import { X, ExternalLink, Film, Play, Tv } from "lucide-react";
import { AnimeItem } from "@/lib/types";
import { getWorkingTrailerEmbedUrl, getStreamingPlatforms } from "@/lib/videoUtils";
import Link from "next/link";

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  anime?: AnimeItem | null;
  trailerUrl?: string | null;
  youtubeId?: string | null;
  title?: string;
}

export default function TrailerModal({
  isOpen,
  onClose,
  anime,
  trailerUrl,
  youtubeId,
  title,
}: TrailerModalProps) {
  const [activeTab, setActiveTab] = useState<"trailer" | "stream">("trailer");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const displayTitle = title || anime?.title_english || anime?.title || "Anime Trailer";

  // Build a reliable working embed URL
  const embedSrc = anime
    ? getWorkingTrailerEmbedUrl(anime, true)
    : youtubeId
    ? `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`
    : `https://www.youtube-nocookie.com/embed?listType=search&list=${encodeURIComponent(displayTitle + " official anime trailer")}&autoplay=1&rel=0`;

  const streaming = anime ? getStreamingPlatforms(anime) : [];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="trailer-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/90 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-gray-950 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl glow-red-sm flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-800/80 bg-gray-900/80">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-600 text-white flex-shrink-0">
              <Play className="w-4 h-4 fill-white" />
            </div>
            <div className="min-w-0">
              <h3 id="trailer-modal-title" className="text-sm sm:text-base font-bold text-white truncate">
                {displayTitle}
              </h3>
              <p className="text-[11px] text-gray-400">Official Video Stream • HD 1080p</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {anime?.mal_id && (
              <Link
                href={`/anime/${anime.mal_id}`}
                onClick={onClose}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-gray-200 transition"
              >
                <Tv className="w-3.5 h-3.5 text-red-400" />
                View Full Page
              </Link>
            )}
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Player */}
        <div className="relative aspect-video w-full bg-black">
          <iframe
            src={embedSrc}
            title={`${displayTitle} Official Video`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>

        {/* Streaming links bar below video */}
        {streaming.length > 0 && (
          <div className="p-4 bg-gray-900/90 border-t border-gray-800/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                <Tv className="w-3.5 h-3.5 text-red-500" />
                Watch on Official Streaming Platforms:
              </span>
              <span className="text-[11px] text-emerald-400 font-medium">Verified Links</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {streaming.map((stream, idx) => (
                <a
                  key={idx}
                  href={stream.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-950 hover:bg-red-950/40 border border-gray-800 hover:border-red-600/50 transition-all text-xs group"
                >
                  <span className="font-semibold text-gray-300 group-hover:text-white truncate">
                    {stream.name}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-500 group-hover:text-red-400 flex-shrink-0 ml-1" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
