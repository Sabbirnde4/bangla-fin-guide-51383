-- =====================================================
-- DATABASE SCHEMA UPDATE FOR MOCK DATA
-- =====================================================

-- Drop all dependent constraints first with CASCADE
ALTER TABLE IF EXISTS public.user_favorites DROP CONSTRAINT IF EXISTS user_favorites_loan_product_id_fkey CASCADE;
ALTER TABLE IF EXISTS public.user_favorites DROP CONSTRAINT IF EXISTS user_favorites_bank_id_fkey CASCADE;
ALTER TABLE IF EXISTS public.loan_products DROP CONSTRAINT IF EXISTS loan_products_bank_id_fkey CASCADE;
ALTER TABLE IF EXISTS public.loan_products DROP CONSTRAINT IF EXISTS loan_products_pkey CASCADE;
ALTER TABLE IF EXISTS public.banks DROP CONSTRAINT IF EXISTS banks_pkey CASCADE;

-- Change banks table ID type to TEXT
ALTER TABLE public.banks ALTER COLUMN id TYPE TEXT USING id::TEXT;
ALTER TABLE public.banks ADD PRIMARY KEY (id);

-- Update related foreign key columns in loan_products
ALTER TABLE public.loan_products ALTER COLUMN id TYPE TEXT USING id::TEXT;
ALTER TABLE public.loan_products ALTER COLUMN bank_id TYPE TEXT USING bank_id::TEXT;
ALTER TABLE public.loan_products ADD PRIMARY KEY (id);

-- Update user_favorites columns
ALTER TABLE public.user_favorites ALTER COLUMN bank_id TYPE TEXT USING bank_id::TEXT;
ALTER TABLE public.user_favorites ALTER COLUMN loan_product_id TYPE TEXT USING loan_product_id::TEXT;

-- Re-add foreign key constraints
ALTER TABLE public.loan_products 
  ADD CONSTRAINT loan_products_bank_id_fkey 
  FOREIGN KEY (bank_id) REFERENCES public.banks(id) ON DELETE CASCADE;

ALTER TABLE public.user_favorites 
  ADD CONSTRAINT user_favorites_bank_id_fkey 
  FOREIGN KEY (bank_id) REFERENCES public.banks(id) ON DELETE SET NULL;

ALTER TABLE public.user_favorites 
  ADD CONSTRAINT user_favorites_loan_product_id_fkey 
  FOREIGN KEY (loan_product_id) REFERENCES public.loan_products(id) ON DELETE SET NULL;

-- Update banks table structure
ALTER TABLE public.banks 
  DROP COLUMN IF EXISTS interest_rate,
  DROP COLUMN IF EXISTS minimum_deposit,
  DROP COLUMN IF EXISTS description;

ALTER TABLE public.banks
  ADD COLUMN IF NOT EXISTS established INTEGER,
  ADD COLUMN IF NOT EXISTS rating NUMERIC(2,1),
  ADD COLUMN IF NOT EXISTS total_branches INTEGER;

-- Rename columns to match mock data (with error handling)
DO $$ 
BEGIN
  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name='banks' AND column_name='logo_url') THEN
    ALTER TABLE public.banks RENAME COLUMN logo_url TO logo;
  END IF;
  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name='banks' AND column_name='website_url') THEN
    ALTER TABLE public.banks RENAME COLUMN website_url TO website;
  END IF;
END $$;

-- Create NBFIs table
CREATE TABLE IF NOT EXISTS public.nbfis (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  logo TEXT,
  established INTEGER,
  rating NUMERIC(2,1),
  total_branches INTEGER,
  website TEXT,
  type TEXT CHECK (type IN ('lease', 'investment', 'merchant', 'housing')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create NGOs table
CREATE TABLE IF NOT EXISTS public.ngos (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  logo TEXT,
  established INTEGER,
  rating NUMERIC(2,1),
  total_branches INTEGER,
  website TEXT,
  focus TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create savings_products table
CREATE TABLE IF NOT EXISTS public.savings_products (
  id TEXT PRIMARY KEY,
  bank_id TEXT NOT NULL REFERENCES public.banks(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  interest_rate NUMERIC(5,2) NOT NULL,
  minimum_deposit NUMERIC(12,2),
  maximum_deposit NUMERIC(12,2),
  tenure_min INTEGER,
  tenure_max INTEGER,
  compounding_frequency TEXT CHECK (compounding_frequency IN ('monthly', 'quarterly', 'yearly')),
  account_opening_fee NUMERIC(10,2),
  maintenance_fee NUMERIC(10,2),
  withdrawal_fee NUMERIC(10,2),
  features TEXT[],
  eligibility TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Update loan_products table structure
ALTER TABLE public.loan_products
  ADD COLUMN IF NOT EXISTS loan_type TEXT CHECK (loan_type IN ('personal', 'home', 'car', 'business', 'student', 'startup')),
  ADD COLUMN IF NOT EXISTS interest_rate_min NUMERIC(5,2),
  ADD COLUMN IF NOT EXISTS interest_rate_max NUMERIC(5,2),
  ADD COLUMN IF NOT EXISTS loan_amount_min NUMERIC(12,2),
  ADD COLUMN IF NOT EXISTS loan_amount_max NUMERIC(12,2),
  ADD COLUMN IF NOT EXISTS tenure_min INTEGER,
  ADD COLUMN IF NOT EXISTS tenure_max INTEGER,
  ADD COLUMN IF NOT EXISTS processing_fee NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS processing_time TEXT,
  ADD COLUMN IF NOT EXISTS eligibility TEXT[],
  ADD COLUMN IF NOT EXISTS required_documents TEXT[],
  ADD COLUMN IF NOT EXISTS features TEXT[];

-- Drop old columns from loan_products
ALTER TABLE public.loan_products
  DROP COLUMN IF EXISTS interest_rate,
  DROP COLUMN IF EXISTS min_amount,
  DROP COLUMN IF EXISTS max_amount,
  DROP COLUMN IF EXISTS term_months,
  DROP COLUMN IF EXISTS type,
  DROP COLUMN IF EXISTS description;

-- Rename columns to match interface
DO $$ 
BEGIN
  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name='loan_products' AND column_name='name') THEN
    ALTER TABLE public.loan_products RENAME COLUMN name TO product_name;
  END IF;
END $$;

-- Enable RLS on new tables
ALTER TABLE public.nbfis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ngos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.savings_products ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Anyone can view NBFIs"
  ON public.nbfis FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage NBFIs"
  ON public.nbfis FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view NGOs"
  ON public.ngos FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage NGOs"
  ON public.ngos FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view savings products"
  ON public.savings_products FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage savings products"
  ON public.savings_products FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Add update triggers
CREATE TRIGGER update_nbfis_updated_at
  BEFORE UPDATE ON public.nbfis
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ngos_updated_at
  BEFORE UPDATE ON public.ngos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_savings_products_updated_at
  BEFORE UPDATE ON public.savings_products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();