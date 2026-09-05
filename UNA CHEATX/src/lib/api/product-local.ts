// Deprecated: Local product storage has been replaced by direct universal Supabase cloud storage.
// This file is retained only for backward compatibility.
import { type Product, DEFAULT_PRODUCTS } from "@/lib/products";

export function getLocalProducts(): Product[] {
  return [];
}

export function saveLocalProducts(_products: Product[]): void {
  // No-op: products are saved in universal Supabase database
}

export function createLocalProduct(product: Omit<Product, "id" | "created_at" | "updated_at">): Product {
  return {
    ...product,
    id: `temp_${Date.now()}`,
    image_url: product.image_url || "",
  } as Product;
}

export function updateLocalProduct(_id: string, _updates: Partial<Product>): Product | null {
  return null;
}

export function deleteLocalProduct(_id: string): boolean {
  return true;
}

export function syncLocalProductsToSupabase(supabaseProducts: Product[]): Product[] {
  return supabaseProducts && supabaseProducts.length > 0 ? supabaseProducts : DEFAULT_PRODUCTS;
}
