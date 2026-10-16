import { NextRequest, NextResponse } from "next/server";
import { getAnimeById, getAnimeReviews, getAnimeStreaming } from "@/lib/jikan";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const [anime, reviews, streaming] = await Promise.all([
      getAnimeById(id),
      getAnimeReviews(id),
      getAnimeStreaming(id),
    ]);

    if (!anime) {
      return NextResponse.json({ error: "Anime not found" }, { status: 404 });
    }

    return NextResponse.json({
      data: {
        ...anime,
        reviews,
        streaming: anime.streaming && anime.streaming.length > 0 ? anime.streaming : streaming,
      },
    });
  } catch (error) {
    console.error(`API route /api/anime/${id} error:`, error);
    return NextResponse.json(
      { error: "Failed to fetch anime details" },
      { status: 500 }
    );
  }
}
