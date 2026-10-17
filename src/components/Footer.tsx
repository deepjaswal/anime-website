import React from "react";
import Link from "next/link";
import { Flame, Heart, ShieldCheck, Tv, Film } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-rose-900/20 bg-[#060813]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-black text-white">
                Anime<span className="text-gradient-anime">Vault</span>
              </span>
              <span className="px-2 py-0.5 rounded-md bg-rose-950/80 text-[10px] text-rose-300 border border-rose-700/40 font-bold">
                India
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              India&apos;s premier anime discovery &amp; review hub. Explore authentic ratings, community reviews, official trailers, and where to watch legally in India.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#0e1224] border border-white/[0.08] text-rose-300 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                100% Legal &amp; Safe
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#0e1224] border border-white/[0.08] text-slate-300">
                <Film className="w-3.5 h-3.5 text-amber-400" />
                Verified Reviews
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
              Explore Anime
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/?tab=airing" className="hover:text-rose-400 transition-colors">
                  Top Airing Anime
                </Link>
              </li>
              <li>
                <Link href="/?tab=bypopularity" className="hover:text-rose-400 transition-colors">
                  Most Popular
                </Link>
              </li>
              <li>
                <Link href="/?tab=upcoming" className="hover:text-rose-400 transition-colors">
                  Upcoming Releases
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-rose-400 transition-colors">
                  Genres &amp; Categories
                </Link>
              </li>
              <li>
                <Link href="/watchlist" className="hover:text-rose-400 transition-colors">
                  My Saved Watchlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Streaming Platforms in India */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
              <Tv className="w-3.5 h-3.5 text-rose-400" />
              Watch Legally in India
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a
                  href="https://www.crunchyroll.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-rose-400 transition-colors block"
                >
                  Crunchyroll India (Hindi / Subs)
                </a>
              </li>
              <li>
                <a
                  href="https://www.netflix.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-rose-400 transition-colors block"
                >
                  Netflix India
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/@MuseAsia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-rose-400 transition-colors block"
                >
                  Muse Asia / Muse India (Free)
                </a>
              </li>
              <li>
                <a
                  href="https://www.primevideo.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-rose-400 transition-colors block"
                >
                  Prime Video India
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 AnimeVault India • Dedicated to Indian Anime Fans.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for the Anime Community in India
          </p>
        </div>
      </div>
    </footer>
  );
}
