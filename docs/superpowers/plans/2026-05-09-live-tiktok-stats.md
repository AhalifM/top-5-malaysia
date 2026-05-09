# Live TikTok Stats Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show live TikTok view and like counts on portfolio cards without restoring heavy TikTok embeds.

**Architecture:** Keep the portfolio carousel as lightweight thumbnail links. Add a server-only stats helper and a Next route that queries TikTok's `/v2/video/query/` endpoint with `view_count` and `like_count`, caches responses briefly, and returns a simple ID-keyed object to the client. Update the carousel to fetch this local route after it lazy-loads and render compact view/like badges with graceful fallbacks.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, TikTok Display API `/v2/video/query/`, existing Swiper carousel, lucide-react icons.

---

## File Structure

- Create: `src/lib/tiktok-stats.ts`
  - Owns TikTok video ID extraction, number formatting, TikTok response normalization, and the server fetch wrapper.
- Create: `src/app/api/tiktok-stats/route.ts`
  - Public read-only endpoint used by the landing page. Reads requested IDs, calls the server helper, and returns cached stats.
- Modify: `src/components/site/PortfolioCarousel.tsx`
  - Extracts IDs from portfolio URLs, fetches `/api/tiktok-stats`, and renders views/likes.
- Modify: `.env.local` manually, outside git
  - Add `TIKTOK_ACCESS_TOKEN=...` for the TikTok user whose videos are shown. The official endpoint only returns details for videos belonging to the authorized user.

## External API Notes

TikTok's official video query endpoint is `POST https://open.tiktokapis.com/v2/video/query/`. It accepts up to 20 video IDs in `filters.video_ids`, requires a bearer user access token with `video.list`, and supports `like_count` and `view_count` fields.

## Task 1: Add TikTok Stats Helper

**Files:**
- Create: `src/lib/tiktok-stats.ts`

- [ ] **Step 1: Create the helper file**

```ts
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
  if (!Number.isFinite(value) || value < 0) return '--';
  if (value >= 1_000_000) return `${Number.parseFloat((value / 1_000_000).toFixed(1))}M`;
  if (value >= 1_000) return `${Number.parseFloat((value / 1_000).toFixed(1))}K`;
  return String(value);
}

export function normalizeTikTokStats(data: TikTokQueryResponse): Record<string, TikTokVideoStats> {
  const videos = data.data?.videos ?? [];

  return videos.reduce<Record<string, TikTokVideoStats>>((acc, video) => {
    if (!video.id) return acc;

    acc[video.id] = {
      views: typeof video.view_count === 'number' ? video.view_count : 0,
      likes: typeof video.like_count === 'number' ? video.like_count : 0,
    };

    return acc;
  }, {});
}

export async function fetchTikTokStats(videoIds: string[], accessToken: string): Promise<Record<string, TikTokVideoStats>> {
  const uniqueIds = Array.from(new Set(videoIds)).filter(Boolean).slice(0, 20);

  if (uniqueIds.length === 0) return {};

  const endpoint = new URL('https://open.tiktokapis.com/v2/video/query/');
  endpoint.searchParams.set('fields', 'id,view_count,like_count');

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
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

  if (data.error?.code && data.error.code !== 'ok') {
    throw new Error(data.error.message || data.error.code);
  }

  return normalizeTikTokStats(data);
}
```

- [ ] **Step 2: Run type checking through the production build**

Run: `npm run build`

Expected: The build may still reflect unrelated existing warnings elsewhere, but TypeScript should not report errors from `src/lib/tiktok-stats.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/lib/tiktok-stats.ts
git commit -m "feat: add tiktok stats helper"
```

## Task 2: Add Server Stats Route

**Files:**
- Create: `src/app/api/tiktok-stats/route.ts`

- [ ] **Step 1: Create the route**

```ts
import { NextRequest, NextResponse } from 'next/server';
import { fetchTikTokStats } from '@/lib/tiktok-stats';

export const revalidate = 300;

export async function GET(req: NextRequest) {
  const idsParam = req.nextUrl.searchParams.get('ids') ?? '';
  const ids = idsParam
    .split(',')
    .map((id) => id.trim())
    .filter((id) => /^\d+$/.test(id))
    .slice(0, 20);

  if (ids.length === 0) {
    return NextResponse.json({ stats: {} });
  }

  const accessToken = process.env.TIKTOK_ACCESS_TOKEN;

  if (!accessToken) {
    return NextResponse.json({ stats: {}, error: 'TikTok stats are not configured' }, { status: 200 });
  }

  try {
    const stats = await fetchTikTokStats(ids, accessToken);
    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Failed to fetch TikTok stats', error);
    return NextResponse.json({ stats: {}, error: 'Failed to fetch TikTok stats' }, { status: 200 });
  }
}
```

- [ ] **Step 2: Add local environment variable**

Edit `.env.local` and add:

