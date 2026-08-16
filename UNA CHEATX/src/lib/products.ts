import { supabase } from "@/intergrations/supabase/client";
import { syncLocalProductsToSupabase, getLocalProducts } from "@/lib/api/product-local";

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

export async function fetchProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    
    if (error) {
      console.warn('[Products] Supabase fetch error, falling back to local:', error);
      return getLocalProducts();
    }
    
    const supabaseProducts = (data ?? []) as unknown as Product[];
    
    // Merge with local products
    return syncLocalProductsToSupabase(supabaseProducts);
  } catch (error) {
    console.error('[Products] Fetch error:', error);
    // Fall back to local storage
    return getLocalProducts();
  }
}
