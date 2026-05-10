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

  return (
    <section id="pricing" className="py-28 px-6 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="max-w-7xl mx-auto">
        <AnimateIn className="text-center mb-16">
          <p className="text-xs font-semibold tracking-widest uppercase text-gold mb-3">
            {lang === 'en' ? 'Pricing' : 'Harga'}
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            <Flame className="inline-block text-gold mr-2 mb-1" size={28} />
            {lang === 'en' ? 'Packages that fit every budget' : 'Pakej yang sesuai setiap bajet'}
          </h2>
        </AnimateIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {content.map((pkg, i) => (
            <AnimateIn key={pkg.id} delay={i * 0.12}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className={`relative rounded-2xl p-8 flex flex-col h-full ${
                  pkg.featured
                    ? 'bg-gold text-primary-foreground gold-glow'
                    : 'bg-card border border-border'
                }`}
              >
                {pkg.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-white text-gold text-xs font-bold tracking-widest uppercase rounded-full px-4 py-1">
                      {lang === 'en' ? 'Most Popular' : 'Paling Popular'}
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className={`font-semibold text-lg mb-1 ${pkg.featured ? '' : 'text-foreground'}`}>
                    {t(pkg.name, lang)}
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-4xl font-bold ${pkg.featured ? '' : 'text-foreground'}`}>
                      {pkg.price}
                    </span>
                    <span className={`text-sm line-through ${pkg.featured ? 'opacity-50' : 'text-muted-foreground'}`}>
                      {pkg.originalPrice}
                    </span>
                  </div>
                </div>

                <ul className="flex flex-col gap-3 mb-8 flex-1">
                  {(pkg.features[lang] ?? pkg.features.en).map((feature, fi) => (
                    <li key={fi} className="flex items-start gap-3">
                      <Check
                        size={15}
                        className={`mt-0.5 shrink-0 ${pkg.featured ? 'opacity-70' : 'text-gold'}`}
                      />
                      <span className={`text-sm leading-relaxed ${pkg.featured ? 'opacity-80' : 'text-muted-foreground'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <a
                  href={pkg.ctaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex items-center justify-center gap-2 rounded-full px-6 py-3.5 font-semibold text-sm transition-all duration-300 ${
                    pkg.featured
                      ? 'bg-white text-gold hover:bg-blue-50'
                      : 'bg-gold/10 text-gold border border-gold/30 hover:bg-gold hover:text-primary-foreground'
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
