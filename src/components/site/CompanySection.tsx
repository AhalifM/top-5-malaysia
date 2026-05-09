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
    <section id="about" className="py-28 px-6 relative">
      {/* Subtle section divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Image side */}
        <AnimateIn from="left">
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-gold/10 to-transparent pointer-events-none" />
            <img
              src={content.teamImage}
              alt="Swifty team"
              className="w-full aspect-[4/3] object-cover rounded-2xl"
            />
            {/* Stat badge */}
            <div className="absolute -bottom-6 -right-4 bg-gold text-[oklch(0.09_0.008_80)] rounded-2xl px-6 py-4 gold-glow">
              <div className="text-3xl font-bold leading-none">{content.stat}</div>
              <div className="text-xs font-semibold mt-1 opacity-70">
                {t(content.statLabel, lang)}
              </div>
            </div>
          </div>
        </AnimateIn>

        {/* Text side */}
        <AnimateIn from="right" delay={0.1}>
          <p className="text-xs font-semibold tracking-widest uppercase text-gold mb-4">
            {lang === 'en' ? 'Our Story' : 'Kisah Kami'}
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6">
            {t(content.heading, lang)}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-10 max-w-lg">
            {t(content.text, lang)}
          </p>

          {/* Client logos */}
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-5">
              {lang === 'en' ? 'Trusted by brands like' : 'Dipercayai jenama seperti'}
            </p>
            <div className="flex flex-wrap gap-6 items-center">
              {content.logos.map((logo) => (
                <img
                  key={logo.alt}
                  src={logo.src}
                  alt={logo.alt}
                  className="h-6 object-contain opacity-40 hover:opacity-80 transition-opacity duration-300 grayscale hover:grayscale-0"
                  style={{ filter: 'invert(1) grayscale(1)' }}
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
