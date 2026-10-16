import type { Metadata } from "next";
import { Poppins, Righteous } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { WatchlistProvider } from "@/components/WatchlistContext";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const bannerFont = Righteous({
  variable: "--font-banner-curved",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AnimeVault - Modern Anime Database & Reviews",
  description:
    "Explore top anime, trailers, ratings, and streaming platforms powered by the Jikan API (MyAnimeList v4).",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${bannerFont.variable} dark`}
    >
      <body className="min-h-screen flex flex-col bg-[#060813] text-slate-100 selection:bg-rose-600 selection:text-white font-sans antialiased">
        <WatchlistProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </WatchlistProvider>
      </body>
    </html>
  );
}
