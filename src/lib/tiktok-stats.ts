export interface TikTokVideoStats {
  views: number;
  likes: number;
}

interface TikTokVideoObject {
  id?: string;
  view_count?: number;
  like_count?: number;
}

interface TikTokQueryResponse {
  data?: {
    videos?: TikTokVideoObject[];
  };
  error?: {
    code?: string;
    message?: string;
    log_id?: string;
  };
}

export function getTikTokVideoId(url: string): string | null {
  try {
    const parsed = new URL(url);
    const match = parsed.pathname.match(/\/video\/(\d+)/);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}

export function formatTikTokCount(value: number): string {
  if (!Number.isFinite(value) || value < 0) return "--";
  if (value >= 1_000_000) return `${Number.parseFloat((value / 1_000_000).toFixed(1))}M`;
  if (value >= 1_000) return `${Number.parseFloat((value / 1_000).toFixed(1))}K`;
  return String(value);
}

export function normalizeTikTokStats(data: TikTokQueryResponse): Record<string, TikTokVideoStats> {
  const videos = data.data?.videos ?? [];

  return videos.reduce<Record<string, TikTokVideoStats>>((acc, video) => {
    if (!video.id) return acc;

    acc[video.id] = {
      views: typeof video.view_count === "number" ? video.view_count : 0,
      likes: typeof video.like_count === "number" ? video.like_count : 0,
    };

    return acc;
  }, {});
}

export async function fetchTikTokStats(
  videoIds: string[],
  accessToken: string,
): Promise<Record<string, TikTokVideoStats>> {
  const uniqueIds = Array.from(new Set(videoIds)).filter(Boolean).slice(0, 20);

  if (uniqueIds.length === 0) return {};

  const endpoint = new URL("https://open.tiktokapis.com/v2/video/query/");
  endpoint.searchParams.set("fields", "id,view_count,like_count");

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      filters: {
        video_ids: uniqueIds,
      },
    }),
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(`TikTok stats request failed with ${response.status}`);
  }

  const data = (await response.json()) as TikTokQueryResponse;

  if (data.error?.code && data.error.code !== "ok") {
    throw new Error(data.error.message || data.error.code);
  }

  return normalizeTikTokStats(data);
}
