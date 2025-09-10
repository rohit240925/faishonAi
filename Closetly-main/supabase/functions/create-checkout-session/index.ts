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
            const { planId, billingInterval = 'monthly' } = await req?.json();
            
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

            // Get subscription plan details
            const { data: plan, error: planError } = await supabase?.from('subscription_plans')?.select('*')?.eq('id', planId)?.eq('is_active', true)?.single();

            if (planError || !plan) {
                throw new Error('Subscription plan not found');
            }

            // Create or get Stripe customer
            let stripeCustomerId = userProfile?.stripe_customer_id;
            
            if (!stripeCustomerId) {
                const customer = await stripe?.customers?.create({
                    email: userProfile?.email,
                    name: userProfile?.full_name,
                    metadata: {
                        supabase_user_id: user?.id
                    }
                });
                
                stripeCustomerId = customer?.id;
                
                // Update user profile with Stripe customer ID
                await supabase?.from('user_profiles')?.update({ stripe_customer_id: stripeCustomerId })?.eq('id', user?.id);
            }

            // Determine price based on billing interval
            const unitAmount = billingInterval === 'yearly' 
                ? Math.round(plan?.price_yearly * 100)
                : Math.round(plan?.price_monthly * 100);

            const credits = billingInterval === 'yearly'
                ? plan?.api_credits_yearly
                : plan?.api_credits_monthly;

            // Create Stripe checkout session
            const session = await stripe?.checkout?.sessions?.create({
                customer: stripeCustomerId,
                payment_method_types: ['card'],
                mode: 'subscription',
                line_items: [{
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `${plan?.name} Plan`,
                            description: `${plan?.description} - ${credits} API credits ${billingInterval}`,
                            metadata: {
                                plan_id: planId,
                                billing_interval: billingInterval,
                                credits_included: credits?.toString()
                            }
                        },
                        unit_amount: unitAmount,
                        recurring: {
                            interval: billingInterval === 'yearly' ? 'year' : 'month'
                        }
                    },
                    quantity: 1,
                }],
                success_url: `${req?.headers?.get('origin')}/customer-portal?success=true&session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${req?.headers?.get('origin')}/subscription-management?canceled=true`,
                metadata: {
                    user_id: user?.id,
                    plan_id: planId,
                    billing_interval: billingInterval
                },
                subscription_data: {
                    metadata: {
                        user_id: user?.id,
                        plan_id: planId,
                        billing_interval: billingInterval
                    }
                },
                customer_update: {
                    name: 'auto',
                    address: 'auto'
                },
                billing_address_collection: 'required',
                tax_id_collection: {
                    enabled: true
                }
            });

            return new Response(JSON.stringify({
                sessionId: session.id,
                url: session.url
            }), {
                headers: { 
                    ...corsHeaders, 
                    'Content-Type': 'application/json' 
                }
            });
        }

        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Checkout session error:', error);
        return new Response(JSON.stringify({
            error: error.message || 'Failed to create checkout session'
        }), {
            status: 400,
            headers: {
                ...corsHeaders,
                'Content-Type': 'application/json'
            }
        });
    }
});