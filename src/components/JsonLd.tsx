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
    url: SITE_URL,
    description: siteConfig.description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * 2. Organization Schema
 * Brand authority, logo, aur Google Knowledge Graph inclusion ke liye
 */
export function generateOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.ico`,
    description: siteConfig.description,
    sameAs: [
      "https://twitter.com/animevault",
      "https://github.com",
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
 */
export function generateAnimeJsonLd(anime: AnimeItem) {
  const isMovie = anime.type?.toLowerCase() === "movie";
  const title = anime.title_english || anime.title;
  const image = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url;

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": isMovie ? "Movie" : "TVSeries",
    name: title,
    alternateName: anime.title_japanese || anime.title,
    description: anime.synopsis || `${title} details, reviews, and trailer.`,
    image: image ? [image] : undefined,
    url: `${SITE_URL}/anime/${anime.mal_id}`,
    genre: anime.genres?.map((g) => g.name) || [],
    contentRating: anime.rating || undefined,
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

  // Animation Studio / Production
  if (anime.studios && anime.studios.length > 0) {
    schema.productionCompany = anime.studios.map((s) => ({
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
