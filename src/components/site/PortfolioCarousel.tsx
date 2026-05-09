'use client';

import Script from 'next/script';
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

export default function PortfolioCarousel({ content, lang }: Props) {
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card/20 px-2 py-8 md:px-8">
      <Script
        src="https://www.tiktok.com/embed.js"
        strategy="lazyOnload"
        onLoad={loadTikTokEmbeds}
        onReady={loadTikTokEmbeds}
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

          return (
            <SwiperSlide key={item.id}>
              {videoId ? (
                <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
                  <blockquote
                    className="tiktok-embed !m-0 !min-w-0 !max-w-none"
                    cite={item.videoLink}
                    data-video-id={videoId}
                    data-embed-from="oembed"
                    style={{ minWidth: 0, maxWidth: '100%' }}
                  >
                    <section>
                      <a target="_blank" rel="noopener noreferrer" href={item.videoLink}>
                        {title}
                      </a>
                    </section>
                  </blockquote>
                </div>
              ) : (
                <a
                  href={item.videoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative block aspect-[9/16] overflow-hidden rounded-2xl border border-border bg-card"
                >
                  <img
                    src={item.thumbnail}
                    alt={title}
                    loading="lazy"
                    decoding="async"
                    className="size-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 to-transparent p-4">
                    <span className="text-sm font-semibold text-foreground">{title}</span>
                  </div>
                </a>
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
