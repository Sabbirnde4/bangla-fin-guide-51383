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