-- =========================================================
-- OG REDEGIT: 1-CLICK UNIVERSAL PRODUCT & SYNC SETUP SCRIPT
-- Paste this entire script into your Supabase SQL Editor and click RUN.
-- This creates the products table, realtime synchronization,
-- image storage bucket, and visitor counter.
-- =========================================================

-- 1. Enable UUID generator
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  tag TEXT DEFAULT '',
  tagline TEXT DEFAULT '',
  badge TEXT DEFAULT '',
  price_label TEXT DEFAULT 'Lifetime',
  price TEXT NOT NULL,
  credits INTEGER DEFAULT 0,
  accent TEXT DEFAULT 'violet',
  features TEXT[] NOT NULL DEFAULT '{}',
  notes TEXT[] NOT NULL DEFAULT '{}',
  tiers JSONB NOT NULL DEFAULT '[]'::jsonb,
  image_url TEXT DEFAULT '',
  scanner_url TEXT DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Grant access to client keys
GRANT ALL ON public.products TO anon, authenticated, service_role;

-- Enable replica identity for full realtime payloads
ALTER TABLE public.products REPLICA IDENTITY FULL;

-- 3. Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Drop old policies if they exist to prevent conflicts
DROP POLICY IF EXISTS "Public read products" ON public.products;
DROP POLICY IF EXISTS "Anyone can view products" ON public.products;
DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
DROP POLICY IF EXISTS "Admins can update products" ON public.products;
DROP POLICY IF EXISTS "Admins can delete products" ON public.products;
DROP POLICY IF EXISTS "Allow universal product read" ON public.products;
DROP POLICY IF EXISTS "Allow universal product insert" ON public.products;
DROP POLICY IF EXISTS "Allow universal product update" ON public.products;
DROP POLICY IF EXISTS "Allow universal product delete" ON public.products;

-- Allow universal read so all devices (Phone, PC, iPad, Customers) see products
CREATE POLICY "Allow universal product read"
ON public.products FOR SELECT
TO anon, authenticated
USING (true);

-- Allow universal insert/update/delete for admin actions from any device
CREATE POLICY "Allow universal product insert"
ON public.products FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Allow universal product update"
ON public.products FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow universal product delete"
ON public.products FOR DELETE
TO anon, authenticated
USING (true);

-- 4. Enable Realtime updates across devices
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'products'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
  END IF;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

-- 5. Storage bucket for payment scanner / QR images
INSERT INTO storage.buckets (id, name, public)
VALUES ('scanners', 'scanners', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage policies for scanners
DROP POLICY IF EXISTS "Public access to scanner images" ON storage.objects;
DROP POLICY IF EXISTS "Scanner images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload scanner images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update scanner images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete scanner images" ON storage.objects;
DROP POLICY IF EXISTS "Universal upload to scanner images" ON storage.objects;
DROP POLICY IF EXISTS "Universal update to scanner images" ON storage.objects;
DROP POLICY IF EXISTS "Universal delete to scanner images" ON storage.objects;

CREATE POLICY "Public access to scanner images"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'scanners');

CREATE POLICY "Universal upload to scanner images"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'scanners');

CREATE POLICY "Universal update to scanner images"
ON storage.objects FOR UPDATE
TO anon, authenticated
USING (bucket_id = 'scanners');

CREATE POLICY "Universal delete to scanner images"
ON storage.objects FOR DELETE
TO anon, authenticated
USING (bucket_id = 'scanners');

-- 6. Visitor counter
CREATE TABLE IF NOT EXISTS public.site_stats (
  id INTEGER PRIMARY KEY DEFAULT 1,
  visits BIGINT NOT NULL DEFAULT 0,
  CONSTRAINT site_stats_single_row CHECK (id = 1)
);

GRANT SELECT ON public.site_stats TO anon, authenticated;
GRANT ALL ON public.site_stats TO service_role;

