import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { supabase } from '../../../lib/supabase';

const RecentActivity = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecentActivity();
  }, []);

  const fetchRecentActivity = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch recent activities from multiple tables
      const [subscriptions, payments, invoices, usageEvents] = await Promise.all([
        // Recent subscriptions
        supabase
          .from('user_subscriptions')
          .select(`
            *,
            subscription_plans(name, price_monthly),
            user_profiles(full_name)
          `)
          .order('created_at', { ascending: false })
          .limit(5),
        
        // Recent payment attempts (would come from Stripe webhooks)
        supabase
          .from('payment_events')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5),
        
        // Recent invoices
        supabase
          .from('invoices')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5),
        
        // Recent usage events
        supabase
          .from('api_usage_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5)
      ]);

      const allActivities = [];

      // Process subscriptions
      if (subscriptions.data) {
        subscriptions.data.forEach(sub => {
          allActivities.push({
            id: `sub_${sub.id}`,
            type: 'subscription',
            title: sub.status === 'active' ? 'New subscription created' : 'Subscription updated',
            description: `${sub.user_profiles?.full_name || 'User'} ${sub.status === 'active' ? 'activated' : 'modified'} ${sub.subscription_plans?.name || 'plan'}`,
            user: sub.user_profiles?.full_name || 'Anonymous User',
            amount: sub.subscription_plans?.price_monthly ? `$${sub.subscription_plans.price_monthly}/month` : 'N/A',
            timestamp: new Date(sub.created_at),
            status: sub.status === 'active' ? 'success' : sub.status === 'cancelled' ? 'warning' : 'info',
            icon: sub.status === 'active' ? 'UserPlus' : sub.status === 'cancelled' ? 'UserMinus' : 'User'
          });
        });
      }

      // Process payments
      if (payments.data) {
        payments.data.forEach(payment => {
          allActivities.push({
            id: `pay_${payment.id}`,
            type: 'payment',
            title: payment.status === 'succeeded' ? 'Payment received' : 'Payment failed',
            description: payment.description || 'Payment processed',
            user: payment.customer_name || 'Customer',
            amount: payment.amount ? `$${(payment.amount / 100).toFixed(2)}` : 'N/A',
            timestamp: new Date(payment.created_at),
            status: payment.status === 'succeeded' ? 'success' : 'error',
            icon: payment.status === 'succeeded' ? 'CreditCard' : 'AlertCircle'
          });
        });
      }

      // Process invoices
      if (invoices.data) {
        invoices.data.forEach(invoice => {
          allActivities.push({
            id: `inv_${invoice.id}`,
            type: 'invoice',
            title: 'Invoice generated',
            description: `Invoice #${invoice.invoice_number} created`,
            user: invoice.customer_name || 'Customer',
            amount: invoice.total ? `$${(invoice.total / 100).toFixed(2)}` : 'N/A',
            timestamp: new Date(invoice.created_at),
            status: invoice.status === 'paid' ? 'success' : 'info',
            icon: 'FileText'
          });
        });
      }

      // Process usage events
      if (usageEvents.data) {
        usageEvents.data.forEach(usage => {
          allActivities.push({
            id: `usage_${usage.id}`,
            type: 'usage',
            title: 'API usage recorded',
            description: `${usage.endpoint || 'API'} endpoint accessed`,
            user: usage.user_id || 'System',
            amount: `${usage.request_count || 1} calls`,
            timestamp: new Date(usage.created_at),
            status: 'info',
            icon: 'BarChart3'
          });
        });
      }

      // Sort all activities by timestamp
      allActivities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      setActivities(allActivities.slice(0, 20)); // Limit to 20 most recent
    } catch (err) {
      console.error('Error fetching activities:', err);
      setError('Failed to load recent activity');
      setActivities([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const filterOptions = [
    { value: 'all', label: 'All Activity', count: activities?.length },
    { value: 'subscription', label: 'Subscriptions', count: activities?.filter(a => a?.type === 'subscription')?.length },
    { value: 'payment', label: 'Payments', count: activities?.filter(a => a?.type === 'payment')?.length },
    { value: 'invoice', label: 'Invoices', count: activities?.filter(a => a?.type === 'invoice')?.length },
    { value: 'usage', label: 'Usage', count: activities?.filter(a => a?.type === 'usage')?.length }
  ];

  const filteredActivities = selectedFilter === 'all' 
    ? activities 
    : activities?.filter(activity => activity?.type === selectedFilter);

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'bg-success-100 text-success-700 border-success-200';
      case 'error':
        return 'bg-error-100 text-error-700 border-error-200';
      case 'warning':
        return 'bg-warning-100 text-warning-700 border-warning-200';
      case 'info':
        return 'bg-primary-100 text-primary-700 border-primary-200';
      default:
        return 'bg-secondary-100 text-secondary-700 border-secondary-200';
    }
  };

  const getIconColor = (status) => {
    switch (status) {
      case 'success':
        return 'text-success-600';
      case 'error':
        return 'text-error-600';
      case 'warning':
        return 'text-warning-600';
      case 'info':
        return 'text-primary-600';
      default:
        return 'text-secondary-600';
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  return (
    <div className="bg-surface rounded-lg shadow-card border border-border-light p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
        <h3 className="text-lg font-semibold text-text-primary">Recent Activity</h3>
        
        {/* Activity Filters */}
        <div className="flex flex-wrap gap-2">
          {filterOptions?.map((option) => (
            <button
              key={option?.value}
              onClick={() => setSelectedFilter(option?.value)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                selectedFilter === option?.value
                  ? 'bg-primary text-white' :'bg-surface-hover text-text-secondary hover:text-text-primary hover:bg-secondary-100'
              }`}
            >
              {option?.label}
              <span className="ml-1 text-xs opacity-75">({option?.count})</span>
            </button>
          ))}
        </div>
      </div>
      {/* Activity List */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-muted-foreground">Loading activities...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <Icon name="AlertCircle" size={24} className="text-error mx-auto mb-2" />
            <p className="text-error text-sm">{error}</p>
            <button 
              onClick={fetchRecentActivity}
              className="mt-2 text-primary hover:text-primary-700 text-sm"
            >
              Try again
            </button>
          </div>
        ) : filteredActivities?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Activity" size={24} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground text-sm">No recent activity found</p>
          </div>
        ) : filteredActivities?.map((activity) => (
          <div
            key={activity?.id}
            className="flex items-start space-x-4 p-4 border border-border-light rounded-lg hover:bg-surface-hover transition-colors duration-200"
          >
            {/* Icon */}
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              activity?.status === 'success' ? 'bg-success-100' :
              activity?.status === 'error' ? 'bg-error-100' :
              activity?.status === 'warning'? 'bg-warning-100' : 'bg-primary-100'
            }`}>
              <Icon 
                name={activity?.icon} 
                size={20} 
                className={getIconColor(activity?.status)} 
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-medium text-text-primary text-sm">{activity?.title}</h4>
                  <p className="text-text-secondary text-sm">{activity?.description}</p>
                </div>
                <span className="text-text-tertiary text-xs whitespace-nowrap ml-4">
                  {formatTimestamp(activity?.timestamp)}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-text-secondary text-sm">{activity?.user}</span>
                  <span className="font-medium text-text-primary text-sm">{activity?.amount}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(activity?.status)}`}>
                  {activity?.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Refresh Button */}
      {!loading && activities.length > 0 && (
        <div className="mt-6 pt-4 border-t border-border-light">
          <button 
            onClick={fetchRecentActivity}
            disabled={loading}
            className="w-full text-primary hover:text-primary-700 text-sm font-medium py-2 border border-border-light rounded-lg hover:bg-surface-hover transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <Icon name="RotateCcw" size={16} />
            <span>Refresh Activity</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentActivity;