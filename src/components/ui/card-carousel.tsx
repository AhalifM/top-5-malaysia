"use client"

import React from "react"
import Image from "next/image"
import { ExternalLink, Eye, Heart, Play, SparklesIcon } from "lucide-react"
import { Autoplay, EffectCoverflow, Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

import "swiper/css"
import "swiper/css/effect-coverflow"
import "swiper/css/pagination"
import "swiper/css/navigation"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface CarouselImage {
  src: string
  alt: string
  href?: string
  title?: string
  views?: string
  likes?: string
}

interface CarouselProps {
  images: CarouselImage[]
  autoplayDelay?: number
  showPagination?: boolean
  showNavigation?: boolean
  badgeText?: string
  title?: string
  description?: string
  className?: string
}

export const CardCarousel: React.FC<CarouselProps> = ({
  images,
  autoplayDelay = 1500,
  showPagination = true,
  showNavigation = true,
  badgeText,
  title,
  description,
  className,
}) => {
  const css = `
  .card-carousel-swiper {
    width: 100%;
    padding: 18px 0 54px;
  }

  .card-carousel-swiper .swiper-slide {
    background-position: center;
    background-size: cover;
    width: min(74vw, 320px);
  }

  .card-carousel-swiper .swiper-pagination-bullet {
    background: color-mix(in oklch, var(--gold) 60%, white 20%);
    opacity: 0.35;
  }

  .card-carousel-swiper .swiper-pagination-bullet-active {
    background: var(--gold);
    opacity: 1;
  }

  .card-carousel-swiper .swiper-button-next,
  .card-carousel-swiper .swiper-button-prev {
    color: var(--gold);
  }

  .card-carousel-swiper .swiper-button-next::after,
  .card-carousel-swiper .swiper-button-prev::after {
    font-size: 18px;
    font-weight: 700;
  }

  .swiper-3d .swiper-slide-shadow-left,
  .swiper-3d .swiper-slide-shadow-right {
    background-image: none;
    background: none;
  }
  `

  const slides = images.length > 1 ? [...images, ...images] : images

  return (
    <section className={cn("w-full", className)}>
      <style>{css}</style>
      <div className="mx-auto w-full max-w-6xl rounded-3xl border border-border bg-card/30 p-2 shadow-sm">
        <div className="relative mx-auto flex w-full flex-col rounded-3xl border border-border bg-background/70 p-3 shadow-sm md:gap-6 md:p-5">
          {(badgeText || title || description) && (
            <div className="flex flex-col gap-4 px-2 pb-2 pt-2 md:px-4">
              {badgeText && (
                <Badge
                  variant="outline"
                  className="w-fit rounded-full border-gold/30 text-gold"
                >
                  <SparklesIcon data-icon="inline-start" className="fill-gold/20" />
                  {badgeText}
                </Badge>
              )}
              {(title || description) && (
                <div className="flex flex-col gap-1">
                  {title && (
                    <h3 className="text-2xl font-bold tracking-tight md:text-4xl">
                      {title}
                    </h3>
                  )}
                  {description && (
                    <p className="text-sm text-muted-foreground md:text-base">
                      {description}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          <Swiper
            className="card-carousel-swiper"
            spaceBetween={36}
            autoplay={{
              delay: autoplayDelay,
              disableOnInteraction: false,
            }}
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            loop={images.length > 1}
            slidesPerView="auto"
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 110,
              modifier: 2.5,
            }}
            pagination={showPagination}
            navigation={showNavigation}
            modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}
          >
            {slides.map((image, index) => {
              const content = (
                <div className="group relative aspect-[9/16] overflow-hidden rounded-2xl border border-border bg-card">
                  <Image
                    src={image.src}
                    width={500}
                    height={750}
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    alt={image.alt}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent opacity-80" />

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="flex size-14 items-center justify-center rounded-full bg-gold text-primary-foreground gold-glow">
                      <Play fill="currentColor" className="ml-1 size-5" />
                    </div>
                  </div>

                  {(image.views || image.likes) && (
                    <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                      {image.views && (
                        <Badge className="gap-1.5 rounded-full border border-white/10 bg-background/80 px-2.5 py-1.5 text-[11px] text-foreground shadow-lg backdrop-blur-md">
                          <Eye data-icon="inline-start" className="text-gold" />
                          {image.views}
                        </Badge>
                      )}
                      {image.likes && (
                        <Badge className="gap-1.5 rounded-full border border-white/10 bg-background/80 px-2.5 py-1.5 text-[11px] text-foreground shadow-lg backdrop-blur-md">
                          <Heart data-icon="inline-start" className="fill-gold/20 text-gold" />
                          {image.likes}
                        </Badge>
                      )}
                    </div>
                  )}

                  {(image.title || image.href) && (
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <div className="flex items-center justify-between gap-3">
                        {image.title && (
                          <span className="text-sm font-semibold text-foreground">
                            {image.title}
                          </span>
                        )}
                        {image.href && <ExternalLink className="size-4 shrink-0 text-gold" />}
                      </div>
                    </div>
                  )}
                </div>
              )

              return (
                <SwiperSlide key={`${image.src}-${index}`}>
                  {image.href ? (
                    <a href={image.href} target="_blank" rel="noopener noreferrer">
                      {content}
                    </a>
                  ) : (
                    content
                  )}
                </SwiperSlide>
              )
            })}
          </Swiper>
        </div>
      </div>
    </section>
  )
}
