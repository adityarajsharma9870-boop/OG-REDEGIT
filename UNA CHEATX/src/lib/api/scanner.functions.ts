import { supabase } from "@/intergrations/supabase/client";

/**
 * Direct client-side upload of payment scanner / QR images to Supabase Storage.
 * Stores files in the public "scanners" bucket and returns the public CDN URL.
 */
export async function uploadScannerImage(
  input:
    | File
    | { file: File }
    | { data: { fileName: string; contentType: string; base64: string } }
) {
  let fileBody: File | Blob;
  let originalName: string;
  let contentType: string;

  if (input instanceof File) {
    fileBody = input;
    originalName = input.name;
    contentType = input.type || "image/png";
  } else if ("file" in input) {
    fileBody = input.file;
    originalName = input.file.name;
    contentType = input.file.type || "image/png";
  } else {
    const { data } = input;
    originalName = data.fileName;
    contentType = data.contentType || "image/png";

    // Decode base64 to binary Blob
    const binary = atob(data.base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    fileBody = new Blob([bytes], { type: contentType });
  }

  const ext = originalName.split(".").pop() || "png";
  const uniqueName = `scanner_${Date.now()}_${Math.random().toString(36).slice(2, 9)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("scanners")
    .upload(uniqueName, fileBody, {
      contentType,
      upsert: true,
    });

  if (uploadError) {
    console.error("[Scanner] Storage upload error:", uploadError);
    throw new Error(`Failed to upload scanner image: ${uploadError.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from("scanners")
    .getPublicUrl(uniqueName);

  return { publicUrl: publicUrlData.publicUrl };
}
