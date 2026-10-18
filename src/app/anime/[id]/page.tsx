import { getAnimeById, getAnimeReviews, getAnimeStreaming, getTopAnime } from "@/lib/jikan";
import AnimeDetailClient from "@/components/AnimeDetailClient";
import JsonLd, { generateAnimeJsonLd, generateBreadcrumbJsonLd } from "@/components/JsonLd";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { SITE_URL, siteConfig } from "@/lib/seo-config";

/**
 * ==============================================================================
 * ISR (Incremental Static Regeneration)
 * ==============================================================================
 * force-dynamic ke bajay ISR use kar rahe hain:
 * - Pages pehli baar serve hote hain, phir 24 ghante tak cache mein rehte hain.
 * - Isse Google ko real static HTML milta hai jo rank karne mein madad karta hai.
 * - 86400 seconds = 24 hours
 */
export const revalidate = 86400;

/**
 * ==============================================================================
 * STATIC PARAMS (Pre-render Top 100 Anime at Build Time)
 * ==============================================================================
 * Ye function build ke time pe top 100 anime pages ko pre-render karta hai.
 * Matlab Google ko instantly crawlable HTML milti hai — bina server request wait ke.
 * Jab koi "Naruto", "Attack on Titan" search kare, Google humara page dhundh lega.
 */
export async function generateStaticParams() {
  try {
    // Top 50 trending + top 50 most popular anime
    const [trendingRes, popularRes] = await Promise.allSettled([
      getTopAnime("airing", 1, 50),
      getTopAnime("bypopularity", 1, 50),
    ]);

    const seenIds = new Set<string>();
    const params: { id: string }[] = [];

    const allAnime = [
      ...(trendingRes.status === "fulfilled" ? trendingRes.value.data : []),
      ...(popularRes.status === "fulfilled" ? popularRes.value.data : []),
    ];

    for (const anime of allAnime) {
      const id = String(anime.mal_id);
      if (!seenIds.has(id)) {
        seenIds.add(id);
        params.push({ id });
      }
    }

    return params;
  } catch (err) {
    console.error("[generateStaticParams] Failed:", err);
    return [];
  }
}

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

  // SEO keywords anime-specific — jab koi Google pe anime ka naam search kare
  const genreNames = anime.genres?.map((g) => g.name) || [];
  const studioNames = anime.studios?.map((s) => s.name) || [];
  const animeKeywords = [
    title,                                      // English title
    anime.title_japanese || "",                  // Japanese title (native speakers)
    anime.title,                                 // Romaji title
    `${title} anime`,                            // "Attack on Titan anime"
    `${title} review`,                           // "Naruto review"
    `${title} trailer`,                          // "Demon Slayer trailer"
    `${title} episodes`,                         // "One Piece episodes"
    `${title} watch online`,                     // "Dragon Ball watch online"
    `${title} streaming`,                        // "Bleach streaming"
    `${title} ${releaseYear}`,                   // "Jujutsu Kaisen 2023"
    `${title} rating`,                           // "AOT rating"
    `${title} score`,                            // "Berserk score"
    `where to watch ${title}`,                   // Featured Snippet bait
    `is ${title} worth watching`,                // Long-tail intent
    ...genreNames,
    ...studioNames,
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
