'use client';

import AnimateIn from './AnimateIn';
import { useLang } from '@/context/LanguageContext';
import type { SiteContent } from '@/lib/content';
import { t } from '@/lib/content';

interface Props {
  content: SiteContent['company'];
}

export default function CompanySection({ content }: Props) {
  const { lang } = useLang();

  return (
    <section id="about" className="relative overflow-hidden px-6 py-28">
      {/* Subtle section divider */}
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/25 to-transparent" />
      <div className="absolute inset-y-20 left-0 w-1/2 bg-[radial-gradient(circle_at_30%_40%,color-mix(in_oklch,var(--gold)_12%,transparent),transparent_55%)]" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Image side */}
        <AnimateIn from="left">
          <div className="relative">
            <div className="pointer-events-none absolute -inset-5 rounded-[2rem] border border-gold/15 bg-gradient-to-br from-gold/14 to-transparent" />
            <img
              src={content.teamImage}
              alt="Swifty team"
              loading="lazy"
              decoding="async"
              className="aspect-[4/3] w-full rounded-lg border border-gold/15 object-cover brightness-[0.82] contrast-110 saturate-[0.9]"
            />
            <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-background/70 via-transparent to-transparent" />
            {/* Stat badge */}
            <div className="absolute -bottom-6 right-4 rounded-lg border border-gold/25 bg-gold px-6 py-4 text-primary-foreground gold-glow">
              <div className="text-3xl font-black leading-none">{content.stat}</div>
              <div className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] opacity-75">
                {t(content.statLabel, lang)}
              </div>
            </div>
          </div>
        </AnimateIn>

        {/* Text side */}
        <AnimateIn from="right" delay={0.1}>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-gold">
            {lang === 'en' ? 'Our Story' : 'Kisah Kami'}
          </p>
          <h2 className="mb-6 text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
            {t(content.heading, lang)}
          </h2>
          <p className="mb-10 max-w-xl text-lg leading-relaxed text-muted-foreground">
            {t(content.text, lang)}
          </p>

          {/* Client logos */}
          <div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              {lang === 'en' ? 'Trusted by brands like' : 'Dipercayai jenama seperti'}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              {content.logos.map((logo) => (
                <img
                  key={logo.alt}
                  src={logo.src}
                  alt={logo.alt}
                  loading="lazy"
                  decoding="async"
                  className="h-9 rounded-full border border-gold/12 bg-card px-4 py-2 object-contain opacity-65 grayscale transition-all duration-300 hover:border-gold/30 hover:opacity-100 hover:grayscale-0"
                  style={{ filter: 'grayscale(1) invert(1)' }}
                  onError={(e) => {
                    const parent = (e.target as HTMLElement).parentElement;
                    if (parent) {
                      const span = document.createElement('span');
                      span.className = 'text-xs font-semibold text-muted-foreground/40 hover:text-muted-foreground transition-colors';
                      span.textContent = logo.alt;
                      parent.replaceChild(span, e.target as HTMLElement);
                    }
                  }}
                />
              ))}
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
