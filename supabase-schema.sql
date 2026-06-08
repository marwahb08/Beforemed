-- Run this in your Supabase SQL editor

-- Profiles table (stores full name + country set at signup)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  country text,
  email text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Simulations table
create table if not exists public.simulations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  specialty text not null,
  messages jsonb not null default '[]',
  score integer,
  career_fit text,
  completed_at timestamptz default now()
);

alter table public.simulations enable row level security;

create policy "Users can read own simulations"
  on public.simulations for select
  using (auth.uid() = user_id);

create policy "Users can insert own simulations"
  on public.simulations for insert
  with check (auth.uid() = user_id);
