import { getTopAnime, getAnimeGenres } from "@/lib/jikan";
import HomeClient from "@/components/HomeClient";
import JsonLd, { generateFaqJsonLd } from "@/components/JsonLd";
import { homeFaqs } from "@/data/faqs";
import { Metadata } from "next";
import { siteConfig } from "@/lib/seo-config";

/**
 * ==============================================================================
 * HOMEPAGE SEO METADATA
 * ==============================================================================
 * Homepage website ka primary landing page hota hai.
 * Yaha 'title.absolute' dene se layout ka title template override hoke clean title banega.
 */
export const metadata: Metadata = {
  title: {
    absolute: siteConfig.defaultTitle, // Full brand title bina duplicate suffix ke
  },
  description: siteConfig.description,
  alternates: {
    canonical: "/", // Google ko batata hai ki ye root homepage URL hai
  },
  openGraph: {
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
    url: "/",
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.defaultOgImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} Homepage - Top Anime and Reviews`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
    images: [siteConfig.defaultOgImage],
  },
};

export default async function HomePage() {
  // Homepage par initial top airing anime aur genres list fetch karna
  const [topResult, genres] = await Promise.all([
    getTopAnime("airing", 1, 18),
    getAnimeGenres(),
  ]);

  return (
    <>
      {/* 
        Google Schema.org FAQPage Structured Data:
        Isse Google search engine me direct expandable FAQ dropdowns rank hote hain!
      */}
      <JsonLd data={generateFaqJsonLd(homeFaqs)} />

      <HomeClient
        initialAnime={topResult.data}
        genres={genres}
        initialPagination={topResult.pagination}
      />
    </>
  );
}
