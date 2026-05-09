'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Script from 'next/script';
import { ExternalLink, Play } from 'lucide-react';
import { Autoplay, EffectCoverflow, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Lang, SiteContent } from '@/lib/content';
import { t } from '@/lib/content';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Props {
  content: SiteContent['portfolio'];
  lang: Lang;
}

interface PortfolioSlideItem {
  id: string;
  title: string;
  thumbnail: string;
  videoLink: string;
  videoId: string | null;
}

declare global {
  interface Window {
    tiktokEmbed?: {
      load: () => void;
    };
  }
}

const carouselCss = `
  .tiktok-portfolio-carousel {
    overflow: visible;
    padding: 10px 0 58px;
  }

  .tiktok-portfolio-carousel .swiper-slide {
    width: min(86vw, 440px);
    height: auto;
  }

  .tiktok-portfolio-carousel .swiper-button-next,
  .tiktok-portfolio-carousel .swiper-button-prev {
    color: var(--gold);
  }

  .tiktok-portfolio-carousel .swiper-button-next::after,
  .tiktok-portfolio-carousel .swiper-button-prev::after {
    font-size: 22px;
    font-weight: 800;
  }

  .tiktok-portfolio-carousel .swiper-pagination-bullet {
    background: color-mix(in oklch, var(--gold) 70%, white 10%);
    opacity: 0.35;
  }

  .tiktok-portfolio-carousel .swiper-pagination-bullet-active {
    background: var(--gold);
    opacity: 1;
  }

  .tiktok-portfolio-carousel .swiper-3d .swiper-slide-shadow-left,
  .tiktok-portfolio-carousel .swiper-3d .swiper-slide-shadow-right {
    background: none;
  }
`;

function getTikTokVideoId(url: string): string | null {
  try {
    const parsed = new URL(url);
    const match = parsed.pathname.match(/\/video\/(\d+)/);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}

function loadTikTokEmbeds() {
  window.tiktokEmbed?.load();
}

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
        data-active-tiktok-id={item.id}
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

export default function PortfolioCarousel({ content, lang }: Props) {
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

  useEffect(() => {
    if (!scriptReady || !activeItem?.videoId) return;

    window.setTimeout(loadTikTokEmbeds, 0);
  }, [activeItem, embedKey, scriptReady]);

  useEffect(() => {
    if (!activeItem?.videoId) return;

    const timeout = window.setTimeout(() => {
      const embed = document.querySelector(`[data-active-tiktok-id="${activeItem.id}"]`);
      if (embed?.querySelector('iframe')) return;

      setFallbackIds((current) => {
        const next = new Set(current);
        next.add(activeItem.id);
        return next;
      });
    }, 2500);

    return () => window.clearTimeout(timeout);
  }, [activeItem, embedKey]);

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

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card/20 px-2 py-8 md:px-8">
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
      <style>{carouselCss}</style>
      <Swiper
        className="tiktok-portfolio-carousel"
        modules={[Autoplay, EffectCoverflow, Navigation, Pagination]}
        effect="coverflow"
        centeredSlides
        grabCursor
        loop={content.length > 1}
        slidesPerView="auto"
        spaceBetween={34}
        onSlideChange={(swiper) => {
          setActiveIndex(swiper.realIndex);
          setEmbedKey((key) => key + 1);
        }}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 130,
          modifier: 2,
          slideShadows: false,
        }}
        navigation
        pagination={{ clickable: true }}
      >
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
      </Swiper>
    </div>
  );
}
