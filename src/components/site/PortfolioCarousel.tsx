'use client';

import { ExternalLink, Eye, Heart, Play } from 'lucide-react';
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
  const watchLabel = lang === 'en' ? 'Watch on TikTok' : 'Tonton di TikTok';

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

          return (
            <SwiperSlide key={item.id}>
              <a
                href={item.videoLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${watchLabel}: ${title}`}
                className="group relative block aspect-[9/16] overflow-hidden rounded-2xl border border-border bg-card"
              >
                <img
                  src={item.thumbnail}
                  alt={title}
                  loading="lazy"
                  decoding="async"
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.08_0.01_250/0.96)] via-[oklch(0.08_0.01_250/0.38)] via-38% to-[oklch(0.08_0.01_250/0.08)] opacity-100" />
                <div className="absolute left-4 right-4 top-4 flex items-center justify-between">
                  <span className="inline-flex size-10 items-center justify-center rounded-full border border-white/15 bg-black/55 text-gold shadow-lg backdrop-blur">
                    <Play size={18} fill="currentColor" />
                  </span>
                  <span className="inline-flex size-10 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white shadow-lg backdrop-blur">
                    <ExternalLink size={17} />
                  </span>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-gold">
                    TikTok
                  </p>
                  <h3 className="mt-2 text-lg font-semibold leading-tight text-white">
                    {title}
                  </h3>
                  <div className="mt-3 flex items-center gap-3 text-xs font-semibold text-white/75">
                    <span className="inline-flex items-center gap-1.5">
                      <Eye size={14} className="text-gold" />
                      {item.views || '--'}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Heart size={14} className="text-gold" />
                      {item.likes || '--'}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-white/70">{watchLabel}</p>
                </div>
              </a>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
