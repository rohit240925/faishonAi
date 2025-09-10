// src/pages/subscription-management/components/SubscriptionStats.jsx
import React, { useMemo } from 'react';
import Icon from '../../../components/AppIcon';

const SubscriptionStats = ({ subscriptions = [] }) => {
  // Calculate statistics
  const stats = React.useMemo(() => {
    const totalMRR = subscriptions?.reduce((sum, sub) => sum + (sub?.mrr || 0), 0);
    const activeSubscriptions = subscriptions?.filter(sub => sub?.status === 'active')?.length;
    const trialSubscriptions = subscriptions?.filter(sub => sub?.status === 'trial')?.length;
    const churnedSubscriptions = subscriptions?.filter(sub => sub?.status === 'cancelled')?.length;
    const pastDueSubscriptions = subscriptions?.filter(sub => sub?.status === 'past_due')?.length;
    
    // Calculate churn rate (simplified)
    const churnRate = subscriptions?.length > 0 ? (churnedSubscriptions / subscriptions?.length * 100) : 0;
    
    // Calculate average revenue per user
    const arpu = activeSubscriptions > 0 ? totalMRR / activeSubscriptions : 0;
    
    // Calculate growth metrics (mock data for now)
    const previousMRR = totalMRR * 0.92; // Simulate 8% growth
    const mrrGrowth = previousMRR > 0 ? ((totalMRR - previousMRR) / previousMRR * 100) : 0;
    
    return {
      totalMRR,
      activeSubscriptions,
      trialSubscriptions,
      churnedSubscriptions,
      pastDueSubscriptions,
      churnRate,
      arpu,
      mrrGrowth,
      totalSubscriptions: subscriptions?.length
    };
  }, [subscriptions]);

  // Format currency
  const formatCurrency = (amount, showSymbol = true) => {
    if (showSymbol) {
      return `$${amount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return amount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Format percentage
  const formatPercentage = (value) => {
    return `${value?.toFixed(1)}%`;
  };

  const statCards = [
    {
      title: 'Total MRR',
      value: formatCurrency(stats?.totalMRR),
      change: `+${formatPercentage(stats?.mrrGrowth)}`,
      changeType: stats?.mrrGrowth >= 0 ? 'positive' : 'negative',
      icon: 'DollarSign',
      iconBg: 'bg-success-50',
      iconColor: 'text-success-600',
      description: 'Monthly recurring revenue'
    },
    {
      title: 'Active Subscriptions',
      value: stats?.activeSubscriptions?.toLocaleString(),
      change: `${stats?.totalSubscriptions} total`,
      changeType: 'neutral',
      icon: 'Users',
      iconBg: 'bg-primary-50',
      iconColor: 'text-primary-600',
      description: 'Currently active subscriptions'
    },
    {
      title: 'Trial Subscriptions',
      value: stats?.trialSubscriptions?.toLocaleString(),
      change: stats?.trialSubscriptions > 0 ? 'Conversion opportunities' : 'No active trials',
      changeType: stats?.trialSubscriptions > 0 ? 'positive' : 'neutral',
      icon: 'Clock',
      iconBg: 'bg-accent-50',
      iconColor: 'text-accent-600',
      description: 'Subscriptions in trial period'
    },
    {
      title: 'Churn Rate',
      value: formatPercentage(stats?.churnRate),
      change: `${stats?.churnedSubscriptions} cancelled`,
      changeType: stats?.churnRate > 5 ? 'negative' : stats?.churnRate > 2 ? 'warning' : 'positive',
      icon: 'TrendingDown',
      iconBg: stats?.churnRate > 5 ? 'bg-error-50' : stats?.churnRate > 2 ? 'bg-warning-50' : 'bg-success-50',
      iconColor: stats?.churnRate > 5 ? 'text-error-600' : stats?.churnRate > 2 ? 'text-warning-600' : 'text-success-600',
      description: 'Percentage of cancelled subscriptions'
    },
    {
      title: 'Average Revenue Per User',
      value: formatCurrency(stats?.arpu),
      change: 'Per active subscription',
      changeType: 'neutral',
      icon: 'Target',
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
      description: 'MRR divided by active subscriptions'
    },
    {
      title: 'Needs Attention',
      value: stats?.pastDueSubscriptions?.toLocaleString(),
      change: stats?.pastDueSubscriptions > 0 ? 'Past due payments' : 'All payments current',
      changeType: stats?.pastDueSubscriptions > 0 ? 'negative' : 'positive',
      icon: 'AlertTriangle',
      iconBg: stats?.pastDueSubscriptions > 0 ? 'bg-error-50' : 'bg-success-50',
      iconColor: stats?.pastDueSubscriptions > 0 ? 'text-error-600' : 'text-success-600',
      description: 'Subscriptions requiring immediate action'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4 mb-6">
      {statCards?.map((stat, index) => (
        <div key={index} className="bg-surface rounded-lg border border-border-light shadow-card p-4 hover:shadow-modal transition-shadow duration-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-text-tertiary font-medium">{stat?.title}</p>
              <p className="text-2xl font-semibold text-text-primary mt-1">{stat?.value}</p>
              
              <div className="flex items-center mt-2">
                <span className={`text-xs font-medium ${
                  stat?.changeType === 'positive' ? 'text-success-600' :
                  stat?.changeType === 'negative' ? 'text-error-600' :
                  stat?.changeType === 'warning'? 'text-warning-600' : 'text-text-tertiary'
                }`}>
                  {stat?.changeType === 'positive' && (
                    <Icon name="TrendingUp" size={12} className="inline mr-1" />
                  )}
                  {stat?.changeType === 'negative' && (
                    <Icon name="TrendingDown" size={12} className="inline mr-1" />
                  )}
                  {stat?.changeType === 'warning' && (
                    <Icon name="AlertTriangle" size={12} className="inline mr-1" />
                  )}
                  {stat?.change}
                </span>
              </div>
              
              <p className="text-xs text-text-tertiary mt-1">{stat?.description}</p>
            </div>
            
            <div className={`w-10 h-10 rounded-lg ${stat?.iconBg} flex items-center justify-center flex-shrink-0`}>
              <Icon name={stat?.icon} size={20} className={stat?.iconColor} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SubscriptionStats;