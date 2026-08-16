import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const uploadScannerImage = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      fileName: z.string().min(1),
      contentType: z.string().min(1),
      base64: z.string().min(1),
    }),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/intergrations/supabase/client.server");
    const { randomUUID } = await import("crypto");
    const fileBuffer = Buffer.from(data.base64, "base64");
    const ext = data.fileName.split(".").pop() || "png";
    const path = `${randomUUID()}.${ext}`;

    const { error } = await supabaseAdmin.storage.from("scanners").upload(path, fileBuffer, {
      contentType: data.contentType,
      upsert: true,
    });

    if (error) {
      throw new Error(error.message || "Failed to upload scanner image.");
    }

    const { data: result } = supabaseAdmin.storage.from("scanners").getPublicUrl(path);
    return { publicUrl: result.publicUrl };
  });
