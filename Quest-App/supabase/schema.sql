-- Quest App MVP schema for Supabase (Postgres)
-- Run this in the Supabase SQL editor.

create table users (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  level integer default 1,
  current_xp integer default 0,
  streak_count integer default 0,
  last_active_date timestamptz,
  reward_points integer default 0,
  created_at timestamptz default now()
);

create table tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  source_type text default 'manual' check (source_type in ('manual', 'doc', 'youtube')),
  title text not null,
  description text,
  difficulty_score integer default 1,
  estimated_minutes integer,
  status text default 'pending' check (status in ('pending', 'active', 'done')),
  xp_value integer default 10,
  due_date timestamptz,
  created_at timestamptz default now(),
  completed_at timestamptz
);

create table subtasks (
  id uuid primary key default gen_random_uuid(),
  task_id uuid references tasks(id) on delete cascade,
  title text not null,
  order_index integer default 0,
  status text default 'pending' check (status in ('pending', 'done')),
  xp_value integer default 5
);

create table achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  achievement_key text not null,
  tier text default 'mini' check (tier in ('mini', 'major')),
  unlocked_at timestamptz default now()
);

create table rewards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  name text not null,
  duration_minutes integer,
  cost_points integer default 10,
  category text
);

create table reward_claims (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  reward_id uuid references rewards(id) on delete cascade,
  claimed_at timestamptz default now(),
  used boolean default false
);

create table uploaded_files (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  task_id uuid references tasks(id) on delete set null,
  file_url text,
  file_type text,
  extracted_text text,
  processed_at timestamptz
);

create table youtube_resources (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  task_id uuid references tasks(id) on delete set null,
  video_url text,
  duration_seconds integer,
  transcript_text text,
  processed_at timestamptz
);

create table study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  task_id uuid references tasks(id) on delete set null,
  start_time timestamptz,
  end_time timestamptz,
  focus_minutes integer
);

create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  type text,
  message text,
  scheduled_for timestamptz,
  sent boolean default false
);

-- Row Level Security: users can only access their own data
alter table users enable row level security;
alter table tasks enable row level security;
alter table achievements enable row level security;
alter table rewards enable row level security;
alter table reward_claims enable row level security;

create policy "Users can view own row" on users for select using (auth.uid() = id);
create policy "Users can update own row" on users for update using (auth.uid() = id);

create policy "Users can manage own tasks" on tasks for all using (auth.uid() = user_id);
create policy "Users can view own achievements" on achievements for select using (auth.uid() = user_id);
create policy "Users can manage own rewards" on rewards for all using (auth.uid() = user_id);
create policy "Users can manage own claims" on reward_claims for all using (auth.uid() = user_id);

-- Auto-create a users row when someone signs up via Supabase Auth
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, display_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
