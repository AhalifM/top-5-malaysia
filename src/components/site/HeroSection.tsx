'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import Image from 'next/image';
import { useLang } from '@/context/LanguageContext';
import type { SiteContent } from '@/lib/content';
import { imageAdjustmentsToFilter, t } from '@/lib/content';
import HeroScene from './HeroScene';

interface Props {
  content: SiteContent['hero'];
  ctaLink: string;
}

export default function HeroSection({ content, ctaLink }: Props) {
  const { lang } = useLang();

  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-6 pb-20 pt-28">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={content.backgroundImage}
          alt=""
          fill
          preload
          sizes="100vw"
          className="object-cover"
          style={{ filter: imageAdjustmentsToFilter(content.imageAdjustments) }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--background)_0%,color-mix(in_oklch,var(--background)_82%,transparent)_48%,color-mix(in_oklch,var(--background)_42%,transparent)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_46%_36%,color-mix(in_oklch,var(--gold)_18%,transparent),transparent_31%),linear-gradient(180deg,color-mix(in_oklch,var(--background)_55%,transparent)_0%,var(--background)_94%)]" />
      </div>
      <HeroScene />

      {/* Animated blue glow */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/3 z-0 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: 'radial-gradient(circle, color-mix(in oklch, var(--gold) 12%, transparent) 0%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[0.9fr_0.55fr] lg:items-center">
        <div className="max-w-4xl text-center lg:text-left">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="mb-8 inline-flex items-center gap-2 rounded-full border border-gold/35 bg-gold/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-gold shadow-[0_0_40px_color-mix(in_oklch,var(--gold)_12%,transparent)]">
            <Play size={10} fill="currentColor" />
            {lang === 'en' ? 'Malaysia\'s Most Affordable UGC Agency' : 'Agensi UGC Paling Mampu Milik Malaysia'}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 text-5xl font-black leading-[0.95] tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl"
        >
          {t(content.headline, lang).split(' ').map((word, i, arr) => {
            const goldWords = ['Affordable', 'Swifty', 'Mampu', 'Swifty,'];
            const isGold = goldWords.includes(word);
            return (
              <span key={i} className={isGold ? 'text-gold' : ''}>
                {word}{i < arr.length - 1 ? ' ' : ''}
              </span>
            );
          })}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground lg:mx-0"
        >
          {t(content.subheading, lang)}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-4 sm:flex-row lg:justify-start"
        >
          <a
            href={ctaLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full bg-gold px-8 py-3.5 font-semibold text-primary-foreground transition-all duration-300 hover:bg-gold-light gold-glow"
          >
            {t(content.ctaText, lang)}
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
          </a>
          <a
            href="#portfolio"
            className="inline-flex items-center gap-2 rounded-full border border-gold/25 bg-card/45 px-6 py-3.5 text-sm text-muted-foreground transition-colors hover:border-gold/55 hover:text-foreground"
          >
            <Play size={14} className="text-gold" />
            {lang === 'en' ? 'Watch Our Work' : 'Tonton Kerja Kami'}
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 grid max-w-xl grid-cols-3 overflow-hidden rounded-lg border border-gold/18 bg-card/55 text-left backdrop-blur"
        >
          {[
            ['20+', lang === 'en' ? 'Creators' : 'Kreator'],
            ['48h', lang === 'en' ? 'Kickoff' : 'Mula'],
            ['90%', lang === 'en' ? 'Savings' : 'Jimat'],
          ].map(([value, label]) => (
            <div key={label} className="border-r border-gold/12 p-4 last:border-r-0">
              <div className="text-xl font-black text-gold">{value}</div>
              <div className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{label}</div>
            </div>
          ))}
        </motion.div>
        </div>

        <div className="hidden lg:block" />

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-10 left-1/2 hidden -translate-x-1/2 md:block"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-5 h-8 rounded-full border border-gold/30 flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-2 bg-gold rounded-full" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
