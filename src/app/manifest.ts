import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo-config";

/**
 * ==============================================================================
 * WEB APP MANIFEST (manifest.ts -> /manifest.webmanifest)
 * ==============================================================================
 * Google Mobile Search algorithm PWA manifest ko analyze karke mobile search
 * rankings me higher priority deta hai.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AnimeVault - Modern Anime Database & Reviews",
    short_name: "AnimeVault",
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#060813",
    theme_color: "#060813",
    icons: [
      {
        src: "/icon.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
