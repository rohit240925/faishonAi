import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { subscriptionService } from '../services/subscriptionService';

const SubscriptionContext = createContext({});

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider = ({ children }) => {
  const { user } = useAuth();
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load subscription plans
  useEffect(() => {
    const loadPlans = async () => {
      try {
        const plans = await subscriptionService?.getSubscriptionPlans();
        setSubscriptionPlans(plans);
      } catch (error) {
        console.error('Error loading subscription plans:', error);
        setError(error?.message);
      }
    };
    
    loadPlans();
  }, []);

  // Load user subscription status
  useEffect(() => {
    const loadSubscriptionStatus = async () => {
      if (!user?.id) {
        setSubscriptionStatus(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const status = await subscriptionService?.getUserSubscriptionStatus(user?.id);
        setSubscriptionStatus(status);
        setError(null);
      } catch (error) {
        console.error('Error loading subscription status:', error);
        setError(error?.message);
        setSubscriptionStatus(null);
      } finally {
        setLoading(false);
      }
    };

    loadSubscriptionStatus();
  }, [user?.id]);

  // Refresh subscription status
  const refreshSubscriptionStatus = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const status = await subscriptionService?.getUserSubscriptionStatus(user?.id);
      setSubscriptionStatus(status);
      setError(null);
    } catch (error) {
      console.error('Error refreshing subscription status:', error);
      setError(error?.message);
    } finally {
      setLoading(false);
    }
  };

  // Subscribe to a plan
  const subscribeToPlan = async (planId, billingInterval = 'monthly') => {
    try {
      setLoading(true);
      const { url } = await subscriptionService?.createCheckoutSession(planId, billingInterval);
      
      // Redirect to Stripe checkout
      window.location.href = url;
    } catch (error) {
      console.error('Error subscribing to plan:', error);
      setError(error?.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Open customer portal
  const openCustomerPortal = async () => {
    try {
      setLoading(true);
      const { url } = await subscriptionService?.createCustomerPortalSession();
      
      // Open in new tab
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error opening customer portal:', error);
      setError(error?.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Check if user has active subscription
  const hasActiveSubscription = () => {
    return subscriptionStatus?.status === 'active';
  };

  // Check if user has sufficient credits
  const hasSufficientCredits = (requiredCredits = 1) => {
    return (subscriptionStatus?.credits_remaining || 0) >= requiredCredits;
  };

  // Get plan by ID
  const getPlanById = (planId) => {
    return subscriptionPlans?.find(plan => plan?.id === planId);
  };

  // Get current plan
  const getCurrentPlan = () => {
    if (!subscriptionStatus?.plan_name) return null;
    return subscriptionPlans?.find(plan => 
      plan?.name?.toLowerCase() === subscriptionStatus?.plan_name?.toLowerCase()
    );
  };

  // Check if feature is available
  const hasFeature = (featureName) => {
    const currentPlan = getCurrentPlan();
    if (!currentPlan) return false;
    
    try {
      const features = Array.isArray(currentPlan?.features) 
        ? currentPlan?.features 
        : JSON.parse(currentPlan?.features || '[]');
      
      return features?.some(feature => 
        feature?.toLowerCase()?.includes(featureName?.toLowerCase())
      );
    } catch (error) {
      console.error('Error checking feature availability:', error);
      return false;
    }
  };

  const value = {
    // State
    subscriptionStatus,
    subscriptionPlans,
    loading,
    error,
    
    // Actions
    refreshSubscriptionStatus,
    subscribeToPlan,
    openCustomerPortal,
    
    // Helpers
    hasActiveSubscription,
    hasSufficientCredits,
    getPlanById,
    getCurrentPlan,
    hasFeature,
    
    // Utils
    formatCurrency: subscriptionService?.formatCurrency,
    formatDate: subscriptionService?.formatDate,
    getStatusColor: subscriptionService?.getStatusColor
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export default SubscriptionProvider;