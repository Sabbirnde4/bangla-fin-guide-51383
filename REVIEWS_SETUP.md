# Reviews & Ratings Setup Instructions

This document contains the SQL needed to create the reviews and ratings tables for BankCompare BD.

## Setup Steps

1. Open your Supabase project dashboard
2. Go to the SQL Editor
3. Copy and paste the SQL below
4. Click "Run" to execute

## SQL Migration

```sql
-- Create reviews tables for products and banks
-- Product Reviews (for both savings and loans)
create table if not exists public.product_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  product_id text not null,
  product_type text not null check (product_type in ('savings', 'loans')),
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text not null check (char_length(comment) >= 10 and char_length(comment) <= 1000),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, product_id, product_type)
);

-- Bank Reviews
create table if not exists public.bank_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  bank_id text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text not null check (char_length(comment) >= 10 and char_length(comment) <= 1000),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, bank_id)
);

-- Enable RLS
alter table public.product_reviews enable row level security;
alter table public.bank_reviews enable row level security;

-- RLS Policies for product_reviews
create policy "Anyone can read product reviews"
  on public.product_reviews
  for select
  using (true);

create policy "Users can insert their own product reviews"
  on public.product_reviews
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own product reviews"
  on public.product_reviews
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own product reviews"
  on public.product_reviews
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- RLS Policies for bank_reviews
create policy "Anyone can read bank reviews"
  on public.bank_reviews
  for select
  using (true);

create policy "Users can insert their own bank reviews"
  on public.bank_reviews
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own bank reviews"
  on public.bank_reviews
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own bank reviews"
  on public.bank_reviews
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- Create indexes for better query performance
create index if not exists product_reviews_product_id_idx on public.product_reviews(product_id, product_type);
create index if not exists product_reviews_user_id_idx on public.product_reviews(user_id);
create index if not exists product_reviews_created_at_idx on public.product_reviews(created_at desc);
create index if not exists bank_reviews_bank_id_idx on public.bank_reviews(bank_id);
create index if not exists bank_reviews_user_id_idx on public.bank_reviews(user_id);
create index if not exists bank_reviews_created_at_idx on public.bank_reviews(created_at desc);

-- Create function to automatically update the updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

-- Create triggers to call the function
create trigger product_reviews_updated_at
  before update on public.product_reviews
  for each row
  execute function public.handle_updated_at();

create trigger bank_reviews_updated_at
  before update on public.bank_reviews
  for each row
  execute function public.handle_updated_at();
```

## Features

### Product Reviews
- Users can review both savings and loan products
- Each user can only leave one review per product
- Reviews include a 1-5 star rating and text comment
- Users can update or delete their own reviews
- All reviews are publicly visible

### Bank Reviews
- Users can review banks
- Each user can only leave one review per bank
- Reviews include a 1-5 star rating and text comment
- Users can update or delete their own reviews
- All reviews are publicly visible

### Security
- Row Level Security (RLS) is enabled
- Users must be authenticated to create, update, or delete reviews
- Users can only modify their own reviews
- All reviews are readable by everyone (including non-authenticated users)
- Input validation ensures ratings are 1-5 and comments are 10-1000 characters

### UI Components Created
- `ReviewList`: Displays all reviews with user info and timestamps
- `ReviewForm`: Form for submitting/updating reviews with star rating and comment
- `ReviewStats`: Shows average rating and rating distribution
- Integrated into ProductDetailPage and BankDetailPage

## Next Steps

After running the SQL:
1. The reviews feature will be immediately available
2. Users need to be logged in to write reviews
3. Reviews will appear on both product detail pages and bank detail pages
