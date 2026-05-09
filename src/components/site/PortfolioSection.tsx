'use client';

import Script from 'next/script';
import AnimateIn from './AnimateIn';
import { useLang } from '@/context/LanguageContext';
import type { SiteContent } from '@/lib/content';
import { t } from '@/lib/content';

interface Props {
  content: SiteContent['portfolio'];
}

function getTikTokVideoId(url: string): string | null {
  try {
    const parsed = new URL(url);
    const match = parsed.pathname.match(/\/video\/(\d+)/);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}

export default function PortfolioSection({ content }: Props) {
  const { lang } = useLang();

  return (
    <section id="portfolio" className="py-28 px-6 relative">
      <Script src="https://www.tiktok.com/embed.js" strategy="lazyOnload" />
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

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
          {content.map((item, i) => {
            const videoId = getTikTokVideoId(item.videoLink);

            return (
              <AnimateIn key={item.id} delay={i * 0.07}>
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
                          {t(item.title, lang)}
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
                      alt={t(item.title, lang)}
                      className="size-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 to-transparent p-4">
                      <span className="text-sm font-semibold text-foreground">{t(item.title, lang)}</span>
                    </div>
                  </a>
                )}
              </AnimateIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
