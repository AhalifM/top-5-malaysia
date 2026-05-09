'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Image as ImageIcon, Users, Tag, Film,
  HelpCircle, Globe, LogOut, Save, Plus, Trash2, ChevronDown,
  ChevronUp, ExternalLink, CheckCircle, AlertCircle, Loader2, BadgeIcon, RefreshCw
} from 'lucide-react';
import type { SiteContent, Lang } from '@/lib/content';
import BrandWordmark from '@/components/site/BrandWordmark';

type Section = 'brand' | 'hero' | 'benefits' | 'company' | 'pricing' | 'portfolio' | 'faq' | 'footer';

const sectionMeta: { key: Section; label: string; icon: React.ReactNode }[] = [
  { key: 'brand', label: 'Brand', icon: <BadgeIcon size={16} /> },
  { key: 'hero', label: 'Hero', icon: <ImageIcon size={16} /> },
  { key: 'benefits', label: 'Benefits', icon: <LayoutDashboard size={16} /> },
  { key: 'company', label: 'Company', icon: <Users size={16} /> },
  { key: 'pricing', label: 'Pricing', icon: <Tag size={16} /> },
  { key: 'portfolio', label: 'Portfolio', icon: <Film size={16} /> },
  { key: 'faq', label: 'FAQ', icon: <HelpCircle size={16} /> },
  { key: 'footer', label: 'Footer', icon: <Globe size={16} /> },
];

function Field({
  label, value, onChange, placeholder, type = 'text', multiline = false
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; multiline?: boolean;
}) {
  const base = "w-full bg-[oklch(0.12_0.008_80)] border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-gold/50 transition-colors";
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className={base + ' resize-none'}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={base}
        />
      )}
    </div>
  );
}

