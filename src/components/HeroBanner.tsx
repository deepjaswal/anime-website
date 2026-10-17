"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Play,
  Info,
  Star,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Volume2,
  VolumeX,
  Video,
  Image as ImageIcon,
  Flame,
} from "lucide-react";
import { AnimeItem } from "@/lib/types";
import { useWatchlist } from "./WatchlistContext";
import { getBackgroundTrailerEmbedUrl } from "@/lib/videoUtils";

interface HeroBannerProps {
  featuredAnime: AnimeItem[];
  onOpenTrailer: (anime: AnimeItem) => void;
}

const AUTO_SLIDE_INTERVAL = 7000; // 7 seconds per slide

export default function HeroBanner({ featuredAnime, onOpenTrailer }: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showVideoBackground, setShowVideoBackground] = useState(true);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [progress, setProgress] = useState(0);

  const bannerRef = useRef<HTMLDivElement>(null);
  const { isInWatchlist, toggleWatchlist } = useWatchlist();

  const totalSlides = featuredAnime.length;
  const current = featuredAnime[currentIndex] || featuredAnime[0];
  const nextAnime = featuredAnime[(currentIndex + 1) % totalSlides];
  const isBookmarked = current ? isInWatchlist(current.mal_id) : false;
  const displayTitle = current?.title_english || current?.title || "Featured Anime";

  const backdropImg =
    current?.images.webp?.large_image_url ||
    current?.images.jpg.large_image_url ||
    current?.images.jpg.image_url;

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
    setProgress(0);
  }, [totalSlides]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
    setProgress(0);
  }, [totalSlides]);

  // Auto-slide Timer with Progress Bar (pauses when hovered)
  useEffect(() => {
    if (totalSlides <= 1 || isHovered) return;

    const tickInterval = 50; // update progress bar smoothly
    const step = (tickInterval / AUTO_SLIDE_INTERVAL) * 100;

    const timer = setInterval(() => {
      setProgress((old) => {
        if (old >= 100) {
          handleNext();
          return 0;
        }
        return old + step;
      });
    }, tickInterval);

    return () => clearInterval(timer);
  }, [totalSlides, isHovered, handleNext]);

  // 3D Parallax Tilt effect on mouse movement
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!bannerRef.current) return;
    const rect = bannerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5
    setMouseOffset({ x, y });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMouseOffset({ x: 0, y: 0 });
  };

  if (!featuredAnime || featuredAnime.length === 0) return null;

  // Background trailer embed URL (muted looping)
  const backgroundTrailerUrl = current ? getBackgroundTrailerEmbedUrl(current, isMuted) : "";

  // 3D Transform calculations
  const rotateY = mouseOffset.x * 8; // -4deg to 4deg
  const rotateX = -mouseOffset.y * 6; // -3deg to 3deg

  return (
    <div
      ref={bannerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: "1200px",
      }}
      className="relative w-full h-[540px] sm:h-[600px] lg:h-[660px] rounded-3xl overflow-hidden mb-12 border border-gray-800/80 shadow-2xl group transition-all"
    >
      {/* 3D Tilt Wrapper */}
      <div
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformStyle: "preserve-3d",
          transition: isHovered ? "transform 0.1s ease-out" : "transform 0.5s ease-out",
        }}
        className="relative w-full h-full"
      >
        {/* BACKGROUND LAYER 1: Dynamic Live Video Trailer */}
        {showVideoBackground && backgroundTrailerUrl ? (
          <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none bg-black scale-105">
            <iframe
              key={`bg-trailer-${current.mal_id}-${isMuted ? "muted" : "unmuted"}`}
              src={backgroundTrailerUrl}
              title={`${displayTitle} Background Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              className="absolute top-1/2 left-1/2 w-[180%] h-[180%] -translate-x-1/2 -translate-y-1/2 object-cover filter brightness-50 opacity-90 transition-opacity duration-1000"
            />
          </div>
        ) : null}

        {/* BACKGROUND LAYER 2: High-Res Poster Fallback/Crossfade */}
        <div
          className={`absolute inset-0 bg-gray-950 transition-opacity duration-700 ${
            showVideoBackground && backgroundTrailerUrl ? "opacity-30" : "opacity-100"
          }`}
        >
          <img
            src={backdropImg}
            alt={displayTitle}
            className="w-full h-full object-cover object-center filter brightness-60 transition-transform duration-700 scale-100 group-hover:scale-105"
          />
        </div>

        {/* Cinematic Vignettes & Gradients for High Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/70 to-transparent pointer-events-none z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/80 to-transparent pointer-events-none z-10 max-w-4xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/60 via-transparent to-gray-950/80 pointer-events-none z-10" />

        {/* TOP CONTROLS: Sound Mute/Unmute & Video Toggle */}
        <div className="absolute top-6 right-6 z-30 flex items-center gap-2">
          {/* Video / Poster Mode Switch */}
          <button
            onClick={() => setShowVideoBackground(!showVideoBackground)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-950/80 hover:bg-gray-800 text-xs font-semibold text-gray-200 border border-gray-800/80 backdrop-blur-md transition shadow-lg"
            title={showVideoBackground ? "Switch to Poster Artwork" : "Switch to Video Trailer"}
          >
            {showVideoBackground ? (
              <>
                <Video className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                <span className="hidden sm:inline">Trailer Playing</span>
              </>
            ) : (
              <>
                <ImageIcon className="w-3.5 h-3.5 text-gray-400" />
                <span className="hidden sm:inline">Poster View</span>
              </>
            )}
          </button>

          {/* Audio Mute / Unmute Button */}
          {showVideoBackground && (
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-950/80 hover:bg-gray-800 text-xs font-semibold text-gray-200 border border-gray-800/80 backdrop-blur-md transition shadow-lg"
              title={isMuted ? "Unmute Trailer Audio" : "Mute Audio"}
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-gray-400" />
                  <span className="hidden sm:inline">Muted</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-red-500 animate-bounce" />
                  <span className="hidden sm:inline text-red-400 font-bold">Sound ON</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* FOREGROUND LAYER (Floating 3D Content) */}
        <div
          style={{
            transform: "translateZ(45px)",
          }}
          className="relative z-20 h-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 flex flex-col justify-end pb-12 sm:pb-16 max-w-3xl"
        >
          {/* Badges Row */}
          <div className="flex flex-wrap items-center gap-2.5 mb-3.5">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-rose-600/30 ring-1 ring-white/20">
              <Sparkles className="w-3.5 h-3.5" />
              #1 Global Spotlight
            </span>

            {current.score && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-amber-500/30 text-amber-300 text-xs font-bold shadow-md">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {current.score.toFixed(1)} Rating
              </span>
            )}

            <span className="px-2.5 py-1 rounded-full bg-[#0e1224]/90 backdrop-blur-md text-slate-300 text-xs font-semibold border border-white/10">
              {current.type || "TV Series"}
            </span>

            <span className="px-2.5 py-1 rounded-full bg-[#0e1224]/90 backdrop-blur-md text-slate-300 text-xs font-semibold border border-white/10">
              {current.episodes ? `${current.episodes} Episodes` : "Airing Season"}
            </span>
          </div>

          {/* Primary Semantic H1 for Google Brand Authority */}
          <h1 className="sr-only">
            AnimeVault - Modern Anime Database, Reviews &amp; Official HD Trailers
          </h1>

          {/* Featured Anime Title */}
          <h2 className="font-banner text-3xl sm:text-5xl lg:text-6xl text-white tracking-wide leading-tight mb-2 drop-shadow-2xl font-normal">
            {displayTitle}
          </h2>

          {current.title_japanese && (
            <p className="text-sm sm:text-base text-slate-400 font-sans mb-3 drop-shadow">
              {current.title_japanese}
            </p>
          )}

          {/* Genre Badges */}
          {current.genres && current.genres.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {current.genres.slice(0, 4).map((genre) => (
                <span
                  key={genre.mal_id}
                  className="text-xs px-2.5 py-0.5 rounded-lg bg-white/[0.07] text-slate-200 border border-white/10 font-medium"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          )}

          {/* Synopsis Snippet */}
          <p className="text-sm sm:text-base text-slate-300 line-clamp-3 mb-6 max-w-2xl leading-relaxed drop-shadow-md">
            {current.synopsis || "Explore the captivating storyline and reviews of this popular anime series."}
          </p>

          {/* Action CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3.5">
            <button
              onClick={() => onOpenTrailer(current)}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-sm shadow-xl shadow-rose-600/35 transition-all hover:scale-105 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              Watch Full Trailer
            </button>

            <Link
              href={`/anime/${current.mal_id}`}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#0e1224]/90 hover:bg-[#161d38] text-white font-bold text-sm border border-white/10 hover:border-white/20 transition-all hover:scale-105 backdrop-blur-md shadow-lg"
            >
              <Info className="w-4 h-4" />
              Full Review & Specs
            </Link>

            <button
              onClick={() => toggleWatchlist(current)}
              title={isBookmarked ? "Remove from Watchlist" : "Add to Watchlist"}
              className={`p-3.5 rounded-2xl transition-all border shadow-lg cursor-pointer ${
                isBookmarked
                  ? "bg-rose-600 text-white border-rose-500 shadow-rose-600/40 scale-105"
                  : "bg-[#0e1224]/90 hover:bg-[#161d38] text-slate-300 border-white/10"
              }`}
            >
              <Bookmark className={`w-5 h-5 ${isBookmarked ? "fill-white" : ""}`} />
            </button>
          </div>
        </div>

        {/* 3D NEXT SLIDE PREVIEW CARD (Visible on Desktop) */}
        {nextAnime && (
          <div
            onClick={handleNext}
            style={{
              transform: "translateZ(30px)",
            }}
            className="hidden xl:flex items-center gap-3 absolute right-12 bottom-20 z-20 p-2.5 rounded-2xl bg-gray-950/80 hover:bg-gray-900 border border-gray-800/80 backdrop-blur-md cursor-pointer transition-all hover:scale-105 shadow-2xl group/preview"
          >
            <img
              src={
                nextAnime.images.webp?.large_image_url ||
                nextAnime.images.jpg.large_image_url ||
                nextAnime.images.jpg.image_url
              }
              alt={nextAnime.title_english || nextAnime.title}
              className="w-12 h-16 object-cover rounded-xl"
            />
            <div className="max-w-[160px] text-left pr-2">
              <span className="text-[10px] text-rose-400 uppercase font-black tracking-wider block">
                Up Next →
              </span>
              <h4 className="font-banner text-xs text-white truncate group-hover/preview:text-rose-400 transition-colors">
                {nextAnime.title_english || nextAnime.title}
              </h4>
              <span className="text-[11px] text-slate-400">
                ⭐ {nextAnime.score ? nextAnime.score.toFixed(1) : "9.0"}
              </span>
            </div>
          </div>
        )}

        {/* NAVIGATION ARROWS */}
        {totalSlides > 1 && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Previous slide"
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-gray-950/80 hover:bg-red-600 text-white backdrop-blur-md border border-gray-800 transition-all z-30 opacity-0 group-hover:opacity-100 hover:scale-110 shadow-xl"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={handleNext}
              aria-label="Next slide"
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-gray-950/80 hover:bg-red-600 text-white backdrop-blur-md border border-gray-800 transition-all z-30 opacity-0 group-hover:opacity-100 hover:scale-110 shadow-xl"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* BOTTOM CONTROLS & AUTO-SLIDER PROGRESS BAR */}
            <div className="absolute right-6 sm:right-10 bottom-6 sm:bottom-8 z-30 flex items-center gap-3">
              {/* Dots */}
              <div className="flex items-center gap-2">
                {featuredAnime.slice(0, 5).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setProgress(0);
                    }}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`transition-all rounded-full cursor-pointer ${
                      currentIndex === idx
                        ? "w-8 h-2.5 bg-gradient-to-r from-rose-600 to-red-500 shadow-md shadow-rose-600/40"
                        : "w-2.5 h-2.5 bg-white/20 hover:bg-white/40"
                    }`}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {/* CONTINUOUS AUTO-SLIDE PROGRESS BAR AT BOTTOM */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40 z-30">
          <div
            className="h-full bg-gradient-to-r from-rose-600 to-red-500 transition-all duration-75 ease-linear shadow-sm shadow-rose-600/50"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
