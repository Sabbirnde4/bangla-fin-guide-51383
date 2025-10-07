# Setting Up Automated Alert Checking

To enable automatic monitoring of interest rate changes, you need to set up a cron job that runs the alert checking function periodically.

## Step 1: Enable Required Extensions

Run this SQL in your Supabase SQL Editor:

```sql
-- Enable pg_cron for scheduling
create extension if not exists pg_cron with schema extensions;

-- Enable pg_net for making HTTP requests
create extension if not exists pg_net with schema extensions;
```

## Step 2: Create the Cron Job

Replace `YOUR_PROJECT_REF` and `YOUR_ANON_KEY` with your actual Supabase project values:

```sql
-- Schedule the alert checker to run every hour
select cron.schedule(
  'check-rate-alerts-hourly',
  '0 * * * *', -- Every hour at minute 0
  $$
  select
    net.http_post(
        url:='https://YOUR_PROJECT_REF.supabase.co/functions/v1/check-alerts',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb,
        body:=concat('{"time": "', now(), '"}')::jsonb
    ) as request_id;
  $$
);
```

## Alternative Schedules

You can adjust the cron schedule to check more or less frequently:

```sql
-- Every 15 minutes
'*/15 * * * *'

-- Every 30 minutes
'*/30 * * * *'

-- Every 6 hours
'0 */6 * * *'

-- Daily at 9 AM
'0 9 * * *'
```

## Viewing Scheduled Jobs

To see all scheduled cron jobs:

```sql
select * from cron.job;
```

## Removing a Cron Job

If you need to remove the scheduled job:

```sql
select cron.unschedule('check-rate-alerts-hourly');
```

## Manual Testing

You can manually trigger the alert checker by calling the edge function:

```bash
curl -X POST 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/check-alerts' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json'
```

## How It Works

1. The cron job runs at your specified interval
2. It calls the `check-alerts` edge function
3. The function fetches all active alerts
4. For each alert, it checks current interest rates
5. If conditions are met, it creates notifications for users
6. Users see notifications on the Alerts page
