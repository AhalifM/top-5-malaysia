'use client';

import { motion } from 'framer-motion';
import AnimateIn from './AnimateIn';
import { useLang } from '@/context/LanguageContext';
import type { SiteContent } from '@/lib/content';
import { t } from '@/lib/content';

interface Props {
  content: SiteContent['benefits'];
}

export default function BenefitsSection({ content }: Props) {
  const { lang } = useLang();

  return (
    <section id="benefits" className="py-28 px-6">
      <div className="max-w-7xl mx-auto">
        <AnimateIn className="text-center mb-16">
          <p className="text-xs font-semibold tracking-widest uppercase text-gold mb-3">
            {lang === 'en' ? 'Why Swifty' : 'Mengapa Swifty'}
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            {lang === 'en' ? 'Everything you need,' : 'Semua yang anda perlukan,'}
            <br />
            <span className="text-gold">{lang === 'en' ? 'nothing you don\'t' : 'tiada yang tidak perlu'}</span>
          </h2>
        </AnimateIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {content.map((benefit, i) => (
            <AnimateIn key={benefit.id} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="group relative h-full rounded-2xl border border-border bg-card p-7 flex flex-col gap-5 overflow-hidden cursor-default"
              >
                {/* Hover gold shimmer */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle at 50% 0%, oklch(0.76 0.12 85 / 0.07) 0%, transparent 70%)',
                  }}
                />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Number */}
                <span className="text-5xl font-bold text-gold/10 absolute top-4 right-5 select-none">
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
                  <img
                    src={benefit.icon}
                    alt=""
                    className="w-6 h-6 object-contain"
                    style={{ filter: 'invert(1) sepia(1) saturate(2) hue-rotate(5deg)' }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2 leading-snug">
                    {t(benefit.heading, lang)}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(benefit.text, lang)}
                  </p>
                </div>
              </motion.div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
