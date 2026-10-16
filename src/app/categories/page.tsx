import { getAnimeGenres, searchAnime } from "@/lib/jikan";
import CategoriesClient from "@/components/CategoriesClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories & Genres - AnimeVault",
  description: "Browse anime by genres: Action, Fantasy, Comedy, Sci-Fi, Romance, Adventure, and more.",
};

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ genre?: string }>;
}

export default async function CategoriesPage({ searchParams }: PageProps) {
  const { genre } = await searchParams;
  const initialGenreId = genre ? parseInt(genre, 10) : 1; // Default to Action (1)

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
