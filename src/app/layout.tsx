import type { Metadata, Viewport } from "next";
import { Poppins, Righteous } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { WatchlistProvider } from "@/components/WatchlistContext";
import JsonLd, { generateWebSiteJsonLd, generateOrganizationJsonLd, generateNavigationJsonLd } from "@/components/JsonLd";
import { SITE_URL, siteConfig } from "@/lib/seo-config";
import "./globals.css";

// Google Fonts setup
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

/**
 * ==============================================================================
 * VIEWPORT CONFIGURATION (Mobile responsiveness & theme color)
 * ==============================================================================
 * Mobile devices par proper scaling aur browser status bar ka color match karne ke liye
 */
export const viewport: Viewport = {
  themeColor: "#060813",
  width: "device-width",
  initialScale: 1,
};

/**
 * ==============================================================================
 * GLOBAL ROOT SEO METADATA
 * ==============================================================================
 * Next.js App Router ka powerful metadata object jo Google, Bing, Facebook,
 * Twitter aur WhatsApp crawlers ko website ki sari details supply karta hai.
 */
export const metadata: Metadata = {
  // 1. metadataBase: Absolute URLs banata hai canonical aur og:image ke liye
  metadataBase: new URL(SITE_URL),

  // 2. Title Template:
  // default: Jab kisi page ka specific title na ho (e.g. Homepage)
  // template: Kisi specific page ke title ke sath automatic suffix jodta hai (e.g. "Naruto | AnimeVault")
  title: {
    default: siteConfig.defaultTitle,
    template: siteConfig.titleTemplate,
  },

  // 3. Meta Description: Search result me link ke niche aane wala 2-line summary
  description: siteConfig.description,

  // 4. Meta Keywords: Google aur search engines ko relevant niche keywords batata hai
  keywords: siteConfig.keywords,

  // 5. Author & Publisher: E-E-A-T score improve karta hai
  authors: [{ name: siteConfig.author.name, url: siteConfig.author.url }],
  creator: siteConfig.author.name,
  publisher: siteConfig.name,

  // 6. Canonical Alternates: Duplicate content issue prevent karne ke liye
  alternates: {
    canonical: "/",
  },

  // 7. OpenGraph (OG): WhatsApp, Facebook, LinkedIn, Discord share previews ke liye
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: siteConfig.name,
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.defaultOgImage,
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: `${siteConfig.name} - Anime Discovery & Reviews`,
      },
    ],
  },

  // 8. Twitter Card: Twitter / X par jab link share ho to bada card preview dikhega
  twitter: {
    card: "summary_large_image",
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
    images: [siteConfig.defaultOgImage],
    creator: siteConfig.social.twitterHandle,
  },

  // 9. Robots: Googlebot ko instruction ki pure site ko index aur links ko follow kare
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // 10. Webmaster Verification: Google Search Console, Bing Webmaster tools token
  verification: siteConfig.verification,

  // 11. Icons: Modern crisp anime favicon + 512×512 brand logo for Google
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
      { url: "/logo.png", sizes: "512x512", type: "image/png" }, // Google logo
    ],
    apple: "/icon.svg",
    shortcut: "/logo.png",
  },
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
      <head>
        {/* Google Schema.org Searchbox Structured Data injection */}
        <JsonLd data={generateWebSiteJsonLd()} />
        {/* Organization Knowledge Graph Structured Data */}
        <JsonLd data={generateOrganizationJsonLd()} />
        {/* Google Sitelinks Navigation Elements */}
        <JsonLd data={generateNavigationJsonLd()} />
      </head>
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
