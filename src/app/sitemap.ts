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
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date();

  // 1. Static Pages & Core Landing Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0, // Primary homepage
    },
    {
      url: `${SITE_URL}/categories`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.85, // Categories main directory
    },
  ];

  // 2. High-Intent Genre Pages (Action, Comedy, Fantasy, Sci-Fi, etc.)
  const genreIds = [1, 2, 4, 8, 10, 14, 22, 24, 30, 37];
  const genreRoutes: MetadataRoute.Sitemap = genreIds.map((id) => ({
    url: `${SITE_URL}/categories?genre=${id}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  // 3. Dynamic High-Traffic Anime Detail Pages
  // Airing + Most Popular Anime ko sitemap me index karna
  const seenIds = new Set<number>();
  const animeRoutes: MetadataRoute.Sitemap = [];

  try {
    const [airingRes, popularRes] = await Promise.allSettled([
      getTopAnime("airing", 1, 25),
      getTopAnime("bypopularity", 1, 25),
    ]);

    const allAnime = [
      ...(airingRes.status === "fulfilled" && airingRes.value?.data ? airingRes.value.data : []),
      ...(popularRes.status === "fulfilled" && popularRes.value?.data ? popularRes.value.data : []),
    ];

    for (const anime of allAnime) {
      if (!seenIds.has(anime.mal_id)) {
        seenIds.add(anime.mal_id);
        animeRoutes.push({
          url: `${SITE_URL}/anime/${anime.mal_id}`,
          lastModified: currentDate,
          changeFrequency: "weekly",
          priority: 0.9, // High priority for individual anime pages
        });
      }
    }
  } catch (error) {
    console.error("Failed to fetch anime for sitemap generation:", error);
  }

  return [...staticRoutes, ...genreRoutes, ...animeRoutes];
}
