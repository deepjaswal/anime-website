import { ImageResponse } from "next/og";

export const alt = "AnimeVault - Modern Anime Database, Reviews & Official Trailers";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

/**
 * ==============================================================================
 * DYNAMIC OPEN GRAPH SOCIAL CARD (opengraph-image.png)
 * ==============================================================================
 * Google Discover, WhatsApp, Twitter, Discord, aur Facebook share previews me
 * automatically 1200x630 HD branded social preview generate karta hai.
 */
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#060813",
          backgroundImage:
            "radial-gradient(circle at 50% 20%, rgba(225, 29, 72, 0.25), transparent 70%), radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.15), transparent 60%)",
          padding: "60px 80px",
          position: "relative",
        }}
      >
        {/* Top Tag */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "8px 20px",
            borderRadius: "30px",
            backgroundColor: "rgba(225, 29, 72, 0.15)",
            border: "1px solid rgba(225, 29, 72, 0.35)",
            color: "#fb7185",
            fontSize: 18,
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "2px",
            marginBottom: 24,
          }}
        >
          #1 Anime Discovery &amp; Review Platform
        </div>

        {/* Brand Name */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 76,
            fontWeight: 900,
            letterSpacing: "-2px",
            color: "#ffffff",
            marginBottom: 16,
          }}
        >
          Anime<span style={{ color: "#f43f5e", marginLeft: 4 }}>Vault</span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 26,
            color: "#94a3b8",
            textAlign: "center",
            maxWidth: "850px",
            lineHeight: 1.4,
            marginBottom: 40,
          }}
        >
          Explore 25,000+ top anime series, verified community reviews, official HD trailers, and legal streaming platforms.
        </div>

        {/* Badges Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
          }}
        >
          <div
            style={{
              padding: "10px 24px",
              borderRadius: "16px",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: "#f1f5f9",
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            MyAnimeList v4 Sync
          </div>
          <div
            style={{
              padding: "10px 24px",
              borderRadius: "16px",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: "#f1f5f9",
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            Official 1080p Trailers
          </div>
          <div
            style={{
              padding: "10px 24px",
              borderRadius: "16px",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: "#f1f5f9",
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            Verified Reviews
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
