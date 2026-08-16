alter publication supabase_realtime add table public.products;
alter table public.products replica identity full;