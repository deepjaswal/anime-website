import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo-config";
import { getTopAnime } from "@/lib/jikan";

/**
 * ==============================================================================
 * DYNAMIC XML SITEMAP (sitemap.ts -> /sitemap.xml)
 * ==============================================================================
 * Googlebot aur Bingbot is file ko read karke website ke saare URLs discover karte hain.
 * Next.js automatically is TypeScript file ko XML format me serve karta hai:
 * https://your-domain.com/sitemap.xml
 *
 * Jab koi Google pe kisi bhi anime ka naam search kare (e.g. "Naruto", "Attack on Titan"),
 * Google pehle sitemap me us URL ko dhundh ke index karta hai.
 * Jitne zyada anime URLs sitemap mein honge, utne zyada anime search queries pe
 * humara page Google me dikhe ga!
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date();

  // ─────────────────────────────────────────────────────────────────────
  // 1. STATIC PAGES (Homepage, Categories)
  // ─────────────────────────────────────────────────────────────────────
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0, // Homepage = sabse zyada priority
    },
    {
      url: `${SITE_URL}/categories`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.85,
    },
  ];

  // ─────────────────────────────────────────────────────────────────────
  // 2. GENRE FILTER PAGES (Action, Comedy, Fantasy, Horror, Romance…)
  // ─────────────────────────────────────────────────────────────────────
  const genreIds = [1, 2, 4, 7, 8, 10, 14, 22, 24, 30, 36, 37, 41];
  const genreRoutes: MetadataRoute.Sitemap = genreIds.map((id) => ({
    url: `${SITE_URL}/categories?genre=${id}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  // ─────────────────────────────────────────────────────────────────────
  // 3. ANIME DETAIL PAGES — 600+ unique anime URLs for Google indexing
  // ─────────────────────────────────────────────────────────────────────
  // 4 pages × 50 items × 3 filters = up to 600 unique anime pages
  // Google jab inhe index kare ga to individual anime name searches rank honge
  const seenIds = new Set<number>();
  const animeRoutes: MetadataRoute.Sitemap = [];

  try {
    // 3 filters × 4 pages × 50 items = up to 600 unique anime
    // bypopularity = all-time popular (Naruto, One Piece, AOT, etc.)
    // airing       = currently trending anime
    // favorite     = highest scored anime of all time
    const pageNumbers = [1, 2, 3, 4];
    const filters = ["bypopularity", "airing", "favorite"] as const;

    const allFetchPromises = filters.flatMap((filter) =>
      pageNumbers.map((page) => getTopAnime(filter, page, 50))
    );

    const results = await Promise.allSettled(allFetchPromises);

    for (const result of results) {
      if (result.status === "fulfilled" && result.value?.data) {
        for (const anime of result.value.data) {
          if (!seenIds.has(anime.mal_id)) {
            seenIds.add(anime.mal_id);
            animeRoutes.push({
              url: `${SITE_URL}/anime/${anime.mal_id}`,
              lastModified: currentDate,
              changeFrequency: "weekly",
              // High priority — ye pages actual anime name search queries pe rank karte hain
              priority: 0.9,
            });
          }
        }
      }
    }
  } catch (error) {
    console.error("[Sitemap] Failed to fetch anime:", error);
  }

  // Final sitemap = Static pages + Genre pages + All anime detail pages
  return [...staticRoutes, ...genreRoutes, ...animeRoutes];
}

