import { NextRequest, NextResponse } from "next/server";
import { getTopAnime, searchAnime } from "@/lib/jikan";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "top";
  const filter = (searchParams.get("filter") || "bypopularity") as "airing" | "bypopularity" | "favorite" | "upcoming";
  const query = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "16", 10);
  const genreId = searchParams.get("genre") ? parseInt(searchParams.get("genre")!, 10) : undefined;

  try {
    if (query.trim()) {
      const results = await searchAnime(query, page, limit, genreId);
      return NextResponse.json(results);
    } else {
      const results = await getTopAnime(filter, page, limit, genreId);
      return NextResponse.json(results);
    }
  } catch (error) {
    console.error("API route /api/anime error:", error);
    return NextResponse.json(
      { error: "Failed to fetch anime data", data: [] },
      { status: 500 }
    );
  }
}
