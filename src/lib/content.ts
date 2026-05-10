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

export interface ImageAdjustments {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
}

export interface ThemePalette {
  id: string;
  name: string;
  accent: string;
  accentLight: string;
  accentDark: string;
  accentMuted: string;
  background: string;
  surface: string;
  surface2: string;
  foreground: string;
  card: string;
  muted: string;
  mutedForeground: string;
  border: string;
  input: string;
}

export type SiteTheme = Omit<ThemePalette, 'id' | 'name'> & {
  paletteId: string;
};

export const THEME_PALETTES: ThemePalette[] = [
  {
    id: 'blue-white',
    name: 'Blue White',
    accent: '#0f7ceb',
    accentLight: '#3aa0ff',
    accentDark: '#0757b7',
    accentMuted: '#5c7fae',
    background: '#f8fbff',
    surface: '#eef6ff',
    surface2: '#dcecff',
    foreground: '#0b1f3a',
    card: '#ffffff',
    muted: '#eaf3ff',
    mutedForeground: '#526780',
    border: '#cddff4',
    input: '#f2f8ff',
  },
  {
    id: 'navy-sky',
    name: 'Navy Sky',
    accent: '#2563eb',
    accentLight: '#60a5fa',
    accentDark: '#1e3a8a',
    accentMuted: '#64748b',
    background: '#f8fafc',
    surface: '#eef2ff',
    surface2: '#dbeafe',
    foreground: '#0f172a',
    card: '#ffffff',
    muted: '#e2e8f0',
    mutedForeground: '#475569',
    border: '#cbd5e1',
    input: '#f1f5f9',
  },
  {
    id: 'teal-clean',
    name: 'Teal Clean',
    accent: '#0d9488',
    accentLight: '#2dd4bf',
    accentDark: '#0f766e',
    accentMuted: '#5b7f7a',
    background: '#f7fffd',
    surface: '#eafffa',
    surface2: '#ccfbf1',
    foreground: '#102a2a',
    card: '#ffffff',
    muted: '#dff7f2',
    mutedForeground: '#4d6867',
    border: '#b8e7df',
    input: '#effdfa',
  },
  {
    id: 'rose-soft',
    name: 'Rose Soft',
    accent: '#e11d48',
    accentLight: '#fb7185',
    accentDark: '#be123c',
    accentMuted: '#93616b',
    background: '#fff8fa',
    surface: '#fff1f4',
    surface2: '#ffe4eb',
    foreground: '#31111a',
    card: '#ffffff',
    muted: '#ffe9ef',
    mutedForeground: '#71535b',
    border: '#ffc9d6',
    input: '#fff1f4',
  },
];

const { id: defaultPaletteId, name: _defaultPaletteName, ...defaultPaletteTheme } = THEME_PALETTES[0];
void _defaultPaletteName;

export const DEFAULT_THEME: SiteTheme = {
  paletteId: defaultPaletteId,
  ...defaultPaletteTheme,
};

export const DEFAULT_IMAGE_ADJUSTMENTS: ImageAdjustments = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  blur: 0,
};

export function normalizeTheme(theme?: Partial<SiteTheme>): SiteTheme {
  const palette = THEME_PALETTES.find((item) => item.id === theme?.paletteId) ?? THEME_PALETTES[0];
  const { id: _id, name: _name, ...paletteTheme } = palette;
  void _id;
  void _name;

  return {
    paletteId: palette.id,
    ...paletteTheme,
    ...theme,
  };
}

export function themeToCssVariables(theme?: Partial<SiteTheme>): Record<string, string> {
  const normalized = normalizeTheme(theme);

  return {
    '--gold': normalized.accent,
    '--gold-light': normalized.accentLight,
    '--gold-dark': normalized.accentDark,
    '--gold-muted': normalized.accentMuted,
    '--background': normalized.background,
    '--surface': normalized.surface,
    '--surface-2': normalized.surface2,
    '--foreground': normalized.foreground,
    '--card': normalized.card,
    '--card-foreground': normalized.foreground,
    '--popover': normalized.card,
    '--popover-foreground': normalized.foreground,
    '--primary': normalized.accent,
    '--primary-foreground': '#ffffff',
    '--secondary': normalized.surface2,
    '--secondary-foreground': normalized.foreground,
    '--muted': normalized.muted,
    '--muted-foreground': normalized.mutedForeground,
    '--accent': normalized.accent,
    '--accent-foreground': '#ffffff',
    '--border': normalized.border,
    '--input': normalized.input,
    '--ring': normalized.accent,
    '--sidebar': normalized.surface,
    '--sidebar-foreground': normalized.foreground,
    '--sidebar-primary': normalized.accent,
    '--sidebar-primary-foreground': '#ffffff',
    '--sidebar-accent': normalized.surface2,
    '--sidebar-accent-foreground': normalized.foreground,
    '--sidebar-border': normalized.border,
    '--sidebar-ring': normalized.accent,
  };
}

export function normalizeImageAdjustments(adjustments?: Partial<ImageAdjustments>): ImageAdjustments {
  return {
    ...DEFAULT_IMAGE_ADJUSTMENTS,
    ...adjustments,
  };
}

export function imageAdjustmentsToFilter(adjustments?: Partial<ImageAdjustments>): string {
  const normalized = normalizeImageAdjustments(adjustments);

  return [
    `brightness(${normalized.brightness}%)`,
    `contrast(${normalized.contrast}%)`,
    `saturate(${normalized.saturation}%)`,
    `blur(${normalized.blur}px)`,
  ].join(' ');
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
  views?: string;
  likes?: string;
  title: LocalizedString;
}

export interface FaqItem {
  id: string;
  question: LocalizedString;
  answer: LocalizedString;
}

export interface SiteContent {
  theme: SiteTheme;
  brand: Brand;
  hero: {
    headline: LocalizedString;
    subheading: LocalizedString;
    backgroundImage: string;
    imageAdjustments: ImageAdjustments;
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
