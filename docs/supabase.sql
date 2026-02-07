create extension if not exists "pgcrypto";

create table if not exists public.calendar_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null default 'appointment',
  title text not null,
  date date not null,
  time text,
  status text not null default 'pending',
  color text not null default '#f97316',
  notes text,
  patient_first_name text not null,
  patient_middle_name text,
  patient_last_name text not null,
  created_at timestamp with time zone default now()
);

create table if not exists public.communications (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  patient_name text not null,
  patient_first_name text not null,
  patient_middle_name text,
  patient_last_name text not null,
  school_year text not null,
  current_dentist text,
  language text,
  date_called date,
  date_emailed date,
  referral_type text not null,
  notes text,
  created_by text not null,
  appointment_id uuid references public.calendar_events(id),
  created_at timestamp with time zone default now()
);

create table if not exists public.dentists (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamp with time zone default now()
);

create table if not exists public.staff (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamp with time zone default now()
);

alter table public.calendar_events enable row level security;
alter table public.communications enable row level security;
alter table public.dentists enable row level security;
alter table public.staff enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'calendar_events'
      and policyname = 'Allow read access to calendar_events'
  ) then
    create policy "Allow read access to calendar_events"
      on public.calendar_events
      for select
      using (true);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'calendar_events'
      and policyname = 'Allow insert access to calendar_events'
  ) then
    create policy "Allow insert access to calendar_events"
      on public.calendar_events
      for insert
      with check (true);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'communications'
      and policyname = 'Allow read access to communications'
  ) then
    create policy "Allow read access to communications"
      on public.communications
      for select
      using (true);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'communications'
      and policyname = 'Allow insert access to communications'
  ) then
    create policy "Allow insert access to communications"
      on public.communications
      for insert
      with check (true);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'dentists'
      and policyname = 'Allow read access to dentists'
  ) then
    create policy "Allow read access to dentists"
      on public.dentists
      for select
      using (true);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'dentists'
      and policyname = 'Allow insert access to dentists'
  ) then
    create policy "Allow insert access to dentists"
      on public.dentists
      for insert
      with check (true);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'staff'
      and policyname = 'Allow read access to staff'
  ) then
    create policy "Allow read access to staff"
      on public.staff
      for select
      using (true);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'staff'
      and policyname = 'Allow insert access to staff'
  ) then
    create policy "Allow insert access to staff"
      on public.staff
      for insert
      with check (true);
  end if;
end $$;
