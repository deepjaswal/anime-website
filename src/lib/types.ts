export interface AnimeImage {
  image_url: string;
  small_image_url?: string;
  large_image_url?: string;
}

export interface AnimeImages {
  jpg: AnimeImage;
  webp?: AnimeImage;
}

export interface AnimeTrailer {
  youtube_id: string | null;
  url: string | null;
  embed_url: string | null;
  images?: {
    image_url: string | null;
    small_image_url: string | null;
    medium_image_url: string | null;
    large_image_url: string | null;
    maximum_image_url: string | null;
  };
}

export interface GenericItem {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface StreamingLink {
  name: string;
  url: string;
}

export interface AnimeItem {
  mal_id: number;
  url: string;
  images: AnimeImages;
  trailer: AnimeTrailer;
  approved?: boolean;
  titles?: Array<{ type: string; title: string }>;
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  title_synonyms?: string[];
  type: string;
  source: string;
  episodes: number | null;
  status: string;
  airing: boolean;
  aired?: {
    from: string | null;
    to: string | null;
    string: string;
  };
  duration: string;
  rating: string;
  score: number | null;
  scored_by: number | null;
  rank: number | null;
  popularity: number | null;
  members: number | null;
  favorites: number | null;
  synopsis: string | null;
  background?: string | null;
  season: string | null;
  year: number | null;
  broadcast?: {
    day: string | null;
    time: string | null;
    timezone: string | null;
    string: string | null;
  };
  producers?: GenericItem[];
  licensors?: GenericItem[];
  studios: GenericItem[];
  genres: GenericItem[];
  explicit_genres?: GenericItem[];
  themes?: GenericItem[];
  demographics?: GenericItem[];
  streaming?: StreamingLink[];
  external?: StreamingLink[];
}

export interface PaginationInfo {
  currentPage: number;
  lastPage: number;
  hasNextPage: boolean;
  total: number;
}

export interface JikanPagination {
  last_visible_page: number;
  has_next_page: boolean;
  current_page: number;
  items: {
    count: number;
    total: number;
    per_page: number;
  };
}

export interface JikanResponse<T> {
  data: T;
  pagination?: JikanPagination;
}

export interface AnimeReview {
  mal_id: number;
  url: string;
  date: string;
  review: string;
  score: number;
  tags: string[];
  user: {
    username: string;
    url: string;
    images?: {
      jpg?: {
        image_url?: string;
      };
    };
  };
}
