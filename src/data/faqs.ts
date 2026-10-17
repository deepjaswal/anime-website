/**
 * ==============================================================================
 * SEO FAQS DATA (faqs.ts)
 * ==============================================================================
 * Google Search Engine me FAQ Rich Snippets pane ke liye high-intent search queries.
 * Jab Google bot is data ko read karega, to search results me expandable accordion dikhega,
 * jo Click-Through-Rate (CTR) ko 40% tak boost karta hai!
 */

export interface FaqItem {
  question: string;
  answer: string;
}

export const homeFaqs: FaqItem[] = [
  {
    question: "What is AnimeVault and how does it work?",
    answer:
      "AnimeVault is a modern, high-speed anime database, review aggregator, and trailer streaming hub. Powered by the official Jikan API (MyAnimeList v4) and AniList GraphQL, it delivers real-time scores, seasonal rankings, character details, official HD trailers, and verified streaming platforms for over 25,000+ anime titles.",
  },
  {
    question: "Where can I legally stream and watch anime online?",
    answer:
      "On AnimeVault, each anime details page provides direct, verified streaming platform links to legal providers such as Crunchyroll, Netflix, Hulu, Prime Video, Disney+, and HIDIVE depending on regional licensing availability.",
  },
  {
    question: "How are anime scores and ratings calculated on AnimeVault?",
    answer:
      "AnimeVault displays weighted global community ratings aggregated from millions of global otaku on MyAnimeList and AniList. Scores range on a 1-to-10 scale and factor in user review quality, total scored count, and popularity algorithms to prevent vote manipulation.",
  },
  {
    question: "What are the highest-rated anime series of all time?",
    answer:
      "The top-ranking anime of all time include legendary masterpieces like Fullmetal Alchemist: Brotherhood, Bleach: Thousand-Year Blood War, Steins;Gate, Attack on Titan (Shingeki no Kyojin), Hunter x Hunter (2011), and Gintama, all of which maintain global ratings above 9.0/10.",
  },
  {
    question: "Can I save anime to my personal watchlist without an account?",
    answer:
      "Yes! AnimeVault features an instant client-side Watchlist powered by local storage. Simply tap the Bookmark icon on any anime card or detail page to curate your personal collection instantly with zero sign-up or cookies required.",
  },
  {
    question: "How often is the anime database and schedule updated?",
    answer:
      "The database is synchronized live with official Japanese broadcast schedules and community databases. New episode releases, air dates, PV trailers, voice actors, and review scores update in real time every day.",
  },
];
