import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo-config";

/**
 * ==============================================================================
 * DYNAMIC ROBOTS.TXT (robots.ts -> /robots.txt)
 * ==============================================================================
 * Robots.txt web crawlers (Google, Bing, Yahoo, DuckDuckGo) ko instructions deta hai:
 * - Kaha jana allowed hai: / (sab public pages)
 * - Kaha jana mana hai: /api/ (backend API routes crawl karne ki zarurat nahi hoti)
 * - Sitemap ka URL batata hai taaki crawlers aasani se sitemap.xml read kar sakein
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*", // Sabhi search engine crawlers ke liye rule
        allow: "/",     // Website ke sare public pages crawl karne do
        disallow: [
          "/api/",      // Internal API endpoints ko search index se bahar rakho
        ],
      },
    ],
    // Crawlers ko direct sitemap ka path batana
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
