"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame, Compass, Bookmark, Menu, X, TrendingUp, Sparkles } from "lucide-react";
import SearchBar from "./SearchBar";
import { useWatchlist } from "./WatchlistContext";

export default function Navbar() {
  const pathname = usePathname();
  const { watchlist } = useWatchlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "/", icon: Flame },
    { label: "Top Airing", href: "/?tab=airing", icon: TrendingUp },
    { label: "Categories", href: "/categories", icon: Compass },
    { label: "My Watchlist", href: "/watchlist", icon: Bookmark, badge: watchlist.length },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-nav border-b border-rose-900/20 shadow-2xl shadow-rose-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-6">
          {/* Logo with Authentic Anime Aesthetics */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 via-red-600 to-indigo-900 shadow-lg shadow-rose-500/25 ring-1 ring-white/20 group-hover:scale-105 group-hover:shadow-rose-500/40 transition-all duration-300">
              <Flame className="w-5 h-5 text-white fill-white drop-shadow-sm" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-400 animate-ping opacity-75" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-white group-hover:text-rose-400 transition-colors">
                  Anime<span className="text-gradient-anime">Vault</span>
                </span>
                <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-rose-950/90 to-purple-950/90 text-[10px] text-rose-300 border border-rose-700/40 font-bold tracking-wider uppercase">
                  アニメ
                </span>
              </div>
              <span className="text-[9px] uppercase tracking-widest text-slate-400 -mt-0.5 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                Anime Reviews &bull; India
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs lg:text-sm font-bold tracking-wide transition-all duration-200 ${
                    isActive
                      ? "text-white bg-gradient-to-r from-rose-600 to-red-600 shadow-md shadow-rose-600/30 ring-1 ring-rose-400/30"
                      : "text-slate-300 hover:text-white hover:bg-white/[0.06] hover:ring-1 hover:ring-white/10"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-rose-400"}`} />
                  <span>{link.label}</span>
                  {link.badge !== undefined && link.badge > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white shadow-sm">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Search Bar in Header */}
          <div className="hidden sm:block flex-1 max-w-xs md:max-w-sm lg:max-w-md">
            <SearchBar isHeader />
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-2 md:hidden">
            <Link
              href="/watchlist"
              aria-label="My Watchlist"
              className="p-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-slate-300 hover:text-white relative"
            >
              <Bookmark className="w-4 h-4 text-rose-400" />
              {watchlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center shadow">
                  {watchlist.length}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-slate-300 hover:text-white"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search input */}
        <div className="sm:hidden pb-3">
          <SearchBar isHeader />
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-rose-900/20 bg-[#070914]/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-2 animate-fade-in shadow-2xl">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold tracking-wide transition-colors ${
                  isActive
                    ? "text-white bg-gradient-to-r from-rose-600 to-red-600 shadow-md shadow-rose-600/30"
                    : "text-slate-300 hover:text-white hover:bg-white/[0.06]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-rose-400" />
                  <span>{link.label}</span>
                </div>
                {link.badge !== undefined && link.badge > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-black bg-rose-500 text-white">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
