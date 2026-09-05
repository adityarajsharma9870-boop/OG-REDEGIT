import { supabase } from "@/intergrations/supabase/client";

export type Tier = { label: string; price: string };

export type Product = {
  id: string;
  name: string;
  tag: string;
  tagline: string;
  badge: string;
  price_label: string;
  price: string;
  credits: number;
  accent: string;
  features: string[];
  notes: string[];
  tiers: Tier[];
  image_url: string;
  scanner_url: string;
  sort_order: number;
};

export const ACCENTS = ["violet", "magenta", "cyan", "gold", "grass"] as const;

export const accentClasses: Record<string, { text: string; ring: string; btn: string; dot: string; glow: string }> = {
  violet: { text: "text-violet", ring: "border-violet/40", btn: "bg-violet text-white", dot: "bg-violet", glow: "var(--violet)" },
  magenta: { text: "text-magenta", ring: "border-magenta/40", btn: "bg-magenta text-white", dot: "bg-magenta", glow: "var(--magenta)" },
  cyan: { text: "text-cyan", ring: "border-cyan/40", btn: "bg-cyan text-background", dot: "bg-cyan", glow: "var(--cyan)" },
  gold: { text: "text-gold", ring: "border-gold/40", btn: "bg-gold text-background", dot: "bg-gold", glow: "var(--gold)" },
  grass: { text: "text-grass", ring: "border-grass/40", btn: "bg-grass text-background", dot: "bg-grass", glow: "var(--grass)" },
};

export function accentOf(name: string) {
  return accentClasses[name] ?? accentClasses.violet;
}

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "default-ai-basic",
    name: "AI Module – Basic",
    tag: "UNDETECTABLE",
    tagline: "All-safe AI aimbot suite tuned for tournaments and live streamers.",
    badge: "MOST POPULAR",
    price_label: "Lifetime",
    price: "₹3,000 / $33",
    credits: 3000,
    accent: "gold",
    features: [
      "AimBot [Neck] – SAFE",
      "AimBot [Drag] – SAFE",
      "AimBot [Female Fixed]",
      "AI AimBot Externals",
      "Recall Control",
      "Change Aim Positions Instantly",
      "Chams Location",
      "Smoother Aim Assist",
      "Streamer Mode On/Off",
      "Works on any FF / FF Max APK",
    ],
    notes: ["Works on Win 11", "Instant delivery"],
    tiers: [
      { label: "1 DAY", price: "₹100 / $1.1" },
      { label: "3 DAYS", price: "₹150 / $1.7" },
      { label: "1 WEEK", price: "₹500 / $5.5" },
      { label: "1 MONTH", price: "₹1,000 / $11" },
      { label: "LIFETIME", price: "₹3,000 / $33" },
    ],
    image_url: "",
    scanner_url: "",
    sort_order: 1,
  },
  {
    id: "default-ai-premium",
    name: "AI Module – Premium",
    tag: "ADVANCED PANEL",
    tagline: "Stealth-focused architecture with HVCI, VBS & Hyper-V bypass built in.",
    badge: "ELITE",
    price_label: "Lifetime",
    price: "₹3,000 / $33",
    credits: 3000,
    accent: "magenta",
    features: [
      "Streamer ESP – OBS / DVR compatible",
      "Aimbot CPS [Female Fix]",
      "Aimbot Fair [Real Drag]",
      "Fully customizable settings",
      "Aimbot Head, Left Neck Drag, Chest/Shoulder targeting",
      "HVCI / VBS / Hyper-V Bypass",
      "Kernel Memory Protection Bypass",
      "PatchGuard-Aware Design",
      "All Anti-Cheat Bypassed",
    ],
    notes: ["Win 10 / Win 11 support", "Instant delivery"],
    tiers: [
      { label: "1 DAY", price: "₹300 / $3.3" },
      { label: "3 DAYS", price: "₹450 / $5" },
      { label: "1 WEEK", price: "₹1,000 / $11" },
      { label: "1 MONTH", price: "₹2,000 / $22" },
      { label: "LIFETIME", price: "₹3,000 / $33" },
    ],
    image_url: "",
    scanner_url: "",
    sort_order: 2,
  },
  {
    id: "default-premium-optimizer",
    name: "Premium Optimizer",
    tag: "SINGLE CLICK",
    tagline: "One click – stable FPS, smoother sensi, no more drops.",
    badge: "",
    price_label: "Lifetime",
    price: "₹500 / $5.5",
    credits: 500,
    accent: "cyan",
    features: [
      "Stable FPS – no drops",
      "Better sensi tuning",
      "Smoother gameplay",
      "Works in all emulators",
      "Single-click execution",
    ],
    notes: ["Instant delivery"],
    tiers: [
      { label: "1 DAY", price: "₹100 / $1.1" },
      { label: "1 WEEK", price: "₹300 / $3.3" },
      { label: "1 MONTH", price: "₹400 / $4.4" },
      { label: "LIFETIME", price: "₹500 / $5.5" },
    ],
    image_url: "",
    scanner_url: "",
    sort_order: 3,
  },
];

/**
 * Universally fetch products from Supabase database.
 * Falls back to built-in default products if database has no items or connection fails.
 */
export async function fetchProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      console.warn("[Products] Supabase fetch error, using default products:", error.message);
      return DEFAULT_PRODUCTS;
    }

    const products = (data ?? []) as unknown as Product[];
    return products.length > 0 ? products : DEFAULT_PRODUCTS;
  } catch (error) {
    console.error("[Products] Fetch exception:", error);
    return DEFAULT_PRODUCTS;
  }
}
