-- DesignBySari – Wohnzimmer-Projekte
--
-- ENTWURF, NOCH NICHT AUSGEFÜHRT.
-- Wird erst angewendet, wenn ein Supabase-Projekt (Region Frankfurt) eingerichtet
-- und freigegeben ist. Prüfen mit: supabase db diff / supabase db push.
--
-- Grundsatz: Jede Person sieht und verändert ausschließlich ihre eigenen Projekte
-- und Fotos. Auch Gäste (anonyme Anmeldung bei Supabase) erhalten eine eigene
-- Nutzer-ID und sind dadurch genauso geschützt.

create table if not exists public.living_room_projects (
  id            uuid primary key default gen_random_uuid(),
  owner_id      uuid not null default auth.uid() references auth.users (id) on delete cascade,
  status        text not null default 'draft'
                  check (status in ('draft', 'submitted', 'generating', 'completed', 'failed')),
  room_size_sqm numeric(5, 2) check (room_size_sqm is null or room_size_sqm between 5 and 200),
  style         text not null check (style in ('modern', 'skandinavisch', 'minimalistisch', 'industrial',
                                                'japandi', 'klassisch', 'landhaus', 'luxurioes')),
  color_world   text not null,
  atmosphere    text not null,
  budget_eur    integer not null check (budget_eur between 100 and 50000),
  keep_items    text[] not null default '{}',
  replace_items text[] not null default '{}',
  keep_surfaces   text[] not null default '{}',
  change_surfaces text[] not null default '{}',
  variant_count integer not null default 2 check (variant_count between 1 and 4),
  notes         text not null default '' check (char_length(notes) <= 500),
  photo_path    text,
  photo_width   integer,
  photo_height  integer,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint keep_and_replace_disjoint check (not (keep_items && replace_items)),
  constraint surfaces_disjoint check (not (keep_surfaces && change_surfaces))
);

create index if not exists living_room_projects_owner_idx
  on public.living_room_projects (owner_id, created_at desc);

alter table public.living_room_projects enable row level security;

create policy "Eigene Projekte lesen"
  on public.living_room_projects for select to authenticated
  using (owner_id = (select auth.uid()));

create policy "Eigene Projekte anlegen"
  on public.living_room_projects for insert to authenticated
  with check (owner_id = (select auth.uid()));

create policy "Eigene Projekte ändern"
  on public.living_room_projects for update to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));

create policy "Eigene Projekte löschen"
  on public.living_room_projects for delete to authenticated
  using (owner_id = (select auth.uid()));

-- updated_at automatisch pflegen
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger living_room_projects_updated_at
  before update on public.living_room_projects
  for each row execute function public.set_updated_at();

-- Privater Speicher für Raumfotos: max. 10 MB, nur JPG/PNG/WebP.
-- Ablage: <nutzer-id>/<projekt-id>/<datei>. Zugriff nur über kurzlebige signierte Links.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('room-photos', 'room-photos', false, 10485760, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create policy "Eigene Fotos lesen"
  on storage.objects for select to authenticated
  using (bucket_id = 'room-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "Eigene Fotos hochladen"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'room-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "Eigene Fotos löschen"
  on storage.objects for delete to authenticated
  using (bucket_id = 'room-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);
