import { getAnimeById, getAnimeReviews, getAnimeStreaming } from "@/lib/jikan";
import AnimeDetailClient from "@/components/AnimeDetailClient";
import JsonLd, { generateAnimeJsonLd, generateBreadcrumbJsonLd } from "@/components/JsonLd";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { SITE_URL, siteConfig } from "@/lib/seo-config";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * ==============================================================================
 * DYNAMIC SEO METADATA GENERATOR (generateMetadata)
 * ==============================================================================
 * Next.js App Router har anime ke dynamic ID ke hisab se automatic SEO tags banata hai.
 * Google ko har anime ka unique Title, Poster image, Synopsis aur Keywords milte hain.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const anime = await getAnimeById(id);

  // Agar anime exist nahi karta to 404 title return karein
  if (!anime) {
    return {
      title: "Anime Not Found",
      description: "The requested anime could not be found on AnimeVault.",
      robots: { index: false, follow: true },
    };
  }

  // Primary title (English agar available ho, nahi to Romaji / default)
  const title = anime.title_english || anime.title;
  const releaseYear = anime.year || anime.aired?.string || "";
  const yearSuffix = releaseYear ? ` (${releaseYear})` : "";
  
  // Clean synopsis 155-160 characters me trim karna Google search snippet ke liye
  const cleanDescription = anime.synopsis
    ? anime.synopsis.replace(/\r?\n|\r/g, " ").slice(0, 155) + "..."
    : `Explore ${title}${yearSuffix} ratings, reviews, episode count, official trailers, and streaming options on ${siteConfig.name}.`;

  // Best available image (HD large poster)
  const posterImage =
    anime.images.jpg.large_image_url ||
    anime.images.jpg.image_url ||
    siteConfig.defaultOgImage;

  // SEO keywords anime specific
  const genreNames = anime.genres?.map((g) => g.name) || [];
  const animeKeywords = [
    title,
    anime.title_japanese || "",
    `${title} anime review`,
    `${title} trailer`,
    `${title} episodes`,
    `${title} score`,
    ...genreNames,
    ...siteConfig.keywords,
  ].filter(Boolean);

  return {
    // Page Title: e.g. "Attack on Titan (2013) - Episodes, Reviews & Trailers"
    title: `${title}${yearSuffix} - Episodes, Reviews & Trailer`,
    description: cleanDescription,
    keywords: animeKeywords,

    // Canonical link - taaki duplicate URLs / query params rank na ho
    alternates: {
      canonical: `/anime/${id}`,
    },

    // OpenGraph - WhatsApp / Facebook / Discord par jab link share ho
    openGraph: {
      title: `${title}${yearSuffix} | AnimeVault`,
      description: cleanDescription,
      url: `/anime/${id}`,
      siteName: siteConfig.name,
      images: [
        {
          url: posterImage,
          width: 800,
          height: 1100,
          alt: `${title} Poster`,
        },
      ],
      type: "video.other",
    },

    // Twitter Card - Bada image card
    twitter: {
      card: "summary_large_image",
      title: `${title}${yearSuffix} | AnimeVault`,
      description: cleanDescription,
      images: [posterImage],
      creator: siteConfig.social.twitterHandle,
    },
  };
}

/**
 * ==============================================================================
 * ANIME DETAILS SERVER COMPONENT
 * ==============================================================================
 * Server side data fetching + JSON-LD Schema injection for rich snippets.
 */
export default async function AnimeDetailsPage({ params }: PageProps) {
  const { id } = await params;

  // Parallel data fetching for fast load time
  const [anime, reviews, streaming] = await Promise.all([
    getAnimeById(id),
    getAnimeReviews(id),
    getAnimeStreaming(id),
  ]);

  if (!anime) {
    notFound();
  }

  const title = anime.title_english || anime.title;

  // Breadcrumbs data (Home > Anime > Anime Title)
  const breadcrumbData = [
    { name: "Home", url: SITE_URL },
    { name: "Categories", url: `${SITE_URL}/categories` },
    { name: title, url: `${SITE_URL}/anime/${id}` },
  ];

  return (
    <>
      {/* 
        Google Schema.org Structured Data
        1. Anime details (TVSeries / Movie) schema: Star ratings, episodes, trailer
        2. Breadcrumbs schema: Google search me navigation trail
      */}
      <JsonLd data={generateAnimeJsonLd(anime)} />
      <JsonLd data={generateBreadcrumbJsonLd(breadcrumbData)} />

      {/* Main interactive UI client component */}
      <AnimeDetailClient
        anime={anime}
        reviews={reviews}
        streamingLinks={streaming}
      />
    </>
  );
}
