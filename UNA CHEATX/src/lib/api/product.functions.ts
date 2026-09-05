import { supabase } from "@/intergrations/supabase/client";
import { type Product } from "@/lib/products";

export type ProductPayload = {
  name: string;
  tag?: string;
  tagline?: string;
  badge?: string;
  price_label?: string;
  price: string;
  credits?: number;
  accent?: string;
  features?: string[];
  notes?: string[];
  tiers?: Array<{ label: string; price: string }>;
  scanner_url?: string;
  image_url?: string;
  sort_order?: number;
};

const unwrapData = <T>(data: T | { data: T }): T => {
  if (typeof data === "object" && data !== null && "data" in data) {
    return (data as { data: T }).data;
  }
  return data as T;
};

/**
 * Universally create a product directly in the Supabase database.
 * Syncs immediately across Phone, PC, and all visitors.
 */
export async function createProduct(input: ProductPayload | { data: ProductPayload }) {
  try {
    const payload = unwrapData(input);

    if (!payload.name || !payload.name.trim()) {
      throw new Error("Product name is required");
    }
    if (!payload.price || !payload.price.trim()) {
      throw new Error("Product price is required");
    }

    const cleanPayload = {
      name: payload.name.trim(),
      tag: payload.tag || "",
      tagline: payload.tagline || "",
      badge: payload.badge || "",
      price_label: payload.price_label || "Lifetime",
      price: payload.price.trim(),
      credits: Number(payload.credits) || 0,
      accent: payload.accent || "violet",
      features: Array.isArray(payload.features) ? payload.features : [],
      notes: Array.isArray(payload.notes) ? payload.notes : [],
      tiers: Array.isArray(payload.tiers) ? payload.tiers : [],
      scanner_url: payload.scanner_url || "",
      image_url: payload.image_url || "",
      sort_order: Number(payload.sort_order) || 99,
    };

    const { data: result, error } = await supabase
      .from("products")
      .insert([cleanPayload])
      .select()
      .single();

    if (error) {
      console.error("[Product] Supabase insert error:", error);
      throw new Error(error.message || "Failed to create product in database");
    }

    return { success: true, data: result as unknown as Product };
  } catch (error) {
    console.error("[Product] Create error:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
}

/**
 * Universally update an existing product directly in Supabase.
 */
export async function updateProduct(
  input:
    | { id: string; payload: Partial<ProductPayload> }
    | { data: { id: string; payload: Partial<ProductPayload> } }
) {
  try {
    const normalized = unwrapData(input);
    const { id, payload } = normalized;

    if (!id) {
      throw new Error("Product ID is required for update");
    }

    const cleanUpdates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (payload.name !== undefined) cleanUpdates.name = payload.name;
    if (payload.tag !== undefined) cleanUpdates.tag = payload.tag;
    if (payload.tagline !== undefined) cleanUpdates.tagline = payload.tagline;
    if (payload.badge !== undefined) cleanUpdates.badge = payload.badge;
    if (payload.price_label !== undefined) cleanUpdates.price_label = payload.price_label;
    if (payload.price !== undefined) cleanUpdates.price = payload.price;
    if (payload.credits !== undefined) cleanUpdates.credits = Number(payload.credits) || 0;
    if (payload.accent !== undefined) cleanUpdates.accent = payload.accent;
    if (payload.features !== undefined) cleanUpdates.features = payload.features;
    if (payload.notes !== undefined) cleanUpdates.notes = payload.notes;
    if (payload.tiers !== undefined) cleanUpdates.tiers = payload.tiers;
    if (payload.scanner_url !== undefined) cleanUpdates.scanner_url = payload.scanner_url;
    if (payload.image_url !== undefined) cleanUpdates.image_url = payload.image_url;
    if (payload.sort_order !== undefined) cleanUpdates.sort_order = Number(payload.sort_order) || 0;

    const { data: result, error } = await supabase
      .from("products")
      .update(cleanUpdates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[Product] Supabase update error:", error);
      throw new Error(error.message || "Failed to update product in database");
    }

    return { success: true, data: result as unknown as Product };
  } catch (error) {
    console.error("[Product] Update error:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
}

/**
 * Universally delete a product directly in Supabase.
 */
export async function deleteProduct(input: { id: string } | { data: { id: string } }) {
  try {
    const normalized = unwrapData(input);
    const { id } = normalized;

    if (!id) {
      throw new Error("Product ID is required for deletion");
    }

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      console.error("[Product] Supabase delete error:", error);
      throw new Error(error.message || "Failed to delete product in database");
    }

    return { success: true };
  } catch (error) {
    console.error("[Product] Delete error:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
}
