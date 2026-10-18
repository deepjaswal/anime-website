import React from "react";
import { AnimeItem } from "@/lib/types";
import { SITE_URL, siteConfig } from "@/lib/seo-config";
import { FaqItem } from "@/data/faqs";

/**
 * ==============================================================================
 * JSON-LD STRUCTURED DATA HELPER & COMPONENT (JsonLd.tsx)
 * ==============================================================================
 * Schema.org JSON-LD Google Search Console aur Googlebot ko structured data provide
 * karta hai jisse Google search results me:
 * 1. ⭐ Star Ratings & Reviews (Rich Snippets)
 * 2. ❓ Expandable FAQ Dropdowns directly in Google SERP
 * 3. 🏢 Organization Logo & Official Links
 * 4. 📅 Release Date & Episodes count
 * 5. 🖼️ Poster & Trailer Video Objects
 * 6. 🧭 Breadcrumbs (Home > Categories > Anime)
 * 7. 🔍 Sitelinks Search Box
 */

interface JsonLdProps {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
}

/**
 * JSON-LD Script tag renderer
 * Is component se Google search bots JSON code ko read kar lete hain
 */
export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * 1. Website Schema (Sitelinks Searchbox)
 * Google ko batata hai ki ye ek Searchable Web Application hai
 */
export function generateWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    alternateName: ["Anime Vault", "AnimeVault India", "AnimeVault App", "AnimeVault Online"],
    url: SITE_URL,
    description: siteConfig.description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * 2. Organization Schema — Google Knowledge Graph & Logo
 * ==============================================================================
 * Ye schema Google ko brand ki puri identity batata hai:
 * - Logo: Google search results ke side mein brand logo dikhata hai
 * - ImageObject: Google ko exact logo dimensions provide karta hai (required!)
 * - sameAs: Social profiles se brand authority verify hoti hai
 *
 * Google Logo Requirements:
 *   ✅ Min 112×112px  ✅ Max 1MB  ✅ Square recommended  ✅ Hosted on same domain
 */
export function generateOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    alternateName: ["Anime Vault", "AnimeVault India", "AnimeVault App"],
    url: SITE_URL,

    // ✅ Google-required ImageObject format for logo (plain URL kaam nahi karta!)
    // Google is logo ko Knowledge Panel aur search results me dikhata hai
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/logo.png`,    // public/logo.png — 512×512px brand logo
      width: 512,
      height: 512,
      caption: "AnimeVault — Modern Anime Database & Reviews",
    },

    // Ye bhi add karo taaki Google favicon bhi index kare
    image: {
      "@type": "ImageObject",
      url: `${SITE_URL}/logo.png`,
      width: 512,
      height: 512,
    },

    description: siteConfig.description,
    slogan: "Modern Anime Database, Verified Reviews & Official Trailers",

    // Google Knowledge Graph mein "Knows About" topics show hote hain
    knowsAbout: [
      "Anime",
      "Manga",
      "Japanese Animation",
      "Anime Reviews",
      "Anime Streaming Platforms",
      "MyAnimeList Ratings",
      "Anime Database",
      "Otaku Culture",
    ],

    // sameAs se Google brand ki authenticity verify karta hai
    // Jitne zyada verified profiles, utna strong Knowledge Panel
    sameAs: [
      "https://twitter.com/animevault",
      "https://github.com/deepjaswal/anime-website",
    ],
  };
}

/**
 * 3. Site Navigation Elements (Google Sitelinks under main search result)
 */
export function generateNavigationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: [
      {
        "@type": "SiteNavigationElement",
        position: 1,
        name: "Top Airing Anime",
        description: "Explore currently airing anime series and weekly episodes",
        url: `${SITE_URL}/?tab=airing`,
      },
      {
        "@type": "SiteNavigationElement",
        position: 2,
        name: "Most Popular Anime",
        description: "Browse all-time highest-rated and most popular anime shows",
        url: `${SITE_URL}/?tab=bypopularity`,
      },
      {
        "@type": "SiteNavigationElement",
        position: 3,
        name: "Anime Categories & Genres",
        description: "Discover anime by 70+ genres including Action, Fantasy, Sci-Fi, and Romance",
        url: `${SITE_URL}/categories`,
      },
      {
        "@type": "SiteNavigationElement",
        position: 4,
        name: "Personal Watchlist",
        description: "Save and track your favorite anime titles in your personal library",
        url: `${SITE_URL}/watchlist`,
      },
    ],
  };
}

/**
 * 3. FAQPage Schema (Google Search me direct FAQ dropdowns lane ke liye)
 */
export function generateFaqJsonLd(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * 4. Anime Schema (TVSeries ya Movie)
 * Specific anime ke liye Rich Snippet generate karta hai (Ratings, episodes, genres, etc.)
 *
 * Ye schema Google ko batata hai ki ye content kya hai aur kaise rank karna hai:
 * - countryOfOrigin: Japan — "anime" searches ke liye helpful
 * - inLanguage: Japanese — anime-specific queries target karta hai
 * - creator: Studio name — brand authority signals
 */
export function generateAnimeJsonLd(anime: AnimeItem) {
  const isMovie = anime.type?.toLowerCase() === "movie";
  const title = anime.title_english || anime.title;
  const image = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url;

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": isMovie ? "Movie" : "TVSeries",
    name: title,
    // alternateName: Romaji + Japanese title dono — Japanese/native searchers ke liye
    alternateName: [
      anime.title_japanese,
      anime.title !== title ? anime.title : null,
    ].filter(Boolean),
    description: anime.synopsis || `${title} details, reviews, and trailer.`,
    image: image ? [image] : undefined,
    url: `${SITE_URL}/anime/${anime.mal_id}`,
    genre: anime.genres?.map((g) => g.name) || [],
    contentRating: anime.rating || undefined,
    // Google ko batata hai ye Japanese animation hai
    countryOfOrigin: {
      "@type": "Country",
      name: "Japan",
    },
    inLanguage: "ja", // Japanese — anime-specific ranking signal
  };

  // Release year/date
  if (anime.aired?.from) {
    schema.datePublished = anime.aired.from;
  }

  // Episode count
  if (anime.episodes) {
    schema.numberOfEpisodes = anime.episodes;
  }

  // ⭐ Aggregate Rating (Google me Yellow Stars dikhane ke liye)
  if (anime.score && anime.scored_by) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: anime.score,
      bestRating: "10",
      worstRating: "1",
      ratingCount: anime.scored_by,
    };
  }

  // Trailer Video Schema (Google Video Carousel me aane ke liye)
  if (anime.trailer?.embed_url || anime.trailer?.url) {
    schema.trailer = {
      "@type": "VideoObject",
      name: `${title} Official Trailer`,
      description: `Official trailer for ${title}`,
      thumbnailUrl: anime.trailer.images?.maximum_image_url || image,
      embedUrl: anime.trailer.embed_url || undefined,
      contentUrl: anime.trailer.url || undefined,
      uploadDate: anime.aired?.from || "2024-01-01",
    };
  }

  // Animation Studio / Production Company (Creator authority signals)
  if (anime.studios && anime.studios.length > 0) {
    schema.productionCompany = anime.studios.map((s) => ({
      "@type": "Organization",
      name: s.name,
    }));
    // creator field — search engines ke liye extra studio authority signal
    schema.creator = anime.studios.map((s) => ({
      "@type": "Organization",
      name: s.name,
    }));
  }

  return schema;
}


/**
 * 5. BreadcrumbList Schema
 * Google search results me "Home > Categories > Anime Name" path dikhane ke liye
 */
export function generateBreadcrumbJsonLd(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
