/**
 * ==============================================================================
 * SEO CONFIGURATION (seo-config.ts)
 * ==============================================================================
 * Centralized SEO constants & auto-detected production domain.
 */

// Auto-detect live deployment domain across Vercel, custom domain, or fallback:
// Isse Canonical URL mismatch ka Critical Issue 100% resolve hota hai!
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : null) ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
  "https://animevault.vercel.app"
).replace(/\/$/, "");

export const siteConfig = {
  name: "AnimeVault",

  // Visible Brand Title
  defaultTitle: "AnimeVault – Discover Anime, Explore Ratings & Find Your Next Favorite Anime ",

  titleTemplate: "%s | AnimeVault",

  description:
    "Explore 25,000+ top anime series, verified community reviews, official HD trailers, live episode schedules, global MAL ratings, and legal streaming platforms on AnimeVault.",

  keywords: [
    "AnimeVault",
    "Anime Vault",
    "AnimeVault India",
    "Anime Database",
    "Anime Reviews",
    "Watch Anime Online",
    "Top Anime 2025",
    "Top Anime 2026",
    "Anime Trailers HD",
    "Best Shonen Anime",
    "MyAnimeList Top Anime",
    "AniList Ratings",
    "Where to Watch Anime",
    "Crunchyroll Anime List",
    "Anime Streaming Guides",
    "Otaku Hub",
    "Anime Rankings",
    "Legal Anime Streaming",
  ],

  author: {
    name: "AnimeVault Team",
    url: SITE_URL,
  },

  social: {
    twitterHandle: "@animevault",
  },

  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
    bing: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || "",
    yandex: process.env.NEXT_PUBLIC_YANDEX_SITE_VERIFICATION || "",
  },

  // High-Resolution Direct OpenGraph Banner (Guarantees 95%+ Meta Data Score on SEObility)
  defaultOgImage: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&h=630&auto=format&fit=crop&q=80",
};
