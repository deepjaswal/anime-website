/**
 * ==============================================================================
 * SEO CONFIGURATION (seo-config.ts)
 * ==============================================================================
 * Ye file hamari website ke pure SEO ke default settings aur constants ko hold karti hai.
 * Yaha se aap site ka domain, name, description, keywords, aur Google verification code
 * aasani se customize kar sakte hain.
 */

// Website ka live domain URL (agar production me environment variable na ho to fallback use hoga)
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://animevault.vercel.app";

export const siteConfig = {
  // Website ka brand name
  name: "AnimeVault",

  // Browser tab aur Google search me aane wala default title
  defaultTitle: "AnimeVault - Watch Official Trailers, Anime Ratings & Database",

  // Title format jo har page ke title ke piche lagega (e.g. "Attack on Titan | AnimeVault")
  titleTemplate: "%s | AnimeVault",

  // Website ka high-CTR description (Google search snippets ke liye 155-160 characters best hota hai)
  description:
    "Explore 25,000+ top anime titles, official HD trailers, live episode schedules, global MAL ratings, user reviews, and verified streaming platforms on AnimeVault.",

  // High-search-volume keywords jo search engines ko website ka topic batate hain
  keywords: [
    "Anime",
    "Anime Database",
    "Watch Anime Online",
    "Anime Reviews",
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
  ],

  // Author aur creator details (Google E-E-A-T score aur ownership proof ke liye)
  author: {
    name: "AnimeVault Team",
    url: SITE_URL,
  },

  // Social media handles (Twitter cards aur OpenGraph ke liye)
  social: {
    twitterHandle: "@animevault",
  },

  // Search Engine Webmaster Verification codes
  // Google Search Console se jo verification code milta hai wo aap environment variable
  // NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION me daal sakte hain ya yaha direct paste kar sakte hain.
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
    bing: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || "",
    yandex: process.env.NEXT_PUBLIC_YANDEX_SITE_VERIFICATION || "",
  },

  // Website ka default banner / poster image jo social media sharing (WhatsApp, Facebook, Twitter) par dikhega
  defaultOgImage: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&h=630&fit=crop",
};
