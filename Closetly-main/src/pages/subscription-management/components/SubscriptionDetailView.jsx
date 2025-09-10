// src/pages/subscription-management/components/SubscriptionDetailView.jsx
import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const SubscriptionDetailView = ({ subscription, onAction, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Format currency
  const formatCurrency = (amount, currency) => {
    const currencySymbols = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      INR: '₹',
      AUD: 'A$',
      CAD: 'C$',
      JPY: '¥',
      NOK: 'kr',
      AED: 'د.إ'
    };
    
    const symbol = currencySymbols?.[currency] || currency;
    
    if (currency === 'JPY') {
      return `${symbol}${Math.round(amount)?.toLocaleString()}`;
    }
    
    return `${symbol}${amount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { bg: 'bg-success-50', text: 'text-success-700', icon: 'CheckCircle' },
      trial: { bg: 'bg-accent-50', text: 'text-accent-700', icon: 'Clock' },
      paused: { bg: 'bg-warning-50', text: 'text-warning-700', icon: 'Pause' },
      cancelled: { bg: 'bg-secondary-100', text: 'text-secondary-700', icon: 'XCircle' },
      past_due: { bg: 'bg-error-50', text: 'text-error-700', icon: 'AlertTriangle' }
    };
    
    const config = statusConfig?.[status] || statusConfig?.active;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config?.bg} ${config?.text}`}>
        <Icon name={config?.icon} size={16} className="mr-1" />
        {status?.replace('_', ' ')?.replace(/\b\w/g, l => l?.toUpperCase())}
      </span>
    );
  };

  // Mock usage history data
  const usageHistory = [
    { date: '2024-05-01', usage: 7800, limit: 10000 },
    { date: '2024-04-01', usage: 7200, limit: 10000 },
    { date: '2024-03-01', usage: 6900, limit: 10000 },
    { date: '2024-02-01', usage: 6500, limit: 10000 },
    { date: '2024-01-01', usage: 5800, limit: 10000 }
  ];

  // Mock billing history
  const billingHistory = [
    {
      date: '2024-05-01',
      amount: subscription?.mrr || 999.99,
      status: 'paid',
      invoiceId: 'INV-2024-0045'
    },
    {
      date: '2024-04-01',
      amount: subscription?.mrr || 999.99,
      status: 'paid',
      invoiceId: 'INV-2024-0032'
    },
    {
      date: '2024-03-01',
      amount: subscription?.mrr || 999.99,
      status: 'paid',
      invoiceId: 'INV-2024-0019'
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'FileText' },
    { id: 'usage', label: 'Usage Metrics', icon: 'BarChart3' },
    { id: 'billing', label: 'Billing History', icon: 'CreditCard' },
    { id: 'modifications', label: 'Modifications', icon: 'Settings' }
  ];

  return (
    <div className="max-h-[80vh] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="border-b border-border-light pb-4 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-text-primary mb-2">
              {subscription?.customer?.name}
            </h2>
            <div className="flex items-center space-x-4">
              {getStatusBadge(subscription?.status)}
              <span className="text-sm text-text-secondary">
                Subscription ID: {subscription?.id}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {subscription?.status === 'active' && (
              <>
                <button
                  onClick={() => onAction('upgrade')}
                  className="px-3 py-1.5 bg-success-50 text-success-700 border border-success-200 rounded-lg text-sm font-medium hover:bg-success-100 transition-colors duration-200"
                >
                  <Icon name="TrendingUp" size={16} className="mr-1" />
                  Upgrade
                </button>
                <button
                  onClick={() => onAction('pause')}
                  className="px-3 py-1.5 bg-warning-50 text-warning-700 border border-warning-200 rounded-lg text-sm font-medium hover:bg-warning-100 transition-colors duration-200"
                >
                  <Icon name="Pause" size={16} className="mr-1" />
                  Pause
                </button>
              </>
            )}
            
            {subscription?.status === 'paused' && (
              <button
                onClick={() => onAction('resume')}
                className="px-3 py-1.5 bg-success-50 text-success-700 border border-success-200 rounded-lg text-sm font-medium hover:bg-success-100 transition-colors duration-200"
              >
                <Icon name="Play" size={16} className="mr-1" />
                Resume
              </button>
            )}
            
            <button
              onClick={() => onAction('cancel')}
              className="px-3 py-1.5 bg-error-50 text-error-700 border border-error-200 rounded-lg text-sm font-medium hover:bg-error-100 transition-colors duration-200"
            >
              <Icon name="XCircle" size={16} className="mr-1" />
              Cancel
            </button>
          </div>
        </div>
      </div>
      {/* Tabs */}
      <div className="flex space-x-1 mb-6 border-b border-border-light">
        {tabs?.map((tab) => (
          <button
            key={tab?.id}
            onClick={() => setActiveTab(tab?.id)}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-t-lg transition-colors duration-200 ${
              activeTab === tab?.id
                ? 'bg-primary text-white border-b-2 border-primary' :'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
            }`}
          >
            <Icon name={tab?.icon} size={16} className="mr-2" />
            {tab?.label}
          </button>
        ))}
      </div>
      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Customer Information */}
            <div>
              <h3 className="text-lg font-medium text-text-primary mb-4">Customer Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-tertiary mb-1">Name</label>
                  <p className="text-sm text-text-primary">{subscription?.customer?.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-tertiary mb-1">Email</label>
                  <p className="text-sm text-text-primary">{subscription?.customer?.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-tertiary mb-1">Customer ID</label>
                  <p className="text-sm text-text-primary font-data">{subscription?.customer?.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-tertiary mb-1">Sales Rep</label>
                  <p className="text-sm text-text-primary">{subscription?.metadata?.salesRep || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Plan Details */}
            <div>
              <h3 className="text-lg font-medium text-text-primary mb-4">Plan Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-tertiary mb-1">Plan Name</label>
                  <p className="text-sm text-text-primary">{subscription?.plan?.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-tertiary mb-1">Plan Type</label>
                  <p className="text-sm text-text-primary capitalize">{subscription?.plan?.type}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-tertiary mb-1">Billing Frequency</label>
                  <p className="text-sm text-text-primary capitalize">{subscription?.plan?.billingFrequency}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-tertiary mb-1">Monthly Recurring Revenue</label>
                  <p className="text-sm text-text-primary font-data">
                    {formatCurrency(subscription?.mrr, subscription?.plan?.currency)}
                  </p>
                </div>
              </div>
            </div>

            {/* Subscription Dates */}
            <div>
              <h3 className="text-lg font-medium text-text-primary mb-4">Important Dates</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-tertiary mb-1">Created Date</label>
                  <p className="text-sm text-text-primary">{formatDate(subscription?.createdDate)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-tertiary mb-1">Next Billing Date</label>
                  <p className="text-sm text-text-primary">{formatDate(subscription?.nextBillingDate)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-tertiary mb-1">Renewal Date</label>
                  <p className="text-sm text-text-primary">{formatDate(subscription?.renewalDate)}</p>
                </div>
                {subscription?.trial?.isTrialActive && (
                  <div>
                    <label className="block text-sm font-medium text-text-tertiary mb-1">Trial End Date</label>
                    <p className="text-sm text-accent-600 font-medium">{formatDate(subscription?.trial?.trialEndDate)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Add-ons */}
            {subscription?.addOns && subscription?.addOns?.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-text-primary mb-4">Add-ons</h3>
                <div className="bg-secondary-50 rounded-lg p-4">
                  <div className="space-y-2">
                    {subscription?.addOns?.map((addOn, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-text-primary">{addOn?.name}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-text-secondary">Qty: {addOn?.quantity}</span>
                          <span className="text-sm font-medium text-text-primary font-data">
                            {formatCurrency(addOn?.price, subscription?.plan?.currency)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'usage' && (
          <div className="space-y-6">
            {/* Current Usage */}
            <div>
              <h3 className="text-lg font-medium text-text-primary mb-4">Current Usage</h3>
              <div className="bg-secondary-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-text-secondary">Usage this month</span>
                  <span className="text-sm font-medium text-text-primary">
                    {subscription?.usage?.current?.toLocaleString()} / {subscription?.usage?.limit?.toLocaleString()}
                  </span>
                </div>
                
                <div className="w-full bg-white rounded-full h-2 mb-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      subscription?.usage?.percentage >= 90 ? 'bg-error-500' :
                      subscription?.usage?.percentage >= 75 ? 'bg-warning-500': 'bg-success-500'
                    }`}
                    style={{ width: `${subscription?.usage?.percentage || 0}%` }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-tertiary">0</span>
                  <span className={`text-sm font-medium ${
                    subscription?.usage?.percentage >= 90 ? 'text-error-600' :
                    subscription?.usage?.percentage >= 75 ? 'text-warning-600': 'text-success-600'
                  }`}>
                    {subscription?.usage?.percentage}% used
                  </span>
                  <span className="text-xs text-text-tertiary">{subscription?.usage?.limit?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Usage History */}
            <div>
              <h3 className="text-lg font-medium text-text-primary mb-4">Usage History</h3>
              <div className="space-y-3">
                {usageHistory?.map((record, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-surface border border-border-light rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        {new Date(record.date)?.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </p>
                      <p className="text-xs text-text-tertiary">
                        {Math.round((record?.usage / record?.limit) * 100)}% of limit used
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-text-primary font-data">
                        {record?.usage?.toLocaleString()}
                      </p>
                      <p className="text-xs text-text-secondary">
                        of {record?.limit?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="space-y-6">
            {/* Payment Method */}
            <div>
              <h3 className="text-lg font-medium text-text-primary mb-4">Payment Method</h3>
              <div className="bg-secondary-50 rounded-lg p-4">
                <div className="flex items-center">
                  <Icon 
                    name={subscription?.paymentMethod?.type === 'credit_card' ? 'CreditCard' : 'Building'} 
                    size={20} 
                    className="text-secondary-500 mr-3" 
                  />
                  <div>
                    {subscription?.paymentMethod?.type === 'credit_card' ? (
                      <>
                        <p className="text-sm font-medium text-text-primary">
                          {subscription?.paymentMethod?.brand} •••• {subscription?.paymentMethod?.last4}
                        </p>
                        <p className="text-xs text-text-secondary">
                          Expires {subscription?.paymentMethod?.expiryDate}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm font-medium text-text-primary">
                          {subscription?.paymentMethod?.bankName || 'Bank Transfer'}
                        </p>
                        <p className="text-xs text-text-secondary">
                          {subscription?.paymentMethod?.accountLast4 && `•••• ${subscription?.paymentMethod?.accountLast4}`}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Billing History */}
            <div>
              <h3 className="text-lg font-medium text-text-primary mb-4">Billing History</h3>
              <div className="space-y-3">
                {billingHistory?.map((record, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-surface border border-border-light rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        {formatDate(record?.date)}
                      </p>
                      <p className="text-xs text-text-tertiary">
                        Invoice #{record?.invoiceId}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-text-primary font-data">
                        {formatCurrency(record?.amount, subscription?.plan?.currency)}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        record?.status === 'paid' ? 'bg-success-50 text-success-700' :
                        record?.status === 'pending'? 'bg-warning-50 text-warning-700' : 'bg-error-50 text-error-700'
                      }`}>
                        {record?.status?.charAt(0)?.toUpperCase() + record?.status?.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'modifications' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-text-primary mb-4">Plan Modifications</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => onAction('upgrade')}
                  className="p-4 border border-border-light rounded-lg hover:bg-success-50 hover:border-success-200 transition-colors duration-200 group"
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-success-50 rounded-lg mx-auto mb-3 group-hover:bg-success-100">
                    <Icon name="TrendingUp" size={24} className="text-success-600" />
                  </div>
                  <h4 className="text-sm font-medium text-text-primary mb-1">Upgrade Plan</h4>
                  <p className="text-xs text-text-secondary text-center">
                    Move to a higher tier plan with more features
                  </p>
                </button>
                
                <button
                  onClick={() => onAction('downgrade')}
                  className="p-4 border border-border-light rounded-lg hover:bg-warning-50 hover:border-warning-200 transition-colors duration-200 group"
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-warning-50 rounded-lg mx-auto mb-3 group-hover:bg-warning-100">
                    <Icon name="TrendingDown" size={24} className="text-warning-600" />
                  </div>
                  <h4 className="text-sm font-medium text-text-primary mb-1">Downgrade Plan</h4>
                  <p className="text-xs text-text-secondary text-center">
                    Move to a lower tier plan with adjusted pricing
                  </p>
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-text-primary mb-4">Subscription Actions</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {subscription?.status === 'active' && (
                  <button
                    onClick={() => onAction('pause')}
                    className="p-4 border border-border-light rounded-lg hover:bg-warning-50 hover:border-warning-200 transition-colors duration-200 group"
                  >
                    <div className="flex items-center justify-center w-12 h-12 bg-warning-50 rounded-lg mx-auto mb-3 group-hover:bg-warning-100">
                      <Icon name="Pause" size={24} className="text-warning-600" />
                    </div>
                    <h4 className="text-sm font-medium text-text-primary mb-1">Pause Subscription</h4>
                    <p className="text-xs text-text-secondary text-center">
                      Temporarily pause billing and access
                    </p>
                  </button>
                )}
                
                {subscription?.status === 'paused' && (
                  <button
                    onClick={() => onAction('resume')}
                    className="p-4 border border-border-light rounded-lg hover:bg-success-50 hover:border-success-200 transition-colors duration-200 group"
                  >
                    <div className="flex items-center justify-center w-12 h-12 bg-success-50 rounded-lg mx-auto mb-3 group-hover:bg-success-100">
                      <Icon name="Play" size={24} className="text-success-600" />
                    </div>
                    <h4 className="text-sm font-medium text-text-primary mb-1">Resume Subscription</h4>
                    <p className="text-xs text-text-secondary text-center">
                      Resume billing and restore access
                    </p>
                  </button>
                )}
                
                <button
                  onClick={() => onAction('cancel')}
                  className="p-4 border border-border-light rounded-lg hover:bg-error-50 hover:border-error-200 transition-colors duration-200 group"
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-error-50 rounded-lg mx-auto mb-3 group-hover:bg-error-100">
                    <Icon name="XCircle" size={24} className="text-error-600" />
                  </div>
                  <h4 className="text-sm font-medium text-text-primary mb-1">Cancel Subscription</h4>
                  <p className="text-xs text-text-secondary text-center">
                    Permanently cancel this subscription
                  </p>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionDetailView;