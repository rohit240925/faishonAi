// src/pages/subscription-management/components/PlanModificationModal.jsx
import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const PlanModificationModal = ({ subscription, modificationType, onSubmit, onCancel }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [effectiveDate, setEffectiveDate] = useState('immediate');
  const [customDate, setCustomDate] = useState('');
  const [prorationMethod, setProrationMethod] = useState('prorated');
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculations, setCalculations] = useState(null);

  // Available plans for upgrade/downgrade
  const availablePlans = [
    {
      id: 'plan_starter',
      name: 'Starter Plan',
      type: 'starter',
      price: 99.00,
      currency: 'USD',
      features: ['Up to 1,000 API calls', 'Email support', 'Basic analytics'],
      tier: 1
    },
    {
      id: 'plan_professional',
      name: 'Professional Plan',
      type: 'professional',
      price: 499.00,
      currency: 'USD',
      features: ['Up to 5,000 API calls', 'Priority support', 'Advanced analytics', 'Custom integrations'],
      tier: 2
    },
    {
      id: 'plan_business',
      name: 'Business Plan',
      type: 'business',
      price: 999.00,
      currency: 'USD',
      features: ['Up to 10,000 API calls', 'Phone support', 'Advanced analytics', 'Custom integrations', 'SLA guarantee'],
      tier: 3
    },
    {
      id: 'plan_enterprise',
      name: 'Enterprise Plan',
      type: 'enterprise',
      price: 1999.00,
      currency: 'USD',
      features: ['Unlimited API calls', 'Dedicated support', 'Full analytics suite', 'All integrations', 'Custom SLA'],
      tier: 4
    }
  ];

  // Get current plan tier
  const currentPlan = availablePlans?.find(p => p?.type === subscription?.plan?.type);
  const currentTier = currentPlan?.tier || 1;

  // Filter plans based on modification type
  const filteredPlans = availablePlans?.filter(plan => {
    if (modificationType === 'upgrade') {
      return plan?.tier > currentTier;
    } else {
      return plan?.tier < currentTier;
    }
  });

  // Calculate proration when plan or date changes
  useEffect(() => {
    if (selectedPlan && subscription) {
      calculateProration();
    }
  }, [selectedPlan, effectiveDate, customDate, prorationMethod]);

  // Format currency
  const formatCurrency = (amount, currency = 'USD') => {
    return `$${amount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Calculate proration amounts
  const calculateProration = async () => {
    if (!selectedPlan || !subscription) return;

    setIsCalculating(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      const currentPrice = subscription?.plan?.price;
      const newPrice = selectedPlan?.price;
      const priceDifference = newPrice - currentPrice;

      // Calculate days remaining in current billing cycle
      const today = new Date();
      const nextBilling = new Date(subscription.nextBillingDate);
      const daysBetween = Math.ceil((nextBilling - today) / (1000 * 60 * 60 * 24));
      const totalDaysInCycle = subscription?.plan?.billingFrequency === 'monthly' ? 30 :
                               subscription?.plan?.billingFrequency === 'quarterly' ? 90 : 365;

      let prorationAmount = 0;
      let nextBillingAmount = newPrice;
      let effectiveBillingDate = nextBilling;

      if (prorationMethod === 'prorated' && effectiveDate === 'immediate') {
        // Calculate prorated amount for remaining days
        const dailyOldRate = currentPrice / totalDaysInCycle;
        const dailyNewRate = newPrice / totalDaysInCycle;
        const remainingDaysValue = (dailyNewRate - dailyOldRate) * daysBetween;
        
        prorationAmount = remainingDaysValue;
      } else if (effectiveDate === 'next_billing') {
        prorationAmount = 0; // No immediate charge
      } else if (effectiveDate === 'custom' && customDate) {
        const customEffectiveDate = new Date(customDate);
        const daysFromToday = Math.ceil((customEffectiveDate - today) / (1000 * 60 * 60 * 24));
        const daysFromCustomToNext = Math.ceil((nextBilling - customEffectiveDate) / (1000 * 60 * 60 * 24));
        
        if (daysFromCustomToNext > 0) {
          const dailyOldRate = currentPrice / totalDaysInCycle;
          const dailyNewRate = newPrice / totalDaysInCycle;
          prorationAmount = (dailyNewRate - dailyOldRate) * daysFromCustomToNext;
        }
        
        effectiveBillingDate = customEffectiveDate;
      }

      // Calculate new MRR
      const newMRR = selectedPlan?.billingFrequency === 'monthly' ? newPrice :
                     selectedPlan?.billingFrequency === 'quarterly' ? newPrice / 3 :
                     newPrice / 12;

      setCalculations({
        currentPrice,
        newPrice,
        priceDifference,
        prorationAmount,
        nextBillingAmount,
        newMRR,
        daysRemaining: daysBetween,
        effectiveDate: effectiveBillingDate,
        totalImmediateCharge: Math.max(0, prorationAmount)
      });
    } catch (error) {
      console.error('Error calculating proration:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!selectedPlan || !calculations) return;

    const modificationData = {
      subscriptionId: subscription?.id,
      newPlan: selectedPlan,
      prorationAmount: calculations?.prorationAmount,
      effectiveDate: effectiveDate === 'custom' ? customDate : 
                     effectiveDate === 'next_billing'? subscription?.nextBillingDate : new Date()?.toISOString()?.split('T')?.[0],
      prorationMethod,
      calculations
    };

    onSubmit(modificationData);
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      {/* Current Plan Info */}
      <div className="bg-secondary-50 rounded-lg p-4 mb-6">
        <h3 className="text-sm font-medium text-text-primary mb-2">Current Plan</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-text-primary">{subscription?.plan?.name}</p>
            <p className="text-xs text-text-secondary capitalize">
              {subscription?.plan?.billingFrequency} billing
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-text-primary">
              {formatCurrency(subscription?.plan?.price, subscription?.plan?.currency)}
            </p>
            <p className="text-xs text-text-secondary">
              per {subscription?.plan?.billingFrequency === 'monthly' ? 'month' :
                   subscription?.plan?.billingFrequency === 'quarterly' ? 'quarter' : 'year'}
            </p>
          </div>
        </div>
      </div>
      {/* Plan Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-text-primary mb-4">
          {modificationType === 'upgrade' ? 'Upgrade to' : 'Downgrade to'}
        </h3>
        
        {filteredPlans?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="AlertCircle" size={24} className="text-secondary-400 mx-auto mb-3" />
            <p className="text-sm text-text-secondary">
              No {modificationType === 'upgrade' ? 'higher' : 'lower'} tier plans available
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPlans?.map((plan) => (
              <div
                key={plan?.id}
                onClick={() => setSelectedPlan(plan)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                  selectedPlan?.id === plan?.id
                    ? 'border-primary bg-primary-50' :'border-border-light hover:border-primary-300 hover:bg-primary-25'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-text-primary">{plan?.name}</h4>
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        selectedPlan?.id === plan?.id
                          ? 'border-primary bg-primary' :'border-border-medium'
                      }`}>
                        {selectedPlan?.id === plan?.id && (
                          <div className="w-full h-full rounded-full bg-white scale-50"></div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-xl font-bold text-text-primary">
                          {formatCurrency(plan?.price)}
                        </span>
                        <span className="text-sm text-text-secondary">/month</span>
                      </div>
                      
                      {modificationType === 'upgrade' && (
                        <span className="bg-success-50 text-success-700 px-2 py-1 rounded-full text-xs font-medium">
                          +{formatCurrency(plan?.price - subscription?.plan?.price)} more
                        </span>
                      )}
                      
                      {modificationType === 'downgrade' && (
                        <span className="bg-warning-50 text-warning-700 px-2 py-1 rounded-full text-xs font-medium">
                          -{formatCurrency(subscription?.plan?.price - plan?.price)} less
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                      {plan?.features?.slice(0, 4)?.map((feature, index) => (
                        <div key={index} className="flex items-center text-xs text-text-secondary">
                          <Icon name="Check" size={12} className="text-success-600 mr-1 flex-shrink-0" />
                          <span className="truncate">{feature}</span>
                        </div>
                      ))}
                      {plan?.features?.length > 4 && (
                        <div className="text-xs text-text-tertiary">
                          +{plan?.features?.length - 4} more features
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {selectedPlan && (
        <>
          {/* Effective Date */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-text-primary mb-4">When should this change take effect?</h3>
            
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="effectiveDate"
                  value="immediate"
                  checked={effectiveDate === 'immediate'}
                  onChange={(e) => setEffectiveDate(e?.target?.value)}
                  className="text-primary focus:ring-primary"
                />
                <div>
                  <span className="text-sm font-medium text-text-primary">Immediately</span>
                  <p className="text-xs text-text-secondary">
                    Change will be applied right now with prorated billing
                  </p>
                </div>
              </label>
              
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="effectiveDate"
                  value="next_billing"
                  checked={effectiveDate === 'next_billing'}
                  onChange={(e) => setEffectiveDate(e?.target?.value)}
                  className="text-primary focus:ring-primary"
                />
                <div>
                  <span className="text-sm font-medium text-text-primary">Next billing cycle</span>
                  <p className="text-xs text-text-secondary">
                    Change will be applied on {new Date(subscription?.nextBillingDate)?.toLocaleDateString()}
                  </p>
                </div>
              </label>
              
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="effectiveDate"
                  value="custom"
                  checked={effectiveDate === 'custom'}
                  onChange={(e) => setEffectiveDate(e?.target?.value)}
                  className="text-primary focus:ring-primary"
                />
                <div className="flex-1">
                  <span className="text-sm font-medium text-text-primary">Custom date</span>
                  <p className="text-xs text-text-secondary mb-2">
                    Choose a specific date for the change
                  </p>
                  {effectiveDate === 'custom' && (
                    <input
                      type="date"
                      value={customDate}
                      onChange={(e) => setCustomDate(e?.target?.value)}
                      min={new Date()?.toISOString()?.split('T')?.[0]}
                      max={subscription?.nextBillingDate}
                      className="block w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    />
                  )}
                </div>
              </label>
            </div>
          </div>

          {/* Proration Method */}
          {effectiveDate === 'immediate' && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-text-primary mb-4">Proration Method</h3>
              
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="prorationMethod"
                    value="prorated"
                    checked={prorationMethod === 'prorated'}
                    onChange={(e) => setProrationMethod(e?.target?.value)}
                    className="text-primary focus:ring-primary"
                  />
                  <div>
                    <span className="text-sm font-medium text-text-primary">Prorated billing</span>
                    <p className="text-xs text-text-secondary">
                      Charge the difference for the remaining days in the current cycle
                    </p>
                  </div>
                </label>
                
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="prorationMethod"
                    value="full_charge"
                    checked={prorationMethod === 'full_charge'}
                    onChange={(e) => setProrationMethod(e?.target?.value)}
                    className="text-primary focus:ring-primary"
                  />
                  <div>
                    <span className="text-sm font-medium text-text-primary">Full charge immediately</span>
                    <p className="text-xs text-text-secondary">
                      Charge the full amount for the new plan right now
                    </p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Billing Preview */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-text-primary mb-4">Billing Preview</h3>
            
            {isCalculating ? (
              <div className="bg-secondary-50 rounded-lg p-4 flex items-center justify-center">
                <Icon name="Loader" size={20} className="animate-spin text-primary mr-2" />
                <span className="text-sm text-text-secondary">Calculating pricing...</span>
              </div>
            ) : calculations ? (
              <div className="bg-secondary-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Current plan price</span>
                  <span className="text-sm font-medium text-text-primary">
                    {formatCurrency(calculations?.currentPrice)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">New plan price</span>
                  <span className="text-sm font-medium text-text-primary">
                    {formatCurrency(calculations?.newPrice)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Price difference</span>
                  <span className={`text-sm font-medium ${
                    calculations?.priceDifference >= 0 ? 'text-primary' : 'text-success-600'
                  }`}>
                    {calculations?.priceDifference >= 0 ? '+' : ''}{formatCurrency(calculations?.priceDifference)}
                  </span>
                </div>
                
                {calculations?.prorationAmount !== 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">
                      {effectiveDate === 'immediate' ? 'Prorated charge' : 'Adjustment'}
                    </span>
                    <span className={`text-sm font-medium ${
                      calculations?.prorationAmount >= 0 ? 'text-primary' : 'text-success-600'
                    }`}>
                      {calculations?.prorationAmount >= 0 ? '+' : ''}{formatCurrency(calculations?.prorationAmount)}
                    </span>
                  </div>
                )}
                
                <div className="border-t border-border-light pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-text-primary">Immediate charge</span>
                    <span className="text-lg font-bold text-primary">
                      {formatCurrency(calculations?.totalImmediateCharge)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Next billing amount</span>
                  <span className="text-sm font-medium text-text-primary">
                    {formatCurrency(calculations?.nextBillingAmount)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">New MRR</span>
                  <span className="text-sm font-medium text-text-primary">
                    {formatCurrency(calculations?.newMRR)}
                  </span>
                </div>
              </div>
            ) : null}
          </div>
        </>
      )}
      {/* Action Buttons */}
      <div className="flex items-center justify-end space-x-3 pt-6 border-t border-border-light">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors duration-200"
        >
          Cancel
        </button>
        
        <button
          onClick={handleSubmit}
          disabled={!selectedPlan || isCalculating}
          className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          <Icon name={modificationType === 'upgrade' ? 'TrendingUp' : 'TrendingDown'} size={16} className="mr-2" />
          {modificationType === 'upgrade' ? 'Upgrade Plan' : 'Downgrade Plan'}
        </button>
      </div>
    </div>
  );
};

export default PlanModificationModal;