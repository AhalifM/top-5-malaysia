'use client';

import { motion } from 'framer-motion';
import {
  BadgeCheck,
  CircleDollarSign,
  Clapperboard,
  Layers3,
  LucideIcon,
  Sparkles,
  UsersRound,
} from 'lucide-react';
import AnimateIn from './AnimateIn';
import { useLang } from '@/context/LanguageContext';
import type { SiteContent } from '@/lib/content';
import { t } from '@/lib/content';

interface Props {
  content: SiteContent['benefits'];
}

const benefitVisuals: {
  Icon: LucideIcon;
  Accent: LucideIcon;
  kicker: string;
  metric: string;
  className: string;
}[] = [
  {
    Icon: Clapperboard,
    Accent: Sparkles,
    kicker: 'Script',
    metric: '01',
    className: 'lg:col-span-3',
  },
  {
    Icon: UsersRound,
    Accent: BadgeCheck,
    kicker: 'Crew',
    metric: '20+',
    className: 'lg:col-span-3 lg:translate-y-8',
  },
  {
    Icon: CircleDollarSign,
    Accent: Sparkles,
    kicker: 'Save',
    metric: '90%',
    className: 'lg:col-span-3',
  },
  {
    Icon: Layers3,
    Accent: BadgeCheck,
    kicker: 'Niche',
    metric: '04',
    className: 'lg:col-span-3 lg:translate-y-8',
  },
];

function BenefitVisual({ index }: { index: number }) {
  const visual = benefitVisuals[index % benefitVisuals.length];
  const Icon = visual.Icon;
  const Accent = visual.Accent;

  return (
    <div className="relative h-28 overflow-hidden rounded-lg border border-gold/20 bg-[linear-gradient(135deg,color-mix(in_oklch,var(--gold)_11%,transparent),color-mix(in_oklch,var(--surface)_88%,transparent)_48%,color-mix(in_oklch,var(--gold)_16%,transparent))] p-3 shadow-[inset_0_1px_0_color-mix(in_oklch,var(--gold)_28%,transparent)]">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,color-mix(in_oklch,var(--gold)_12%,transparent)_44%,transparent_78%)] opacity-70" />
      <div className="absolute left-3 top-3 flex h-8 items-center gap-2 rounded-md border border-gold/20 bg-card/80 px-2 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-gold shadow-sm">
        <Accent size={13} />
        {visual.kicker}
      </div>
      <div className="absolute bottom-3 left-3 h-10 w-20 rounded-md border border-border/80 bg-card/70 shadow-sm" />
      <div className="absolute bottom-5 left-6 h-2 w-12 rounded-full bg-gold/25" />
      <div className="absolute bottom-8 left-6 h-2 w-8 rounded-full bg-foreground/10" />
      <div className="absolute right-3 top-3 text-4xl font-black leading-none text-gold/12">
        {visual.metric}
      </div>
      <div className="absolute bottom-3 right-4 grid size-16 place-items-center rounded-lg border border-gold/25 bg-card shadow-[0_18px_50px_color-mix(in_oklch,var(--gold)_18%,transparent)]">
        <div className="absolute inset-1 rounded-md bg-[radial-gradient(circle_at_35%_28%,color-mix(in_oklch,var(--gold)_20%,transparent),transparent_48%)]" />
        <Icon size={30} className="relative text-gold" strokeWidth={1.8} />
      </div>
    </div>
  );
}

export default function BenefitsSection({ content }: Props) {
  const { lang } = useLang();

  return (
    <section id="benefits" className="relative isolate overflow-hidden px-6 py-24 sm:py-32">
      <div className="absolute inset-x-0 top-10 h-px bg-gradient-to-r from-transparent via-gold/25 to-transparent" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,transparent_0%,color-mix(in_oklch,var(--surface)_70%,transparent)_46%,transparent_100%)]" />

      <div className="mx-auto max-w-7xl">
        <AnimateIn className="mb-14 grid gap-6 md:grid-cols-[0.9fr_1.1fr] md:items-end">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-gold">
              {lang === 'en' ? 'Why Swifty' : 'Mengapa Swifty'}
            </p>
            <h2 className="max-w-3xl text-4xl font-black leading-[0.98] tracking-tight sm:text-5xl md:text-6xl">
              {lang === 'en' ? 'Everything you need,' : 'Semua yang anda perlukan,'}
              <span className="block text-gold">{lang === 'en' ? 'nothing you don\'t' : 'tiada yang tidak perlu'}</span>
            </h2>
          </div>
          <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:justify-self-end">
            {lang === 'en'
              ? 'A lean content engine for businesses that want TikTok output without building a studio from scratch.'
              : 'Enjin konten yang ringkas untuk perniagaan yang mahukan output TikTok tanpa membina studio sendiri.'}
          </p>
        </AnimateIn>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-12 lg:gap-5">
          {content.map((benefit, i) => (
            <AnimateIn key={benefit.id} delay={i * 0.08} className={benefitVisuals[i % benefitVisuals.length].className}>
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="group relative flex min-h-[25rem] cursor-default flex-col justify-between overflow-hidden rounded-lg border border-border bg-card p-5 shadow-[0_24px_80px_color-mix(in_oklch,var(--foreground)_5%,transparent)]"
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: 'linear-gradient(135deg, color-mix(in oklch, var(--gold) 12%, transparent), transparent 44%, color-mix(in oklch, var(--gold) 8%, transparent))',
                  }}
                />
                <div className="relative">
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <span className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-gold">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="h-px flex-1 bg-gradient-to-r from-gold/30 to-transparent" />
                  </div>
                  <BenefitVisual index={i} />
                </div>

                <div className="relative pt-6">
                  <h3 className="mb-3 text-xl font-black leading-tight tracking-tight text-foreground">
                    {t(benefit.heading, lang)}
                  </h3>
                  <p className="text-[0.95rem] leading-relaxed text-muted-foreground">
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
