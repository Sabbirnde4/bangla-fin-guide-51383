# Complete Database Population Guide

This guide walks you through all steps needed to fully populate your BankCompare BD database.

## Step 1: Run SQL Migrations (REQUIRED)

You need to run these SQL migrations in your Supabase SQL Editor to create all necessary tables.

### 1.1 Reviews & Ratings Tables

1. Open your Supabase dashboard at https://supabase.com/dashboard
2. Navigate to your project (oxnvxljwcukaguznuqwc)
3. Go to **SQL Editor** (in left sidebar)
4. Click "New Query"
5. Copy the SQL from `REVIEWS_SETUP.md` (lines 15-125)
6. Click "Run" to execute

This creates:
- `product_reviews` table (for savings & loan product reviews)
- `bank_reviews` table
- RLS policies for secure access
- Indexes for performance
- Auto-update triggers

### 1.2 Alerts System Tables

1. In the same SQL Editor, click "New Query" again
2. Copy the SQL from `ALERTS_SETUP.md` (lines 10-89)
3. Click "Run" to execute

This creates:
- `alerts` table (for interest rate alerts)
- `notifications` table
- RLS policies
- Indexes
- Triggers

### 1.3 Verify Tables Created

Run this query to verify all tables exist:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'banks', 'nbfis', 'ngos', 
  'savings_products', 'loan_products',
  'product_reviews', 'bank_reviews',
  'alerts', 'notifications',
  'user_roles'
)
ORDER BY table_name;
```

You should see all 10 tables listed.

## Step 2: Populate Database with Mock Data

After running the SQL migrations, you have two options:

### Option A: Use the "Seed Database" Button (Easiest)

1. Log in to your app as an admin user
2. Go to the **Admin** page (click hamburger menu → Admin)
3. In the "Overview" tab, scroll down to "Data Seeding System"
4. Click the **"Seed Database with Mock Data"** button
5. Wait for the success toast message

This will populate:
- 60+ banks (state-owned, private, foreign, specialized)
- 18 NBFIs (leasing, investment, merchant banks, housing finance)
- 10+ NGOs (microfinance organizations)
- Multiple savings products per institution
- Various loan products (personal, home, car, business, student)

### Option B: Use CSV Upload (For Real Bangladesh Data)

1. Go to Admin page → "Overview" tab → "Data Upload" section
2. Download the CSV template for each data type:
   - Banks
   - NBFIs
   - NGOs
   - Savings Products
   - Loan Products
3. Fill in real Bangladesh banking data
4. Upload each CSV file

**Data Guidelines:**
- Use consistent IDs across files (e.g., bank_id in products should match bank IDs)
- Interest rates should be in percentage format (e.g., 7.5 for 7.5%)
- Use ISO format for dates
- Ensure all required fields are filled

## Step 3: Verify Data Population

### Check Data in Supabase

Run these queries in SQL Editor:

```sql
-- Count records in each table
SELECT 
  (SELECT COUNT(*) FROM banks) as banks_count,
  (SELECT COUNT(*) FROM nbfis) as nbfis_count,
  (SELECT COUNT(*) FROM ngos) as ngos_count,
  (SELECT COUNT(*) FROM savings_products) as savings_count,
  (SELECT COUNT(*) FROM loan_products) as loans_count;

-- View sample data
SELECT * FROM banks LIMIT 5;
SELECT * FROM savings_products LIMIT 5;
SELECT * FROM loan_products LIMIT 5;
```

### Check Data in App

1. Navigate to **/savings** page - should see savings products listed
2. Navigate to **/loans** page - should see loan products listed
3. Navigate to **/banks** page - should see all financial institutions
4. Click on any product - should load product details
5. Click on any bank - should load bank profile

## Step 4: Set Up Alerts Cron Job (Optional but Recommended)

Follow the instructions in `ALERTS_CRON_SETUP.md` to set up automatic alert checking.

This enables:
- Automatic monitoring of interest rate changes
- Notification creation when alert conditions are met
- Background processing every hour (configurable)

## Step 5: Database Optimization (After Population)

Run these queries to optimize performance:

```sql
-- Add indexes for frequently queried columns
CREATE INDEX IF NOT EXISTS banks_name_idx ON banks(name);
CREATE INDEX IF NOT EXISTS banks_rating_idx ON banks(rating);
CREATE INDEX IF NOT EXISTS savings_products_bank_id_idx ON savings_products(bank_id);
CREATE INDEX IF NOT EXISTS savings_products_interest_rate_idx ON savings_products(interest_rate);
CREATE INDEX IF NOT EXISTS loan_products_bank_id_idx ON loan_products(bank_id);
CREATE INDEX IF NOT EXISTS loan_products_loan_type_idx ON loan_products(loan_type);
CREATE INDEX IF NOT EXISTS loan_products_interest_rate_min_idx ON loan_products(interest_rate_min);

-- Update table statistics for better query planning
ANALYZE banks;
ANALYZE nbfis;
ANALYZE ngos;
ANALYZE savings_products;
ANALYZE loan_products;
```

## Troubleshooting

### "Seed Database" Button Not Working
- Check browser console for errors
- Verify you're logged in as admin
- Check that the populate-database edge function is deployed

### Data Not Showing in App
- Verify tables are populated (use SQL queries above)
- Check RLS policies are created correctly
- Ensure user is authenticated if required

### Foreign Key Errors on Upload
- Ensure bank_id in products matches actual bank IDs
- Use the correct ID format (text, not numbers)
- Check for typos in bank IDs

### Duplicate Key Errors
- The system uses upsert, which updates existing records
- If you get duplicate errors, there may be unique constraint violations
- Check that email addresses and other unique fields are unique

## Next Steps After Population

1. ✅ Test all pages to ensure data loads correctly
2. ✅ Create sample reviews (requires user accounts)
3. ✅ Test alert creation and notifications
4. ✅ Test comparison feature with multiple products
5. ✅ Verify search functionality works
6. ✅ Check that favorites system works
7. ✅ Test admin panel CRUD operations

## Data Maintenance

### Regular Updates
- Update interest rates regularly (use admin panel or CSV upload)
- Add new products as banks launch them
- Update bank information (branches, ratings, etc.)
- Monitor and moderate user reviews

### Backup Strategy
- Supabase automatically backs up your database
- You can export data using the admin panel or SQL Editor
- Keep CSV backups of critical data

---

**Need Help?** Check the README.md for more information or contact support.
