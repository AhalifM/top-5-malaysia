'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Eye, Play } from 'lucide-react';
import AnimateIn from './AnimateIn';
import { useLang } from '@/context/LanguageContext';
import type { SiteContent } from '@/lib/content';
import { t } from '@/lib/content';

interface Props {
  content: SiteContent['portfolio'];
}

export default function PortfolioSection({ content }: Props) {
  const { lang } = useLang();

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

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {content.map((item, i) => (
            <AnimateIn key={item.id} delay={i * 0.07}>
              <motion.a
                href={item.videoLink}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="group relative block aspect-[9/16] rounded-2xl overflow-hidden bg-card border border-border"
              >
                <img
                  src={item.thumbnail}
                  alt={t(item.title, lang)}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.09_0.008_80/0.9)] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-14 h-14 rounded-full bg-gold flex items-center justify-center gold-glow">
                    <Play size={18} fill="currentColor" className="text-[oklch(0.09_0.008_80)] ml-1" />
                  </div>
                </div>

                {item.views && (
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full border border-white/10 bg-[oklch(0.09_0.008_80/0.72)] px-2.5 py-1.5 text-[11px] font-semibold text-foreground shadow-lg backdrop-blur-md">
                    <Eye size={12} className="text-gold" />
                    <span>{item.views}</span>
                  </div>
                )}

                {/* Title */}
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">{t(item.title, lang)}</span>
                    <ExternalLink size={12} className="text-gold" />
                  </div>
                </div>
              </motion.a>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
