// Local product storage with Supabase sync fallback
import { type Product } from "@/lib/products";

const STORAGE_KEY = "una_products_local";

export function getLocalProducts(): Product[] {
  if (typeof window === "undefined" || !window.localStorage) {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('[Products] Failed to read local storage:', error);
    return [];
  }
}

export function saveLocalProducts(products: Product[]): void {
  if (typeof window === "undefined" || !window.localStorage) {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (error) {
    console.error('[Products] Failed to save to local storage:', error);
  }
}

export function createLocalProduct(product: Omit<Product, "id" | "created_at" | "updated_at">): Product {
  const newProduct: Product = {
    ...product,
    id: `local_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    image_url: product.image_url || "",
  } as Product;

  const products = getLocalProducts();
  const nextProducts = [...products, newProduct];
  saveLocalProducts(nextProducts);

  return newProduct;
}

export function updateLocalProduct(id: string, updates: Partial<Product>): Product | null {
  const products = getLocalProducts();
  const index = products.findIndex(p => p.id === id);

  const fallbackProduct: Product = {
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
    ...(index >= 0 ? products[index] : {}),
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

export function deleteLocalProduct(id: string): boolean {
  const products = getLocalProducts();
  const filtered = products.filter(p => p.id !== id);

  if (filtered.length === products.length) return false;

  saveLocalProducts(filtered);
  return true;
}

export function syncLocalProductsToSupabase(supabaseProducts: Product[]): Product[] {
  // Merge local products with Supabase products
  // Local products take precedence if IDs match
  const local = getLocalProducts();
  
  if (local.length === 0) return supabaseProducts;
  
  const merged = [...supabaseProducts];
  for (const localProduct of local) {
    const index = merged.findIndex(p => p.id === localProduct.id);
    if (index === -1) {
      merged.push(localProduct);
    } else {
      merged[index] = localProduct;
    }
  }
  
  return merged.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
}
