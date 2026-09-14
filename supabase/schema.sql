create table if not exists watchlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  symbol text not null,
  created_at timestamptz default now(),
  unique(user_id, symbol)
);
alter table watchlist enable row level security;
create policy "Users can view their own watchlist" on watchlist for select using (auth.uid() = user_id);
create policy "Users can insert into their own watchlist" on watchlist for insert with check (auth.uid() = user_id);
create policy "Users can delete their own watchlist rows" on watchlist for delete using (auth.uid() = user_id);
