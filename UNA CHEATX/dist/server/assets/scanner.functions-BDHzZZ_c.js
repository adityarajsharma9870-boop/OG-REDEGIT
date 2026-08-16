import { c as createServerRpc } from "./createServerRpc-Dp8p6m2G.js";
import { a as createServerFn } from "./server-DFBiH7bP.js";
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
const uploadScannerImage_createServerFn_handler = createServerRpc({
  id: "b3cb49f8aeff22e6afa32f8cd54a0000a6b65a2328f41b890e6c2ce7970b4be6",
  name: "uploadScannerImage",
  filename: "src/lib/api/scanner.functions.ts"
}, (opts) => uploadScannerImage.__executeServer(opts));
const uploadScannerImage = createServerFn({
  method: "POST"
}).inputValidator(z.object({
  fileName: z.string().min(1),
  contentType: z.string().min(1),
  base64: z.string().min(1)
})).handler(uploadScannerImage_createServerFn_handler, async ({
  data
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-CnTaJoSD.js");
  const {
    randomUUID
  } = await import("crypto");
  const fileBuffer = Buffer.from(data.base64, "base64");
  const ext = data.fileName.split(".").pop() || "png";
  const path = `${randomUUID()}.${ext}`;
  const {
    error
  } = await supabaseAdmin.storage.from("scanners").upload(path, fileBuffer, {
    contentType: data.contentType,
    upsert: true
  });
  if (error) {
    throw new Error(error.message || "Failed to upload scanner image.");
  }
  const {
    data: result
  } = supabaseAdmin.storage.from("scanners").getPublicUrl(path);
  return {
    publicUrl: result.publicUrl
  };
});
export {
  uploadScannerImage_createServerFn_handler
};
