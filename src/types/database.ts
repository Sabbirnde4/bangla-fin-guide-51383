// Local type definitions for database tables
// These are manually defined types that match the database schema
// They bypass the auto-generated Supabase types which may be out of sync

// Bank type
export interface Bank {
  id: string;
  name: string;
  logo: string | null;
  established: number | null;
  rating: number | null;
  total_branches: number | null;
  website: string | null;
  created_at: string;
  updated_at: string;
}

// Savings Product type
export interface SavingsProduct {
  id: string;
  bank_id: string;
  product_name: string;
  interest_rate: number;
  minimum_deposit: number | null;
  maximum_deposit: number | null;
  tenure_min: number | null;
  tenure_max: number | null;
  compounding_frequency: string | null;
  account_opening_fee: number | null;
  maintenance_fee: number | null;
  withdrawal_fee: number | null;
  features: string[] | null;
  eligibility: string[] | null;
  created_at: string;
  updated_at: string;
}

// Loan Product type
export interface LoanProduct {
  id: string;
  bank_id: string;
  product_name: string;
  loan_type: string | null;
  interest_rate_min: number | null;
  interest_rate_max: number | null;
  loan_amount_min: number | null;
  loan_amount_max: number | null;
  tenure_min: number | null;
  tenure_max: number | null;
  processing_fee: number | null;
  processing_time: string | null;
  features: string[] | null;
  eligibility: string[] | null;
  required_documents: string[] | null;
  created_at: string;
  updated_at: string;
}

// Profile type
export interface Profile {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

// User Favorite type
export interface UserFavorite {
  id: string;
  user_id: string;
  bank_id: string | null;
  loan_product_id: string | null;
  created_at: string;
}

// User Role type
export interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'user';
  created_at: string;
}

// Extended product types with bank relation
export interface SavingsProductWithBank extends SavingsProduct {
  banks: Pick<Bank, 'name' | 'website' | 'rating' | 'total_branches'> | null;
}

export interface LoanProductWithBank extends LoanProduct {
  banks: Pick<Bank, 'name' | 'website' | 'rating' | 'total_branches'> | null;
}

// Product review type
export interface ProductReview {
  id: string;
  user_id: string;
  product_id: string;
  product_type: 'savings' | 'loans';
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
  profiles?: Pick<Profile, 'first_name' | 'last_name'> | null;
}

// Bank review type
export interface BankReview {
  id: string;
  user_id: string;
  bank_id: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
  profiles?: Pick<Profile, 'first_name' | 'last_name'> | null;
}

// Alert type
export interface Alert {
  id: string;
  user_id: string;
  alert_type: 'product' | 'bank';
  target_id: string;
  target_name: string;
  condition_type: 'above' | 'below' | 'changes';
  threshold_value: number | null;
  current_value: number;
  is_active: boolean;
  last_triggered_at: string | null;
  created_at: string;
  updated_at: string;
}

// Notification type
export interface Notification {
  id: string;
  user_id: string;
  alert_id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

// Insert types for mutations
export interface ProductReviewInsert {
  user_id: string;
  product_id: string;
  product_type: 'savings' | 'loans';
  rating: number;
  comment: string;
}

export interface AlertInsert {
  user_id: string;
  alert_type: 'product' | 'bank';
  target_id: string;
  target_name: string;
  condition_type: 'above' | 'below' | 'changes';
  threshold_value?: number | null;
  current_value: number;
}

// NBFI type
export interface Nbfi {
  id: string;
  name: string;
  logo: string | null;
  established: number | null;
  rating: number | null;
  total_branches: number | null;
  type: string | null;
  website: string | null;
  created_at: string;
  updated_at: string;
}

// NGO type
export interface Ngo {
  id: string;
  name: string;
  logo: string | null;
  established: number | null;
  rating: number | null;
  total_branches: number | null;
  focus: string[] | null;
  website: string | null;
  created_at: string;
  updated_at: string;
}