ALTER TABLE public.site_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view visit count" ON public.site_stats;
CREATE POLICY "Anyone can view visit count"
ON public.site_stats FOR SELECT
USING (true);

INSERT INTO public.site_stats (id, visits) VALUES (1, 0)
ON CONFLICT (id) DO NOTHING;

CREATE OR REPLACE FUNCTION public.increment_visits()
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
declare v bigint;
begin
  update public.site_stats set visits = visits + 1 where id = 1 returning visits into v;
  return v;
end;
$$;

GRANT EXECUTE ON FUNCTION public.increment_visits() TO anon, authenticated;

-- 7. Seed initial default products if table is empty
INSERT INTO public.products (name, tag, tagline, badge, price_label, price, credits, accent, features, notes, tiers, sort_order)
SELECT 'AI Module – Basic', 'UNDETECTABLE', 'All-safe AI aimbot suite tuned for tournaments and live streamers.', 'MOST POPULAR', 'Lifetime', '₹3,000 / $33', 3000, 'gold',
 ARRAY['AimBot [Neck] – SAFE','AimBot [Drag] – SAFE','AimBot [Female Fixed]','AI AimBot Externals','Recall Control','Change Aim Positions Instantly','Chams Location','Smoother Aim Assist','Streamer Mode On/Off','Works on any FF / FF Max APK'],
 ARRAY['Works on Win 11','Instant delivery'],
 '[{"label":"1 DAY","price":"₹100 / $1.1"},{"label":"3 DAYS","price":"₹150 / $1.7"},{"label":"1 WEEK","price":"₹500 / $5.5"},{"label":"1 MONTH","price":"₹1,000 / $11"},{"label":"LIFETIME","price":"₹3,000 / $33"}]'::jsonb, 1
WHERE NOT EXISTS (SELECT 1 FROM public.products LIMIT 1);

INSERT INTO public.products (name, tag, tagline, badge, price_label, price, credits, accent, features, notes, tiers, sort_order)
SELECT 'AI Module – Premium', 'ADVANCED PANEL', 'Stealth-focused architecture with HVCI, VBS & Hyper-V bypass built in.', 'ELITE', 'Lifetime', '₹3,000 / $33', 3000, 'magenta',
 ARRAY['Streamer ESP – OBS / DVR compatible','Aimbot CPS [Female Fix]','Aimbot Fair [Real Drag]','Fully customizable settings','Aimbot Head, Left Neck Drag, Chest/Shoulder targeting','HVCI / VBS / Hyper-V Bypass','Kernel Memory Protection Bypass','PatchGuard-Aware Design','All Anti-Cheat Bypassed'],
 ARRAY['Win 10 / Win 11 support','Instant delivery'],
 '[{"label":"1 DAY","price":"₹300 / $3.3"},{"label":"3 DAYS","price":"₹450 / $5"},{"label":"1 WEEK","price":"₹1,000 / $11"},{"label":"1 MONTH","price":"₹2,000 / $22"},{"label":"LIFETIME","price":"₹3,000 / $33"}]'::jsonb, 2
WHERE (SELECT count(*) FROM public.products) < 2;

INSERT INTO public.products (name, tag, tagline, badge, price_label, price, credits, accent, features, notes, tiers, sort_order)
SELECT 'Premium Optimizer', 'SINGLE CLICK', 'One click – stable FPS, smoother sensi, no more drops.', '', 'Lifetime', '₹500 / $5.5', 500, 'cyan',
 ARRAY['Stable FPS – no drops','Better sensi tuning','Smoother gameplay','Works in all emulators','Single-click execution'],
 ARRAY['Instant delivery'],
 '[{"label":"1 DAY","price":"₹100 / $1.1"},{"label":"1 WEEK","price":"₹300 / $3.3"},{"label":"1 MONTH","price":"₹400 / $4.4"},{"label":"LIFETIME","price":"₹500 / $5.5"}]'::jsonb, 3
WHERE (SELECT count(*) FROM public.products) < 3;
