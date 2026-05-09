export interface LocalizedString {
  en: string;
  my: string;
}

export interface Benefit {
  id: string;
  icon: string;
  heading: LocalizedString;
  text: LocalizedString;
}

export interface Logo {
  src: string;
  alt: string;
}

export interface Brand {
  name: string;
  highlight: string;
}

export interface PricingPackage {
  id: string;
  name: LocalizedString;
  price: string;
  originalPrice: string;
  features: { en: string[]; my: string[] };
  ctaLink: string;
  featured: boolean;
}

export interface PortfolioItem {
  id: string;
  thumbnail: string;
  videoLink: string;
  title: LocalizedString;
}

export interface FaqItem {
  id: string;
  question: LocalizedString;
  answer: LocalizedString;
}

export interface SiteContent {
  brand: Brand;
  hero: {
    headline: LocalizedString;
    subheading: LocalizedString;
    backgroundImage: string;
    ctaText: LocalizedString;
    ctaLink: string;
  };
  benefits: Benefit[];
  company: {
    teamImage: string;
    heading: LocalizedString;
    text: LocalizedString;
    stat: string;
    statLabel: LocalizedString;
    logos: Logo[];
  };
  pricing: PricingPackage[];
  portfolio: PortfolioItem[];
  faq: FaqItem[];
  footer: {
    text: LocalizedString;
    social: {
      twitter: string;
      facebook: string;
      instagram: string;
      tiktok: string;
    };
    address: string;
    copyright: string;
  };
}

export type Lang = 'en' | 'my';

export function t(obj: LocalizedString, lang: Lang): string {
  return obj[lang] ?? obj.en;
}
