-- Update admin-role trigger to recognize the new admin email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
begin
  if new.email = 'admin@unacheatx.com' then
    insert into public.user_roles (user_id, role)
    values (new.id, 'admin')
    on conflict (user_id, role) do nothing;
  end if;
  return new;
end;
$function$;

-- Visitor counter
CREATE TABLE IF NOT EXISTS public.site_stats (
  id integer PRIMARY KEY DEFAULT 1,
  visits bigint NOT NULL DEFAULT 0,
  CONSTRAINT site_stats_single_row CHECK (id = 1)
);

GRANT SELECT ON public.site_stats TO anon, authenticated;
GRANT ALL ON public.site_stats TO service_role;

ALTER TABLE public.site_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view visit count"
ON public.site_stats FOR SELECT
USING (true);

INSERT INTO public.site_stats (id, visits) VALUES (1, 0)
ON CONFLICT (id) DO NOTHING;

-- Atomic increment callable by anyone
CREATE OR REPLACE FUNCTION public.increment_visits()
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
declare v bigint;
begin
  update public.site_stats set visits = visits + 1 where id = 1 returning visits into v;
  return v;
end;
$function$;

GRANT EXECUTE ON FUNCTION public.increment_visits() TO anon, authenticated;