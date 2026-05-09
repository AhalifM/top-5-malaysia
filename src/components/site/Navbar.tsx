'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useLang } from '@/context/LanguageContext';
import type { SiteContent } from '@/lib/content';
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
}

export default function Navbar({ brand }: Props) {
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
          ? 'bg-[oklch(0.09_0.008_80/0.92)] backdrop-blur-xl border-b border-[oklch(0.26_0.012_80)]'
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
            className="flex items-center gap-1 text-xs font-semibold border border-border rounded-full px-3 py-1.5 text-muted-foreground hover:text-gold hover:border-gold transition-all duration-200"
          >
            <span className={lang === 'en' ? 'text-gold' : ''}>EN</span>
            <span className="opacity-40">/</span>
            <span className={lang === 'my' ? 'text-gold' : ''}>MY</span>
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 text-muted-foreground hover:text-gold transition-colors"
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
            className="md:hidden overflow-hidden bg-[oklch(0.09_0.008_80/0.97)] backdrop-blur-xl border-b border-border"
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
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
