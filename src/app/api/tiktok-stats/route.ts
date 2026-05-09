import { NextRequest, NextResponse } from "next/server";
import { fetchTikTokStats } from "@/lib/tiktok-stats";

export const revalidate = 300;

export async function GET(req: NextRequest) {
  const idsParam = req.nextUrl.searchParams.get("ids") ?? "";
  const ids = idsParam
    .split(",")
    .map((id) => id.trim())
    .filter((id) => /^\d+$/.test(id))
    .slice(0, 20);

  if (ids.length === 0) {
    return NextResponse.json({ stats: {} });
  }

  const accessToken = process.env.TIKTOK_ACCESS_TOKEN;

  if (!accessToken) {
    return NextResponse.json({ stats: {}, error: "TikTok stats are not configured" }, { status: 200 });
  }

  try {
    const stats = await fetchTikTokStats(ids, accessToken);
    return NextResponse.json({ stats });
  } catch (error) {
    console.error("Failed to fetch TikTok stats", error);
    return NextResponse.json({ stats: {}, error: "Failed to fetch TikTok stats" }, { status: 200 });
  }
}
