import React, { useState } from 'react';
import { CheckCircle, Star, Zap, Crown } from 'lucide-react';
import Button from './Button';
import { useSubscription } from '../../contexts/SubscriptionContext';

const planIcons = {
  starter: Star,
  professional: Zap,
  premium: Crown
};

const planColors = {
  starter: 'border-blue-200 bg-blue-50',
  professional: 'border-purple-200 bg-purple-50',
  premium: 'border-gold-200 bg-gold-50'
};

export const SubscriptionCard = ({ 
  plan, 
  billingInterval = 'monthly',
  isCurrentPlan = false,
  isPopular = false,
  className = '' 
}) => {
  const { subscribeToPlan, loading } = useSubscription();
  const [subscribing, setSubscribing] = useState(false);

  const price = billingInterval === 'yearly' ? plan?.price_yearly : plan?.price_monthly;
  const credits = billingInterval === 'yearly' ? plan?.api_credits_yearly : plan?.api_credits_monthly;
  const savings = billingInterval === 'yearly' 
    ? Math.round(((plan?.price_monthly * 12) - plan?.price_yearly) / (plan?.price_monthly * 12) * 100)
    : 0;

  const IconComponent = planIcons?.[plan?.name?.toLowerCase()] || Star;
  const cardColorClass = planColors?.[plan?.name?.toLowerCase()] || 'border-gray-200 bg-gray-50';

  const handleSubscribe = async () => {
    if (isCurrentPlan || loading) return;
    
    try {
      setSubscribing(true);
      await subscribeToPlan(plan?.id, billingInterval);
    } catch (error) {
      console.error('Subscription error:', error);
    } finally {
      setSubscribing(false);
    }
  };

  let features = [];
  try {
    features = Array.isArray(plan?.features) ? plan?.features : JSON.parse(plan?.features || '[]');
  } catch (error) {
    console.error('Error parsing plan features:', error);
    features = [];
  }

  return (
    <div className={`
      relative rounded-xl border-2 p-6 transition-all duration-200 hover:shadow-lg
      ${isPopular ? 'border-purple-500 bg-purple-50 shadow-md' : cardColorClass}
      ${isCurrentPlan ? 'ring-2 ring-green-500 ring-opacity-50' : ''}
      ${className}
    `}>
      {/* Popular badge */}
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
            Most Popular
          </span>
        </div>
      )}

      {/* Current plan badge */}
      {isCurrentPlan && (
        <div className="absolute -top-3 right-4">
          <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <CheckCircle size={12} />
            Current Plan
          </span>
        </div>
      )}

      {/* Plan header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-3">
          <IconComponent className="w-8 h-8 text-purple-600" />
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {plan?.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4">
          {plan?.description}
        </p>

        {/* Pricing */}
        <div className="mb-4">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-3xl font-bold text-gray-900">
              ${price}
            </span>
            <span className="text-gray-600">
              /{billingInterval === 'yearly' ? 'year' : 'month'}
            </span>
          </div>
          
          {billingInterval === 'yearly' && savings > 0 && (
            <div className="text-green-600 text-sm font-medium mt-1">
              Save {savings}% annually
            </div>
          )}
        </div>

        {/* Credits info */}
        <div className="bg-white rounded-lg p-3 border">
          <div className="text-lg font-semibold text-gray-900">
            {credits?.toLocaleString()} API Credits
          </div>
          <div className="text-sm text-gray-600">
            {billingInterval === 'yearly' ? 'per year' : 'per month'}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Up to {plan?.max_image_generations} images per generation
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="space-y-3 mb-6">
        {features?.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-700 text-sm">
              {feature}
            </span>
          </div>
        ))}
      </div>

      {/* Action button */}
      <Button
        onClick={handleSubscribe}
        disabled={isCurrentPlan || subscribing || loading}
        className={`
          w-full py-3 font-semibold transition-all duration-200
          ${isCurrentPlan 
            ? 'bg-green-100 text-green-800 cursor-not-allowed' 
            : isPopular
            ? 'bg-purple-600 hover:bg-purple-700 text-white' :'bg-gray-900 hover:bg-gray-800 text-white'
          }
        `}
        size="lg"
      >
        {subscribing ? (
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            Processing...
          </div>
        ) : isCurrentPlan ? (
          'Current Plan'
        ) : (
          `Choose ${plan?.name}`
        )}
      </Button>

      {/* Additional info */}
      {!isCurrentPlan && (
        <p className="text-xs text-gray-500 text-center mt-3">
          Cancel anytime. No hidden fees.
        </p>
      )}
    </div>
  );
};

export default SubscriptionCard;