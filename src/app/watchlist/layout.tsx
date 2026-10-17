import type { Metadata } from "next";

/**
 * ==============================================================================
 * WATCHLIST PAGE SEO LAYOUT
 * ==============================================================================
 * Watchlist user ka personal collection page hai (Client-side localStorage).
 * 
 * SEO Best Practice:
 * - robots: { index: false, follow: true }
 * Google ko bataya jata hai ki empty/personal watchlist ko Google search index me
 * add mat karo, lekin page ke links follow karo. Isse search crawl budget waste nahi hota.
 */
export const metadata: Metadata = {
  title: "My Watchlist",
  description: "View and manage your saved anime watchlist and favorite series on AnimeVault.",
  robots: {
    index: false, // Do not index personal user list in public search results
    follow: true, // But allow crawlers to follow navigation links
  },
};

export default function WatchlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
