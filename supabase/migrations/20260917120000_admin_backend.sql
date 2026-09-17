-- =====================================================================
-- Jolly's Creamery — admin backend
--
--   Inquiries      contact-form messages (/contact)
--   CRM            Kanban pipeline; "New Leads" is a locked first stage
--   Bookings       the reserve form (/reserve), saved field by field
--   Analytics      booking-form funnel and drop-off, from interaction events
--   Admins         allowlist of Supabase Auth users who can open /admin
--
-- Run once in the Supabase SQL editor (or `supabase db push`). Every
-- statement is idempotent, so running it twice is harmless.
--
-- Security model
--   * The public website never touches tables directly. The anon role can
--     only execute submit_inquiry, track_booking and submit_booking —
--     SECURITY DEFINER functions that validate and cap everything they write.
--   * Everything else requires a signed-in user listed in admin_users,
--     enforced by Row Level Security and by the admin functions themselves.
--
-- After running: create your login in Authentication → Users, then
--   insert into public.admin_users (user_id, email)
--   select id, email from auth.users where email = 'you@example.com';
-- =====================================================================


-- ---------------------------------------------------------------------
-- Private helpers (not exposed through the Data API)
-- ---------------------------------------------------------------------

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated;

/* The booking form's fields, in the order they appear on the page.
   Funnel maths depends on this order — keep it in step with
   src/lib/booking-fields.ts. */
create or replace function private.booking_form_fields()
returns text[]
language sql
immutable
set search_path = ''
as $$
  select array['name', 'phone', 'email', 'event_type', 'event_date',
               'guests', 'venue', 'cart', 'flavours', 'custom_flavour', 'message'];
$$;

create or replace function private.clean_text(p_value text, p_max integer)
returns text
language sql
immutable
set search_path = ''
as $$
  select nullif(left(btrim(p_value), p_max), '');
$$;

create or replace function private.to_int(p_value text, p_min integer, p_max integer)
returns integer
language plpgsql
immutable
set search_path = ''
as $$
declare
  v integer;
begin
  if p_value is null or btrim(p_value) !~ '^\d{1,9}$' then
    return null;
  end if;
  v := btrim(p_value)::integer;
  return case when v between p_min and p_max then v end;
end;
$$;

create or replace function private.to_event_date(p_value text)
returns date
language plpgsql
immutable
set search_path = ''
as $$
declare
  v date;
begin
  if p_value is null or btrim(p_value) !~ '^\d{4}-\d{2}-\d{2}$' then
    return null;
  end if;
  v := btrim(p_value)::date;
  return case when v between date '2000-01-01' and date '2100-12-31' then v end;
exception when others then
  return null; -- e.g. 2026-02-30
end;
$$;

create or replace function private.to_flavours(p_value jsonb)
returns text[]
language sql
immutable
set search_path = ''
as $$
  select coalesce(array_agg(v order by n), '{}')
    from (
      select private.clean_text(value, 60) as v, n
        from jsonb_array_elements_text(
               case when jsonb_typeof(p_value) = 'array' then p_value else '[]'::jsonb end
             ) with ordinality as t (value, n)
       limit 40
    ) picked
   where v is not null;
$$;

create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;


-- ---------------------------------------------------------------------
-- Admins
-- ---------------------------------------------------------------------

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

/* True when the signed-in user is on the allowlist. SECURITY DEFINER so RLS
   policies can call it without recursing into admin_users' own policy. */
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users where user_id = (select auth.uid())
  );
$$;


