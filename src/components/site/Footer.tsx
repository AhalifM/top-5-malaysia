'use client';

import { useLang } from '@/context/LanguageContext';
import type { SiteContent } from '@/lib/content';
import { t } from '@/lib/content';
import BrandWordmark from './BrandWordmark';

interface Props {
  brand: SiteContent['brand'];
  content: SiteContent['footer'];
  ctaLink: string;
  ctaText: SiteContent['hero']['ctaText'];
}

function XIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function TikTokIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
    </svg>
  );
}

export default function Footer({ brand, content, ctaLink, ctaText }: Props) {
  const { lang } = useLang();

  return (
    <footer className="relative overflow-hidden border-t border-gold/15">
      {/* CTA band */}
      <div className="relative bg-[linear-gradient(135deg,var(--gold),var(--gold-dark))] px-6 py-20 text-center text-primary-foreground">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,color-mix(in_oklch,white_22%,transparent),transparent_45%)]" />
        <div className="relative">
        <h2 className="mb-4 text-4xl font-black tracking-tight sm:text-5xl">
          {lang === 'en' ? 'Ready to grow on TikTok?' : 'Bersedia untuk berkembang di TikTok?'}
        </h2>
        <p className="mx-auto mb-8 max-w-md text-primary-foreground/75">
          {lang === 'en'
            ? 'Join 1,000+ businesses already creating content with Swifty.'
            : 'Sertai 1,000+ perniagaan yang sudah mencipta konten bersama Swifty.'}
        </p>
        <a
          href={ctaLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-background px-8 py-3.5 font-bold text-gold transition-all duration-300 hover:bg-card"
        >
          {t(ctaText, lang)}
        </a>
        </div>
      </div>

      {/* Footer bottom */}
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-6 py-12 md:flex-row md:items-center">
        <div className="max-w-sm">
          <BrandWordmark brand={brand} className="text-xl mb-3 block" />
          <p className="text-sm text-muted-foreground leading-relaxed">{t(content.text, lang)}</p>
          <p className="text-xs text-muted-foreground/60 mt-2">{content.address}</p>
        </div>

        <div className="flex flex-col items-start md:items-end gap-4">
          <div className="flex items-center gap-3">
            {content.social.twitter && (
              <a href={content.social.twitter} target="_blank" rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/15 text-muted-foreground transition-all duration-200 hover:border-gold hover:text-gold">
                <XIcon size={15} />
              </a>
            )}
            {content.social.facebook && (
              <a href={content.social.facebook} target="_blank" rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/15 text-muted-foreground transition-all duration-200 hover:border-gold hover:text-gold">
                <FacebookIcon size={15} />
              </a>
            )}
            {content.social.instagram && (
              <a href={content.social.instagram} target="_blank" rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/15 text-muted-foreground transition-all duration-200 hover:border-gold hover:text-gold">
                <InstagramIcon size={15} />
              </a>
            )}
            {content.social.tiktok && (
              <a href={content.social.tiktok} target="_blank" rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/15 text-muted-foreground transition-all duration-200 hover:border-gold hover:text-gold">
                <TikTokIcon size={15} />
              </a>
            )}
          </div>
          <p className="text-xs text-muted-foreground/50">{content.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
