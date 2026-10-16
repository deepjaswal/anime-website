import { getAnimeById, getAnimeReviews, getAnimeStreaming } from "@/lib/jikan";
import AnimeDetailClient from "@/components/AnimeDetailClient";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const anime = await getAnimeById(id);

  if (!anime) {
    return {
      title: "Anime Not Found - AnimeVault",
    };
  }

  const title = anime.title_english || anime.title;
  return {
    title: `${title} - Details, Trailer & Reviews | AnimeVault`,
    description: anime.synopsis?.slice(0, 160) || `Read details and watch trailer for ${title} on AnimeVault.`,
    openGraph: {
      title: `${title} | AnimeVault`,
      description: anime.synopsis?.slice(0, 160),
      images: [anime.images.jpg.large_image_url || anime.images.jpg.image_url],
    },
  };
}

export default async function AnimeDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const [anime, reviews, streaming] = await Promise.all([
    getAnimeById(id),
    getAnimeReviews(id),
    getAnimeStreaming(id),
  ]);

  if (!anime) {
    notFound();
  }

  return (
    <AnimeDetailClient
      anime={anime}
      reviews={reviews}
      streamingLinks={streaming}
    />
  );
}
