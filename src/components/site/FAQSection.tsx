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
    <section id="faq" className="py-28 px-6 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="max-w-3xl mx-auto">
        <AnimateIn className="text-center mb-16">
          <p className="text-xs font-semibold tracking-widest uppercase text-gold mb-3">
            {lang === 'en' ? 'FAQs' : 'Soalan Lazim'}
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            {lang === 'en' ? 'Questions we get a lot' : 'Soalan yang sering ditanya'}
          </h2>
        </AnimateIn>

        <div className="flex flex-col gap-3">
          {content.map((item, i) => (
            <AnimateIn key={item.id} delay={i * 0.05}>
              <div className="rounded-xl border border-border overflow-hidden">
                <button
                  onClick={() => setOpen(open === item.id ? null : item.id)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-card/50 transition-colors duration-200"
                >
                  <span className="font-medium text-foreground leading-snug">
                    {t(item.question, lang)}
                  </span>
                  <span className="shrink-0 text-gold">
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
                      <div className="px-6 pb-5 border-t border-border pt-4">
                        <p className="text-sm text-muted-foreground leading-relaxed">
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
