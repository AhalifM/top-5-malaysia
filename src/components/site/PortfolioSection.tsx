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
    <section id="portfolio" className="py-28 px-6 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="max-w-7xl mx-auto">
        <AnimateIn className="text-center mb-16">
          <p className="text-xs font-semibold tracking-widest uppercase text-gold mb-3">
            {lang === 'en' ? 'Our Work' : 'Kerja Kami'}
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight max-w-2xl mx-auto">
            {lang === 'en'
              ? 'Engaging content that converts'
              : 'Konten menarik yang menukar pengunjung'}
          </h2>
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
