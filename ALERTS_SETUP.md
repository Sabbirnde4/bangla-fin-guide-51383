# Alerts System Setup

This guide will help you set up the alerts system for tracking interest rate changes on products and banks.

## Database Setup

Run this SQL in your Supabase SQL Editor:

```sql
-- Create alerts table
create table public.alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  alert_type text not null check (alert_type in ('product', 'bank')),
  target_id uuid not null,
  target_name text not null,
  condition_type text not null check (condition_type in ('above', 'below', 'changes')),
  threshold_value numeric(5,2),
  current_value numeric(5,2) not null,
  is_active boolean default true,
  last_triggered_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.alerts enable row level security;

-- RLS Policies
create policy "Users can view their own alerts"
  on public.alerts for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can create their own alerts"
  on public.alerts for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own alerts"
  on public.alerts for update
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can delete their own alerts"
  on public.alerts for delete
  to authenticated
  using (auth.uid() = user_id);

-- Create indexes
create index alerts_user_id_idx on public.alerts(user_id);
create index alerts_target_id_idx on public.alerts(target_id);
create index alerts_is_active_idx on public.alerts(is_active);

-- Add updated_at trigger
create trigger handle_alerts_updated_at
  before update on public.alerts
  for each row
  execute function handle_updated_at();

-- Create notifications table
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  alert_id uuid references public.alerts(id) on delete cascade not null,
  title text not null,
  message text not null,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.notifications enable row level security;

-- RLS Policies
create policy "Users can view their own notifications"
  on public.notifications for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can update their own notifications"
  on public.notifications for update
  to authenticated
  using (auth.uid() = user_id);

-- Create index
create index notifications_user_id_idx on public.notifications(user_id);
create index notifications_is_read_idx on public.notifications(is_read);
```

## Features

- **Rate Monitoring**: Set alerts when interest rates go above/below thresholds or when they change
- **Multiple Alert Types**: Support for both product and bank alerts
- **Active/Inactive States**: Toggle alerts on/off without deleting them
- **Notifications**: Get notified when alerts are triggered
- **Dashboard Integration**: View and manage all alerts from one place

## Next Steps

1. Run the SQL migration above in Supabase
2. The UI components are already integrated into product and bank detail pages
3. Set up the cron job to run the alert checker (see edge function documentation)