-- ---------------------------------------------------------------------
-- Inquiries — the contact form
-- ---------------------------------------------------------------------

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (char_length(email) between 3 and 254),
  phone text check (char_length(phone) <= 40),
  message text not null check (char_length(message) between 1 and 5000),
  status text not null default 'new' check (status in ('new', 'read', 'archived')),
  page_path text check (char_length(page_path) <= 300),
  user_agent text check (char_length(user_agent) <= 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists inquiries_created_at_idx on public.inquiries (created_at desc);
create index if not exists inquiries_status_idx on public.inquiries (status);

drop trigger if exists inquiries_set_updated_at on public.inquiries;
create trigger inquiries_set_updated_at
  before update on public.inquiries
  for each row execute function private.set_updated_at();


-- ---------------------------------------------------------------------
-- Bookings — the reserve form, saved as the visitor types
-- ---------------------------------------------------------------------

/* One row per visitor session. It is created on the first interaction and
   updated field by field while status = 'in_progress'. Submitting moves it
   to 'pending'; the team then confirms (it appears on the calendar),
   declines or cancels. An 'in_progress' row that has gone quiet is an
   incomplete booking — still useful, since it often holds a name and phone. */
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null unique,
  status text not null default 'in_progress'
    check (status in ('in_progress', 'pending', 'confirmed', 'declined', 'cancelled')),

  -- What the visitor entered
  name text check (char_length(name) <= 120),
  phone text check (char_length(phone) <= 40),
  email text check (char_length(email) <= 254),
  event_type text check (char_length(event_type) <= 60),
  event_date date,
  guests integer check (guests between 1 and 100000),
  venue text check (char_length(venue) <= 200),
  cart text check (char_length(cart) <= 80),
  flavours text[] not null default '{}' check (cardinality(flavours) <= 40),
  custom_flavour text check (char_length(custom_flavour) <= 200),
  message text check (char_length(message) <= 5000),

  -- Progress and where they came from
  last_field text,
  device text check (device in ('mobile', 'tablet', 'desktop')),
  source text check (char_length(source) <= 120),
  landing_path text check (char_length(landing_path) <= 300),
  started_at timestamptz not null default now(),
  last_activity_at timestamptz not null default now(),
  submitted_at timestamptz,

  -- Set by the team
  confirmed_date date,
  confirmed_time time,
  admin_notes text check (char_length(admin_notes) <= 10000),
  confirmed_at timestamptz,
  confirmed_by uuid references auth.users (id) on delete set null,
  status_changed_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint bookings_confirmed_needs_date
    check (status <> 'confirmed' or confirmed_date is not null)
);

create index if not exists bookings_status_submitted_idx on public.bookings (status, submitted_at desc);
create index if not exists bookings_last_activity_idx on public.bookings (last_activity_at desc);
create index if not exists bookings_confirmed_date_idx on public.bookings (confirmed_date)
  where status = 'confirmed';

create or replace function private.bookings_track_status()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.status is distinct from old.status then
    new.status_changed_at := now();
    if new.status = 'confirmed' then
      new.confirmed_at := now();
      new.confirmed_by := auth.uid();
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists bookings_track_status on public.bookings;
create trigger bookings_track_status
  before update on public.bookings
  for each row execute function private.bookings_track_status();

drop trigger if exists bookings_set_updated_at on public.bookings;
create trigger bookings_set_updated_at
  before update on public.bookings
  for each row execute function private.set_updated_at();


-- ---------------------------------------------------------------------
-- Booking form events — the raw material for the analytics
-- ---------------------------------------------------------------------

/* view      the form was shown (carries device and source)
   focus     a field was entered
   complete  a field was left with a value (duration_ms = time spent in it)
   clear     a field was left empty after holding a value
   error     a field blocked a submit attempt
   submit    the booking was sent */
create table if not exists public.booking_events (
  id bigint generated always as identity primary key,
  session_id uuid not null,
  type text not null check (type in ('view', 'focus', 'complete', 'clear', 'error', 'submit')),
  field text check (field is null or field = any (private.booking_form_fields())),
  duration_ms integer check (duration_ms between 0 and 3600000),
  device text check (device in ('mobile', 'tablet', 'desktop')),
  source text check (char_length(source) <= 120),
  created_at timestamptz not null default now()
);

create index if not exists booking_events_created_at_idx on public.booking_events (created_at);
create index if not exists booking_events_session_idx on public.booking_events (session_id, created_at);


-- ---------------------------------------------------------------------
-- CRM — stages (Kanban columns) and leads (cards)
-- ---------------------------------------------------------------------

create table if not exists public.crm_stages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 1 and 40),
  position integer not null default 0,
  is_system boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- At most one system stage: "New Leads", where inquiries and bookings land.
create unique index if not exists crm_stages_single_system_idx on public.crm_stages (is_system)
  where is_system;

/* New Leads stays first, keeps its name and cannot be deleted. Every other
   stage can be renamed, reordered or removed. */
create or replace function private.crm_stages_guard()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'DELETE' then
    if old.is_system then
      raise exception using errcode = 'PT409', message = 'The New Leads stage cannot be deleted';
    end if;
    return old;
  end if;

  if tg_op = 'INSERT' then
    if new.is_system and exists (select 1 from public.crm_stages where is_system) then
      raise exception using errcode = 'PT409', message = 'There can only be one New Leads stage';
    end if;
    return new;
  end if;

  if old.is_system then
    if new.name is distinct from old.name
       or new.position is distinct from old.position
       or not new.is_system then
      raise exception using errcode = 'PT409', message = 'The New Leads stage cannot be renamed or moved';
    end if;
  elsif new.is_system then
    raise exception using errcode = 'PT409', message = 'There can only be one New Leads stage';
  end if;
  return new;
end;
$$;

drop trigger if exists crm_stages_guard on public.crm_stages;
create trigger crm_stages_guard
  before insert or update or delete on public.crm_stages
  for each row execute function private.crm_stages_guard();

