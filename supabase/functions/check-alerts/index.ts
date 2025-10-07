import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Alert {
  id: string;
  user_id: string;
  alert_type: 'product' | 'bank';
  target_id: string;
  target_name: string;
  condition_type: 'above' | 'below' | 'changes';
  threshold_value: number | null;
  current_value: number;
  is_active: boolean;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Starting alert check...');

    // Fetch all active alerts
    const { data: alerts, error: alertsError } = await supabaseClient
      .from('alerts')
      .select('*')
      .eq('is_active', true);

    if (alertsError) {
      console.error('Error fetching alerts:', alertsError);
      throw alertsError;
    }

    console.log(`Found ${alerts?.length || 0} active alerts`);

    if (!alerts || alerts.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No active alerts to check' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let triggeredCount = 0;

    for (const alert of alerts as Alert[]) {
      try {
        let currentRate: number | null = null;

        // Fetch current rate based on alert type
        if (alert.alert_type === 'product') {
          const { data: product } = await supabaseClient
            .from('savings_products')
            .select('interest_rate_min')
            .eq('id', alert.target_id)
            .single();

          if (product) {
            currentRate = product.interest_rate_min;
          } else {
            // Try loan products
            const { data: loanProduct } = await supabaseClient
              .from('loan_products')
              .select('interest_rate_min')
              .eq('id', alert.target_id)
              .single();

            if (loanProduct) {
              currentRate = loanProduct.interest_rate_min;
            }
          }
        } else if (alert.alert_type === 'bank') {
          // For banks, calculate average rate from their savings products
          const { data: products } = await supabaseClient
            .from('savings_products')
            .select('interest_rate_min')
            .eq('bank_id', alert.target_id);

          if (products && products.length > 0) {
            const sum = products.reduce((acc, p) => acc + p.interest_rate_min, 0);
            currentRate = sum / products.length;
          }
        }

        if (currentRate === null) {
          console.log(`Could not fetch rate for alert ${alert.id}`);
          continue;
        }

        // Check if alert should be triggered
        let shouldTrigger = false;
        const rateChanged = Math.abs(currentRate - alert.current_value) > 0.01;

        if (alert.condition_type === 'changes') {
          shouldTrigger = rateChanged;
        } else if (alert.condition_type === 'above' && alert.threshold_value) {
          shouldTrigger = currentRate > alert.threshold_value && alert.current_value <= alert.threshold_value;
        } else if (alert.condition_type === 'below' && alert.threshold_value) {
          shouldTrigger = currentRate < alert.threshold_value && alert.current_value >= alert.threshold_value;
        }

        // Update current value if changed
        if (rateChanged) {
          await supabaseClient
            .from('alerts')
            .update({ current_value: currentRate })
            .eq('id', alert.id);
        }

        // Create notification if triggered
        if (shouldTrigger) {
          const message = alert.condition_type === 'changes'
            ? `Rate changed from ${alert.current_value.toFixed(2)}% to ${currentRate.toFixed(2)}%`
            : alert.condition_type === 'above'
            ? `Rate increased to ${currentRate.toFixed(2)}% (above your ${alert.threshold_value}% threshold)`
            : `Rate decreased to ${currentRate.toFixed(2)}% (below your ${alert.threshold_value}% threshold)`;

          await supabaseClient
            .from('notifications')
            .insert({
              user_id: alert.user_id,
              alert_id: alert.id,
              title: `Rate Alert: ${alert.target_name}`,
              message: message,
            });

          await supabaseClient
            .from('alerts')
            .update({ last_triggered_at: new Date().toISOString() })
            .eq('id', alert.id);

          triggeredCount++;
          console.log(`Alert ${alert.id} triggered for user ${alert.user_id}`);
        }
      } catch (error) {
        console.error(`Error processing alert ${alert.id}:`, error);
      }
    }

    console.log(`Alert check complete. ${triggeredCount} alerts triggered.`);

    return new Response(
      JSON.stringify({
        message: 'Alert check completed',
        totalAlerts: alerts.length,
        triggeredAlerts: triggeredCount,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in check-alerts function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
