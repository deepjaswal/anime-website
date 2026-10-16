import { getTopAnime, getAnimeGenres } from "@/lib/jikan";
import HomeClient from "@/components/HomeClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AnimeVault - Modern Anime Database & Reviews",
  description:
    "Explore top airing anime, rankings, trailers, reviews, and streaming platforms powered by the Jikan API (MyAnimeList v4).",
};

export default async function HomePage() {
  // Fetch initial top airing anime and genres list
  const [topResult, genres] = await Promise.all([
    getTopAnime("airing", 1, 18),
    getAnimeGenres(),
  ]);

  return (
    <HomeClient
      initialAnime={topResult.data}
      genres={genres}
      initialPagination={topResult.pagination}
    />
  );
}
