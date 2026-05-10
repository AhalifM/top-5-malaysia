'use client';

import { motion } from 'framer-motion';
import { Check, ArrowRight, Flame } from 'lucide-react';
import AnimateIn from './AnimateIn';
import { useLang } from '@/context/LanguageContext';
import type { SiteContent } from '@/lib/content';
import { t } from '@/lib/content';

interface Props {
  content: SiteContent['pricing'];
}

export default function PricingSection({ content }: Props) {
  const { lang } = useLang();
  const packageGuides = [
    lang === 'en' ? 'Best for testing the channel' : 'Terbaik untuk cuba saluran',
    lang === 'en' ? 'Best for consistent weekly output' : 'Terbaik untuk output mingguan',
    lang === 'en' ? 'Best for scaling campaigns' : 'Terbaik untuk kempen berskala',
  ];

  return (
    <section id="pricing" className="relative overflow-hidden px-6 py-28">
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/25 to-transparent" />
      <div className="absolute inset-x-0 top-20 h-80 bg-[radial-gradient(circle_at_50%_0%,color-mix(in_oklch,var(--gold)_14%,transparent),transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl">
        <AnimateIn className="mb-16 grid gap-6 md:grid-cols-[0.8fr_1fr] md:items-end">
          <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-gold">
            {lang === 'en' ? 'Pricing' : 'Harga'}
          </p>
          <h2 className="text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
            {lang === 'en' ? 'Packages that fit every budget' : 'Pakej yang sesuai setiap bajet'}
          </h2>
          </div>
          <p className="max-w-lg text-base leading-relaxed text-muted-foreground md:justify-self-end">
            {lang === 'en'
              ? 'Pick a launch size, then scale once the content starts proving itself.'
              : 'Pilih saiz permulaan, kemudian kembangkan apabila konten mula menunjukkan hasil.'}
          </p>
        </AnimateIn>

        <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-3">
          {content.map((pkg, i) => (
            <AnimateIn key={pkg.id}>
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className={`relative flex h-full flex-col overflow-hidden rounded-lg p-7 ${
                  pkg.featured
                    ? 'border border-gold/45 bg-[linear-gradient(180deg,color-mix(in_oklch,var(--surface-2)_70%,black),color-mix(in_oklch,var(--card)_96%,black))] text-foreground gold-glow'
                    : 'border border-gold/15 bg-card/88'
                }`}
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,color-mix(in_oklch,white_18%,transparent),transparent_44%)] opacity-70" />
                {pkg.featured && (
                  <div className="absolute right-5 top-5">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gold px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-primary-foreground">
                      <Flame size={13} fill="currentColor" />
                      {lang === 'en' ? 'Most Popular' : 'Paling Popular'}
                    </span>
                  </div>
                )}

                <div className="relative mb-7">
                  <p className={`mb-4 text-xs font-bold uppercase tracking-[0.18em] ${pkg.featured ? 'pr-32 text-gold' : 'text-gold'}`}>
                    {packageGuides[i]}
                  </p>
                  <h3 className="mb-2 text-xl font-black text-foreground">
                    {t(pkg.name, lang)}
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-foreground">
                      {pkg.price}
                    </span>
                    <span className="text-sm text-muted-foreground line-through">
                      {pkg.originalPrice}
                    </span>
                  </div>
                </div>

                <ul className="relative mb-8 flex flex-1 flex-col gap-3">
                  {(pkg.features[lang] ?? pkg.features.en).map((feature, fi) => (
                    <li key={fi} className="flex items-start gap-3">
                      <Check
                        size={15}
                        className="mt-0.5 shrink-0 text-gold"
                      />
                      <span className="text-sm leading-relaxed text-muted-foreground">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <a
                  href={pkg.ctaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group relative flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold transition-all duration-300 ${
                    pkg.featured
                      ? 'bg-gold text-primary-foreground hover:bg-gold-light'
                      : 'border border-gold/30 bg-gold/10 text-gold hover:bg-gold hover:text-primary-foreground'
                  }`}
                >
                  {lang === 'en' ? "I'm Interested" : 'Saya Berminat'}
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-200" />
                </a>
              </motion.div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
