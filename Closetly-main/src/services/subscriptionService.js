import { supabase } from '../lib/supabase';

/**
 * Subscription management service
 */
export const subscriptionService = {
  /**
   * Get all available subscription plans
   */
  async getPlans() {
    try {
      const { data, error } = await supabase?.from('subscription_plans')?.select('*')?.eq('is_active', true)?.order('price_monthly', { ascending: true });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Get plans error:', error);
      throw error;
    }
  },

  /**
   * Get user's current subscription
   */
  async getUserSubscription(userId) {
    try {
      const { data, error } = await supabase?.from('user_subscriptions')?.select(`*,subscription_plans (*)`)?.eq('user_id', userId)?.eq('status', 'active')?.single();

      if (error && error?.code !== 'PGRST116') {
        throw error;
      }

      return data || null;
    } catch (error) {
      console.error('Get user subscription error:', error);
      throw error;
    }
  },

  /**
   * Create Stripe checkout session for subscription
   */
  async createCheckoutSession(planId, interval = 'monthly') {
    try {
      const { data, error } = await supabase?.functions?.invoke('create-checkout-session', {
        body: {
          planId,
          interval,
          successUrl: `${window.location?.origin}/subscription/success`,
          cancelUrl: `${window.location?.origin}/subscription`
        }
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Create checkout session error:', error);
      throw error;
    }
  },

  /**
   * Create Stripe customer portal session
   */
  async createPortalSession() {
    try {
      const { data, error } = await supabase?.functions?.invoke('create-customer-portal', {
        body: {
          returnUrl: `${window.location?.origin}/account`
        }
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Create portal session error:', error);
      throw error;
    }
  },

  /**
   * Purchase additional API credits
   */
  async purchaseCredits(credits) {
    try {
      // Calculate cost with discount
      const { data: costData, error: costError } = await supabase?.rpc('calculate_recharge_cost', { credits });

      if (costError) throw costError;

      const { base_cost, discount_percent, final_cost } = costData?.[0];

      // Create payment intent for credit purchase
      const { data, error } = await supabase?.functions?.invoke('create-checkout-session', {
        body: {
          type: 'credit_recharge',
          credits,
          baseCost: base_cost,
          discountPercent: discount_percent,
          finalCost: final_cost,
          successUrl: `${window.location?.origin}/credits/success`,
          cancelUrl: `${window.location?.origin}/credits`
        }
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Purchase credits error:', error);
      throw error;
    }
  },

  /**
   * Get user's API usage history
   */
  async getApiUsage(userId, limit = 50) {
    try {
      const { data, error } = await supabase?.from('api_usage')?.select(`
          *,
          user_subscriptions:subscription_id(
            plan_id,
            subscription_plans:plan_id(name)
          )
        `)?.eq('user_id', userId)?.order('created_at', { ascending: false })?.limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching API usage:', error);
      throw new Error('Failed to fetch API usage');
    }
  },

  /**
   * Get user's billing history
   */
  async getBillingHistory(userId, page = 1, limit = 20) {
    try {
      const offset = (page - 1) * limit;

      const { data, error, count } = await supabase?.from('billing_history')?.select('*', { count: 'exact' })?.eq('user_id', userId)?.order('created_at', { ascending: false })?.range(offset, offset + limit - 1);

      if (error) throw error;

      return {
        history: data || [],
        total: count || 0,
        page,
        totalPages: Math.ceil((count || 0) / limit)
      };
    } catch (error) {
      console.error('Get billing history error:', error);
      throw error;
    }
  },

  /**
   * Get user's fashion analysis results
   */
  async getFashionAnalysisResults(userId, limit = 20) {
    try {
      const { data, error } = await supabase?.from('fashion_analysis_results')?.select('*')?.eq('user_id', userId)?.order('created_at', { ascending: false })?.limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching fashion analysis results:', error);
      throw new Error('Failed to fetch analysis results');
    }
  },

  /**
   * Process AI fashion generation with credit consumption
   */
  async processAIGeneration({
    prompt,
    generationStyle = 'realistic',
    creativity = 0.7,
    maxImages = 1
  }) {
    try {
      const { data: session, error } = await supabase?.auth?.getSession();
      if (error || !session?.session?.access_token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${import.meta.env?.VITE_SUPABASE_URL}/functions/v1/process-ai-generation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.session?.access_token}`,
        },
        body: JSON.stringify({
          prompt,
          generationStyle,
          creativity,
          maxImages
        }),
      });

      const data = await response?.json();
      if (!response?.ok) {
        throw new Error(data.error || 'Failed to process AI generation');
      }

      return data;
    } catch (error) {
      console.error('Error processing AI generation:', error);
      throw error;
    }
  },

  /**
   * Get subscription status color for UI
   */
  getStatusColor(status) {
    const colors = {
      active: 'text-green-600 bg-green-100',
      inactive: 'text-gray-600 bg-gray-100',
      canceled: 'text-red-600 bg-red-100',
      past_due: 'text-yellow-600 bg-yellow-100',
      paused: 'text-blue-600 bg-blue-100'
    };
    return colors?.[status] || colors?.inactive;
  },

  /**
   * Check if user needs storage upgrade warning
   */
  async checkStorageUpgradeNeeded(userId) {
    try {
      const { data, error } = await supabase?.from('user_profiles')?.select('storage_used_bytes, storage_limit_bytes')?.eq('id', userId)?.single();

      if (error) throw error;

      const usagePercent = (data?.storage_used_bytes / data?.storage_limit_bytes) * 100;
      
      return {
        needsWarning: usagePercent >= 90,
        usagePercent: Math.round(usagePercent),
        used: Math.round(data?.storage_used_bytes / (1024 * 1024)), // MB
        limit: Math.round(data?.storage_limit_bytes / (1024 * 1024)) // MB
      };
    } catch (error) {
      console.error('Check storage upgrade error:', error);
      return { needsWarning: false, usagePercent: 0 };
    }
  },

  /**
   * Send notification email
   */
  async sendNotificationEmail(email, template, data = {}) {
    try {
      const { data: result, error } = await supabase?.functions?.invoke('send-notification-email', {
        body: {
          email,
          subject: this.getEmailSubject(template),
          template,
          data
        }
      });

      if (error) throw error;

      return result;
    } catch (error) {
      console.error('Send notification email error:', error);
      throw error;
    }
  },

  /**
   * Get email subject for template
   */
  getEmailSubject(template) {
    const subjects = {
      welcome: 'Welcome to FashionGen! 🎨',
      subscription_changed: 'Your FashionGen subscription has been updated',
      credit_recharge: 'API credits successfully added to your account',
      storage_warning: 'Storage limit warning - FashionGen'
    };

    return subjects?.[template] || 'FashionGen Notification';
  },

  /**
   * Calculate price with discount
   */
  calculatePrice(planPrice, interval = 'monthly') {
    if (interval === 'yearly') {
      // 2 months free when paying yearly
      return planPrice * 10; // 10 months instead of 12
    }
    return planPrice;
  },

  /**
   * Format price for display
   */
  formatPrice(price, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    })?.format(price);
  },

  /**
   * Format date
   */
  formatDate(dateString) {
    if (!dateString) return 'N/A';
    return new Date(dateString)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
};

export default subscriptionService;