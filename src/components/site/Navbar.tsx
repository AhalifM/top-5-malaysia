'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useLang } from '@/context/LanguageContext';
import type { SiteContent } from '@/lib/content';
import { t } from '@/lib/content';
import BrandWordmark from './BrandWordmark';

const navLinks = {
  en: [
    { label: 'Benefits', href: '#benefits' },
    { label: 'About', href: '#about' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Portfolio', href: '#portfolio' },
    { label: 'FAQ', href: '#faq' },
  ],
  my: [
    { label: 'Manfaat', href: '#benefits' },
    { label: 'Tentang', href: '#about' },
    { label: 'Harga', href: '#pricing' },
    { label: 'Portfolio', href: '#portfolio' },
    { label: 'Soal Jawab', href: '#faq' },
  ],
};

interface Props {
  brand: SiteContent['brand'];
  ctaLink: string;
  ctaText: SiteContent['hero']['ctaText'];
}

export default function Navbar({ brand, ctaLink, ctaText }: Props) {
  const { lang, setLang } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const links = navLinks[lang];

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'border-b border-gold/15 bg-background/82 shadow-[0_12px_60px_color-mix(in_oklch,var(--background)_70%,transparent)] backdrop-blur-xl'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <BrandWordmark brand={brand} className="text-xl" />
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-gold transition-colors duration-200 gold-underline"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          {/* Lang toggle */}
          <button
            onClick={() => setLang(lang === 'en' ? 'my' : 'en')}
            className="flex items-center gap-1 rounded-full border border-gold/20 bg-card/35 px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-all duration-200 hover:border-gold hover:text-gold"
          >
            <span className={lang === 'en' ? 'text-gold' : ''}>EN</span>
            <span className="opacity-40">/</span>
            <span className={lang === 'my' ? 'text-gold' : ''}>MY</span>
          </button>

          <a
            href={ctaLink}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-full bg-gold px-4 py-2 text-xs font-bold text-primary-foreground shadow-[0_0_30px_color-mix(in_oklch,var(--gold)_18%,transparent)] transition-colors hover:bg-gold-light sm:inline-flex"
          >
            {t(ctaText, lang)}
          </a>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={open}
            className="p-2 text-muted-foreground transition-colors hover:text-gold md:hidden"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-b border-gold/15 bg-background/95 backdrop-blur-xl md:hidden"
          >
            <nav className="px-6 py-4 flex flex-col gap-4">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-sm text-muted-foreground hover:text-gold transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <a
                href={ctaLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex w-fit rounded-full bg-gold px-5 py-3 text-sm font-bold text-primary-foreground"
              >
                {t(ctaText, lang)}
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
