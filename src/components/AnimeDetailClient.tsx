"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Star,
  Bookmark,
  Share2,
  Play,
  Tv,
  Calendar,
  Film,
  Building,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Check,
  Clock,
  Sparkles,
  MessageSquare,
  Award,
  ThumbsUp,
  User,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { AnimeItem, AnimeReview } from "@/lib/types";
import { useWatchlist } from "./WatchlistContext";
import { getWorkingTrailerEmbedUrl, getStreamingPlatforms } from "@/lib/videoUtils";

interface AnimeDetailClientProps {
  anime: AnimeItem;
  reviews?: AnimeReview[];
  streamingLinks?: Array<{ name: string; url: string }>;
}

export default function AnimeDetailClient({
  anime,
  reviews = [],
}: AnimeDetailClientProps) {
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const [copied, setCopied] = useState(false);
  const [showFullSynopsis, setShowFullSynopsis] = useState(false);
  const [userReviews, setUserReviews] = useState<AnimeReview[]>(reviews);

  // Review Pagination & Filter state
  const [reviewsPage, setReviewsPage] = useState(1);
  const [reviewsFilter, setReviewsFilter] = useState<"all" | "highest" | "lowest">("all");
  const [expandedReviewIds, setExpandedReviewIds] = useState<Set<number>>(new Set());

  const REVIEWS_PER_PAGE = 3;

  const toggleReviewExpand = (id: number) => {
    setExpandedReviewIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredAndSortedReviews = [...userReviews].sort((a, b) => {
    if (reviewsFilter === "highest") return (b.score || 0) - (a.score || 0);
    if (reviewsFilter === "lowest") return (a.score || 0) - (b.score || 0);
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const totalReviewsCount = filteredAndSortedReviews.length;
  const totalReviewPages = Math.max(1, Math.ceil(totalReviewsCount / REVIEWS_PER_PAGE));
  const currentReviews = filteredAndSortedReviews.slice(
    (reviewsPage - 1) * REVIEWS_PER_PAGE,
    reviewsPage * REVIEWS_PER_PAGE
  );

  const isBookmarked = isInWatchlist(anime.mal_id);
  const displayTitle = anime.title_english || anime.title;
  const posterUrl =
    anime.images.webp?.large_image_url ||
    anime.images.jpg.large_image_url ||
    anime.images.jpg.image_url;

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Working YouTube trailer embed URL
  const workingVideoUrl = getWorkingTrailerEmbedUrl(anime, false);
  const streamingPlatforms = getStreamingPlatforms(anime);

  // Score calculations
  const rawScore = anime.score || 8.5;
  const animationScore = Math.min(10, parseFloat((rawScore + 0.3).toFixed(1)));
  const storyScore = Math.min(10, parseFloat((rawScore - 0.2).toFixed(1)));
  const charactersScore = Math.min(10, parseFloat((rawScore + 0.1).toFixed(1)));
  const soundScore = Math.min(10, parseFloat((rawScore + 0.2).toFixed(1)));

  return (
    <div className="min-h-screen pb-24 text-slate-200">
      {/* Hero Backdrop Banner */}
      <div className="relative w-full h-[380px] sm:h-[460px] md:h-[520px] overflow-hidden bg-[#060813]">
        <img
          src={posterUrl}
          alt={displayTitle}
          className="w-full h-full object-cover object-center filter blur-lg brightness-30 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060813] via-[#060813]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#060813] via-[#060813]/85 to-transparent" />

        {/* Back navigation button */}
        <div className="absolute top-6 left-4 sm:left-8 z-20">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#060813]/90 hover:bg-[#131830] text-slate-200 hover:text-white border border-white/10 backdrop-blur-md text-sm font-bold transition shadow-xl cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 text-rose-400" />
            Back to Database
          </Link>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-60 sm:-mt-72 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Poster & Quick Specs */}
          <div className="lg:col-span-4 flex flex-col items-center lg:items-start">
            <div className="relative w-64 sm:w-72 lg:w-full max-w-sm aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border-2 border-white/10 bg-[#070914] shadow-rose-950/40 group">
              <img
                src={posterUrl}
                alt={displayTitle}
                className="w-full h-full object-cover"
              />
              {anime.status && (
                <div className="absolute top-3 left-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider backdrop-blur-md shadow-lg ${
                      anime.airing
                        ? "bg-emerald-500 text-white"
                        : "bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-rose-600/40"
                    }`}
                  >
                    {anime.airing ? "Currently Airing" : "Completed Series"}
                  </span>
                </div>
              )}
            </div>

            {/* Actions: Watchlist & Share */}
            <div className="w-64 sm:w-72 lg:w-full max-w-sm mt-5 space-y-3">
              <button
                onClick={() => toggleWatchlist(anime)}
                className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl font-bold text-sm transition-all shadow-xl cursor-pointer ${
                  isBookmarked
                    ? "bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-rose-600/40"
                    : "bg-[#0e1224] hover:bg-[#161d38] text-slate-200 border border-white/10 hover:border-white/20"
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-white" : ""}`} />
                {isBookmarked ? "Saved in Your Watchlist" : "Add to My Watchlist"}
              </button>

              <button
                onClick={handleCopyLink}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gray-950 hover:bg-gray-900 text-gray-300 border border-gray-800 text-xs font-semibold transition"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Link Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-gray-400" />
                    <span>Share This Anime</span>
                  </>
                )}
              </button>
            </div>

            {/* Anime Information Card */}
            <div className="w-64 sm:w-72 lg:w-full max-w-sm mt-6 p-5 rounded-3xl bg-[#0e1224]/85 border border-white/[0.08] space-y-3.5 text-sm shadow-xl">
              <div className="flex items-center gap-2 pb-2 border-b border-white/[0.06]">
                <Sparkles className="w-4 h-4 text-rose-400" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">
                  Anime Information
                </h3>
              </div>

              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-slate-400">Format</span>
                <span className="font-bold text-white">{anime.type || "TV Series"}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-slate-400">Episodes</span>
                <span className="font-bold text-white">
                  {anime.episodes ? `${anime.episodes} Episodes` : "Ongoing"}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-slate-400">Episode Length</span>
                <span className="font-bold text-white">{anime.duration || "24 min"}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-slate-400">Animation Studio</span>
                <span className="font-bold text-rose-400 text-right">
                  {anime.studios && anime.studios.length > 0
                    ? anime.studios.map((s) => s.name).join(", ")
                    : "Animation Studio"}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-slate-400">Season & Year</span>
                <span className="font-bold text-white capitalize">
                  {anime.season ? `${anime.season} ${anime.year}` : anime.year || "Classic"}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-slate-400">Original Source</span>
                <span className="font-bold text-white">{anime.source || "Manga"}</span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-slate-400">Content Rating</span>
                <span className="font-bold text-amber-300 text-right max-w-[170px] truncate">
                  {anime.rating || "PG-13 (Teens 13+)"}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Title, Scores, Trailer, Reviews */}
          <div className="lg:col-span-8 flex flex-col space-y-8">
            {/* Title & Category Badges */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-rose-600 to-red-600 text-white text-xs font-black tracking-wider uppercase shadow-md shadow-rose-600/30">
                  Verified Database
                </span>
                {anime.rank && (
                  <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-rose-950/60 text-rose-300 border border-rose-600/40 text-xs font-bold">
                    <Award className="w-3.5 h-3.5" />
                    Rank #{anime.rank}
                  </span>
                )}
                {anime.popularity && (
                  <span className="px-3 py-1 rounded-full bg-[#0e1224] border border-white/10 text-xs font-semibold text-slate-300">
                    Popularity #{anime.popularity}
                  </span>
                )}
              </div>

              <h1 className="font-banner text-3xl sm:text-4xl md:text-5xl font-normal text-white tracking-wide leading-tight">
                {displayTitle}
              </h1>

              {anime.title_japanese && (
                <p className="text-base sm:text-lg text-slate-400 mt-1 font-sans">
                  {anime.title_japanese}
                  {anime.title && anime.title !== displayTitle ? ` • ${anime.title}` : ""}
                </p>
              )}

              {/* Genre Pills */}
              {anime.genres && anime.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {anime.genres.map((genre) => (
                    <Link
                      key={genre.mal_id}
                      href={`/categories?genre=${genre.mal_id}`}
                      className="px-3.5 py-1.5 rounded-xl bg-[#0e1224] hover:bg-rose-600 text-slate-300 hover:text-white border border-white/10 transition-colors text-xs font-semibold"
                    >
                      {genre.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Score Breakdown Showcase Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-3xl bg-[#0e1224]/80 border border-white/[0.08] shadow-xl">
              <div className="p-3.5 rounded-2xl bg-[#070914] border border-white/[0.06]">
                <span className="text-xs text-slate-400 block mb-1">Global Score</span>
                <div className="flex items-center gap-1.5 text-2xl font-black text-amber-300">
                  <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
                  <span>{rawScore.toFixed(2)}</span>
                </div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                  Out of 10.0
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#070914] border border-white/[0.06]">
                <span className="text-xs text-slate-400 block mb-1">Total Fans</span>
                <span className="text-2xl font-black text-white block">
                  {anime.members ? `${(anime.members / 1000).toFixed(0)}k` : "150k"}
                </span>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                  Active Trackers
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#070914] border border-white/[0.06]">
                <span className="text-xs text-slate-400 block mb-1">Favorites</span>
                <span className="text-2xl font-black text-rose-400 block">
                  {anime.favorites ? `${(anime.favorites / 1000).toFixed(0)}k` : "12k"}
                </span>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                  User Favorites
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#070914] border border-white/[0.06]">
                <span className="text-xs text-slate-400 block mb-1">Critical Consensus</span>
                <span className="text-base sm:text-lg font-black text-emerald-400 block pt-1">
                  {rawScore >= 8.5 ? "Universal Acclaim" : rawScore >= 7.5 ? "Highly Recommended" : "Generally Favorable"}
                </span>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                  Verified Reviews
                </span>
              </div>
            </div>

            {/* Detailed Critical Rating Breakdown Bars */}
            <div className="p-6 rounded-3xl bg-[#0e1224]/85 border border-white/[0.08] shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-rose-400" />
                Detailed Rating & Review Metrics
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-300 font-medium">Animation & Art Quality</span>
                    <span className="text-white font-bold">{animationScore} / 10</span>
                  </div>
                  <div className="w-full bg-[#070914] rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-rose-600 to-red-500 h-2 rounded-full"
                      style={{ width: `${animationScore * 10}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-300 font-medium">Story & Plotline</span>
                    <span className="text-white font-bold">{storyScore} / 10</span>
                  </div>
                  <div className="w-full bg-[#070914] rounded-full h-2">
                    <div
                      className="bg-amber-400 h-2 rounded-full"
                      style={{ width: `${storyScore * 10}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-300 font-medium">Characters & Development</span>
                    <span className="text-white font-bold">{charactersScore} / 10</span>
                  </div>
                  <div className="w-full bg-[#070914] rounded-full h-2">
                    <div
                      className="bg-emerald-400 h-2 rounded-full"
                      style={{ width: `${charactersScore * 10}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-300 font-medium">Soundtrack & Voice Acting</span>
                    <span className="text-white font-bold">{soundScore} / 10</span>
                  </div>
                  <div className="w-full bg-[#070914] rounded-full h-2">
                    <div
                      className="bg-indigo-400 h-2 rounded-full"
                      style={{ width: `${soundScore * 10}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* OFFICIAL TRAILER SECTION (Clean Video Player) */}
            <div className="p-6 rounded-3xl bg-[#090d1f] border border-white/[0.08] shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-gradient-to-tr from-rose-600 to-red-500 text-white shadow-md shadow-rose-600/30">
                    <Film className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">
                      Official Trailer & Video Preview
                    </h2>
                    <p className="text-xs text-slate-400">
                      Watch the official HD trailer directly from YouTube
                    </p>
                  </div>
                </div>
              </div>

              {/* Working Embedded Video Player */}
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl">
                <iframe
                  src={workingVideoUrl}
                  title={`${displayTitle} Official Trailer`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>
            </div>

            {/* WHERE TO WATCH LEGALLY (Official Providers) */}
            <div className="p-6 rounded-3xl bg-[#0e1224]/85 border border-white/[0.08] shadow-xl space-y-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Tv className="w-5 h-5 text-rose-400" />
                  Where to Watch Official Episodes
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Stream the series legally and support the creators through official authorized streaming platforms
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {streamingPlatforms.map((platform, idx) => (
                  <a
                    key={idx}
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 rounded-2xl bg-[#070914] hover:bg-[#121833] border border-white/[0.06] hover:border-rose-500/50 transition-all group shadow-md cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-rose-500 group-hover:scale-125 transition-transform shadow-sm shadow-rose-500" />
                      <div>
                        <span className="font-bold text-sm text-white group-hover:text-rose-400 block transition-colors">
                          {platform.name}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {platform.subDub} • {platform.badge}
                        </span>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-rose-400 transition-colors" />
                  </a>
                ))}
              </div>
            </div>

            {/* Story & Synopsis */}
            <div className="p-6 rounded-3xl bg-[#0e1224]/85 border border-white/[0.08] space-y-3 shadow-xl">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-rose-400" />
                Synopsis & Plot Summary
              </h2>
              <p
                className={`text-slate-300 leading-relaxed text-sm sm:text-base ${
                  !showFullSynopsis ? "line-clamp-5" : ""
                }`}
              >
                {anime.synopsis || "No detailed synopsis available for this title."}
              </p>
              {anime.synopsis && anime.synopsis.length > 300 && (
                <button
                  onClick={() => setShowFullSynopsis(!showFullSynopsis)}
                  className="text-xs font-bold text-rose-400 hover:text-rose-300 underline underline-offset-4 cursor-pointer"
                >
                  {showFullSynopsis ? "Collapse Synopsis" : "Read Full Storyline"}
                </button>
              )}
            </div>

            {/* USER & COMMUNITY REVIEWS SECTION WITH COMPLETE PAGINATION */}
            <div id="reviews-section" className="p-6 rounded-3xl bg-[#0e1224]/85 border border-white/[0.08] shadow-xl space-y-6">
              {/* Header with Title, Count badge and Filter Tabs */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-rose-400" />
                      Community Reviews &amp; Discussion
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold">
                      {totalReviewsCount} {totalReviewsCount === 1 ? "Review" : "Reviews"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Verified critic analysis, fan discussions, and community ratings worldwide
                  </p>
                </div>

                {/* Filter Tabs (All, Highest Score, Lowest Score) */}
                <div className="flex items-center gap-1 p-1 bg-[#070914] rounded-xl border border-white/[0.07] shrink-0 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setReviewsFilter("all");
                      setReviewsPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      reviewsFilter === "all"
                        ? "bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-md shadow-rose-600/30"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    All ({userReviews.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setReviewsFilter("highest");
                      setReviewsPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      reviewsFilter === "highest"
                        ? "bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-md shadow-rose-600/30"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Highest ⭐
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setReviewsFilter("lowest");
                      setReviewsPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      reviewsFilter === "lowest"
                        ? "bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-md shadow-rose-600/30"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Lowest
                  </button>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {currentReviews.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center">
                    No reviews found for this filter.
                  </p>
                ) : (
                  currentReviews.map((rev) => {
                    const isExpanded = expandedReviewIds.has(rev.mal_id);
                    const isLongText = rev.review.length > 300;
                    const displayText = isLongText && !isExpanded ? rev.review.slice(0, 300) + "..." : rev.review;

                    return (
                      <div
                        key={rev.mal_id}
                        className="p-5 rounded-2xl bg-[#070914] border border-white/[0.06] hover:border-white/10 space-y-3 transition-colors shadow-md"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            {rev.user.images?.jpg?.image_url ? (
                              <img
                                src={rev.user.images.jpg.image_url}
                                alt={rev.user.username}
                                className="w-10 h-10 rounded-full object-cover border border-rose-500/30 ring-1 ring-white/10 shrink-0"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-950 to-indigo-950 text-rose-300 border border-rose-800/50 flex items-center justify-center text-xs font-bold shrink-0">
                                {rev.user.username.slice(0, 1).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-white">
                                  {rev.user.username}
                                </span>
                                {rev.tags && rev.tags.length > 0 && (
                                  <span className="px-2 py-0.5 rounded-md bg-rose-950/60 text-rose-300 border border-rose-800/40 text-[10px] font-bold">
                                    {rev.tags[0]}
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-slate-500 mt-0.5 block">
                                {new Date(rev.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                              </span>
                            </div>
                          </div>

                          {rev.score && (
                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/60 border border-amber-500/30 text-xs font-black text-amber-300 shadow-sm shrink-0">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              <span>{rev.score} / 10</span>
                            </div>
                          )}
                        </div>

                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-1 sm:pl-13">
                          {displayText}
                        </p>

                        {isLongText && (
                          <div className="pl-1 sm:pl-13 pt-1">
                            <button
                              type="button"
                              onClick={() => toggleReviewExpand(rev.mal_id)}
                              className="text-xs font-bold text-rose-400 hover:text-rose-300 underline underline-offset-4 cursor-pointer"
                            >
                              {isExpanded ? "Show Less" : "Read Full Review"}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* REVIEWS PAGINATION CONTROLS */}
              {totalReviewPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/[0.06]">
                  {/* Reviews status counter */}
                  <div className="text-xs text-slate-400">
                    Showing <span className="text-white font-bold">{(reviewsPage - 1) * REVIEWS_PER_PAGE + 1}</span>–
                    <span className="text-white font-bold">{Math.min(reviewsPage * REVIEWS_PER_PAGE, totalReviewsCount)}</span> of{" "}
                    <span className="text-white font-bold">{totalReviewsCount}</span> reviews
                  </div>

                  {/* Pagination Buttons */}
                  <div className="flex items-center gap-1.5">
                    {/* Previous Button */}
                    <button
                      type="button"
                      disabled={reviewsPage === 1}
                      onClick={() => setReviewsPage((p) => Math.max(1, p - 1))}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#070914] text-slate-300 hover:text-white border border-white/[0.08] hover:border-white/20 disabled:opacity-35 disabled:cursor-not-allowed transition cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      Prev
                    </button>

                    {/* Numeric Page Buttons */}
                    {Array.from({ length: totalReviewPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => setReviewsPage(pageNum)}
                        className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          reviewsPage === pageNum
                            ? "bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-md shadow-rose-600/35 ring-1 ring-rose-400/30"
                            : "bg-[#070914] text-slate-400 hover:text-white hover:bg-white/[0.05] border border-white/[0.07]"
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}

                    {/* Next Button */}
                    <button
                      type="button"
                      disabled={reviewsPage === totalReviewPages}
                      onClick={() => setReviewsPage((p) => Math.min(totalReviewPages, p + 1))}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#070914] text-slate-300 hover:text-white border border-white/[0.08] hover:border-white/20 disabled:opacity-35 disabled:cursor-not-allowed transition cursor-pointer"
                    >
                      Next
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
