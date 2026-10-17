import { getAnimeGenres, searchAnime } from "@/lib/jikan";
import CategoriesClient from "@/components/CategoriesClient";
import { Metadata } from "next";
import { siteConfig } from "@/lib/seo-config";

/**
 * ==============================================================================
 * CATEGORIES & GENRES PAGE SEO
 * ==============================================================================
 * Search engines ko batata hai ki is page par Anime Genres (Action, Comedy, Romance etc.)
 * browse kiye ja sakte hain.
 */
export const metadata: Metadata = {
  title: "Browse Anime by Categories & Genres",
  description:
    "Explore anime across diverse genres including Action, Fantasy, Romance, Sci-Fi, Comedy, Shonen, and Mystery with top ratings and trailers.",
  alternates: {
    canonical: "/categories",
  },
  openGraph: {
    title: "Browse Anime by Categories & Genres | AnimeVault",
    description:
      "Explore anime across diverse genres including Action, Fantasy, Romance, Sci-Fi, Comedy, Shonen, and Mystery.",
    url: "/categories",
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.defaultOgImage,
        width: 1200,
        height: 630,
        alt: "Browse Anime Categories",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Browse Anime by Categories & Genres | AnimeVault",
    description:
      "Explore anime across diverse genres including Action, Fantasy, Romance, and Sci-Fi.",
    images: [siteConfig.defaultOgImage],
  },
};

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ genre?: string }>;
}

export default async function CategoriesPage({ searchParams }: PageProps) {
  const { genre } = await searchParams;
  const initialGenreId = genre ? parseInt(genre, 10) : 1; // Default to Action (1)

  // Fetch genres list and first batch of anime in parallel
  const [genres, animeResult] = await Promise.all([
    getAnimeGenres(),
    searchAnime("", 1, 18, initialGenreId),
  ]);

  return (
    <CategoriesClient
      genres={genres}
      initialGenreId={initialGenreId}
      initialAnime={animeResult.data}
      initialPagination={animeResult.pagination}
    />
  );
}
