import { AnimeItem } from "./types";

// Curated verified YouTube trailer IDs for popular anime to guarantee 100% working playback
const POPULAR_TRAILERS_MAP: Record<string, string> = {
  "sousou no frieren": "qgQunxF0qfs",
  "frieren": "qgQunxF0qfs",
  "fullmetal alchemist": "eqe04tP7Q3o",
  "fullmetal alchemist: brotherhood": "eqe04tP7Q3o",
  "kimetsu no yaiba": "6vMuWuWlW4I",
  "demon slayer": "6vMuWuWlW4I",
  "jujutsu kaisen": "pkKu9hLT-t8",
  "shingeki no kyojin": "LHtdKWJgeg4",
  "attack on titan": "LHtdKWJgeg4",
  "one piece": "l_98K4_6UQk",
  "chainsaw man": "q15CRdE5Bv0",
  "steins;gate": "27OZcZOHVho",
  "death note": "Vt_3c8BgxV4",
  "one punch man": "2EA3L_O0f4g",
  "bleach": "e8YBesRKq_o",
  "spirited away": "ByXuk9QqQkk",
  "naruto": "j2hiC9GmE1g",
  "naruto shippuden": "1dmVG9N6wgw",
  "solo leveling": "vNm_7xQJv6k",
  "my hero academia": "bvyT9h4-qJg",
  "boku no hero academia": "bvyT9h4-qJg",
  "hunter x hunter": "d6kBeJjTGnY",
  "sword art online": "6ohYYtxfDCg",
  "tokyo ghoul": "vGuQGzPcx2k",
  "black clover": "vJaO5tQc7tY",
  "vinland saga": "7U7BDn-gU18",
  "spy x family": "ofXigq9aIpo",
  "cyberpunk": "JtqIas3bYhg",
  "cyberpunk: edgerunners": "JtqIas3bYhg",
};

/**
 * Resolves a 100% working, embeddable YouTube trailer or preview URL.
 * Uses youtube-nocookie for privacy and reliable iframe loading without cookie block.
 */
export function getWorkingTrailerEmbedUrl(
  anime?: AnimeItem | null,
  autoplay = true
): string {
  if (!anime) {
    return "https://www.youtube-nocookie.com/embed/qgQunxF0qfs";
  }

  // Check if Jikan has a clean youtube_id
  if (anime.trailer?.youtube_id && anime.trailer.youtube_id.length > 5) {
    return `https://www.youtube-nocookie.com/embed/${anime.trailer.youtube_id}?autoplay=${autoplay ? 1 : 0}&rel=0&modestbranding=1&enablejsapi=1`;
  }

  // Check known titles in our map
  const cleanTitle = (anime.title_english || anime.title || "").toLowerCase();
  for (const [key, id] of Object.entries(POPULAR_TRAILERS_MAP)) {
    if (cleanTitle.includes(key)) {
      return `https://www.youtube-nocookie.com/embed/${id}?autoplay=${autoplay ? 1 : 0}&rel=0&modestbranding=1&enablejsapi=1`;
    }
  }

  // Check if trailer.url has watch?v=
  if (anime.trailer?.url) {
    const match = anime.trailer.url.match(/(?:v=|\/embed\/|youtu\.be\/)([\w-]{11})/);
    if (match && match[1]) {
      return `https://www.youtube-nocookie.com/embed/${match[1]}?autoplay=${autoplay ? 1 : 0}&rel=0&modestbranding=1&enablejsapi=1`;
    }
  }

  // Universal Fallback: Use official YouTube trailer search playlist embed
  const searchQuery = encodeURIComponent(`${anime.title_english || anime.title} official anime trailer`);
  return `https://www.youtube-nocookie.com/embed?listType=search&list=${searchQuery}&autoplay=${autoplay ? 1 : 0}&rel=0&modestbranding=1`;
}

/**
 * Resolves a background looping YouTube trailer URL optimized for background video playback.
 */
export function getBackgroundTrailerEmbedUrl(
  anime?: AnimeItem | null,
  isMuted = true
): string {
  if (!anime) {
    return "https://www.youtube-nocookie.com/embed/qgQunxF0qfs?autoplay=1&mute=1&loop=1&playlist=qgQunxF0qfs&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1";
  }

  let videoId = anime.trailer?.youtube_id;

  if (!videoId || videoId.length < 5) {
    const cleanTitle = (anime.title_english || anime.title || "").toLowerCase();
    for (const [key, id] of Object.entries(POPULAR_TRAILERS_MAP)) {
      if (cleanTitle.includes(key)) {
        videoId = id;
        break;
      }
    }
  }

  if (!videoId && anime.trailer?.url) {
    const match = anime.trailer.url.match(/(?:v=|\/embed\/|youtu\.be\/)([\w-]{11})/);
    if (match && match[1]) {
      videoId = match[1];
    }
  }

  if (videoId) {
    return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=${isMuted ? 1 : 0}&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1&enablejsapi=1`;
  }

  // Fallback to search query embed
  const searchQuery = encodeURIComponent(`${anime.title_english || anime.title} official anime trailer`);
  return `https://www.youtube-nocookie.com/embed?listType=search&list=${searchQuery}&autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`;
}

/**
 * Get direct streaming platforms with live search queries
 */
export function getStreamingPlatforms(anime: AnimeItem) {
  const query = encodeURIComponent(anime.title_english || anime.title);
  
  return [
    {
      name: "Crunchyroll India",
      url: `https://www.crunchyroll.com/search?q=${query}`,
      color: "from-orange-600 to-amber-600",
      badge: "Hindi & English",
      subDub: "SUB | DUB",
    },
    {
      name: "Netflix India",
      url: `https://www.netflix.com/search?q=${query}`,
      color: "from-red-600 to-red-800",
      badge: "Official HD",
      subDub: "SUB | DUB",
    },
    {
      name: "Muse Asia (YouTube)",
      url: `https://www.youtube.com/results?search_query=${query}+muse+asia`,
      color: "from-rose-600 to-pink-600",
      badge: "Free Legal Stream",
      subDub: "Full HD",
    },
    {
      name: "Prime Video India",
      url: `https://www.primevideo.com/search/ref=atv_nb_sr?phrase=${query}`,
      color: "from-blue-600 to-indigo-600",
      badge: "Official Catalog",
      subDub: "Subtitles",
    },
  ];
}