function BilingualField({
  label, value, onChange, multiline = false
}: {
  label: string;
  value: { en: string; my: string };
  onChange: (v: { en: string; my: string }) => void;
  multiline?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {(['en', 'my'] as Lang[]).map((lang) => (
          <div key={lang} className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground/50 font-mono">{lang.toUpperCase()}</span>
            {multiline ? (
              <textarea
                value={value[lang]}
                onChange={(e) => onChange({ ...value, [lang]: e.target.value })}
                rows={3}
                className="w-full bg-[oklch(0.12_0.008_80)] border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-gold/50 transition-colors resize-none"
              />
            ) : (
              <input
                type="text"
                value={value[lang]}
                onChange={(e) => onChange({ ...value, [lang]: e.target.value })}
                className="w-full bg-[oklch(0.12_0.008_80)] border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-gold/50 transition-colors"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ImagePreview({ src }: { src: string }) {
  if (!src) return null;
  return (
    <div className="mt-2">
      <img
        src={src}
        alt="Preview"
        className="h-28 w-full object-cover rounded-lg border border-border"
        onError={(e) => ((e.target as HTMLElement).style.display = 'none')}
      />
    </div>
  );
}

function isTikTokUrl(value: string): boolean {
  try {
    const url = new URL(value);
    const hostname = url.hostname.replace(/^www\./, '');
    return hostname === 'tiktok.com' || hostname.endsWith('.tiktok.com');
  } catch {
    return false;
  }
}

export default function AdminPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<Section>('hero');
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [thumbnailLoadingId, setThumbnailLoadingId] = useState<string | null>(null);
  const [thumbnailErrorId, setThumbnailErrorId] = useState<string | null>(null);
  const thumbnailTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const lastThumbnailFetch = useRef<Record<string, string>>({});

  useEffect(() => {
    fetch('/api/content')
      .then((r) => {
        if (r.status === 401) { router.push('/admin/login'); return null; }
        return r.json();
      })
      .then((data) => {
        if (data) { setContent(data); setLoading(false); }
      })
      .catch(() => router.push('/admin/login'));
  }, [router]);

  const save = useCallback(async () => {
    if (!content) return;
    setSaving(true);
    const res = await fetch('/api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(content),
    });
    setSaving(false);
    setSaveStatus(res.ok ? 'success' : 'error');
    if (!res.ok && res.status === 401) router.push('/admin/login');
    setTimeout(() => setSaveStatus('idle'), 3000);
  }, [content, router]);

  async function logout() {
    await fetch('/api/auth', { method: 'DELETE' });
    router.push('/admin/login');
  }

  function updateContent<K extends keyof SiteContent>(key: K, value: SiteContent[K]) {
    setContent((prev) => prev ? { ...prev, [key]: value } : prev);
  }

  useEffect(() => {
    const timers = thumbnailTimers.current;

    return () => {
      Object.values(timers).forEach(clearTimeout);
    };
  }, []);

  async function fetchTikTokThumbnail(itemId: string, videoLink: string) {
    const normalizedLink = videoLink.trim();

    if (!isTikTokUrl(normalizedLink)) {
      setThumbnailErrorId(itemId);
      return;
    }

    lastThumbnailFetch.current[itemId] = normalizedLink;
    setThumbnailLoadingId(itemId);
    setThumbnailErrorId(null);

    try {
      const res = await fetch('/api/tiktok-thumbnail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoUrl: normalizedLink }),
      });

      if (!res.ok) {
        setThumbnailErrorId(itemId);
        if (res.status === 401) router.push('/admin/login');
        return;
      }

      const data = (await res.json()) as { thumbnailUrl: string };
      setContent((prev) => prev ? {
        ...prev,
        portfolio: prev.portfolio.map((item) =>
          item.id === itemId && item.videoLink.trim() === normalizedLink
            ? { ...item, thumbnail: data.thumbnailUrl }
            : item
        ),
      } : prev);
    } catch {
      setThumbnailErrorId(itemId);
    } finally {
      setThumbnailLoadingId(null);
    }
  }

  function scheduleTikTokThumbnailFetch(itemId: string, videoLink: string) {
    const normalizedLink = videoLink.trim();

    clearTimeout(thumbnailTimers.current[itemId]);
    setThumbnailErrorId((current) => current === itemId ? null : current);

    if (!isTikTokUrl(normalizedLink) || lastThumbnailFetch.current[itemId] === normalizedLink) {
      return;
    }

    thumbnailTimers.current[itemId] = setTimeout(() => {
      fetchTikTokThumbnail(itemId, normalizedLink);
    }, 900);
  }

  if (loading || !content) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="text-gold animate-spin" size={32} />
      </div>
    );
  }

  const activeMeta = sectionMeta.find((s) => s.key === activeSection)!;

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-60 shrink-0 border-r border-border bg-[oklch(0.11_0.008_80)] sticky top-0 h-screen">
        <div className="px-5 py-5 border-b border-border">
          <div className="text-lg">
            <BrandWordmark brand={content.brand} mutedClassName="text-foreground/70" />
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">Content Manager</p>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          {sectionMeta.map((s) => (
            <button
              key={s.key}
              onClick={() => setActiveSection(s.key)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 text-left w-full ${
                activeSection === s.key
                  ? 'bg-gold/10 text-gold font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-card'
              }`}
            >
              {s.icon}
              {s.label}
            </button>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-border flex flex-col gap-2">
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-card transition-all"
          >
            <ExternalLink size={15} />
            View Site
          </a>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-red-400 hover:bg-red-400/5 transition-all"
          >
            <LogOut size={15} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden sticky top-0 z-20 bg-[oklch(0.11_0.008_80)] border-b border-border px-4 py-3 flex items-center justify-between">
        <BrandWordmark brand={content.brand} className="text-sm" mutedClassName="text-foreground/70" />
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="flex items-center gap-2 text-sm text-muted-foreground border border-border rounded-lg px-3 py-1.5"
        >
          {activeMeta.icon}
          {activeMeta.label}
          {mobileNavOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>
      <AnimatePresence>
        {mobileNavOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-[oklch(0.11_0.008_80)] border-b border-border z-10"
          >
            <div className="px-3 py-2 flex flex-col gap-1">
              {sectionMeta.map((s) => (
                <button
                  key={s.key}
                  onClick={() => { setActiveSection(s.key); setMobileNavOpen(false); }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left ${
                    activeSection === s.key ? 'text-gold bg-gold/10' : 'text-muted-foreground'
                  }`}
                >
                  {s.icon}{s.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Topbar */}
        <div className="sticky top-0 md:top-0 z-10 bg-background/90 backdrop-blur border-b border-border px-6 py-4 flex items-center justify-between">
          <h1 className="font-semibold text-foreground">{activeMeta.label}</h1>
          <div className="flex items-center gap-3">
            <AnimatePresence mode="wait">
              {saveStatus === 'success' && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-1.5 text-xs text-emerald-400">
                  <CheckCircle size={13} /> Saved
                </motion.span>
              )}
              {saveStatus === 'error' && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-1.5 text-xs text-red-400">
                  <AlertCircle size={13} /> Failed
                </motion.span>
              )}
            </AnimatePresence>
            <button
              onClick={save}
              disabled={saving}
              className="flex items-center gap-2 bg-gold text-[oklch(0.09_0.008_80)] font-semibold text-sm px-5 py-2 rounded-lg hover:bg-gold-light transition-all disabled:opacity-60"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              Save
            </button>
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 overflow-y-auto px-6 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-3xl mx-auto flex flex-col gap-8"
            >
              {/* ---- BRAND ---- */}
              {activeSection === 'brand' && (
                <div className="flex flex-col gap-6">
                  <Field
                    label="Brand Name"
                    value={content.brand.name}
                    placeholder="Swifty Agency"
                    onChange={(v) => updateContent('brand', { ...content.brand, name: v })}
                  />
                  <Field
                    label="Highlighted Text"
                    value={content.brand.highlight}
                    placeholder="Swifty"
                    onChange={(v) => updateContent('brand', { ...content.brand, highlight: v })}
                  />
                  <div className="border border-border rounded-xl p-5 bg-card">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Preview</p>
                    <BrandWordmark brand={content.brand} className="text-2xl" />
                  </div>
                </div>
              )}

              {/* ---- HERO ---- */}
              {activeSection === 'hero' && (
                <div className="flex flex-col gap-6">
                  <BilingualField label="Headline" value={content.hero.headline}
                    onChange={(v) => updateContent('hero', { ...content.hero, headline: v })} />
                  <BilingualField label="Subheading" value={content.hero.subheading} multiline
                    onChange={(v) => updateContent('hero', { ...content.hero, subheading: v })} />
                  <div>
                    <Field label="Background Image URL" value={content.hero.backgroundImage}
                      placeholder="https://..."
                      onChange={(v) => updateContent('hero', { ...content.hero, backgroundImage: v })} />
                    <ImagePreview src={content.hero.backgroundImage} />
                  </div>
                  <BilingualField label="CTA Button Text" value={content.hero.ctaText}
                    onChange={(v) => updateContent('hero', { ...content.hero, ctaText: v })} />
                  <Field label="CTA Link (WhatsApp or URL)" value={content.hero.ctaLink}
                    placeholder="https://wa.me/..."
                    onChange={(v) => updateContent('hero', { ...content.hero, ctaLink: v })} />
                </div>
              )}

              {/* ---- BENEFITS ---- */}
              {activeSection === 'benefits' && (
                <div className="flex flex-col gap-6">
                  {content.benefits.map((b, i) => (
                    <div key={b.id} className="border border-border rounded-xl p-5 flex flex-col gap-4 bg-card">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-gold uppercase tracking-widest">Benefit {i + 1}</span>
                        <button
                          onClick={() => updateContent('benefits', content.benefits.filter((_, idx) => idx !== i))}
                          className="text-muted-foreground hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div>
                        <Field label="Icon URL" value={b.icon} placeholder="https://..."
                          onChange={(v) => {
                            const updated = [...content.benefits];
                            updated[i] = { ...b, icon: v };
                            updateContent('benefits', updated);
                          }} />
                        {b.icon && (
                          <img src={b.icon} alt="" className="mt-2 h-8 w-8 object-contain"
                            style={{ filter: 'invert(1)' }}
                            onError={(e) => ((e.target as HTMLElement).style.display = 'none')} />
                        )}
                      </div>
                      <BilingualField label="Heading" value={b.heading}
                        onChange={(v) => {
                          const updated = [...content.benefits];
                          updated[i] = { ...b, heading: v };
                          updateContent('benefits', updated);
                        }} />
                      <BilingualField label="Body Text" value={b.text} multiline
                        onChange={(v) => {
                          const updated = [...content.benefits];
                          updated[i] = { ...b, text: v };
                          updateContent('benefits', updated);
                        }} />
                    </div>
                  ))}
                  <button
                    onClick={() => updateContent('benefits', [...content.benefits, {
                      id: `b${Date.now()}`, icon: '', heading: { en: '', my: '' }, text: { en: '', my: '' }
                    }])}
                    className="flex items-center gap-2 text-sm text-gold border border-gold/30 rounded-xl px-4 py-3 hover:bg-gold/5 transition-all"
                  >
                    <Plus size={14} /> Add Benefit
                  </button>
                </div>
              )}

              {/* ---- COMPANY ---- */}
              {activeSection === 'company' && (
                <div className="flex flex-col gap-6">
                  <div>
                    <Field label="Team Image URL" value={content.company.teamImage} placeholder="https://..."
                      onChange={(v) => updateContent('company', { ...content.company, teamImage: v })} />
                    <ImagePreview src={content.company.teamImage} />
                  </div>
                  <BilingualField label="Heading" value={content.company.heading}
                    onChange={(v) => updateContent('company', { ...content.company, heading: v })} />
                  <BilingualField label="Body Text" value={content.company.text} multiline
                    onChange={(v) => updateContent('company', { ...content.company, text: v })} />
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Stat Number" value={content.company.stat}
                      onChange={(v) => updateContent('company', { ...content.company, stat: v })} />
                    <BilingualField label="Stat Label" value={content.company.statLabel}
                      onChange={(v) => updateContent('company', { ...content.company, statLabel: v })} />
                  </div>

                  <div className="border border-border rounded-xl p-5 bg-card">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">Client Logos</p>
                    <div className="flex flex-col gap-3">
                      {content.company.logos.map((logo, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="flex-1 grid grid-cols-2 gap-2">
                            <input type="text" value={logo.src} placeholder="Image URL"
                              onChange={(e) => {
                                const logos = [...content.company.logos];
                                logos[i] = { ...logo, src: e.target.value };
                                updateContent('company', { ...content.company, logos });
                              }}
                              className="bg-[oklch(0.12_0.008_80)] border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-gold/50 transition-colors" />
                            <input type="text" value={logo.alt} placeholder="Brand name"
                              onChange={(e) => {
                                const logos = [...content.company.logos];
                                logos[i] = { ...logo, alt: e.target.value };
                                updateContent('company', { ...content.company, logos });
                              }}
                              className="bg-[oklch(0.12_0.008_80)] border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-gold/50 transition-colors" />
                          </div>
                          <button onClick={() => updateContent('company', { ...content.company, logos: content.company.logos.filter((_, idx) => idx !== i) })}
                            className="text-muted-foreground hover:text-red-400 transition-colors shrink-0">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => updateContent('company', { ...content.company, logos: [...content.company.logos, { src: '', alt: '' }] })}
                        className="flex items-center gap-2 text-xs text-gold border border-gold/20 rounded-lg px-3 py-2 hover:bg-gold/5 transition-all mt-1"
                      >
                        <Plus size={12} /> Add Logo
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ---- PRICING ---- */}
              {activeSection === 'pricing' && (
                <div className="flex flex-col gap-6">
                  {content.pricing.map((pkg, i) => (
                    <div key={pkg.id} className={`border rounded-xl p-5 flex flex-col gap-4 ${pkg.featured ? 'border-gold/40 bg-gold/5' : 'border-border bg-card'}`}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-gold uppercase tracking-widest">Package {i + 1}</span>
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                            <input type="checkbox" checked={pkg.featured}
                              onChange={(e) => {
                                const updated = [...content.pricing];
                                updated[i] = { ...pkg, featured: e.target.checked };
                                updateContent('pricing', updated);
                              }}
                              className="accent-[oklch(0.76_0.12_85)]" />
                            Featured
                          </label>
                          <button onClick={() => updateContent('pricing', content.pricing.filter((_, idx) => idx !== i))}
                            className="text-muted-foreground hover:text-red-400 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <BilingualField label="Package Name" value={pkg.name}
                        onChange={(v) => { const u = [...content.pricing]; u[i] = { ...pkg, name: v }; updateContent('pricing', u); }} />
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Price" value={pkg.price} placeholder="RM 2,000"
                          onChange={(v) => { const u = [...content.pricing]; u[i] = { ...pkg, price: v }; updateContent('pricing', u); }} />
                        <Field label="Original Price" value={pkg.originalPrice} placeholder="RM 5,000"
                          onChange={(v) => { const u = [...content.pricing]; u[i] = { ...pkg, originalPrice: v }; updateContent('pricing', u); }} />
                      </div>
                      <Field label="WhatsApp / CTA Link" value={pkg.ctaLink} placeholder="https://wa.me/..."
                        onChange={(v) => { const u = [...content.pricing]; u[i] = { ...pkg, ctaLink: v }; updateContent('pricing', u); }} />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {(['en', 'my'] as Lang[]).map((lang) => (
                          <div key={lang}>
                            <p className="text-xs text-muted-foreground/50 font-mono mb-2">{lang.toUpperCase()} Features</p>
                            <div className="flex flex-col gap-2">
                              {pkg.features[lang].map((f, fi) => (
                                <div key={fi} className="flex items-center gap-2">
                                  <input type="text" value={f}
                                    onChange={(e) => {
                                      const u = [...content.pricing];
                                      const features = { ...pkg.features };
                                      features[lang] = [...features[lang]];
                                      features[lang][fi] = e.target.value;
                                      u[i] = { ...pkg, features };
                                      updateContent('pricing', u);
                                    }}
                                    className="flex-1 bg-[oklch(0.12_0.008_80)] border border-border rounded-lg px-3 py-1.5 text-sm text-foreground focus:outline-none focus:border-gold/50 transition-colors" />
                                  <button onClick={() => {
                                    const u = [...content.pricing];
                                    const features = { ...pkg.features };
                                    features[lang] = features[lang].filter((_, idx) => idx !== fi);
                                    u[i] = { ...pkg, features };
                                    updateContent('pricing', u);
                                  }} className="text-muted-foreground hover:text-red-400 transition-colors">
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              ))}
                              <button onClick={() => {
                                const u = [...content.pricing];
                                const features = { ...pkg.features };
                                features[lang] = [...features[lang], ''];
                                u[i] = { ...pkg, features };
                                updateContent('pricing', u);
                              }} className="flex items-center gap-1.5 text-xs text-gold/70 hover:text-gold transition-colors">
                                <Plus size={12} /> Add feature
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <button onClick={() => updateContent('pricing', [...content.pricing, {
                    id: `p${Date.now()}`, name: { en: '', my: '' }, price: '', originalPrice: '',
                    features: { en: [], my: [] }, ctaLink: '', featured: false
                  }])}
                    className="flex items-center gap-2 text-sm text-gold border border-gold/30 rounded-xl px-4 py-3 hover:bg-gold/5 transition-all">
                    <Plus size={14} /> Add Package
                  </button>
                </div>
              )}

              {/* ---- PORTFOLIO ---- */}
              {activeSection === 'portfolio' && (
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {content.portfolio.map((item, i) => (
                      <div key={item.id} className="border border-border rounded-xl p-4 bg-card flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-gold">Item {i + 1}</span>
                          <button onClick={() => updateContent('portfolio', content.portfolio.filter((_, idx) => idx !== i))}
                            className="text-muted-foreground hover:text-red-400 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <div>
                          <Field label="Thumbnail Image URL" value={item.thumbnail} placeholder="https://..."
                            onChange={(v) => { const u = [...content.portfolio]; u[i] = { ...item, thumbnail: v }; updateContent('portfolio', u); }} />
                          <ImagePreview src={item.thumbnail} />
                        </div>
                        <div className="flex flex-col gap-2">
                          <Field label="Video / Link URL" value={item.videoLink} placeholder="https://tiktok.com/@user/video/..."
                            onChange={(v) => {
                              const u = [...content.portfolio];
                              u[i] = { ...item, videoLink: v };
                              updateContent('portfolio', u);
                              scheduleTikTokThumbnailFetch(item.id, v);
                            }} />
                          <div className="flex flex-wrap items-center gap-3">
                            <button
                              onClick={() => fetchTikTokThumbnail(item.id, item.videoLink)}
                              disabled={thumbnailLoadingId === item.id || !item.videoLink}
                              className="inline-flex items-center gap-2 self-start rounded-lg border border-gold/25 px-3 py-2 text-xs font-semibold text-gold transition-all hover:bg-gold/5 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {thumbnailLoadingId === item.id ? (
                                <Loader2 size={12} className="animate-spin" />
                              ) : (
                                <RefreshCw size={12} />
                              )}
                              Fetch TikTok thumbnail
                            </button>
                            {thumbnailErrorId === item.id && (
                              <span className="text-xs text-red-400">Could not fetch thumbnail. Check the TikTok URL.</span>
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <Field label="Views" value={item.views} placeholder="1.2M views"
                            onChange={(v) => { const u = [...content.portfolio]; u[i] = { ...item, views: v }; updateContent('portfolio', u); }} />
                          <Field label="Likes" value={item.likes} placeholder="84K likes"
                            onChange={(v) => { const u = [...content.portfolio]; u[i] = { ...item, likes: v }; updateContent('portfolio', u); }} />
                        </div>
                        <BilingualField label="Title" value={item.title}
                          onChange={(v) => { const u = [...content.portfolio]; u[i] = { ...item, title: v }; updateContent('portfolio', u); }} />
                      </div>
                    ))}
                  </div>
                  <button onClick={() => updateContent('portfolio', [...content.portfolio, {
                    id: `pf${Date.now()}`, thumbnail: '', videoLink: '', views: '', likes: '', title: { en: '', my: '' }
                  }])}
                    className="flex items-center gap-2 text-sm text-gold border border-gold/30 rounded-xl px-4 py-3 hover:bg-gold/5 transition-all">
                    <Plus size={14} /> Add Portfolio Item
                  </button>
                </div>
              )}

              {/* ---- FAQ ---- */}
              {activeSection === 'faq' && (
                <div className="flex flex-col gap-4">
                  {content.faq.map((item, i) => (
                    <div key={item.id} className="border border-border rounded-xl p-5 bg-card flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-gold uppercase tracking-widest">Q{i + 1}</span>
                        <button onClick={() => updateContent('faq', content.faq.filter((_, idx) => idx !== i))}
                          className="text-muted-foreground hover:text-red-400 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <BilingualField label="Question" value={item.question}
                        onChange={(v) => { const u = [...content.faq]; u[i] = { ...item, question: v }; updateContent('faq', u); }} />
                      <BilingualField label="Answer" value={item.answer} multiline
                        onChange={(v) => { const u = [...content.faq]; u[i] = { ...item, answer: v }; updateContent('faq', u); }} />
                    </div>
                  ))}
                  <button onClick={() => updateContent('faq', [...content.faq, {
                    id: `faq${Date.now()}`, question: { en: '', my: '' }, answer: { en: '', my: '' }
                  }])}
                    className="flex items-center gap-2 text-sm text-gold border border-gold/30 rounded-xl px-4 py-3 hover:bg-gold/5 transition-all">
                    <Plus size={14} /> Add FAQ
                  </button>
                </div>
              )}

              {/* ---- FOOTER ---- */}
              {activeSection === 'footer' && (
                <div className="flex flex-col gap-6">
                  <BilingualField label="Footer Description" value={content.footer.text} multiline
                    onChange={(v) => updateContent('footer', { ...content.footer, text: v })} />
                  <Field label="Address" value={content.footer.address}
                    onChange={(v) => updateContent('footer', { ...content.footer, address: v })} />
                  <Field label="Copyright Text" value={content.footer.copyright}
                    onChange={(v) => updateContent('footer', { ...content.footer, copyright: v })} />

                  <div className="border border-border rounded-xl p-5 bg-card flex flex-col gap-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Social Links</p>
                    {(['twitter', 'facebook', 'instagram', 'tiktok'] as const).map((platform) => (
                      <Field key={platform} label={platform.charAt(0).toUpperCase() + platform.slice(1)}
                        value={content.footer.social[platform]}
                        placeholder={`https://${platform}.com/...`}
                        onChange={(v) => updateContent('footer', { ...content.footer, social: { ...content.footer.social, [platform]: v } })} />
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
