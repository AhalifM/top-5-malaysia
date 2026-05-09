# Fast TikTok Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the TikTok portfolio carousel load quickly and recover when users switch browser tabs during embed loading.

**Architecture:** Keep `PortfolioSection` as the lazy viewport gate. Refactor `PortfolioCarousel` so all slides render instant thumbnail cards, while only the active slide mounts TikTok's real embed. Add visibility/focus retry logic and an embed timeout so TikTok iframe loading cannot leave the carousel permanently blank.

**Tech Stack:** Next.js 16 App Router, React 19 client components, Swiper 12, `next/script`, existing `data/content.json` thumbnails.

---

## File Structure

- Modify: `src/components/site/PortfolioCarousel.tsx`
  - Owns active-slide state, thumbnail card rendering, one active TikTok embed, TikTok script retry, and visibility recovery.
- Optional modify: `src/components/site/PortfolioSection.tsx`
  - Only adjust the skeleton if final browser testing shows the current shell height is misleading.

No server routes, tokens, admin schema changes, or content JSON changes are needed.

## Task 1: Refactor Portfolio Carousel To Thumbnail-First Active Embed

**Files:**
- Modify: `src/components/site/PortfolioCarousel.tsx`

- [ ] **Step 1: Replace imports**

At the top of `src/components/site/PortfolioCarousel.tsx`, use these imports:

```ts
'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Script from 'next/script';
import { ExternalLink, Play } from 'lucide-react';
import { Autoplay, EffectCoverflow, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Lang, SiteContent } from '@/lib/content';
import { t } from '@/lib/content';
```

Keep the existing Swiper CSS imports.

- [ ] **Step 2: Add item metadata helper type**

After the `Props` interface, add:

```ts
interface PortfolioSlideItem {
  id: string;
  title: string;
  thumbnail: string;
  videoLink: string;
  videoId: string | null;
}
```

Keep the existing `declare global`, `carouselCss`, and `getTikTokVideoId`.

- [ ] **Step 3: Add a thumbnail card component in the same file**

Place this before `export default function PortfolioCarousel`:

```tsx
function ThumbnailCard({ item, label }: { item: PortfolioSlideItem; label: string }) {
  return (
    <a
      href={item.videoLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label}: ${item.title}`}
      className="group relative block aspect-[9/16] overflow-hidden rounded-2xl border border-border bg-card"
    >
      <img
        src={item.thumbnail}
        alt={item.title}
        loading="lazy"
        decoding="async"
        className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent opacity-95" />
      <div className="absolute left-4 right-4 top-4 flex items-center justify-between">
        <span className="inline-flex size-10 items-center justify-center rounded-full bg-background/70 text-gold backdrop-blur">
          <Play size={18} fill="currentColor" />
        </span>
        <span className="inline-flex size-10 items-center justify-center rounded-full bg-background/70 text-foreground backdrop-blur">
          <ExternalLink size={17} />
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-gold">TikTok</p>
        <h3 className="mt-2 text-lg font-semibold leading-tight text-foreground">{item.title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">Watch on TikTok</p>
      </div>
    </a>
  );
}
```

- [ ] **Step 4: Add an active TikTok embed component in the same file**

Place this below `ThumbnailCard`:

```tsx
function ActiveTikTokEmbed({
  item,
  embedKey,
  showFallback,
  label,
}: {
  item: PortfolioSlideItem;
  embedKey: number;
  showFallback: boolean;
  label: string;
}) {
  if (!item.videoId || showFallback) {
    return <ThumbnailCard item={item} label={label} />;
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
      <blockquote
        key={`${item.id}-${embedKey}`}
        className="tiktok-embed !m-0 !min-w-0 !max-w-none"
        cite={item.videoLink}
        data-video-id={item.videoId}
        data-embed-from="oembed"
        style={{ minWidth: 0, maxWidth: '100%' }}
      >
        <section>
          <a target="_blank" rel="noopener noreferrer" href={item.videoLink}>
            {item.title}
          </a>
        </section>
      </blockquote>
    </div>
  );
}
```

- [ ] **Step 5: Replace `loadTikTokEmbeds`**

Use this safer script loader:

```ts
function loadTikTokEmbeds() {
  window.tiktokEmbed?.load();
}
```

This is already present in the file, but keep it after `getTikTokVideoId`.

- [ ] **Step 6: Rewrite `PortfolioCarousel` state and derived items**

Inside `PortfolioCarousel`, before `return`, add:

```ts
const items = useMemo<PortfolioSlideItem[]>(
  () =>
    content.map((item) => ({
      id: item.id,
      title: t(item.title, lang) || '@top5malaysia',
      thumbnail: item.thumbnail,
      videoLink: item.videoLink,
      videoId: getTikTokVideoId(item.videoLink),
    })),
  [content, lang],
);

const [activeIndex, setActiveIndex] = useState(0);
const [embedKey, setEmbedKey] = useState(0);
const [scriptReady, setScriptReady] = useState(false);
const [fallbackIds, setFallbackIds] = useState<Set<string>>(() => new Set());
const watchLabel = lang === 'en' ? 'Watch on TikTok' : 'Tonton di TikTok';

const activeItem = items[activeIndex];

