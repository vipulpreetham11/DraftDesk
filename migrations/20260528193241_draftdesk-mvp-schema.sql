-- DraftDesk MVP Schema

-- 1. Profiles (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  niche text default 'tech_ai',
  style_notes text,
  created_at timestamptz default now()
);

-- 2. Projects (each content piece)
create table public.projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  status text default 'idea' check (status in ('idea', 'scripted', 'recorded', 'edited', 'published')),
  platform text default 'youtube' check (platform in ('youtube', 'instagram', 'tiktok', 'linkedin', 'twitter', 'other')),
  target_date date,
  thumbnail_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Scripts (one per project)
create table public.scripts (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects(id) on delete cascade unique not null,
  hook text,
  body text,
  cta text,
  broll_notes text,
  seo_title text,
  seo_description text,
  seo_tags text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4. Notes (optional notes per project)
create table public.notes (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  content text not null,
  created_at timestamptz default now()
);

-- Auto-update updated_at
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger projects_updated_at
  before update on public.projects
  for each row execute procedure public.update_updated_at();

create trigger scripts_updated_at
  before update on public.scripts
  for each row execute procedure public.update_updated_at();

-- Indexes
create index idx_projects_user_id on public.projects(user_id);
create index idx_projects_status on public.projects(status);
create index idx_scripts_project_id on public.scripts(project_id);
create index idx_notes_project_id on public.notes(project_id);
