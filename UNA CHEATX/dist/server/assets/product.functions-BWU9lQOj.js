import { c as createServerRpc } from "./createServerRpc-C3Nor9Cl.js";
import { a as createServerFn } from "./server-oUqY8gDK.js";
import { z } from "zod";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "seroval";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "react";
import "@tanstack/react-router";
import "react/jsx-runtime";
import "@tanstack/react-router/ssr/server";
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
  tiers: z.array(z.object({
    label: z.string(),
    price: z.string()
  })).default([]),
  scanner_url: z.string().default(""),
  sort_order: z.number().default(99)
}).strict();
const createProductInput = z.union([productPayloadSchema, z.object({
  data: productPayloadSchema
})]);
const updateProductInput = z.union([z.object({
  id: z.string().min(1),
  payload: productPayloadSchema.partial()
}), z.object({
  data: z.object({
    id: z.string().min(1),
    payload: productPayloadSchema.partial()
  })
})]);
const deleteProductInput = z.union([z.object({
  id: z.string().min(1)
}), z.object({
  data: z.object({
    id: z.string().min(1)
  })
})]);
const unwrapData = (data) => {
  if (typeof data === "object" && data !== null && "data" in data) {
    return data.data;
  }
  return data;
};
const createProduct_createServerFn_handler = createServerRpc({
  id: "44fd00a102131b500ed02f43bb7e9a42a6ee826507a0c18467e08f2fabd746ac",
  name: "createProduct",
  filename: "src/lib/api/product.functions.ts"
}, (opts) => createProduct.__executeServer(opts));
const createProduct = createServerFn({
  method: "POST"
}).inputValidator(createProductInput).handler(createProduct_createServerFn_handler, async ({
  data
}) => {
  try {
    const payload = unwrapData(data);
    if (!payload.name || !payload.price) {
      throw new Error("Product name and price are required");
    }
    try {
      const {
        supabaseAdmin
      } = await import("./client.server-CnTaJoSD.js");
      const {
        data: result,
        error
      } = await supabaseAdmin.from("products").insert(payload).select();
      if (error) {
        console.error("[Product] Supabase insert error:", error);
        throw new Error(`Database error: ${error.message}`);
      }
      return {
        success: true,
        data: result?.[0]
      };
    } catch (supabaseError) {
      console.error("[Product] Supabase error:", supabaseError);
      throw new Error(`Failed to save product to database: ${supabaseError instanceof Error ? supabaseError.message : "Unknown error"}`);
    }
  } catch (error) {
    console.error("[Product] Create error:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
});
const updateProduct_createServerFn_handler = createServerRpc({
  id: "31346170704f8ba412fe0f8c5ba3a0194309320623f98c37727162827577c918",
  name: "updateProduct",
  filename: "src/lib/api/product.functions.ts"
}, (opts) => updateProduct.__executeServer(opts));
const updateProduct = createServerFn({
  method: "POST"
}).inputValidator(updateProductInput).handler(updateProduct_createServerFn_handler, async ({
  data
}) => {
  try {
    const normalized = unwrapData(data);
    const {
      id,
      payload
    } = normalized;
    if (!id) throw new Error("Product ID is required");
    try {
      const {
        supabaseAdmin
      } = await import("./client.server-CnTaJoSD.js");
      const {
        data: result,
        error
      } = await supabaseAdmin.from("products").update(payload).eq("id", id).select();
      if (error) {
        console.error("[Product] Supabase update error:", error);
        throw new Error(`Database error: ${error.message}`);
      }
      return {
        success: true,
        data: result?.[0]
      };
    } catch (supabaseError) {
      console.error("[Product] Supabase error:", supabaseError);
      throw new Error(`Failed to update product: ${supabaseError instanceof Error ? supabaseError.message : "Unknown error"}`);
    }
  } catch (error) {
    console.error("[Product] Update error:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
});
const deleteProduct_createServerFn_handler = createServerRpc({
  id: "215f16a3e22d771b84486f221661bd7f828b61d801022f7cdd19659138e0f166",
  name: "deleteProduct",
  filename: "src/lib/api/product.functions.ts"
}, (opts) => deleteProduct.__executeServer(opts));
const deleteProduct = createServerFn({
  method: "POST"
}).inputValidator(deleteProductInput).handler(deleteProduct_createServerFn_handler, async ({
  data
}) => {
  try {
    const normalized = unwrapData(data);
    const {
      id
    } = normalized;
    if (!id) throw new Error("Product ID is required");
    try {
      const {
        supabaseAdmin
      } = await import("./client.server-CnTaJoSD.js");
      const {
        error
      } = await supabaseAdmin.from("products").delete().eq("id", id);
      if (error) {
        console.error("[Product] Supabase delete error:", error);
        throw new Error(`Database error: ${error.message}`);
      }
      return {
        success: true
      };
    } catch (supabaseError) {
      console.error("[Product] Supabase error:", supabaseError);
      throw new Error(`Failed to delete product: ${supabaseError instanceof Error ? supabaseError.message : "Unknown error"}`);
    }
  } catch (error) {
    console.error("[Product] Delete error:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
});
export {
  createProduct_createServerFn_handler,
  deleteProduct_createServerFn_handler,
  updateProduct_createServerFn_handler
};
