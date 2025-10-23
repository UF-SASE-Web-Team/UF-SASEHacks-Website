import { NextResponse } from "next/server";
import { fetchFaqFromNotion } from "@/lib/notion";

// Revalidate this route every 600 seconds (10 minutes)
export const revalidate = 600;

export async function GET() {
  try {
    const items = await fetchFaqFromNotion();

    // Helpful cache headers for browsers/CDN (stale-while-revalidate-like)
    return NextResponse.json(items, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=59",
      },
    });
  } catch (e: unknown) {
    // If Notion rate-limits or errors, reply with a soft failure
    const message = e instanceof Error ? e.message : "Failed to fetch FAQ";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
