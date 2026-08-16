-- Roles enum + table
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

create policy "Users can view their own roles"
on public.user_roles for select
to authenticated
using (auth.uid() = user_id);

-- Auto-assign admin role to the designated admin email on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.email = 'admin@unacheatx.com' then
    insert into public.user_roles (user_id, role)
    values (new.id, 'admin')
    on conflict (user_id, role) do nothing;
  end if;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Products table
create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  tag text default '',
  tagline text default '',
  badge text default '',
  price_label text default 'Lifetime',
  price text default '',
  credits integer default 0,
  accent text default 'violet',
  features text[] not null default '{}',
  notes text[] not null default '{}',
  tiers jsonb not null default '[]'::jsonb,
  image_url text default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select on public.products to anon, authenticated;
grant all on public.products to authenticated, service_role;

alter table public.products enable row level security;

create policy "Anyone can view products"
on public.products for select
to anon, authenticated
using (true);

create policy "Admins can insert products"
on public.products for insert
to authenticated
with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can update products"
on public.products for update
to authenticated
using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete products"
on public.products for delete
to authenticated
using (public.has_role(auth.uid(), 'admin'));

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger products_updated_at
before update on public.products
for each row execute function public.set_updated_at();

-- Seed default panels
insert into public.products (name, tag, tagline, badge, price_label, price, credits, accent, features, notes, tiers, sort_order) values
('AI Module – Basic', 'UNDETECTABLE', 'All-safe AI aimbot suite tuned for tournaments and live streamers.', 'MOST POPULAR', 'Lifetime', '₹3,000 / $33', 3000, 'gold',
 array['AimBot [Neck] – SAFE','AimBot [Drag] – SAFE','AimBot [Female Fixed]','AI AimBot Externals','Recall Control','Change Aim Positions Instantly','Chams Location','Smoother Aim Assist','Streamer Mode On/Off','Works on any FF / FF Max APK'],
 array['Works on Win 11','Instant delivery'],
 '[{"label":"1 DAY","price":"₹100 / $1.1"},{"label":"3 DAYS","price":"₹150 / $1.7"},{"label":"1 WEEK","price":"₹500 / $5.5"},{"label":"1 MONTH","price":"₹1,000 / $11"},{"label":"LIFETIME","price":"₹3,000 / $33"}]'::jsonb, 1),
('AI Module – Premium', 'ADVANCED PANEL', 'Stealth-focused architecture with HVCI, VBS & Hyper-V bypass built in.', 'ELITE', 'Lifetime', '₹3,000 / $33', 3000, 'magenta',
 array['Streamer ESP – OBS / DVR compatible','Aimbot CPS [Female Fix]','Aimbot Fair [Real Drag]','Fully customizable settings','Aimbot Head, Left Neck Drag, Chest/Shoulder targeting','HVCI / VBS / Hyper-V Bypass','Kernel Memory Protection Bypass','PatchGuard-Aware Design','All Anti-Cheat Bypassed'],
 array['Win 10 / Win 11 support','Instant delivery'],
 '[{"label":"1 DAY","price":"₹300 / $3.3"},{"label":"3 DAYS","price":"₹450 / $5"},{"label":"1 WEEK","price":"₹1,000 / $11"},{"label":"1 MONTH","price":"₹2,000 / $22"},{"label":"LIFETIME","price":"₹3,000 / $33"}]'::jsonb, 2),
('Premium Optimizer', 'SINGLE CLICK', 'One click – stable FPS, smoother sensi, no more drops.', '', 'Lifetime', '₹500 / $5.5', 500, 'cyan',
 array['Stable FPS – no drops','Better sensi tuning','Smoother gameplay','Works in all emulators','Single-click execution'],
 array['Instant delivery'],
 '[{"label":"1 DAY","price":"₹100 / $1.1"},{"label":"1 WEEK","price":"₹300 / $3.3"},{"label":"1 MONTH","price":"₹400 / $4.4"},{"label":"LIFETIME","price":"₹500 / $5.5"}]'::jsonb, 3);