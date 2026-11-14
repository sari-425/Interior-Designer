-- DesignBySari – Nutzerprofile
--
-- ENTWURF, NOCH NICHT AUSGEFÜHRT. Gehört zu 20261108000000_living_room_projects.sql.
--
-- Ein Profil pro Konto (auch für Gäste mit anonymer Anmeldung). Es wird beim
-- Anlegen eines Kontos automatisch erzeugt und mit dem Konto gelöscht.
-- E-Mail-Adresse und Passwort verwaltet ausschließlich Supabase Auth.

create table if not exists public.profiles (
  user_id          uuid primary key references auth.users (id) on delete cascade,
  display_name     text check (display_name is null or char_length(display_name) between 2 and 50),
  marketing_opt_in boolean not null default false,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Eigenes Profil lesen"
  on public.profiles for select to authenticated
  using (user_id = (select auth.uid()));

create policy "Eigenes Profil ändern"
  on public.profiles for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- Kein insert/delete für Nutzer: Anlegen per Trigger, Löschen über das Konto (cascade).

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (user_id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();
