// src/pages/subscription-management/components/SubscriptionTable.jsx
import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';

const SubscriptionTable = ({ 
  subscriptions, 
  selectedSubscriptions, 
  onSelectSubscription, 
  onSelectAll, 
  onViewSubscription,
  onSubscriptionAction,
  isLoading
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [searchQuery, setSearchQuery] = useState('');
  
  const allSelected = subscriptions?.length > 0 && selectedSubscriptions?.length === subscriptions?.length;
  
  // Format currency based on currency code
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
  
  // Get status badge styling
  const getStatusBadge = (status) => {
    const statusConfig = {
      active: {
        bgColor: 'bg-success-50',
        textColor: 'text-success-700',
        icon: 'CheckCircle'
      },
      trial: {
        bgColor: 'bg-accent-50',
        textColor: 'text-accent-700',
        icon: 'Clock'
      },
      paused: {
        bgColor: 'bg-warning-50',
        textColor: 'text-warning-700',
        icon: 'Pause'
      },
      cancelled: {
        bgColor: 'bg-secondary-100',
        textColor: 'text-secondary-700',
        icon: 'XCircle'
      },
      past_due: {
        bgColor: 'bg-error-50',
        textColor: 'text-error-700',
        icon: 'AlertTriangle'
      }
    };
    
    const config = statusConfig?.[status] || statusConfig?.active;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config?.bgColor} ${config?.textColor}`}>
        <Icon name={config?.icon} size={14} className="mr-1" />
        {status?.replace('_', ' ')?.replace(/\b\w/g, l => l?.toUpperCase())}
      </span>
    );
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };
  
  // Get plan type badge
  const getPlanTypeBadge = (planType) => {
    const typeConfig = {
      starter: { bgColor: 'bg-blue-50', textColor: 'text-blue-700' },
      professional: { bgColor: 'bg-purple-50', textColor: 'text-purple-700' },
      business: { bgColor: 'bg-green-50', textColor: 'text-green-700' },
      enterprise: { bgColor: 'bg-orange-50', textColor: 'text-orange-700' }
    };
    
    const config = typeConfig?.[planType] || typeConfig?.starter;
    
    return (
      <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${config?.bgColor} ${config?.textColor}`}>
        {planType?.charAt(0)?.toUpperCase() + planType?.slice(1)}
      </span>
    );
  };
  
  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig?.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  // Sort subscriptions
  const sortedSubscriptions = React.useMemo(() => {
    if (!sortConfig?.key) return subscriptions;
    
    return [...subscriptions]?.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortConfig?.key) {
        case 'customer':
          aValue = a?.customer?.name;
          bValue = b?.customer?.name;
          break;
        case 'plan':
          aValue = a?.plan?.name;
          bValue = b?.plan?.name;
          break;
        case 'mrr':
          aValue = a?.mrr;
          bValue = b?.mrr;
          break;
        case 'nextBilling':
          aValue = a?.nextBillingDate ? new Date(a.nextBillingDate) : new Date(0);
          bValue = b?.nextBillingDate ? new Date(b.nextBillingDate) : new Date(0);
          break;
        case 'status':
          aValue = a?.status;
          bValue = b?.status;
          break;
        default:
          aValue = a?.[sortConfig?.key];
          bValue = b?.[sortConfig?.key];
      }
      
      if (aValue < bValue) {
        return sortConfig?.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig?.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [subscriptions, sortConfig]);
  
  // Filter by inline search
  const searchFilteredSubscriptions = sortedSubscriptions?.filter(subscription => {
    if (!searchQuery) return true;
    
    const query = searchQuery?.toLowerCase();
    return (subscription?.customer?.name?.toLowerCase()?.includes(query) ||
    subscription?.customer?.email?.toLowerCase()?.includes(query) ||
    subscription?.plan?.name?.toLowerCase()?.includes(query) || subscription?.id?.toLowerCase()?.includes(query));
  });
  
  // Loading state
  if (isLoading) {
    return (
      <div className="bg-surface rounded-lg border border-border-light shadow-card overflow-hidden">
        <div className="p-8 flex flex-col items-center justify-center">
          <div className="animate-spin mb-4">
            <Icon name="Loader" size={32} className="text-primary" />
          </div>
          <p className="text-text-secondary">Loading subscriptions...</p>
        </div>
      </div>
    );
  }
  
  // Empty state
  if (subscriptions?.length === 0) {
    return (
      <div className="bg-surface rounded-lg border border-border-light shadow-card overflow-hidden">
        <div className="p-8 flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-4">
            <Icon name="Users" size={24} className="text-primary" />
          </div>
          <h3 className="text-lg font-medium text-text-primary mb-2">No subscriptions found</h3>
          <p className="text-text-secondary text-center max-w-md mb-6">
            No subscriptions match your current filters. Try adjusting your search criteria or create a new subscription.
          </p>
          <button
            className="bg-primary text-white px-4 py-2 rounded-lg flex items-center hover:bg-primary-700 transition-colors duration-200"
          >
            <Icon name="Plus" size={18} className="mr-2" />
            Create Subscription
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-surface rounded-lg border border-border-light shadow-card overflow-hidden">
      {/* Search Bar */}
      <div className="p-4 border-b border-border-light">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon name="Search" size={20} className="text-secondary-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
            placeholder="Search subscriptions..."
            className="block w-full pl-10 pr-3 py-2 border border-border-light rounded-lg bg-surface-hover focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm placeholder-secondary-400"
          />
        </div>
      </div>
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-secondary-50 border-b border-border-light">
              <th className="px-6 py-3 text-left">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) => onSelectAll(e?.target?.checked)}
                    className="rounded border-border-medium text-primary focus:ring-primary"
                  />
                </div>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('customer')}
                  className="text-xs font-medium text-secondary-500 uppercase tracking-wider flex items-center hover:text-text-primary transition-colors duration-200"
                >
                  Customer
                  <Icon 
                    name={sortConfig?.key === 'customer' ? (sortConfig?.direction === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                    size={14} 
                    className="ml-1" 
                  />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('plan')}
                  className="text-xs font-medium text-secondary-500 uppercase tracking-wider flex items-center hover:text-text-primary transition-colors duration-200"
                >
                  Plan Type
                  <Icon 
                    name={sortConfig?.key === 'plan' ? (sortConfig?.direction === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                    size={14} 
                    className="ml-1" 
                  />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('status')}
                  className="text-xs font-medium text-secondary-500 uppercase tracking-wider flex items-center hover:text-text-primary transition-colors duration-200"
                >
                  Status
                  <Icon 
                    name={sortConfig?.key === 'status' ? (sortConfig?.direction === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                    size={14} 
                    className="ml-1" 
                  />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('mrr')}
                  className="text-xs font-medium text-secondary-500 uppercase tracking-wider flex items-center hover:text-text-primary transition-colors duration-200"
                >
                  MRR
                  <Icon 
                    name={sortConfig?.key === 'mrr' ? (sortConfig?.direction === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                    size={14} 
                    className="ml-1" 
                  />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('nextBilling')}
                  className="text-xs font-medium text-secondary-500 uppercase tracking-wider flex items-center hover:text-text-primary transition-colors duration-200"
                >
                  Next Billing
                  <Icon 
                    name={sortConfig?.key === 'nextBilling' ? (sortConfig?.direction === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                    size={14} 
                    className="ml-1" 
                  />
                </button>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light">
            {searchFilteredSubscriptions?.map((subscription) => (
              <tr 
                key={subscription?.id} 
                className="hover:bg-secondary-50 transition-colors duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedSubscriptions?.includes(subscription?.id)}
                    onChange={() => onSelectSubscription(subscription?.id)}
                    className="rounded border-border-medium text-primary focus:ring-primary"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-primary-50 rounded-full flex items-center justify-center text-primary font-medium">
                      {subscription?.customer?.name?.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <button
                        onClick={() => onViewSubscription(subscription?.id)}
                        className="text-sm font-medium text-text-primary hover:text-primary transition-colors duration-200"
                      >
                        {subscription?.customer?.name}
                      </button>
                      <div className="text-xs text-text-secondary">{subscription?.customer?.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-text-primary">{subscription?.plan?.name}</div>
                    <div className="flex items-center space-x-2 mt-1">
                      {getPlanTypeBadge(subscription?.plan?.type)}
                      <span className="text-xs text-text-tertiary capitalize">
                        {subscription?.plan?.billingFrequency}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(subscription?.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-text-primary font-data">
                    {formatCurrency(subscription?.mrr, subscription?.plan?.currency)}
                  </div>
                  <div className="text-xs text-text-secondary">
                    {subscription?.plan?.billingFrequency} recurring
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-text-secondary">
                    {formatDate(subscription?.nextBillingDate)}
                  </div>
                  {subscription?.trial?.isTrialActive && (
                    <div className="text-xs text-accent-600 font-medium">
                      Trial ends {formatDate(subscription?.trial?.trialEndDate)}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onViewSubscription(subscription?.id)}
                      className="p-1.5 text-secondary-600 hover:text-primary hover:bg-primary-50 rounded-lg transition-colors duration-200"
                      title="View Details"
                    >
                      <Icon name="Eye" size={18} />
                    </button>
                    
                    {subscription?.status === 'active' && (
                      <>
                        <button
                          onClick={() => onSubscriptionAction('upgrade', subscription?.id)}
                          className="p-1.5 text-secondary-600 hover:text-success hover:bg-success-50 rounded-lg transition-colors duration-200"
                          title="Upgrade Plan"
                        >
                          <Icon name="TrendingUp" size={18} />
                        </button>
                        <button
                          onClick={() => onSubscriptionAction('pause', subscription?.id)}
                          className="p-1.5 text-secondary-600 hover:text-warning hover:bg-warning-50 rounded-lg transition-colors duration-200"
                          title="Pause Subscription"
                        >
                          <Icon name="Pause" size={18} />
                        </button>
                      </>
                    )}
                    
                    {subscription?.status === 'paused' && (
                      <button
                        onClick={() => onSubscriptionAction('resume', subscription?.id)}
                        className="p-1.5 text-secondary-600 hover:text-success hover:bg-success-50 rounded-lg transition-colors duration-200"
                        title="Resume Subscription"
                      >
                        <Icon name="Play" size={18} />
                      </button>
                    )}
                    
                    <div className="relative group">
                      <button
                        className="p-1.5 text-secondary-600 hover:text-primary hover:bg-primary-50 rounded-lg transition-colors duration-200"
                        title="More Options"
                      >
                        <Icon name="MoreVertical" size={18} />
                      </button>
                      
                      <div className="absolute right-0 mt-2 w-48 bg-surface rounded-lg shadow-modal border border-border-light z-10 hidden group-hover:block">
                        <div className="py-1">
                          <button
                            onClick={() => onSubscriptionAction('downgrade', subscription?.id)}
                            className="flex items-center w-full px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors duration-200"
                          >
                            <Icon name="TrendingDown" size={16} className="mr-2" />
                            Downgrade Plan
                          </button>
                          <button
                            onClick={() => onSubscriptionAction('cancel', subscription?.id)}
                            className="flex items-center w-full px-4 py-2 text-sm text-error hover:bg-error-50 transition-colors duration-200"
                          >
                            <Icon name="XCircle" size={16} className="mr-2" />
                            Cancel Subscription
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Tablet View */}
      <div className="hidden md:block lg:hidden">
        <div className="divide-y divide-border-light">
          {searchFilteredSubscriptions?.map((subscription) => (
            <div key={subscription?.id} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedSubscriptions?.includes(subscription?.id)}
                    onChange={() => onSelectSubscription(subscription?.id)}
                    className="rounded border-border-medium text-primary focus:ring-primary mr-3"
                  />
                  <div className="w-8 h-8 bg-primary-50 rounded-full flex items-center justify-center text-primary font-medium">
                    {subscription?.customer?.name?.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <button
                      onClick={() => onViewSubscription(subscription?.id)}
                      className="text-sm font-medium text-text-primary hover:text-primary transition-colors duration-200"
                    >
                      {subscription?.customer?.name}
                    </button>
                    <div className="text-xs text-text-secondary">{subscription?.plan?.name}</div>
                  </div>
                </div>
                {getStatusBadge(subscription?.status)}
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-3">
                <div>
                  <div className="text-xs text-text-tertiary">MRR</div>
                  <div className="text-sm font-medium text-text-primary font-data">
                    {formatCurrency(subscription?.mrr, subscription?.plan?.currency)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-text-tertiary">Next Billing</div>
                  <div className="text-sm text-text-secondary">
                    {formatDate(subscription?.nextBillingDate)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-text-tertiary">Plan Type</div>
                  <div className="text-sm text-text-secondary capitalize">
                    {subscription?.plan?.type}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-2">
                <button
                  onClick={() => onViewSubscription(subscription?.id)}
                  className="p-2 text-secondary-600 hover:text-primary hover:bg-primary-50 rounded-lg transition-colors duration-200"
                  title="View Details"
                >
                  <Icon name="Eye" size={18} />
                </button>
                
                {subscription?.status === 'active' && (
                  <>
                    <button
                      onClick={() => onSubscriptionAction('upgrade', subscription?.id)}
                      className="p-2 text-secondary-600 hover:text-success hover:bg-success-50 rounded-lg transition-colors duration-200"
                      title="Upgrade"
                    >
                      <Icon name="TrendingUp" size={18} />
                    </button>
                    <button
                      onClick={() => onSubscriptionAction('pause', subscription?.id)}
                      className="p-2 text-secondary-600 hover:text-warning hover:bg-warning-50 rounded-lg transition-colors duration-200"
                      title="Pause"
                    >
                      <Icon name="Pause" size={18} />
                    </button>
                  </>
                )}
                
                {subscription?.status === 'paused' && (
                  <button
                    onClick={() => onSubscriptionAction('resume', subscription?.id)}
                    className="p-2 text-secondary-600 hover:text-success hover:bg-success-50 rounded-lg transition-colors duration-200"
                    title="Resume"
                  >
                    <Icon name="Play" size={18} />
                  </button>
                )}
                
                <button
                  className="p-2 text-secondary-600 hover:text-primary hover:bg-primary-50 rounded-lg transition-colors duration-200"
                  title="More Options"
                >
                  <Icon name="MoreVertical" size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Mobile Card View */}
      <div className="md:hidden">
        <div className="divide-y divide-border-light">
          {searchFilteredSubscriptions?.map((subscription) => (
            <div key={subscription?.id} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedSubscriptions?.includes(subscription?.id)}
                    onChange={() => onSelectSubscription(subscription?.id)}
                    className="rounded border-border-medium text-primary focus:ring-primary mr-3"
                  />
                  <div className="w-8 h-8 bg-primary-50 rounded-full flex items-center justify-center text-primary font-medium">
                    {subscription?.customer?.name?.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <button
                      onClick={() => onViewSubscription(subscription?.id)}
                      className="text-sm font-medium text-text-primary hover:text-primary transition-colors duration-200"
                    >
                      {subscription?.customer?.name}
                    </button>
                    <div className="text-xs text-text-secondary">{subscription?.customer?.email}</div>
                  </div>
                </div>
                {getStatusBadge(subscription?.status)}
              </div>
              
              <div className="mb-3">
                <div className="text-sm font-medium text-text-primary mb-1">{subscription?.plan?.name}</div>
                <div className="flex items-center space-x-2">
                  {getPlanTypeBadge(subscription?.plan?.type)}
                  <span className="text-xs text-text-tertiary capitalize">
                    {subscription?.plan?.billingFrequency}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <div className="text-xs text-text-tertiary">MRR</div>
                  <div className="text-sm font-medium text-text-primary font-data">
                    {formatCurrency(subscription?.mrr, subscription?.plan?.currency)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-text-tertiary">Next Billing</div>
                  <div className="text-sm text-text-secondary">
                    {formatDate(subscription?.nextBillingDate)}
                  </div>
                </div>
              </div>
              
              {subscription?.trial?.isTrialActive && (
                <div className="mb-3 p-2 bg-accent-50 rounded-lg">
                  <div className="text-xs text-accent-700 font-medium">
                    <Icon name="Clock" size={14} className="inline mr-1" />
                    Trial ends {formatDate(subscription?.trial?.trialEndDate)}
                  </div>
                </div>
              )}
              
              {/* Expandable Actions */}
              <details className="">
                <summary className="cursor-pointer text-sm text-primary font-medium hover:text-primary-700 transition-colors duration-200 flex items-center">
                  <Icon name="ChevronRight" size={16} className="mr-1 transform transition-transform duration-200" />
                  Actions
                </summary>
                <div className="mt-3 pt-3 border-t border-border-light">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onViewSubscription(subscription?.id)}
                      className="flex items-center justify-center px-3 py-2 text-sm bg-primary-50 text-primary rounded-lg hover:bg-primary-100 transition-colors duration-200"
                    >
                      <Icon name="Eye" size={16} className="mr-1" />
                      View
                    </button>
                    
                    {subscription?.status === 'active' && (
                      <>
                        <button
                          onClick={() => onSubscriptionAction('upgrade', subscription?.id)}
                          className="flex items-center justify-center px-3 py-2 text-sm bg-success-50 text-success-700 rounded-lg hover:bg-success-100 transition-colors duration-200"
                        >
                          <Icon name="TrendingUp" size={16} className="mr-1" />
                          Upgrade
                        </button>
                        <button
                          onClick={() => onSubscriptionAction('pause', subscription?.id)}
                          className="flex items-center justify-center px-3 py-2 text-sm bg-warning-50 text-warning-700 rounded-lg hover:bg-warning-100 transition-colors duration-200"
                        >
                          <Icon name="Pause" size={16} className="mr-1" />
                          Pause
                        </button>
                      </>
                    )}
                    
                    {subscription?.status === 'paused' && (
                      <button
                        onClick={() => onSubscriptionAction('resume', subscription?.id)}
                        className="flex items-center justify-center px-3 py-2 text-sm bg-success-50 text-success-700 rounded-lg hover:bg-success-100 transition-colors duration-200"
                      >
                        <Icon name="Play" size={16} className="mr-1" />
                        Resume
                      </button>
                    )}
                    
                    <button
                      onClick={() => onSubscriptionAction('downgrade', subscription?.id)}
                      className="flex items-center justify-center px-3 py-2 text-sm bg-secondary-50 text-secondary-700 rounded-lg hover:bg-secondary-100 transition-colors duration-200"
                    >
                      <Icon name="TrendingDown" size={16} className="mr-1" />
                      Downgrade
                    </button>
                    
                    <button
                      onClick={() => onSubscriptionAction('cancel', subscription?.id)}
                      className="flex items-center justify-center px-3 py-2 text-sm bg-error-50 text-error-700 rounded-lg hover:bg-error-100 transition-colors duration-200"
                    >
                      <Icon name="XCircle" size={16} className="mr-1" />
                      Cancel
                    </button>
                  </div>
                </div>
              </details>
            </div>
          ))}
        </div>
      </div>
      {/* No results message for search */}
      {subscriptions?.length > 0 && searchFilteredSubscriptions?.length === 0 && (
        <div className="p-8 text-center">
          <Icon name="Search" size={24} className="text-secondary-400 mx-auto mb-3" />
          <h3 className="text-sm font-medium text-text-primary mb-1">No results found</h3>
          <p className="text-xs text-text-secondary">
            No subscriptions match "<span className="font-medium">{searchQuery}</span>"
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="mt-3 text-sm text-primary hover:text-primary-700 transition-colors duration-200"
          >
            Clear search
          </button>
        </div>
      )}
      {/* Pagination */}
      <div className="bg-secondary-50 px-6 py-4 border-t border-border-light flex items-center justify-between">
        <div className="text-sm text-text-secondary">
          Showing <span className="font-medium">{searchFilteredSubscriptions?.length}</span> of <span className="font-medium">{subscriptions?.length}</span> subscriptions
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            className="p-2 text-secondary-600 hover:text-primary hover:bg-surface-hover rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled
          >
            <Icon name="ChevronLeft" size={18} />
          </button>
          
          <button
            className="px-3 py-1.5 bg-primary text-white rounded-lg text-sm font-medium"
          >
            1
          </button>
          
          <button
            className="p-2 text-secondary-600 hover:text-primary hover:bg-surface-hover rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled
          >
            <Icon name="ChevronRight" size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionTable;