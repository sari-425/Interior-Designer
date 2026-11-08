-- DesignBySari – gemeinsamer Nutzungszähler für die KI-Kostenkontrolle
--
-- ENTWURF, NOCH NICHT AUSGEFÜHRT.
--
-- Die KI darf live nur laufen, wenn alle Server-Instanzen dieselben Zähler
-- sehen. Diese Tabellen und die Funktion reserve_ai_usage() bilden dafür die
-- Grundlage. Die Funktion prüft alle Limits und bucht in einem Schritt
-- (Zeilensperre), sodass gleichzeitige Anfragen ein Limit nicht gemeinsam
-- überschreiten. Zugriff nur mit dem Service-Schlüssel auf dem Server,
-- nie aus dem Browser.

create table if not exists public.ai_usage_days (
  day             date primary key,
  designs         integer not null default 0 check (designs >= 0),
  cost_usd_cents  integer not null default 0 check (cost_usd_cents >= 0),
  updated_at      timestamptz not null default now()
);

create table if not exists public.ai_usage_requests (
  id          bigint generated always as identity primary key,
  -- Gehashte Kennung (z. B. SHA-256 aus IP bzw. Konto-ID), keine Klar-IP speichern
  client_hash text not null,
  created_at  timestamptz not null default now()
);

create index if not exists ai_usage_requests_client_time on public.ai_usage_requests (client_hash, created_at);

alter table public.ai_usage_days enable row level security;
alter table public.ai_usage_requests enable row level security;
-- Keine Policies: Nutzerinnen und Nutzer haben keinen Zugriff, nur der Server (service_role).

create or replace function public.reserve_ai_usage(
  p_client_hash text,
  p_day date,
  p_window_start timestamptz,
  p_estimated_cost_usd_cents integer,
  p_max_requests_per_hour integer,
  p_max_designs_per_day integer,
  p_max_cost_usd_cents_per_day integer
) returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_day public.ai_usage_days%rowtype;
  v_recent integer;
begin
  insert into public.ai_usage_days (day) values (p_day) on conflict (day) do nothing;
  -- Sperrt die Tageszeile bis zum Ende der Transaktion
  select * into v_day from public.ai_usage_days where day = p_day for update;

  select count(*) into v_recent
    from public.ai_usage_requests
   where client_hash = p_client_hash and created_at >= p_window_start;

  if v_recent >= p_max_requests_per_hour then return 'client_hourly_limit'; end if;
  if v_day.designs >= p_max_designs_per_day then return 'daily_design_limit'; end if;
  if v_day.cost_usd_cents + p_estimated_cost_usd_cents > p_max_cost_usd_cents_per_day then return 'daily_budget'; end if;

  insert into public.ai_usage_requests (client_hash) values (p_client_hash);
  update public.ai_usage_days
     set designs = designs + 1,
         cost_usd_cents = cost_usd_cents + p_estimated_cost_usd_cents,
         updated_at = now()
   where day = p_day;
  return 'ok';
end;
$$;

revoke all on function public.reserve_ai_usage(text, date, timestamptz, integer, integer, integer, integer) from public, anon, authenticated;

-- Mehrkosten nachbuchen, wenn ein Anbieter mehr meldet als geschätzt
create or replace function public.add_ai_cost(p_day date, p_cost_usd_cents integer)
returns void
language sql
security definer
set search_path = ''
as $$
  insert into public.ai_usage_days (day, cost_usd_cents) values (p_day, greatest(p_cost_usd_cents, 0))
  on conflict (day) do update
    set cost_usd_cents = public.ai_usage_days.cost_usd_cents + greatest(excluded.cost_usd_cents, 0),
        updated_at = now();
$$;

revoke all on function public.add_ai_cost(date, integer) from public, anon, authenticated;

-- Alte Einzelanfragen nach 7 Tagen löschen (z. B. per pg_cron, sobald freigegeben):
-- delete from public.ai_usage_requests where created_at < now() - interval '7 days';
