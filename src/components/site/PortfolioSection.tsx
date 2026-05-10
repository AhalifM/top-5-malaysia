'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import AnimateIn from './AnimateIn';
import { useLang } from '@/context/LanguageContext';
import type { SiteContent } from '@/lib/content';

const PortfolioCarousel = dynamic(() => import('./PortfolioCarousel'), {
  ssr: false,
  loading: () => <PortfolioCarouselShell />,
});

interface Props {
  content: SiteContent['portfolio'];
}

function PortfolioCarouselShell() {
  return (
    <div className="flex min-h-[560px] items-center justify-center overflow-hidden rounded-3xl border border-border bg-card/20 px-2 py-8 md:px-8">
      <div className="relative aspect-[9/16] w-[min(78vw,360px)] overflow-hidden rounded-2xl border border-border bg-card">
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-surface via-surface-2 to-surface" />
      </div>
    </div>
  );
}

export default function PortfolioSection({ content }: Props) {
  const { lang } = useLang();
  const loadRef = useRef<HTMLDivElement>(null);
  const [shouldLoadCarousel, setShouldLoadCarousel] = useState(false);

  useEffect(() => {
    if (shouldLoadCarousel) return;

    const node = loadRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadCarousel(true);
          observer.disconnect();
        }
      },
      { rootMargin: '700px 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [shouldLoadCarousel]);

  return (
    <section id="portfolio" className="relative overflow-hidden px-6 py-28">
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/25 to-transparent" />
      <div className="absolute inset-x-0 top-24 h-96 bg-[radial-gradient(circle_at_50%_0%,color-mix(in_oklch,var(--gold)_12%,transparent),transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl">
        <AnimateIn className="mb-16 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-gold">
            {lang === 'en' ? 'Our Work' : 'Kerja Kami'}
          </p>
          <h2 className="mx-auto max-w-3xl text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
            {lang === 'en'
              ? 'Engaging content that converts'
              : 'Konten menarik yang menukar pengunjung'}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
            {lang === 'en'
              ? 'Real vertical content, built to feel native on the feed.'
              : 'Konten menegak sebenar, dibina supaya terasa natural dalam feed.'}
          </p>
        </AnimateIn>

        <AnimateIn className="min-h-[560px]">
          <div ref={loadRef}>
            {shouldLoadCarousel ? (
              <PortfolioCarousel content={content} lang={lang} />
            ) : (
              <PortfolioCarouselShell />
            )}
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
