import React from 'react';
import { Zap, AlertCircle, Clock, Sparkles } from 'lucide-react';
import { useSubscription } from '../../contexts/SubscriptionContext';

export const CreditsDisplay = ({ 
  showDetails = false,
  className = '',
  size = 'default'
}) => {
  const { 
    subscriptionStatus, 
    hasActiveSubscription, 
    hasSufficientCredits,
    loading,
    formatDate
  } = useSubscription();

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-6 bg-gray-200 rounded w-24"></div>
      </div>
    );
  }

  const credits = subscriptionStatus?.credits_remaining || 0;
  const isActive = hasActiveSubscription();
  const expiresAt = subscriptionStatus?.subscription_expires;
  
  // Determine status and styling
  const getStatusInfo = () => {
    if (!isActive) {
      return {
        icon: AlertCircle,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        message: 'Subscription inactive'
      };
    } else if (credits === 0) {
      return {
        icon: AlertCircle,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        message: 'No credits remaining'
      };
    } else if (credits < 10) {
      return {
        icon: Clock,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        message: 'Low credits'
      };
    } else {
      return {
        icon: Sparkles,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        message: 'Active'
      };
    }
  };

  const statusInfo = getStatusInfo();
  const IconComponent = statusInfo?.icon;

  const sizeClasses = {
    small: 'text-xs px-2 py-1',
    default: 'text-sm px-3 py-2',
    large: 'text-base px-4 py-3'
  };

  return (
    <div className={`
      inline-flex items-center gap-2 rounded-lg border
      ${statusInfo?.bgColor} ${statusInfo?.borderColor}
      ${sizeClasses?.[size]}
      ${className}
    `}>
      <IconComponent className={`w-4 h-4 ${statusInfo?.color}`} />
      <div className="flex items-center gap-2">
        <Zap className={`w-4 h-4 ${statusInfo?.color}`} />
        <span className={`font-semibold ${statusInfo?.color}`}>
          {credits?.toLocaleString()}
        </span>
        {size !== 'small' && (
          <span className="text-gray-600 text-xs">
            credits
          </span>
        )}
      </div>
      {showDetails && (
        <div className="text-xs text-gray-600 ml-2 border-l pl-2">
          <div>{statusInfo?.message}</div>
          {expiresAt && isActive && (
            <div>Expires: {formatDate(expiresAt)}</div>
          )}
        </div>
      )}
    </div>
  );
};

// Compact version for header/navbar
export const CompactCreditsDisplay = ({ className = '' }) => {
  const { subscriptionStatus, hasActiveSubscription } = useSubscription();
  
  const credits = subscriptionStatus?.credits_remaining || 0;
  const isActive = hasActiveSubscription();

  return (
    <div className={`
      inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium
      ${isActive && credits > 0 
        ? 'bg-green-100 text-green-800' :'bg-gray-100 text-gray-600'
      }
      ${className}
    `}>
      <Zap className="w-3 h-3" />
      <span>{credits}</span>
    </div>
  );
};

// Warning component for low credits
export const CreditsWarning = ({ requiredCredits = 1 }) => {
  const { hasSufficientCredits, subscribeToPlan, subscriptionPlans } = useSubscription();
  
  if (hasSufficientCredits(requiredCredits)) {
    return null;
  }

  const handleUpgrade = () => {
    // Get the first plan (starter) for quick upgrade
    const starterPlan = subscriptionPlans?.find(plan => 
      plan?.name?.toLowerCase()?.includes('starter')
    ) || subscriptionPlans?.[0];
    
    if (starterPlan) {
      subscribeToPlan(starterPlan?.id, 'monthly');
    }
  };

  return (
    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-sm font-medium text-orange-800 mb-1">
            Insufficient Credits
          </h4>
          <p className="text-sm text-orange-700 mb-3">
            You need {requiredCredits} credit{requiredCredits > 1 ? 's' : ''} to continue. 
            Upgrade your subscription to get more credits and unlock advanced features.
          </p>
          <button
            onClick={handleUpgrade}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-600 text-white text-sm font-medium rounded-md hover:bg-orange-700 transition-colors"
          >
            <Zap className="w-4 h-4" />
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreditsDisplay;