
# MVP Completion Plan: Core Database & Final Polish

## Overview
The application has all frontend features built, but is **non-functional** because the core database tables don't exist. This plan creates the essential database infrastructure and completes remaining MVP items.

---

## Phase 1: Create Core Database Tables (Critical)

### 1.1 Banks Table
Create the `banks` table with the following schema:

```text
banks
├── id (text, primary key)
├── name (text, not null)
├── logo (text, nullable)
├── established (integer, nullable)
├── rating (numeric, nullable)
├── total_branches (integer, nullable)
├── website (text, nullable)
├── created_at (timestamptz)
└── updated_at (timestamptz)
```

**RLS Policies:**
- Public read access (anyone can view banks)
- Admin-only write access (insert/update/delete)

### 1.2 NBFIs Table
Create the `nbfis` table for Non-Bank Financial Institutions:

```text
nbfis
├── id (text, primary key)
├── name (text, not null)
├── logo (text, nullable)
├── established (integer, nullable)
├── rating (numeric, nullable)
├── total_branches (integer, nullable)
├── type (text, nullable) -- 'lease', 'investment', 'merchant', 'housing'
├── website (text, nullable)
├── created_at (timestamptz)
└── updated_at (timestamptz)
```

### 1.3 NGOs Table
Create the `ngos` table for microfinance organizations:

```text
ngos
├── id (text, primary key)
├── name (text, not null)
├── logo (text, nullable)
├── established (integer, nullable)
├── rating (numeric, nullable)
├── total_branches (integer, nullable)
├── focus (text[], nullable) -- array of focus areas
├── website (text, nullable)
├── created_at (timestamptz)
└── updated_at (timestamptz)
```

### 1.4 Savings Products Table
Create the `savings_products` table with foreign key to banks:

```text
savings_products
├── id (text, primary key)
├── bank_id (text, references banks)
├── product_name (text, not null)
├── interest_rate (numeric, not null)
├── minimum_deposit (numeric, nullable)
├── maximum_deposit (numeric, nullable)
├── tenure_min (integer, nullable) -- months
├── tenure_max (integer, nullable) -- months
├── compounding_frequency (text, nullable)
├── account_opening_fee (numeric, nullable)
├── maintenance_fee (numeric, nullable)
├── withdrawal_fee (numeric, nullable)
├── features (text[], nullable)
├── eligibility (text[], nullable)
├── created_at (timestamptz)
└── updated_at (timestamptz)
```

### 1.5 Loan Products Table
Create the `loan_products` table with foreign key to banks:

```text
loan_products
├── id (text, primary key)
├── bank_id (text, references banks)
├── product_name (text, not null)
├── loan_type (text, nullable)
├── interest_rate_min (numeric, nullable)
├── interest_rate_max (numeric, nullable)
├── loan_amount_min (numeric, nullable)
├── loan_amount_max (numeric, nullable)
├── tenure_min (integer, nullable)
├── tenure_max (integer, nullable)
├── processing_fee (numeric, nullable)
├── processing_time (text, nullable)
├── features (text[], nullable)
├── eligibility (text[], nullable)
├── required_documents (text[], nullable)
├── created_at (timestamptz)
└── updated_at (timestamptz)
```

---

## Phase 2: Performance Indexes

Add indexes for frequently queried columns:

```text
Indexes to create:
├── idx_banks_name (banks.name)
├── idx_banks_rating (banks.rating)
├── idx_savings_products_bank_id (savings_products.bank_id)
├── idx_savings_products_interest_rate (savings_products.interest_rate)
├── idx_loan_products_bank_id (loan_products.bank_id)
├── idx_loan_products_loan_type (loan_products.loan_type)
└── idx_loan_products_interest_rate_min (loan_products.interest_rate_min)
```

---

## Phase 3: Deploy & Test Edge Function

### 3.1 Deploy populate-database Function
The edge function already exists at `supabase/functions/populate-database/index.ts`. It will be deployed automatically and can populate all tables with Bangladesh banking data.

### 3.2 Test Data Seeding
After tables are created:
1. Admin logs into the app
2. Navigate to Admin > Overview
3. Click "Seed Database with Mock Data" button
4. This populates 60+ banks, 18 NBFIs, 10+ NGOs, and their products

---

## Phase 4: Update Type Definitions

Update `src/integrations/supabase/types.ts` to reflect the new tables (this happens automatically when tables are created via migrations).

---

## Phase 5: Final Polish Items

### 5.1 Financial Term Tooltips
Add explanatory tooltips throughout the app for terms like:
- APR (Annual Percentage Rate)
- Interest Rate
- Compounding Frequency
- Tenure
- Processing Fee
- EMI (Equated Monthly Installment)

**Files to update:**
- `src/pages/SavingsPage.tsx`
- `src/pages/LoansPage.tsx`
- `src/pages/ProductDetailPage.tsx`
- `src/components/QuickCalculator.tsx`

### 5.2 Mobile Responsiveness Check
Review and fix any responsive layout issues on:
- Product comparison grid
- Admin tables
- Filter panels

---

## Technical Details

### Database Migration SQL

```sql
-- Create banks table
CREATE TABLE public.banks (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  logo TEXT,
  established INTEGER,
  rating NUMERIC(3,2),
  total_branches INTEGER,
  website TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create nbfis table
CREATE TABLE public.nbfis (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  logo TEXT,
  established INTEGER,
  rating NUMERIC(3,2),
  total_branches INTEGER,
  type TEXT,
  website TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create ngos table
CREATE TABLE public.ngos (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  logo TEXT,
  established INTEGER,
  rating NUMERIC(3,2),
  total_branches INTEGER,
  focus TEXT[],
  website TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create savings_products table
CREATE TABLE public.savings_products (
  id TEXT PRIMARY KEY,
  bank_id TEXT REFERENCES banks(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  interest_rate NUMERIC(5,2) NOT NULL,
  minimum_deposit NUMERIC(15,2),
  maximum_deposit NUMERIC(15,2),
  tenure_min INTEGER,
  tenure_max INTEGER,
  compounding_frequency TEXT,
  account_opening_fee NUMERIC(10,2),
  maintenance_fee NUMERIC(10,2),
  withdrawal_fee NUMERIC(10,2),
  features TEXT[],
  eligibility TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create loan_products table
CREATE TABLE public.loan_products (
  id TEXT PRIMARY KEY,
  bank_id TEXT REFERENCES banks(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  loan_type TEXT,
  interest_rate_min NUMERIC(5,2),
  interest_rate_max NUMERIC(5,2),
  loan_amount_min NUMERIC(15,2),
  loan_amount_max NUMERIC(15,2),
  tenure_min INTEGER,
  tenure_max INTEGER,
  processing_fee NUMERIC(5,2),
  processing_time TEXT,
  features TEXT[],
  eligibility TEXT[],
  required_documents TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.banks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nbfis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ngos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.savings_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loan_products ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Anyone can read banks" ON public.banks 
  FOR SELECT USING (true);
CREATE POLICY "Anyone can read nbfis" ON public.nbfis 
  FOR SELECT USING (true);
CREATE POLICY "Anyone can read ngos" ON public.ngos 
  FOR SELECT USING (true);
CREATE POLICY "Anyone can read savings_products" ON public.savings_products 
  FOR SELECT USING (true);
CREATE POLICY "Anyone can read loan_products" ON public.loan_products 
  FOR SELECT USING (true);

-- Admin write policies (using service role for seeding)
CREATE POLICY "Service role can manage banks" ON public.banks 
  FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role can manage nbfis" ON public.nbfis 
  FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role can manage ngos" ON public.ngos 
  FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role can manage savings_products" ON public.savings_products 
  FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role can manage loan_products" ON public.loan_products 
  FOR ALL USING (true) WITH CHECK (true);

-- Performance indexes
CREATE INDEX idx_banks_name ON public.banks(name);
CREATE INDEX idx_banks_rating ON public.banks(rating DESC);
CREATE INDEX idx_nbfis_name ON public.nbfis(name);
CREATE INDEX idx_nbfis_type ON public.nbfis(type);
CREATE INDEX idx_ngos_name ON public.ngos(name);
CREATE INDEX idx_savings_products_bank_id ON public.savings_products(bank_id);
CREATE INDEX idx_savings_products_interest_rate ON public.savings_products(interest_rate DESC);
CREATE INDEX idx_loan_products_bank_id ON public.loan_products(bank_id);
CREATE INDEX idx_loan_products_loan_type ON public.loan_products(loan_type);
CREATE INDEX idx_loan_products_interest_rate_min ON public.loan_products(interest_rate_min);

-- Add updated_at triggers
CREATE TRIGGER handle_banks_updated_at
  BEFORE UPDATE ON public.banks
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_nbfis_updated_at
  BEFORE UPDATE ON public.nbfis
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_ngos_updated_at
  BEFORE UPDATE ON public.ngos
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_savings_products_updated_at
  BEFORE UPDATE ON public.savings_products
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_loan_products_updated_at
  BEFORE UPDATE ON public.loan_products
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/pages/SavingsPage.tsx` | Add tooltip wrappers for financial terms |
| `src/pages/LoansPage.tsx` | Add tooltip wrappers for financial terms |
| `src/pages/ProductDetailPage.tsx` | Add tooltip explanations |
| `src/components/QuickCalculator.tsx` | Add EMI/ROI term tooltips |

---

## Post-Implementation Checklist

- [ ] All 5 core tables created with RLS policies
- [ ] Performance indexes applied
- [ ] Edge function deployed and tested
- [ ] Database seeded with Bangladesh banking data
- [ ] Verify Savings page loads real data
- [ ] Verify Loans page loads real data
- [ ] Verify Banks page loads real data
- [ ] Test product detail pages
- [ ] Test bank detail pages
- [ ] Financial tooltips added
- [ ] Mobile responsiveness verified
- [ ] Admin panel data management working

---

## Estimated Effort
- Database setup: 1 migration
- Data seeding: Use existing edge function
- Tooltips: 4 files
- Testing: Manual verification

This plan transforms the app from a non-functional shell into a fully working MVP with real Bangladesh banking data.
