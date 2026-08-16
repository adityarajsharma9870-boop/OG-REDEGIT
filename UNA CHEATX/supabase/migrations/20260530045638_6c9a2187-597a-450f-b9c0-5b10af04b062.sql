-- Add scanner image column to products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS scanner_url text NOT NULL DEFAULT '';

-- Storage bucket for payment scanner / QR photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('scanners', 'scanners', true)
ON CONFLICT (id) DO NOTHING;

-- Anyone can view scanner images (public bucket)
CREATE POLICY "Scanner images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'scanners');

-- Admins can upload scanner images
CREATE POLICY "Admins can upload scanner images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'scanners' AND has_role(auth.uid(), 'admin'::app_role));

-- Admins can update scanner images
CREATE POLICY "Admins can update scanner images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'scanners' AND has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete scanner images
CREATE POLICY "Admins can delete scanner images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'scanners' AND has_role(auth.uid(), 'admin'::app_role));