const retryActiveEmbed = useCallback(() => {
  setFallbackIds((current) => {
    if (!activeItem) return current;
    const next = new Set(current);
    next.delete(activeItem.id);
    return next;
  });
  setEmbedKey((key) => key + 1);
  window.setTimeout(loadTikTokEmbeds, 0);
}, [activeItem]);
```

- [ ] **Step 7: Add script-ready and active-slide effects**

Below the state in Step 6, add:

```ts
useEffect(() => {
  if (!scriptReady || !activeItem?.videoId) return;

  window.setTimeout(loadTikTokEmbeds, 0);
}, [activeItem, embedKey, scriptReady]);

useEffect(() => {
  if (!activeItem?.videoId) return;

  const timeout = window.setTimeout(() => {
    setFallbackIds((current) => {
      const next = new Set(current);
      next.add(activeItem.id);
      return next;
    });
  }, 6000);

  return () => window.clearTimeout(timeout);
}, [activeItem, embedKey]);
```

- [ ] **Step 8: Add tab visibility recovery**

Below the effects from Step 7, add:

```ts
useEffect(() => {
  function handleVisibilityChange() {
    if (document.visibilityState === 'visible') {
      retryActiveEmbed();
    }
  }

  document.addEventListener('visibilitychange', handleVisibilityChange);
  window.addEventListener('focus', retryActiveEmbed);

  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('focus', retryActiveEmbed);
  };
}, [retryActiveEmbed]);
```

- [ ] **Step 9: Update the Script callbacks**

Replace the existing `<Script />` callbacks with:

```tsx
<Script
  src="https://www.tiktok.com/embed.js"
  strategy="lazyOnload"
  onLoad={() => {
    setScriptReady(true);
    loadTikTokEmbeds();
  }}
  onReady={() => {
    setScriptReady(true);
    loadTikTokEmbeds();
  }}
/>
```

- [ ] **Step 10: Update the Swiper callbacks and slide rendering**

On the `<Swiper>` component, add:

```tsx
onSlideChange={(swiper) => {
  setActiveIndex(swiper.realIndex);
  setEmbedKey((key) => key + 1);
}}
```

Replace the `content.map` rendering block with:

```tsx
{items.map((item, index) => {
  const isActive = index === activeIndex;
  const showFallback = fallbackIds.has(item.id);

  return (
    <SwiperSlide key={item.id}>
      {isActive ? (
        <ActiveTikTokEmbed
          item={item}
          embedKey={embedKey}
          showFallback={showFallback}
          label={watchLabel}
        />
      ) : (
        <ThumbnailCard item={item} label={watchLabel} />
      )}
    </SwiperSlide>
  );
})}
```

- [ ] **Step 11: Run lint and build**

```bash
npm run lint
npm run build
```

Expected:
- `npm run build` passes.
- `npm run lint` may still show existing image warnings, including the thumbnail `<img>`, but no errors.

- [ ] **Step 12: Commit**

```bash
git add src/components/site/PortfolioCarousel.tsx
git commit -m "fix: load only active tiktok embed"
```

## Task 2: Browser Verify Loading And Tab Recovery

**Files:**
- No source edits expected unless verification finds a bug in Task 1.

- [ ] **Step 1: Start or reuse the local dev server**

```bash
npm run dev
```

If Next reports that port `3000` is already running for this repo, reuse `http://localhost:3000`.

- [ ] **Step 2: Open the portfolio section**

Use a browser and open:

```text
http://localhost:3000/#portfolio
```

Expected:
- The carousel frame appears quickly.
- Non-active slides are thumbnail cards.
- The active slide attempts to become a TikTok embed.

- [ ] **Step 3: Test tab switch recovery**

Manual test:

1. Refresh at `http://localhost:3000/#portfolio`.
2. Immediately switch to another browser tab for 5-10 seconds.
3. Return to the site tab.

Expected:
- The portfolio carousel is not permanently stuck as lines/dots.
- The active slide either loads TikTok's embed or falls back to a thumbnail card with a direct TikTok link.
- Navigation arrows and pagination remain usable.

- [ ] **Step 4: Use Playwright snapshot**

Run:

```bash
export CODEX_HOME="${CODEX_HOME:-$HOME/.codex}"
export PWCLI="$CODEX_HOME/skills/playwright/scripts/playwright_cli.sh"
"$PWCLI" open http://localhost:3000/#portfolio --browser chromium
sleep 3
"$PWCLI" snapshot
```

Expected:
- Snapshot includes portfolio links or TikTok iframes.
- No blank-only carousel content.

- [ ] **Step 5: Commit any verification fix**

If Task 2 required source edits, commit them:

```bash
git add src/components/site/PortfolioCarousel.tsx src/components/site/PortfolioSection.tsx
git commit -m "fix: harden tiktok embed recovery"
```

If no source edits were required, do not create an empty commit.

## Self-Review

- Spec coverage: The plan addresses faster loading, tab-switch interruption, active TikTok native UI, thumbnail fallback, and no token/API setup.
- Placeholder scan: No TBD/TODO/fill-in-later placeholders remain.
- Type consistency: `PortfolioSlideItem`, `ThumbnailCard`, `ActiveTikTokEmbed`, `activeIndex`, `embedKey`, and `fallbackIds` are defined before use with consistent names.
