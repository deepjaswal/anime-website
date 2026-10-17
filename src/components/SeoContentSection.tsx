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
} from "lucide-react";
import { homeFaqs } from "@/data/faqs";

/**
 * ==============================================================================
 * SEO CONTENT & FAQ SECTION COMPONENT (SeoContentSection.tsx)
 * ==============================================================================
 * Ye component website ko Google Search me Rank #1 lane ke liye 3 vital cheezein provide karta hai:
 * 1. Semantic H2/H3 Content: Google algorithm authoritative reading content ko prefer karta hai.
 * 2. FAQ Accordion: Google SERP FAQ rich snippets ke sath directly match karta hai.
 * 3. High-intent Keywords: "Watch Anime Online", "Anime Ratings", "Streaming Platforms", "Top Shonen".
 */
export default function SeoContentSection() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0); // First FAQ open by default

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-white/[0.06] mt-12">
      {/* 1. Value Proposition Highlights (E-E-A-T Signals) */}
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

      {/* 2. Semantic SEO Guide / Long-form Content */}
      <div className="bg-gradient-to-br from-[#0c1022] to-[#070914] rounded-3xl p-6 sm:p-10 border border-white/[0.07] mb-16 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-4 h-4 text-rose-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
            Authoritative Anime Guide
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-4">
          The Ultimate Guide to Modern Anime Discovery, Reviews & Streaming
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-300 leading-relaxed">
          <div className="space-y-4">
            <p>
              Anime is one of the fastest-growing entertainment mediums globally, encompassing legendary Shonen sagas like <strong className="text-white">Attack on Titan</strong> and <strong className="text-white">Jujutsu Kaisen</strong>, psychological thrillers, captivating Isekai adventures, and heartwarming slice-of-life classics.
            </p>
            <p>
              <strong className="text-white">AnimeVault</strong> was built to solve the frustration of scattered information. Instead of browsing dozens of different sites, AnimeVault gathers verified global review scores, official HD YouTube preview trailers, studio credits, episode guides, and licensed streaming providers into one blazing-fast, ad-free interface.
            </p>
          </div>

          <div className="space-y-4">
            <p>
              Whether you are a veteran otaku looking for newly released seasonal episodes or a newcomer searching for the <strong className="text-white">Top 10 highest-rated anime of all time</strong>, our database filters through thousands of series using authentic MyAnimeList and AniList metrics.
            </p>
            <p>
              Explore our comprehensive category directory to discover curated anime across 70+ genres, from Action and Fantasy to Supernatural, Romance, and Sci-Fi.
            </p>
          </div>
        </div>

        {/* Popular Topic Badges (Internal linking for Google Crawler) */}
        <div className="mt-8 pt-6 border-t border-white/[0.07]">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">
            Popular Anime Categories & Topics:
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
      </div>

      {/* 3. Frequently Asked Questions (FAQ Accordion) */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-wider mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            Got Questions?
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
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
                  className="w-full flex items-center justify-between p-5 text-left text-sm sm:text-base font-bold text-white hover:text-rose-400 transition"
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
