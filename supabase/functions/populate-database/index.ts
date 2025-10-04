import { createClient } from 'npm:@supabase/supabase-js@2';
import { banks, savingsProducts, loanProducts, nbfis, ngos } from '../_shared/mockData.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Starting database population...');

    // Insert banks
    console.log(`Inserting ${banks.length} banks...`);
    const { error: banksError } = await supabase
      .from('banks')
      .upsert(banks.map(bank => ({
        id: bank.id,
        name: bank.name,
        logo: bank.logo,
        established: bank.established,
        rating: bank.rating,
        total_branches: bank.totalBranches,
        website: bank.website
      })));

    if (banksError) {
      console.error('Error inserting banks:', banksError);
      throw banksError;
    }

    // Insert NBFIs
    console.log(`Inserting ${nbfis.length} NBFIs...`);
    const { error: nbfisError } = await supabase
      .from('nbfis')
      .upsert(nbfis.map(nbfi => ({
        id: nbfi.id,
        name: nbfi.name,
        logo: nbfi.logo,
        established: nbfi.established,
        rating: nbfi.rating,
        total_branches: nbfi.totalBranches,
        website: nbfi.website,
        type: nbfi.type
      })));

    if (nbfisError) {
      console.error('Error inserting NBFIs:', nbfisError);
      throw nbfisError;
    }

    // Insert NGOs
    console.log(`Inserting ${ngos.length} NGOs...`);
    const { error: ngosError } = await supabase
      .from('ngos')
      .upsert(ngos.map(ngo => ({
        id: ngo.id,
        name: ngo.name,
        logo: ngo.logo,
        established: ngo.established,
        rating: ngo.rating,
        total_branches: ngo.totalBranches,
        website: ngo.website,
        focus: ngo.focus
      })));

    if (ngosError) {
      console.error('Error inserting NGOs:', ngosError);
      throw ngosError;
    }

    // Insert savings products
    console.log(`Inserting ${savingsProducts.length} savings products...`);
    const { error: savingsError } = await supabase
      .from('savings_products')
      .upsert(savingsProducts.map(product => ({
        id: product.id,
        bank_id: product.bankId,
        product_name: product.productName,
        interest_rate: product.interestRate,
        minimum_deposit: product.minimumDeposit,
        maximum_deposit: product.maximumDeposit,
        tenure_min: product.tenure.min,
        tenure_max: product.tenure.max,
        compounding_frequency: product.compoundingFrequency,
        account_opening_fee: product.fees.accountOpening,
        maintenance_fee: product.fees.maintenance,
        withdrawal_fee: product.fees.withdrawal,
        features: product.features,
        eligibility: product.eligibility
      })));

    if (savingsError) {
      console.error('Error inserting savings products:', savingsError);
      throw savingsError;
    }

    // Insert loan products
    console.log(`Inserting ${loanProducts.length} loan products...`);
    const { error: loansError } = await supabase
      .from('loan_products')
      .upsert(loanProducts.map(product => ({
        id: product.id,
        bank_id: product.bankId,
        product_name: product.productName,
        loan_type: product.loanType,
        interest_rate_min: product.interestRate.min,
        interest_rate_max: product.interestRate.max,
        loan_amount_min: product.loanAmount.min,
        loan_amount_max: product.loanAmount.max,
        tenure_min: product.tenure.min,
        tenure_max: product.tenure.max,
        processing_fee: product.processingFee,
        processing_time: product.processingTime,
        eligibility: product.eligibility,
        required_documents: product.requiredDocuments,
        features: product.features
      })));

    if (loansError) {
      console.error('Error inserting loan products:', loansError);
      throw loansError;
    }

    console.log('Database population completed successfully!');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Database populated successfully',
        stats: {
          banks: banks.length,
          nbfis: nbfis.length,
          ngos: ngos.length,
          savingsProducts: savingsProducts.length,
          loanProducts: loanProducts.length
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error populating database:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
