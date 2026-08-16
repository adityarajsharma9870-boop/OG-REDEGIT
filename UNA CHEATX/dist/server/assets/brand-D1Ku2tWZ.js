import { s as supabase } from "./router-uDuRmyto.js";
const STORAGE_KEY = "una_products_local";
function getLocalProducts() {
  if (typeof window === "undefined" || !window.localStorage) {
    return [];
  }
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("[Products] Failed to read local storage:", error);
    return [];
  }
}
function saveLocalProducts(products) {
  if (typeof window === "undefined" || !window.localStorage) {
    return;
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (error) {
    console.error("[Products] Failed to save to local storage:", error);
  }
}
function createLocalProduct(product) {
  const newProduct = {
    ...product,
    id: `local_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    image_url: product.image_url || ""
  };
  const products = getLocalProducts();
  const nextProducts = [...products, newProduct];
  saveLocalProducts(nextProducts);
  return newProduct;
}
function updateLocalProduct(id, updates) {
  const products = getLocalProducts();
  const index = products.findIndex((p) => p.id === id);
  const fallbackProduct = {
    id,
    name: "",
    tag: "",
    tagline: "",
    badge: "",
    price_label: "",
    price: "",
    credits: 0,
    accent: "violet",
    features: [],
    notes: [],
    tiers: [],
    image_url: "",
    scanner_url: "",
    sort_order: 99,
    ...index >= 0 ? products[index] : {}
  };
  const updated = { ...fallbackProduct, ...updates, id };
  const nextProducts = [...products];
  if (index === -1) {
    nextProducts.push(updated);
  } else {
    nextProducts[index] = updated;
  }
  saveLocalProducts(nextProducts);
  return updated;
}
function deleteLocalProduct(id) {
  const products = getLocalProducts();
  const filtered = products.filter((p) => p.id !== id);
  if (filtered.length === products.length) return false;
  saveLocalProducts(filtered);
  return true;
}
function syncLocalProductsToSupabase(supabaseProducts) {
  const local = getLocalProducts();
  if (local.length === 0) return supabaseProducts;
  const merged = [...supabaseProducts];
  for (const localProduct of local) {
    const index = merged.findIndex((p) => p.id === localProduct.id);
    if (index === -1) {
      merged.push(localProduct);
    } else {
      merged[index] = localProduct;
    }
  }
  return merged.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
}
const ACCENTS = ["violet", "magenta", "cyan", "gold", "grass"];
const accentClasses = {
  violet: { text: "text-violet", ring: "border-violet/40", btn: "bg-violet text-white", dot: "bg-violet", glow: "var(--violet)" },
  magenta: { text: "text-magenta", ring: "border-magenta/40", btn: "bg-magenta text-white", dot: "bg-magenta", glow: "var(--magenta)" },
  cyan: { text: "text-cyan", ring: "border-cyan/40", btn: "bg-cyan text-background", dot: "bg-cyan", glow: "var(--cyan)" },
  gold: { text: "text-gold", ring: "border-gold/40", btn: "bg-gold text-background", dot: "bg-gold", glow: "var(--gold)" },
  grass: { text: "text-grass", ring: "border-grass/40", btn: "bg-grass text-background", dot: "bg-grass", glow: "var(--grass)" }
};
function accentOf(name) {
  return accentClasses[name] ?? accentClasses.violet;
}
async function fetchProducts() {
  try {
    const { data, error } = await supabase.from("products").select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: true });
    if (error) {
      console.warn("[Products] Supabase fetch error, falling back to local:", error);
      return getLocalProducts();
    }
    const supabaseProducts = data ?? [];
    return syncLocalProductsToSupabase(supabaseProducts);
  } catch (error) {
    console.error("[Products] Fetch error:", error);
    return getLocalProducts();
  }
}
const BRAND_SETTINGS_KEY = "og_redegit_brand_settings";
const DEFAULT_BRAND_SETTINGS = {
  siteName: "OG REDEGIT",
  tagline: "PREMIUM PANEL · LIFETIME UPDATES",
  logoUrl: "",
  heroDescription: "AI Aimbot, ESP, UID Bypass & Optimizer. Stealth-focused architecture passed through 12+ challenge AC checks. Built for tournament players and live streamers.",
  stats: [
    { value: "10000+", label: "ACTIVE USERS" },
    { value: "500+", label: "CLIENTS" },
    { value: "100%", label: "MAIN ID SAFE" },
    { value: "24/7", label: "LIVE SUPPORT" }
  ],
  featureHighlights: [
    { icon: "shield", title: "Anti-Cheat Evasion", description: "HVCI, VBS, Hyper-V & PatchGuard-aware design." },
    { icon: "cpu", title: "Kernel Bypass", description: "Kernel memory protection bypass at the driver level." },
    { icon: "zap", title: "Instant Delivery", description: "Panel keys delivered the second your payment lands." },
    { icon: "lock", title: "Main ID Safe", description: "UID-based architecture protects your primary account." }
  ],
  faqSectionEyebrow: "SUPPORT",
  faqSectionTitle: "Frequently Asked",
  faqSectionHighlightedWord: "Asked",
  faqItems: [
    { question: "How fast is delivery?", answer: "Instant. You receive your panel within minutes of payment confirmation on Discord." },
    { question: "What happens after an AC update?", answer: "We push a patched build within 20–30 minutes of any official update — lifetime panels get it free." },
    { question: "Which emulators are supported?", answer: "All major emulators plus real devices. Single-click execution works everywhere." },
    { question: "Do I need to disable Windows security?", answer: "No. Our architecture is HVCI / VBS / Hyper-V aware and runs fully external." }
  ]
};
const loadBrandSettings = () => {
  if (typeof window === "undefined") return DEFAULT_BRAND_SETTINGS;
  try {
    const stored = window.localStorage.getItem(BRAND_SETTINGS_KEY);
    if (!stored) return DEFAULT_BRAND_SETTINGS;
    const parsed = JSON.parse(stored);
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
      faqItems: parsed.faqItems || DEFAULT_BRAND_SETTINGS.faqItems
    };
  } catch {
    return DEFAULT_BRAND_SETTINGS;
  }
};
const saveBrandSettings = (settings) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(BRAND_SETTINGS_KEY, JSON.stringify(settings));
};
export {
  ACCENTS as A,
  DEFAULT_BRAND_SETTINGS as D,
  accentOf as a,
  createLocalProduct as c,
  deleteLocalProduct as d,
  fetchProducts as f,
  loadBrandSettings as l,
  saveBrandSettings as s,
  updateLocalProduct as u
};
