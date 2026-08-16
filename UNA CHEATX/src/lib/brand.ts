export type BrandStatsItem = { value: string; label: string };
export type BrandFeatureHighlight = { icon: string; title: string; description: string };
export type BrandFaqItem = { question: string; answer: string };

export type BrandSettings = {
  siteName: string;
  tagline: string;
  logoUrl: string;
  heroDescription: string;
  stats: BrandStatsItem[];
  featureHighlights: BrandFeatureHighlight[];
  faqSectionEyebrow: string;
  faqSectionTitle: string;
  faqSectionHighlightedWord: string;
  faqItems: BrandFaqItem[];
};

export const BRAND_SETTINGS_KEY = "og_redegit_brand_settings";

export const DEFAULT_BRAND_SETTINGS: BrandSettings = {
  siteName: "OG REDEGIT",
  tagline: "PREMIUM PANEL · LIFETIME UPDATES",
  logoUrl: "",
  heroDescription: "AI Aimbot, ESP, UID Bypass & Optimizer. Stealth-focused architecture passed through 12+ challenge AC checks. Built for tournament players and live streamers.",
  stats: [
    { value: "10000+", label: "ACTIVE USERS" },
    { value: "500+", label: "CLIENTS" },
    { value: "100%", label: "MAIN ID SAFE" },
    { value: "24/7", label: "LIVE SUPPORT" },
  ],
  featureHighlights: [
    { icon: "shield", title: "Anti-Cheat Evasion", description: "HVCI, VBS, Hyper-V & PatchGuard-aware design." },
    { icon: "cpu", title: "Kernel Bypass", description: "Kernel memory protection bypass at the driver level." },
    { icon: "zap", title: "Instant Delivery", description: "Panel keys delivered the second your payment lands." },
    { icon: "lock", title: "Main ID Safe", description: "UID-based architecture protects your primary account." },
  ],
  faqSectionEyebrow: "SUPPORT",
  faqSectionTitle: "Frequently Asked",
  faqSectionHighlightedWord: "Asked",
  faqItems: [
    { question: "How fast is delivery?", answer: "Instant. You receive your panel within minutes of payment confirmation on Discord." },
    { question: "What happens after an AC update?", answer: "We push a patched build within 20–30 minutes of any official update — lifetime panels get it free." },
    { question: "Which emulators are supported?", answer: "All major emulators plus real devices. Single-click execution works everywhere." },
    { question: "Do I need to disable Windows security?", answer: "No. Our architecture is HVCI / VBS / Hyper-V aware and runs fully external." },
  ],
};

export const loadBrandSettings = (): BrandSettings => {
  if (typeof window === "undefined") return DEFAULT_BRAND_SETTINGS;

  try {
    const stored = window.localStorage.getItem(BRAND_SETTINGS_KEY);
    if (!stored) return DEFAULT_BRAND_SETTINGS;
    const parsed = JSON.parse(stored) as Partial<BrandSettings>;
    return {
      siteName: parsed.siteName || DEFAULT_BRAND_SETTINGS.siteName,
      tagline: parsed.tagline || DEFAULT_BRAND_SETTINGS.tagline,
      logoUrl: parsed.logoUrl || DEFAULT_BRAND_SETTINGS.logoUrl,
      heroDescription: parsed.heroDescription || DEFAULT_BRAND_SETTINGS.heroDescription,
      stats: parsed.stats || DEFAULT_BRAND_SETTINGS.stats,
      featureHighlights: parsed.featureHighlights || DEFAULT_BRAND_SETTINGS.featureHighlights,
      faqSectionEyebrow: parsed.faqSectionEyebrow || DEFAULT_BRAND_SETTINGS.faqSectionEyebrow,
      faqSectionTitle: parsed.faqSectionTitle || DEFAULT_BRAND_SETTINGS.faqSectionTitle,
      faqSectionHighlightedWord: parsed.faqSectionHighlightedWord || DEFAULT_BRAND_SETTINGS.faqSectionHighlightedWord,
      faqItems: parsed.faqItems || DEFAULT_BRAND_SETTINGS.faqItems,
    };
  } catch {
    return DEFAULT_BRAND_SETTINGS;
  }
};

export const saveBrandSettings = (settings: BrandSettings) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(BRAND_SETTINGS_KEY, JSON.stringify(settings));
};
