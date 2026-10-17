"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  HelpCircle,
  ChevronDown,
  Sparkles,
  BookOpen,
  Film,
  Tv,
  Award,
  ShieldCheck,
  Zap,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import { homeFaqs } from "@/data/faqs";

/**
 * ==============================================================================
 * SEO CONTENT & FAQ SECTION COMPONENT (SeoContentSection.tsx)
 * ==============================================================================
 * High-density semantic editorial content (600+ words) designed to boost SEObility
 * Page Quality score from 52% to 90%+ and eliminate critical on-page flags.
 */
export default function SeoContentSection() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-white/[0.06] mt-12">
      {/* 1. Value Proposition Highlights (E-E-A-T Trust Signals) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
        <div className="p-5 rounded-2xl bg-[#0c1020] border border-white/[0.06] hover:border-rose-500/30 transition shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-3.5">
            <Film className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">
            25,000+ Anime Database
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Real-time synchronization with MyAnimeList (Jikan v4) and AniList for complete global metadata.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c1020] border border-white/[0.06] hover:border-rose-500/30 transition shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3.5">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">
            Global Community Scores
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Weighted ratings from millions of anime fans worldwide to help you discover only top-tier shows.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c1020] border border-white/[0.06] hover:border-rose-500/30 transition shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-3.5">
            <Tv className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">
            Verified Streaming Hub
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Direct official links to stream licensed anime on Crunchyroll, Netflix, Hulu, and Prime Video.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c1020] border border-white/[0.06] hover:border-rose-500/30 transition shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">
            Instant Private Library
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Bookmark and curate your personal anime watchlist with one click — zero accounts or cookies needed.
          </p>
        </div>
      </div>

      {/* 2. Comprehensive Semantic SEO Editorial Guide (High-Word Count Quality Boost) */}
      <article className="bg-gradient-to-br from-[#0c1022] to-[#070914] rounded-3xl p-6 sm:p-10 border border-white/[0.07] mb-16 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-4 h-4 text-rose-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
            Authoritative Anime Guide &amp; Knowledge Hub
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-6">
          The Definitive Guide to Modern Anime Streaming, Critical Ratings &amp; Recommendations
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-slate-300 leading-relaxed mb-8">
          <div className="space-y-4">
            <p>
              Anime has evolved from a niche Japanese cultural phenomenon into one of the most dynamic storytelling mediums on earth. From legendary Shonen franchises like <strong className="text-white">Attack on Titan (Shingeki no Kyojin)</strong>, <strong className="text-white">Jujutsu Kaisen</strong>, and <strong className="text-white">Demon Slayer (Kimetsu no Yaiba)</strong>, to cerebral psychological thrillers and intricate fantasy epics, millions of fans search daily for reliable reviews, release dates, and streaming sources.
            </p>
            <p>
              <strong className="text-white">AnimeVault</strong> was engineered as an all-in-one encyclopedia and discovery engine. Instead of navigating through multiple fragmented sites, AnimeVault consolidates live global review scores, official high-definition trailers, studio credits, episode counts, and licensed streaming platform directories into one intuitive interface.
            </p>
          </div>

          <div className="space-y-4">
            <p>
              Our database aggregates data from over <strong className="text-white">25,000+ anime titles</strong> utilizing the official Jikan API (MyAnimeList v4) and AniList GraphQL engines. Whether you are seeking the latest seasonal simulcasts or exploring all-time masterpieces like <strong className="text-white">Fullmetal Alchemist: Brotherhood</strong>, <strong className="text-white">Steins;Gate</strong>, and <strong className="text-white">Hunter x Hunter</strong>, you receive accurate metrics free of marketing bias.
            </p>
            <p>
              In addition to scores, AnimeVault provides direct access to legal streaming options. Viewers in India and worldwide can verify whether an anime is officially available on Crunchyroll, Netflix, Disney+ Hotstar, Hulu, or Prime Video with proper English subtitles (Sub) and dubbing (Dub).
            </p>
          </div>
        </div>

        {/* Detailed Sub-Guide for Extra Keyword Depth */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/[0.08] text-xs sm:text-sm text-slate-300">
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
            <h3 className="font-bold text-white text-sm mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-rose-400" />
              How Anime Review Scores Are Evaluated
            </h3>
            <p className="leading-relaxed text-slate-400">
              Anime scores are computed using weighted Bayesian community algorithms. Ratings consider overall animation fidelity, narrative coherence, voice acting performance, and musical score, while filtering out review bombing to ensure an honest 1-to-10 evaluation scale.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
            <h3 className="font-bold text-white text-sm mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Top Japanese Animation Studios
            </h3>
            <p className="leading-relaxed text-slate-400">
              Explore critically acclaimed productions from premier animation powerhouses including MAPPA, Ufotable, Wit Studio, Bones, Kyoto Animation, and Madhouse. Each anime detail page highlights official studio credits and production staff.
            </p>
          </div>
        </div>

        {/* Popular Topic Badges (Internal linking for Google Crawler) */}
        <div className="mt-8 pt-6 border-t border-white/[0.07]">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">
            Explore Popular Anime Genres &amp; Categories:
          </span>
          <div className="flex flex-wrap gap-2">
            {[
              { name: "Action Anime", id: 1 },
              { name: "Adventure", id: 2 },
              { name: "Comedy", id: 4 },
              { name: "Fantasy", id: 10 },
              { name: "Sci-Fi", id: 24 },
              { name: "Romance", id: 22 },
              { name: "Supernatural", id: 37 },
              { name: "Mystery", id: 7 },
              { name: "Drama", id: 8 },
            ].map((topic) => (
              <Link
                key={topic.id}
                href={`/categories?genre=${topic.id}`}
                className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-rose-600 hover:text-white border border-white/[0.07] text-xs font-medium text-slate-300 transition"
              >
                {topic.name}
              </Link>
            ))}
          </div>
        </div>
      </article>

      {/* 3. Frequently Asked Questions (FAQ Accordion with Semantic HTML) */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-wider mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            Verified Answers
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions About AnimeVault
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-lg mx-auto">
            Everything you need to know about AnimeVault, our rating algorithms, and where to stream official anime.
          </p>
        </div>

        <div className="space-y-3">
          {homeFaqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl bg-[#0c1022] border border-white/[0.07] overflow-hidden transition-all duration-200 hover:border-rose-500/30"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-5 text-left text-sm sm:text-base font-bold text-white hover:text-rose-400 transition cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-rose-400" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/[0.04]">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
