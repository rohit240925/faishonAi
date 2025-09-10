
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0';
import Stripe from 'https://esm.sh/stripe@12.0.0?target=deno';

// Add Deno type declaration for global access
declare const Deno: {
  env: {
    get: (key: string) => string | undefined;
  };
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*'
};

serve(async (req) => {
  if (req?.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno?.env?.get('SUPABASE_URL');
    const supabaseKey = Deno?.env?.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Create Stripe client
    const stripeKey = Deno?.env?.get('STRIPE_SECRET_KEY');
    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
    });

    if (req?.method === 'POST') {
      const { subscriptionId, newPriceId } = await req?.json();

      // Get JWT from Authorization header
      const authHeader = req?.headers?.get('Authorization');
      if (!authHeader) {
        throw new Error('No authorization header');
      }

      // Verify JWT and get user
      const token = authHeader?.replace('Bearer ', '');
      const { data: { user }, error: authError } = await supabase?.auth?.getUser(token);
      if (authError || !user) {
        throw new Error('Invalid authentication');
      }

      // Get user profile with Stripe customer ID
      const { data: userProfile, error: profileError } = await supabase?.from('user_profiles')?.select('*')?.eq('id', user?.id)?.single();
      if (profileError) {
        throw new Error('User profile not found');
      }

      // Retrieve subscription from Stripe
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      if (!subscription) {
        throw new Error('Subscription not found');
      }

      // Update subscription plan with proration
      const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
        items: [{
          id: subscription.items.data[0].id,
          price: newPriceId,
        }],
        proration_behavior: 'create_prorations',
      });

      return new Response(JSON.stringify({ success: true, updatedSubscription }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Change plan error:', error);
    return new Response(JSON.stringify({
      error: error.message || 'Failed to change plan'
    }), {
      status: 400,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});