```bash
TIKTOK_ACCESS_TOKEN=replace_with_user_access_token_that_has_video.list_scope
```

The token must authorize the TikTok account that owns the displayed videos. If the videos are from `@top5malaysia`, the token must be for that account or TikTok will omit those videos.

- [ ] **Step 3: Run a local endpoint check**

Run the dev server if it is not already running:

```bash
npm run dev
```

Then request one portfolio video ID:

```bash
curl 'http://localhost:3000/api/tiktok-stats?ids=7595535263493885205'
```

Expected with a valid token:

```json
{"stats":{"7595535263493885205":{"views":123456,"likes":7890}}}
```

Expected without a valid token:

```json
{"stats":{},"error":"TikTok stats are not configured"}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/api/tiktok-stats/route.ts
git commit -m "feat: add tiktok stats api route"
```

## Task 3: Render Views And Likes In Carousel

**Files:**
- Modify: `src/components/site/PortfolioCarousel.tsx`

- [ ] **Step 1: Update imports**

Change the top imports to include React state/effect and stat icons:

```ts
'use client';

import { ExternalLink, Eye, Heart, Play } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { Autoplay, EffectCoverflow, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Lang, SiteContent } from '@/lib/content';
import { t } from '@/lib/content';
import { formatTikTokCount, getTikTokVideoId, type TikTokVideoStats } from '@/lib/tiktok-stats';
```

- [ ] **Step 2: Add client response type**

Place this after the `Props` interface:

```ts
interface TikTokStatsResponse {
  stats?: Record<string, TikTokVideoStats>;
}
```

- [ ] **Step 3: Fetch stats inside `PortfolioCarousel`**

At the start of `PortfolioCarousel`, before `return`, add:

```ts
const videoIdsByItemId = useMemo(() => {
  return content.reduce<Record<string, string>>((acc, item) => {
    const videoId = getTikTokVideoId(item.videoLink);
    if (videoId) acc[item.id] = videoId;
    return acc;
  }, {});
}, [content]);

const videoIds = useMemo(() => Array.from(new Set(Object.values(videoIdsByItemId))), [videoIdsByItemId]);
const [statsByVideoId, setStatsByVideoId] = useState<Record<string, TikTokVideoStats>>({});

useEffect(() => {
  if (videoIds.length === 0) return;

  const controller = new AbortController();

  async function loadStats() {
    try {
      const response = await fetch(`/api/tiktok-stats?ids=${videoIds.join(',')}`, {
        signal: controller.signal,
      });
      const data = (await response.json()) as TikTokStatsResponse;
      setStatsByVideoId(data.stats ?? {});
    } catch (error) {
      if (!controller.signal.aborted) {
        console.error('Failed to load TikTok stats', error);
      }
    }
  }

  loadStats();

  return () => controller.abort();
}, [videoIds]);
```

- [ ] **Step 4: Add stats per slide**

Inside the `content.map` callback, directly after `const title = ...`, add:

```ts
const videoId = videoIdsByItemId[item.id];
const stats = videoId ? statsByVideoId[videoId] : undefined;
```

Then replace the bottom overlay paragraph:

```tsx
<p className="mt-2 text-sm text-muted-foreground">
  {lang === 'en' ? 'Watch now' : 'Tonton sekarang'}
</p>
```

with:

```tsx
<div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
  <span className="inline-flex items-center gap-1.5">
    <Eye size={15} className="text-gold" />
    {stats ? formatTikTokCount(stats.views) : '--'}
  </span>
  <span className="inline-flex items-center gap-1.5">
    <Heart size={15} className="text-gold" />
    {stats ? formatTikTokCount(stats.likes) : '--'}
  </span>
</div>
```

- [ ] **Step 5: Run lint and build**

```bash
npm run lint
npm run build
```

Expected: Build passes. Lint may retain pre-existing warnings in admin and non-critical image files, but `PortfolioCarousel.tsx` should not introduce errors.

- [ ] **Step 6: Browser check**

Open `http://localhost:3000/#portfolio`.

Expected: Portfolio cards still render quickly as thumbnails. Each card shows an eye count and a heart count. If TikTok credentials are invalid or videos are not owned by the authorized account, the UI shows `--` instead of crashing.

- [ ] **Step 7: Commit**

```bash
git add src/components/site/PortfolioCarousel.tsx
git commit -m "feat: show live tiktok stats in portfolio"
```

## Self-Review

- Spec coverage: The plan adds live TikTok views and likes, uses server-side TikTok API access, preserves fast thumbnail carousel behavior, and includes graceful failures.
- Placeholder scan: No TBD/TODO/fill-in-later placeholders remain. The only replacement value is the required local secret in `.env.local`, which must not be committed.
- Type consistency: `TikTokVideoStats`, `formatTikTokCount`, and `getTikTokVideoId` are defined in Task 1 and imported with matching names in Task 3.