drop trigger if exists crm_stages_set_updated_at on public.crm_stages;
create trigger crm_stages_set_updated_at
  before update on public.crm_stages
  for each row execute function private.set_updated_at();

insert into public.crm_stages (name, position, is_system)
select name, position, is_system
  from (values
    ('New Leads', 0, true),
    ('Contacted', 1, false),
    ('Proposal Sent', 2, false),
    ('Won', 3, false),
    ('Lost', 4, false)
  ) as seed (name, position, is_system)
 where not exists (select 1 from public.crm_stages);

create table if not exists public.crm_leads (
  id uuid primary key default gen_random_uuid(),
  stage_id uuid not null references public.crm_stages (id) on delete restrict,
  position integer not null default 0,
  name text not null check (char_length(btrim(name)) between 1 and 120),
  email text check (char_length(email) <= 254),
  phone text check (char_length(phone) <= 40),
  event_type text check (char_length(event_type) <= 60),
  event_date date,
  guests integer check (guests between 1 and 100000),
  value_lkr numeric(12, 2) check (value_lkr >= 0),
  notes text check (char_length(notes) <= 10000),
  source text not null default 'manual' check (source in ('inquiry', 'booking', 'manual')),
  inquiry_id uuid unique references public.inquiries (id) on delete set null,
  booking_id uuid unique references public.bookings (id) on delete set null,
  created_by uuid default auth.uid() references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists crm_leads_stage_position_idx on public.crm_leads (stage_id, position);

-- New cards always land at the top of their column.
create or replace function private.crm_leads_place_on_top()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.position := coalesce(
    (select min(position) from public.crm_leads where stage_id = new.stage_id), 1
  ) - 1;
  return new;
end;
$$;

drop trigger if exists crm_leads_place_on_top on public.crm_leads;
create trigger crm_leads_place_on_top
  before insert on public.crm_leads
  for each row execute function private.crm_leads_place_on_top();

drop trigger if exists crm_leads_set_updated_at on public.crm_leads;
create trigger crm_leads_set_updated_at
  before update on public.crm_leads
  for each row execute function private.set_updated_at();


-- ---------------------------------------------------------------------
-- Row Level Security — admins only
-- ---------------------------------------------------------------------

alter table public.admin_users enable row level security;
alter table public.inquiries enable row level security;
alter table public.bookings enable row level security;
alter table public.booking_events enable row level security;
alter table public.crm_stages enable row level security;
alter table public.crm_leads enable row level security;

revoke all on table
  public.admin_users, public.inquiries, public.bookings,
  public.booking_events, public.crm_stages, public.crm_leads
from anon, authenticated;

grant select on table public.admin_users to authenticated;
grant select, update, delete on table public.inquiries to authenticated;
grant select, update, delete on table public.bookings to authenticated;
grant select, delete on table public.booking_events to authenticated;
grant select, insert, update, delete on table public.crm_stages to authenticated;
grant select, insert, update, delete on table public.crm_leads to authenticated;

drop policy if exists "Admins can read the admin list" on public.admin_users;
create policy "Admins can read the admin list" on public.admin_users
  for select to authenticated using ((select public.is_admin()));

drop policy if exists "Admins can read inquiries" on public.inquiries;
create policy "Admins can read inquiries" on public.inquiries
  for select to authenticated using ((select public.is_admin()));
drop policy if exists "Admins can update inquiries" on public.inquiries;
create policy "Admins can update inquiries" on public.inquiries
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
drop policy if exists "Admins can delete inquiries" on public.inquiries;
create policy "Admins can delete inquiries" on public.inquiries
  for delete to authenticated using ((select public.is_admin()));

drop policy if exists "Admins can read bookings" on public.bookings;
create policy "Admins can read bookings" on public.bookings
  for select to authenticated using ((select public.is_admin()));
drop policy if exists "Admins can update bookings" on public.bookings;
create policy "Admins can update bookings" on public.bookings
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
drop policy if exists "Admins can delete bookings" on public.bookings;
create policy "Admins can delete bookings" on public.bookings
  for delete to authenticated using ((select public.is_admin()));

drop policy if exists "Admins can read booking events" on public.booking_events;
create policy "Admins can read booking events" on public.booking_events
  for select to authenticated using ((select public.is_admin()));
drop policy if exists "Admins can delete booking events" on public.booking_events;
create policy "Admins can delete booking events" on public.booking_events
  for delete to authenticated using ((select public.is_admin()));

drop policy if exists "Admins can read stages" on public.crm_stages;
create policy "Admins can read stages" on public.crm_stages
  for select to authenticated using ((select public.is_admin()));
drop policy if exists "Admins can add stages" on public.crm_stages;
create policy "Admins can add stages" on public.crm_stages
  for insert to authenticated with check ((select public.is_admin()) and not is_system);
drop policy if exists "Admins can update stages" on public.crm_stages;
create policy "Admins can update stages" on public.crm_stages
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
drop policy if exists "Admins can delete stages" on public.crm_stages;
create policy "Admins can delete stages" on public.crm_stages
  for delete to authenticated using ((select public.is_admin()));

drop policy if exists "Admins can read leads" on public.crm_leads;
create policy "Admins can read leads" on public.crm_leads
  for select to authenticated using ((select public.is_admin()));
drop policy if exists "Admins can add leads" on public.crm_leads;
create policy "Admins can add leads" on public.crm_leads
  for insert to authenticated with check ((select public.is_admin()));
drop policy if exists "Admins can update leads" on public.crm_leads;
create policy "Admins can update leads" on public.crm_leads
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
drop policy if exists "Admins can delete leads" on public.crm_leads;
create policy "Admins can delete leads" on public.crm_leads
  for delete to authenticated using ((select public.is_admin()));


-- ---------------------------------------------------------------------
-- Public entry points — callable by the website (anon)
-- ---------------------------------------------------------------------

create or replace function public.submit_inquiry(
  p_name text,
  p_email text,
  p_phone text default null,
  p_message text default null,
  p_page_path text default null,
  p_user_agent text default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_name text := private.clean_text(p_name, 120);
  v_email text := private.clean_text(p_email, 254);
  v_message text := private.clean_text(p_message, 5000);
  v_id uuid;
begin
  if v_name is null or v_email is null or v_message is null then
    raise exception using errcode = 'PT400', message = 'Name, email and message are required';
  end if;
  if v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception using errcode = 'PT400', message = 'Please enter a valid email address';
  end if;

  -- Flood guard: three messages per address per ten minutes.
  if (select count(*) from public.inquiries
       where lower(email) = lower(v_email)
         and created_at > now() - interval '10 minutes') >= 3 then
    raise exception using errcode = 'PT429', message = 'Too many messages — please try again shortly';
  end if;

  insert into public.inquiries (name, email, phone, message, page_path, user_agent)
  values (
    v_name, v_email, private.clean_text(p_phone, 40), v_message,
    private.clean_text(p_page_path, 300), private.clean_text(p_user_agent, 500)
  )
  returning id into v_id;

  return v_id;
end;
$$;

/* Called by the reserve form as the visitor moves through it. Records the
   interaction events and saves whichever field values were sent. Keys that
   are present but empty clear the field; absent keys are left alone.
   A session can only edit its own row, and only until it is submitted. */
create or replace function public.track_booking(
  p_session_id uuid,
  p_events jsonb default '[]'::jsonb,
  p_fields jsonb default '{}'::jsonb,
  p_context jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_fields text[] := private.booking_form_fields();
  v_device text;
  v_source text;
  v_landing text;
  v_last_field text;
begin
  if p_session_id is null then
    raise exception using errcode = 'PT400', message = 'Missing session';
  end if;
  if jsonb_typeof(p_events) is distinct from 'array' then
    p_events := '[]'::jsonb;
  end if;
  if jsonb_typeof(p_fields) is distinct from 'object' then
    p_fields := '{}'::jsonb;
  end if;
  if jsonb_typeof(p_context) is distinct from 'object' then
    p_context := '{}'::jsonb;
  end if;
  if jsonb_array_length(p_events) > 100 then
    raise exception using errcode = 'PT400', message = 'Too many events in one request';
  end if;

  v_device := case when p_context ->> 'device' in ('mobile', 'tablet', 'desktop') then p_context ->> 'device' end;
  v_source := private.clean_text(p_context ->> 'source', 120);
  v_landing := private.clean_text(p_context ->> 'landing_path', 300);

  -- 1. Events. Unknown types and fields are dropped; 'submit' only comes
  --    from submit_booking.
  insert into public.booking_events (session_id, type, field, duration_ms, device, source)
  select p_session_id,
         e ->> 'type',
         case when e ->> 'type' <> 'view' then e ->> 'field' end,
         private.to_int(e ->> 'duration_ms', 0, 3600000),
         case when e ->> 'type' = 'view' then v_device end,
         case when e ->> 'type' = 'view' then v_source end
    from jsonb_array_elements(p_events) as e
   where jsonb_typeof(e) = 'object'
     and (
       e ->> 'type' = 'view'
       or (e ->> 'type' in ('focus', 'complete', 'clear', 'error') and e ->> 'field' = any (v_fields))
     );

  select e ->> 'field' into v_last_field
    from jsonb_array_elements(p_events) with ordinality as t (e, n)
   where jsonb_typeof(e) = 'object'
     and e ->> 'type' in ('focus', 'complete', 'clear')
     and e ->> 'field' = any (v_fields)
   order by n desc
   limit 1;

  -- A view on its own doesn't create a booking row.
  if v_last_field is null and p_fields = '{}'::jsonb then
    return;
  end if;

  -- 2. Field values, saved as they arrive.
  insert into public.bookings (session_id, device, source, landing_path)
  values (p_session_id, v_device, v_source, v_landing)
  on conflict (session_id) do nothing;

  update public.bookings b set
    name = case when p_fields ? 'name' then private.clean_text(p_fields ->> 'name', 120) else b.name end,
    phone = case when p_fields ? 'phone' then private.clean_text(p_fields ->> 'phone', 40) else b.phone end,
    email = case when p_fields ? 'email' then private.clean_text(p_fields ->> 'email', 254) else b.email end,
    event_type = case when p_fields ? 'event_type' then private.clean_text(p_fields ->> 'event_type', 60) else b.event_type end,
    event_date = case when p_fields ? 'event_date' then private.to_event_date(p_fields ->> 'event_date') else b.event_date end,
    guests = case when p_fields ? 'guests' then private.to_int(p_fields ->> 'guests', 1, 100000) else b.guests end,
    venue = case when p_fields ? 'venue' then private.clean_text(p_fields ->> 'venue', 200) else b.venue end,
    cart = case when p_fields ? 'cart' then private.clean_text(p_fields ->> 'cart', 80) else b.cart end,
    flavours = case when p_fields ? 'flavours' then private.to_flavours(p_fields -> 'flavours') else b.flavours end,
    custom_flavour = case when p_fields ? 'custom_flavour' then private.clean_text(p_fields ->> 'custom_flavour', 200) else b.custom_flavour end,
    message = case when p_fields ? 'message' then private.clean_text(p_fields ->> 'message', 5000) else b.message end,
    last_field = coalesce(v_last_field, b.last_field),
    device = coalesce(b.device, v_device),
    source = coalesce(b.source, v_source),
    landing_path = coalesce(b.landing_path, v_landing),
    last_activity_at = now()
  where b.session_id = p_session_id
    and b.status = 'in_progress';
end;
$$;

create or replace function public.submit_booking(
  p_session_id uuid,
  p_fields jsonb,
  p_context jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id uuid;
  v_status text;
  v_email text;
begin
  if p_session_id is null or jsonb_typeof(p_fields) is distinct from 'object' then
    raise exception using errcode = 'PT400', message = 'Missing booking details';
  end if;

  v_email := private.clean_text(p_fields ->> 'email', 254);
  if private.clean_text(p_fields ->> 'name', 120) is null
     or private.clean_text(p_fields ->> 'phone', 40) is null
     or v_email is null
     or private.clean_text(p_fields ->> 'event_type', 60) is null then
    raise exception using errcode = 'PT400', message = 'Name, phone, email and event type are required';
  end if;
  if v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception using errcode = 'PT400', message = 'Please enter a valid email address';
  end if;

  select id, status into v_id, v_status
    from public.bookings
   where session_id = p_session_id
     for update;

  -- Already sent (a double click or a retried request): nothing more to do.
  if v_id is not null and v_status <> 'in_progress' then
    return v_id;
  end if;

  if (select count(*) from public.bookings
       where lower(email) = lower(v_email)
         and submitted_at > now() - interval '10 minutes') >= 3 then
    raise exception using errcode = 'PT429', message = 'Too many requests — please try again shortly';
  end if;

  perform public.track_booking(p_session_id, '[]'::jsonb, p_fields, p_context);

  update public.bookings
     set status = 'pending',
         submitted_at = now(),
         last_activity_at = now()
   where session_id = p_session_id
  returning id into v_id;

  insert into public.booking_events (session_id, type) values (p_session_id, 'submit');

  return v_id;
end;
$$;


-- ---------------------------------------------------------------------
-- Admin functions
-- ---------------------------------------------------------------------

/* Moves a card to p_index within p_stage_id (0 = top) and renumbers both
   columns so positions stay contiguous. */
create or replace function public.crm_move_lead(p_lead_id uuid, p_stage_id uuid, p_index integer)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_from_stage uuid;
  v_count integer;
  v_index integer;
begin
  if not public.is_admin() then
    raise exception using errcode = 'PT403', message = 'Admins only';
  end if;

  select stage_id into v_from_stage from public.crm_leads where id = p_lead_id for update;
  if not found then
    raise exception using errcode = 'PT404', message = 'Lead not found';
  end if;
  if not exists (select 1 from public.crm_stages where id = p_stage_id) then
    raise exception using errcode = 'PT404', message = 'Stage not found';
  end if;

  select count(*) into v_count
    from public.crm_leads
   where stage_id = p_stage_id and id <> p_lead_id;
  v_index := greatest(0, least(coalesce(p_index, v_count), v_count));

  update public.crm_leads l
     set position = o.rn + case when o.rn >= v_index then 1 else 0 end
    from (
      select id, (row_number() over (order by position, created_at) - 1)::integer as rn
        from public.crm_leads
       where stage_id = p_stage_id and id <> p_lead_id
    ) o
   where l.id = o.id
     and l.position is distinct from o.rn + case when o.rn >= v_index then 1 else 0 end;

  update public.crm_leads
     set stage_id = p_stage_id, position = v_index
   where id = p_lead_id;

  if v_from_stage <> p_stage_id then
    update public.crm_leads l
       set position = o.rn
      from (
        select id, (row_number() over (order by position, created_at) - 1)::integer as rn
          from public.crm_leads
         where stage_id = v_from_stage
      ) o
     where l.id = o.id
       and l.position is distinct from o.rn;
  end if;
end;
$$;

/* p_stage_ids is the full left-to-right order of every stage except
   New Leads, which always stays first. */
create or replace function public.crm_reorder_stages(p_stage_ids uuid[])
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception using errcode = 'PT403', message = 'Admins only';
  end if;

  if (select count(*) from public.crm_stages where not is_system) <> coalesce(cardinality(p_stage_ids), 0)
     or exists (
       select 1 from public.crm_stages s
        where not s.is_system and not (s.id = any (p_stage_ids))
     ) then
    raise exception using errcode = 'PT409', message = 'The stages have changed — refresh and try again';
  end if;

  update public.crm_stages s
     set position = t.n
    from unnest(p_stage_ids) with ordinality as t (id, n)
   where s.id = t.id
     and not s.is_system
     and s.position is distinct from t.n::integer;
end;
$$;

/* Deletes a stage. Its cards are kept: they move to the bottom of New Leads. */
create or replace function public.crm_delete_stage(p_stage_id uuid)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_is_system boolean;
  v_new_leads uuid;
begin
  if not public.is_admin() then
    raise exception using errcode = 'PT403', message = 'Admins only';
  end if;

  select is_system into v_is_system from public.crm_stages where id = p_stage_id;
  if not found then
    raise exception using errcode = 'PT404', message = 'Stage not found';
  end if;
  if v_is_system then
    raise exception using errcode = 'PT409', message = 'The New Leads stage cannot be deleted';
  end if;

  select id into v_new_leads from public.crm_stages where is_system;
  if v_new_leads is null then
    raise exception using errcode = 'PT409', message = 'The New Leads stage is missing';
  end if;

  update public.crm_leads l
     set stage_id = v_new_leads,
         position = coalesce(
           (select max(position) from public.crm_leads where stage_id = v_new_leads), -1
         ) + o.rn::integer
    from (
      select id, row_number() over (order by position, created_at) as rn
        from public.crm_leads
       where stage_id = p_stage_id
    ) o
   where l.id = o.id;

  delete from public.crm_stages where id = p_stage_id;
end;
$$;

/* Copies an inquiry into New Leads. Calling it again returns the same lead. */
create or replace function public.crm_lead_from_inquiry(p_inquiry_id uuid)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_lead uuid;
  v_inquiry public.inquiries%rowtype;
begin
  if not public.is_admin() then
    raise exception using errcode = 'PT403', message = 'Admins only';
  end if;

  select id into v_lead from public.crm_leads where inquiry_id = p_inquiry_id;
  if v_lead is not null then
    return v_lead;
  end if;

  select * into v_inquiry from public.inquiries where id = p_inquiry_id;
  if not found then
    raise exception using errcode = 'PT404', message = 'Inquiry not found';
  end if;

  insert into public.crm_leads (stage_id, name, email, phone, notes, source, inquiry_id)
  values (
    (select id from public.crm_stages where is_system),
    v_inquiry.name, v_inquiry.email, v_inquiry.phone, v_inquiry.message, 'inquiry', v_inquiry.id
  )
  returning id into v_lead;

  update public.inquiries set status = 'read' where id = p_inquiry_id and status = 'new';

  return v_lead;
exception when unique_violation then
  select id into v_lead from public.crm_leads where inquiry_id = p_inquiry_id;
  return v_lead;
end;
$$;

/* Copies a booking (submitted or incomplete) into New Leads. */
create or replace function public.crm_lead_from_booking(p_booking_id uuid)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_lead uuid;
  v_booking public.bookings%rowtype;
begin
  if not public.is_admin() then
    raise exception using errcode = 'PT403', message = 'Admins only';
  end if;

  select id into v_lead from public.crm_leads where booking_id = p_booking_id;
  if v_lead is not null then
    return v_lead;
  end if;

  select * into v_booking from public.bookings where id = p_booking_id;
  if not found then
    raise exception using errcode = 'PT404', message = 'Booking not found';
  end if;

  insert into public.crm_leads (
    stage_id, name, email, phone, event_type, event_date, guests, notes, source, booking_id
  )
  values (
    (select id from public.crm_stages where is_system),
    coalesce(v_booking.name, v_booking.phone, v_booking.email, 'Website booking'),
    v_booking.email,
    v_booking.phone,
    v_booking.event_type,
    coalesce(v_booking.confirmed_date, v_booking.event_date),
    v_booking.guests,
    nullif(concat_ws(E'\n',
      case when v_booking.venue is not null then 'Venue: ' || v_booking.venue end,
      case when v_booking.cart is not null then 'Cart: ' || v_booking.cart end,
      case when cardinality(v_booking.flavours) > 0
           then 'Flavours: ' || array_to_string(v_booking.flavours, ', ') end,
      case when v_booking.custom_flavour is not null then 'Custom flavour: ' || v_booking.custom_flavour end,
      v_booking.message
    ), ''),
    'booking',
    v_booking.id
  )
  returning id into v_lead;

  return v_lead;
exception when unique_violation then
  select id into v_lead from public.crm_leads where booking_id = p_booking_id;
  return v_lead;
end;
$$;

/* Booking-form analytics for sessions that began in [p_from, p_to).

   A session is one visitor's pass through the form. It has
     started    — touched at least one field (or submitted)
     submitted  — sent the booking
     abandoned  — started, not submitted, and quiet for 30 minutes
   Per field:
     reached    — sessions that got at least this far down the form
     filled     — of those, sessions whose saved booking has a value for it
     dropped    — abandoned sessions whose last touched field was this one
     errors     — sessions where this field blocked a submit attempt
     avg_ms     — average time spent in the field (0.3s–10min only) */
create or replace function public.booking_form_analytics(p_from timestamptz, p_to timestamptz)
returns jsonb
language plpgsql
stable
security invoker
set search_path = ''
as $$
declare
  v_fields text[] := private.booking_form_fields();
  v_quiet_since timestamptz := now() - interval '30 minutes';
  v_result jsonb;
begin
  if not public.is_admin() then
    raise exception using errcode = 'PT403', message = 'Admins only';
  end if;

  with touched as (
    select distinct session_id
      from public.booking_events
     where created_at >= p_from and created_at < p_to
  ),
  sessions as (
    select e.session_id,
           min(e.created_at) as first_at,
           max(e.created_at) as last_at,
           max(e.device) as device,
           max(e.source) as source,
           bool_or(e.type in ('focus', 'complete', 'clear', 'submit')) as started,
           bool_or(e.type = 'submit') as submitted,
           max(array_position(v_fields, e.field))
             filter (where e.type in ('focus', 'complete', 'clear')) as furthest,
           (array_agg(e.field order by e.created_at desc, e.id desc)
             filter (where e.type in ('focus', 'complete', 'clear')))[1] as last_field,
           min(e.created_at) filter (where e.type in ('focus', 'complete', 'clear')) as started_at,
           min(e.created_at) filter (where e.type = 'submit') as submitted_at
      from public.booking_events e
      join touched using (session_id)
     group by e.session_id
    having min(e.created_at) >= p_from and min(e.created_at) < p_to
  ),
  flagged as (
    select s.*,
           (s.started and not s.submitted and s.last_at < v_quiet_since) as abandoned
      from sessions s
  ),
  totals as (
    select count(*) as views,
           count(*) filter (where started) as started,
           count(*) filter (where submitted) as submitted,
           count(*) filter (where abandoned) as abandoned,
           count(*) filter (where started and not submitted and not abandoned) as in_progress,
           round((percentile_cont(0.5) within group (
             order by extract(epoch from submitted_at - coalesce(started_at, first_at))
           ) filter (where submitted))::numeric) as median_seconds_to_submit
      from flagged
  ),
  field_list as (
    select f as field, i::integer as idx
      from unnest(v_fields) with ordinality as t (f, i)
  ),
  field_stats as (
    select fl.field,
           fl.idx,
           (select count(*) from flagged s
             where s.submitted or s.furthest >= fl.idx) as reached,
           (select count(*) from flagged s
              join public.bookings b using (session_id)
             where (s.submitted or s.furthest >= fl.idx)
               and case fl.field
                     when 'name' then b.name is not null
                     when 'phone' then b.phone is not null
                     when 'email' then b.email is not null
                     when 'event_type' then b.event_type is not null
                     when 'event_date' then b.event_date is not null
                     when 'guests' then b.guests is not null
                     when 'venue' then b.venue is not null
                     when 'cart' then b.cart is not null
                     when 'flavours' then cardinality(b.flavours) > 0
                     when 'custom_flavour' then b.custom_flavour is not null
                     when 'message' then b.message is not null
                     else false
                   end) as filled,
           (select count(*) from flagged s
             where s.abandoned and s.last_field = fl.field) as dropped,
           (select count(distinct e.session_id) from public.booking_events e
              join flagged s using (session_id)
             where e.type = 'error' and e.field = fl.field) as errors,
           (select round(avg(e.duration_ms))::integer from public.booking_events e
              join flagged s using (session_id)
             where e.type = 'complete' and e.field = fl.field
               and e.duration_ms between 300 and 600000) as avg_ms
      from field_list fl
  ),
  days as (
    select d::date as day
      from generate_series(
             (p_from at time zone 'Asia/Colombo')::date,
             ((p_to - interval '1 microsecond') at time zone 'Asia/Colombo')::date,
             interval '1 day'
           ) as d
  ),
  daily as (
    select d.day,
           count(s.session_id) as views,
           count(s.session_id) filter (where s.started) as started,
           count(s.session_id) filter (where s.submitted) as submitted
      from days d
      left join flagged s on (s.first_at at time zone 'Asia/Colombo')::date = d.day
     group by d.day
  ),
  devices as (
    select coalesce(device, 'unknown') as device,
           count(*) as views,
           count(*) filter (where started) as started,
           count(*) filter (where submitted) as submitted
      from flagged
     group by 1
  ),
  sources as (
    select coalesce(source, 'direct') as source,
           count(*) as views,
           count(*) filter (where started) as started,
           count(*) filter (where submitted) as submitted
      from flagged
     group by 1
     order by count(*) desc
     limit 12
  )
  select jsonb_build_object(
           'from', p_from,
           'to', p_to,
           'totals', (select to_jsonb(t) from totals t),
           'fields', (select coalesce(jsonb_agg(to_jsonb(f) order by f.idx), '[]'::jsonb) from field_stats f),
           'daily', (select coalesce(jsonb_agg(to_jsonb(d) order by d.day), '[]'::jsonb) from daily d),
           'devices', (select coalesce(jsonb_agg(to_jsonb(v) order by v.views desc), '[]'::jsonb) from devices v),
           'sources', (select coalesce(jsonb_agg(to_jsonb(s) order by s.views desc), '[]'::jsonb) from sources s)
         )
    into v_result;

  return v_result;
end;
$$;


-- ---------------------------------------------------------------------
-- Function privileges
-- ---------------------------------------------------------------------

-- Helpers in the private schema run inside the functions above; only the
-- analytics field list is read directly by a signed-in admin.
revoke execute on all functions in schema private from public, anon, authenticated;
grant execute on function private.booking_form_fields() to authenticated;

-- Supabase grants EXECUTE on new functions to anon and authenticated by
-- default, so revoke first and grant back only what each role needs.
revoke execute on function public.is_admin() from public, anon;
revoke execute on function public.submit_inquiry(text, text, text, text, text, text) from public;
revoke execute on function public.track_booking(uuid, jsonb, jsonb, jsonb) from public;
revoke execute on function public.submit_booking(uuid, jsonb, jsonb) from public;
revoke execute on function public.crm_move_lead(uuid, uuid, integer) from public, anon;
revoke execute on function public.crm_reorder_stages(uuid[]) from public, anon;
revoke execute on function public.crm_delete_stage(uuid) from public, anon;
revoke execute on function public.crm_lead_from_inquiry(uuid) from public, anon;
revoke execute on function public.crm_lead_from_booking(uuid) from public, anon;
revoke execute on function public.booking_form_analytics(timestamptz, timestamptz) from public, anon;

grant execute on function public.is_admin() to authenticated;
grant execute on function public.submit_inquiry(text, text, text, text, text, text) to anon, authenticated;
grant execute on function public.track_booking(uuid, jsonb, jsonb, jsonb) to anon, authenticated;
grant execute on function public.submit_booking(uuid, jsonb, jsonb) to anon, authenticated;
grant execute on function public.crm_move_lead(uuid, uuid, integer) to authenticated;
grant execute on function public.crm_reorder_stages(uuid[]) to authenticated;
grant execute on function public.crm_delete_stage(uuid) to authenticated;
grant execute on function public.crm_lead_from_inquiry(uuid) to authenticated;
grant execute on function public.crm_lead_from_booking(uuid) to authenticated;
grant execute on function public.booking_form_analytics(timestamptz, timestamptz) to authenticated;
