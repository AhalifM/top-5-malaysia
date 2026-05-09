'use client';

import { useEffect, useMemo, useState } from 'react';
import { ExternalLink, Eye, Heart, Play } from 'lucide-react';
import Image from 'next/image';
import { Autoplay, EffectCoverflow, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Lang, SiteContent } from '@/lib/content';
import { t } from '@/lib/content';
import {
  formatTikTokCount,
  getTikTokVideoId,
  type TikTokVideoStats,
} from '@/lib/tiktok-stats';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Props {
  content: SiteContent['portfolio'];
  lang: Lang;
}

interface TikTokStatsResponse {
  stats?: Record<string, TikTokVideoStats>;
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

export default function PortfolioCarousel({ content, lang }: Props) {
  const videoIds = useMemo(
    () =>
      Array.from(
        new Set(
          content
            .map((item) => getTikTokVideoId(item.videoLink))
            .filter((id): id is string => Boolean(id)),
        ),
      ),
    [content],
  );
  const [statsByVideoId, setStatsByVideoId] = useState<Record<string, TikTokVideoStats>>({});

  useEffect(() => {
    if (videoIds.length === 0) {
      return;
    }

    const controller = new AbortController();
    const params = new URLSearchParams({ ids: videoIds.join(',') });

    async function loadTikTokStats() {
      try {
        const response = await fetch(`/api/tiktok-stats?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!response.ok) return;

        const data = (await response.json()) as TikTokStatsResponse;
        setStatsByVideoId(data.stats ?? {});
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
      }
    }

    void loadTikTokStats();

    return () => {
      controller.abort();
    };
  }, [videoIds]);

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card/20 px-2 py-8 md:px-8">
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
        {content.map((item) => {
          const title = t(item.title, lang) || '@top5malaysia';
          const videoId = getTikTokVideoId(item.videoLink);
          const stats = videoId ? statsByVideoId[videoId] : undefined;

          return (
            <SwiperSlide key={item.id}>
              <a
                href={item.videoLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${lang === 'en' ? 'Watch on TikTok' : 'Tonton di TikTok'}: ${title}`}
                className="group relative block aspect-[9/16] overflow-hidden rounded-2xl border border-border bg-card"
              >
                <Image
                  src={item.thumbnail}
                  alt={title}
                  fill
                  loading="lazy"
                  sizes="(max-width: 768px) 86vw, 440px"
                  unoptimized
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
                  <p className="text-xs font-semibold uppercase tracking-widest text-gold">
                    TikTok
                  </p>
                  <h3 className="mt-2 text-lg font-semibold leading-tight text-foreground">
                    {title}
                  </h3>
                  <div className="mt-3 flex items-center gap-3 text-xs font-semibold text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Eye size={14} />
                      {stats ? formatTikTokCount(stats.views) : '--'}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Heart size={14} />
                      {stats ? formatTikTokCount(stats.likes) : '--'}
                    </span>
                  </div>
                </div>
              </a>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
