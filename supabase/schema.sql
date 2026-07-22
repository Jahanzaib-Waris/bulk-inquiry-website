-- Run this once in the Supabase SQL editor (or via `supabase db push`)
-- for your project before using the app.

create extension if not exists "pgcrypto";

create table if not exists inquiries (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  description text not null,
  image_urls text[] not null default '{}',
  status text not null default 'new' check (status in ('new', 'reviewed')),
  created_at timestamptz not null default now()
);

-- Safe to re-run if the table already existed without this column.
alter table inquiries add column if not exists status text not null default 'new';
alter table inquiries drop constraint if exists inquiries_status_check;
alter table inquiries add constraint inquiries_status_check check (status in ('new', 'reviewed'));

alter table inquiries enable row level security;

-- Some projects don't auto-grant table privileges to service_role; the
-- secret-key client needs this to read/write, even with RLS enabled
-- (service_role bypasses RLS but still needs the underlying GRANT).
grant all on public.inquiries to service_role;

-- All reads/writes go through the server (service role key), which bypasses
-- RLS. No public policies are defined, so the anon/public key has zero
-- access to this table by default.

-- Storage bucket for uploaded inquiry images. Public-read so the admin
-- dashboard (and any future public gallery) can render images via URL,
-- but only the service role (server) can upload/delete.
insert into storage.buckets (id, name, public)
values ('inquiry-images', 'inquiry-images', true)
on conflict (id) do nothing;

create policy "Public read of inquiry images"
  on storage.objects for select
  using (bucket_id = 'inquiry-images');

-- Single-row table for site branding (name + logo), editable from the
-- admin Settings tab.
create table if not exists site_settings (
  id int primary key default 1,
  site_name text not null default 'Bulk Inquiry',
  logo_url text,
  updated_at timestamptz not null default now(),
  constraint site_settings_singleton check (id = 1)
);

insert into site_settings (id) values (1) on conflict (id) do nothing;

alter table site_settings enable row level security;
grant all on public.site_settings to service_role;

-- Storage bucket for the site logo. Public-read, service-role write only.
insert into storage.buckets (id, name, public)
values ('site-assets', 'site-assets', true)
on conflict (id) do nothing;

create policy "Public read of site assets"
  on storage.objects for select
  using (bucket_id = 'site-assets');
