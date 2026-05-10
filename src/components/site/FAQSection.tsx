'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import AnimateIn from './AnimateIn';
import { useLang } from '@/context/LanguageContext';
import type { SiteContent } from '@/lib/content';
import { t } from '@/lib/content';

interface Props {
  content: SiteContent['faq'];
}

export default function FAQSection({ content }: Props) {
  const { lang } = useLang();
  const [open, setOpen] = useState<string | null>(content[0]?.id ?? null);

  return (
    <section id="faq" className="relative overflow-hidden px-6 py-28">
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/25 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-80 bg-[radial-gradient(circle_at_50%_100%,color-mix(in_oklch,var(--gold)_10%,transparent),transparent_60%)]" />

      <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1fr]">
        <AnimateIn className="lg:sticky lg:top-28 lg:h-fit">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-gold">
            {lang === 'en' ? 'FAQs' : 'Soalan Lazim'}
          </p>
          <h2 className="max-w-md text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
            {lang === 'en' ? 'Questions we get a lot' : 'Soalan yang sering ditanya'}
          </h2>
          <p className="mt-5 max-w-sm text-muted-foreground">
            {lang === 'en'
              ? 'Clear answers before you message us, so WhatsApp can move straight into the brief.'
              : 'Jawapan ringkas sebelum anda mesej kami, supaya WhatsApp terus masuk ke brief.'}
          </p>
        </AnimateIn>

        <div className="flex flex-col gap-3">
          {content.map((item, i) => (
            <AnimateIn key={item.id} delay={i * 0.05}>
              <div className="overflow-hidden rounded-lg border border-gold/15 bg-card/78">
                <button
                  onClick={() => setOpen(open === item.id ? null : item.id)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors duration-200 hover:bg-gold/5"
                >
                  <span className="font-semibold leading-snug text-foreground">
                    {t(item.question, lang)}
                  </span>
                  <span className="grid size-8 shrink-0 place-items-center rounded-full border border-gold/20 text-gold">
                    {open === item.id ? <Minus size={16} /> : <Plus size={16} />}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {open === item.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="border-t border-gold/10 px-6 pb-5 pt-4">
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {t(item.answer, lang)}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
