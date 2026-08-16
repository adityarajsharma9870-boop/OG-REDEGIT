import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const productPayloadSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  tag: z.string().default(""),
  tagline: z.string().default(""),
  badge: z.string().default(""),
  price_label: z.string().default(""),
  price: z.string().min(1, "Price is required"),
  credits: z.number().default(0),
  accent: z.string().default("violet"),
  features: z.array(z.string()).default([]),
  notes: z.array(z.string()).default([]),
  tiers: z.array(z.object({ label: z.string(), price: z.string() })).default([]),
  scanner_url: z.string().default(""),
  sort_order: z.number().default(99),
}).strict();

const createProductInput = z.union([
  productPayloadSchema,
  z.object({ data: productPayloadSchema }),
]);

const updateProductInput = z.union([
  z.object({ id: z.string().min(1), payload: productPayloadSchema.partial() }),
  z.object({ data: z.object({ id: z.string().min(1), payload: productPayloadSchema.partial() }) }),
]);

const deleteProductInput = z.union([
  z.object({ id: z.string().min(1) }),
  z.object({ data: z.object({ id: z.string().min(1) }) }),
]);

const unwrapData = <T>(data: T | { data: T }): T => {
  if (typeof data === "object" && data !== null && "data" in data) {
    return (data as { data: T }).data;
  }
  return data as T;
};

export const createProduct = createServerFn({ method: "POST" })
  .inputValidator(createProductInput)
  .handler(async ({ data }) => {
    try {
      const payload = unwrapData(data);
      
      // Validate payload
      if (!payload.name || !payload.price) {
        throw new Error("Product name and price are required");
      }

      try {
        const { supabaseAdmin } = await import("@/intergrations/supabase/client.server");
        const { data: result, error } = await supabaseAdmin.from("products").insert(payload).select();
        
        if (error) {
          console.error("[Product] Supabase insert error:", error);
          throw new Error(`Database error: ${error.message}`);
        }
        
        return { success: true, data: result?.[0] };
      } catch (supabaseError) {
        console.error("[Product] Supabase error:", supabaseError);
        throw new Error(`Failed to save product to database: ${supabaseError instanceof Error ? supabaseError.message : "Unknown error"}`);
      }
    } catch (error) {
      console.error("[Product] Create error:", error);
      throw error instanceof Error ? error : new Error(String(error));
    }
  });

export const updateProduct = createServerFn({ method: "POST" })
  .inputValidator(updateProductInput)
  .handler(async ({ data }) => {
    try {
      const normalized = unwrapData(data);
      const { id, payload } = normalized;
      
      if (!id) throw new Error("Product ID is required");

      try {
        const { supabaseAdmin } = await import("@/intergrations/supabase/client.server");
        const { data: result, error } = await supabaseAdmin.from("products").update(payload).eq("id", id).select();
        
        if (error) {
          console.error("[Product] Supabase update error:", error);
          throw new Error(`Database error: ${error.message}`);
        }
        
        return { success: true, data: result?.[0] };
      } catch (supabaseError) {
        console.error("[Product] Supabase error:", supabaseError);
        throw new Error(`Failed to update product: ${supabaseError instanceof Error ? supabaseError.message : "Unknown error"}`);
      }
    } catch (error) {
      console.error("[Product] Update error:", error);
      throw error instanceof Error ? error : new Error(String(error));
    }
  });

export const deleteProduct = createServerFn({ method: "POST" })
  .inputValidator(deleteProductInput)
  .handler(async ({ data }) => {
    try {
      const normalized = unwrapData(data);
      const { id } = normalized;
      
      if (!id) throw new Error("Product ID is required");

      try {
        const { supabaseAdmin } = await import("@/intergrations/supabase/client.server");
        const { error } = await supabaseAdmin.from("products").delete().eq("id", id);
        
        if (error) {
          console.error("[Product] Supabase delete error:", error);
          throw new Error(`Database error: ${error.message}`);
        }
        
        return { success: true };
      } catch (supabaseError) {
        console.error("[Product] Supabase error:", supabaseError);
        throw new Error(`Failed to delete product: ${supabaseError instanceof Error ? supabaseError.message : "Unknown error"}`);
      }
    } catch (error) {
      console.error("[Product] Delete error:", error);
      throw error instanceof Error ? error : new Error(String(error));
    }
  });
