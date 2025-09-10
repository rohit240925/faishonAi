// src/pages/subscription-management/components/SubscriptionFilters.jsx
import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const SubscriptionFilters = ({ filters, setFilters, totalSubscriptions, filteredCount }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Status options
  const statusOptions = [
    { value: 'active', label: 'Active', color: 'text-success-600' },
    { value: 'trial', label: 'Trial', color: 'text-accent-600' },
    { value: 'paused', label: 'Paused', color: 'text-warning-600' },
    { value: 'cancelled', label: 'Cancelled', color: 'text-secondary-600' },
    { value: 'past_due', label: 'Past Due', color: 'text-error-600' }
  ];

  // Plan type options
  const planTypeOptions = [
    { value: 'starter', label: 'Starter', color: 'text-blue-600' },
    { value: 'professional', label: 'Professional', color: 'text-purple-600' },
    { value: 'business', label: 'Business', color: 'text-green-600' },
    { value: 'enterprise', label: 'Enterprise', color: 'text-orange-600' }
  ];

  // Billing frequency options
  const billingFrequencyOptions = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'annual', label: 'Annual' }
  ];

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      if (filterType === 'searchQuery' || filterType === 'dateRange') {
        return { ...prev, [filterType]: value };
      }
      
      const currentValues = prev?.[filterType] || [];
      const newValues = currentValues?.includes(value)
        ? currentValues?.filter(v => v !== value)
        : [...currentValues, value];
      
      return { ...prev, [filterType]: newValues };
    });
  };

  // Handle date range change
  const handleDateRangeChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      dateRange: {
        ...prev?.dateRange,
        [type]: value
      }
    }));
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      status: [],
      planType: [],
      billingFrequency: [],
      dateRange: { start: null, end: null },
      searchQuery: ''
    });
  };

  // Count active filters
  const activeFilterCount = (
    filters?.status?.length +
    filters?.planType?.length +
    filters?.billingFrequency?.length +
    (filters?.searchQuery ? 1 : 0) +
    (filters?.dateRange?.start && filters?.dateRange?.end ? 1 : 0)
  );

  return (
    <div className="bg-surface rounded-lg border border-border-light shadow-card">
      {/* Filter Header */}
      <div className="p-4 border-b border-border-light">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center space-x-2 text-text-primary hover:text-primary transition-colors duration-200"
            >
              <Icon 
                name={isExpanded ? 'ChevronDown' : 'ChevronRight'} 
                size={18} 
                className="transform transition-transform duration-200"
              />
              <span className="font-medium">Advanced Filters</span>
            </button>
            
            {activeFilterCount > 0 && (
              <span className="bg-primary-50 text-primary-700 px-2 py-1 rounded-full text-xs font-medium">
                {activeFilterCount} active
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-text-secondary">
              <span className="font-medium text-text-primary">{filteredCount}</span> of{' '}
              <span className="font-medium text-text-primary">{totalSubscriptions}</span> subscriptions
            </div>
            
            {activeFilterCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-primary hover:text-primary-700 transition-colors duration-200"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      </div>
      {/* Search Bar - Always Visible */}
      <div className="p-4 border-b border-border-light">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon name="Search" size={20} className="text-secondary-400" />
          </div>
          <input
            type="text"
            value={filters?.searchQuery || ''}
            onChange={(e) => handleFilterChange('searchQuery', e?.target?.value)}
            placeholder="Search by customer name, email, or plan..."
            className="block w-full pl-10 pr-3 py-2 border border-border-light rounded-lg bg-surface-hover focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm placeholder-secondary-400"
          />
          {filters?.searchQuery && (
            <button
              onClick={() => handleFilterChange('searchQuery', '')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <Icon name="X" size={18} className="text-secondary-400 hover:text-text-primary transition-colors duration-200" />
            </button>
          )}
        </div>
      </div>
      {/* Expanded Filters */}
      {isExpanded && (
        <div className="p-4 space-y-6">
          {/* Status Filter */}
          <div>
            <h4 className="text-sm font-medium text-text-primary mb-3">Status</h4>
            <div className="flex flex-wrap gap-2">
              {statusOptions?.map((option) => (
                <button
                  key={option?.value}
                  onClick={() => handleFilterChange('status', option?.value)}
                  className={`
                    inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200
                    ${
                      filters?.status?.includes(option?.value)
                        ? 'bg-primary text-white' :'bg-secondary-50 text-text-secondary hover:bg-secondary-100 hover:text-text-primary'
                    }
                  `}
                >
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    filters?.status?.includes(option?.value) ? 'bg-white' : 'bg-current'
                  }`} />
                  {option?.label}
                  {filters?.status?.includes(option?.value) && (
                    <Icon name="Check" size={14} className="ml-1" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Plan Type Filter */}
          <div>
            <h4 className="text-sm font-medium text-text-primary mb-3">Plan Type</h4>
            <div className="flex flex-wrap gap-2">
              {planTypeOptions?.map((option) => (
                <button
                  key={option?.value}
                  onClick={() => handleFilterChange('planType', option?.value)}
                  className={`
                    inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200
                    ${
                      filters?.planType?.includes(option?.value)
                        ? 'bg-primary text-white' :'bg-secondary-50 text-text-secondary hover:bg-secondary-100 hover:text-text-primary'
                    }
                  `}
                >
                  {option?.label}
                  {filters?.planType?.includes(option?.value) && (
                    <Icon name="Check" size={14} className="ml-1" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Billing Frequency Filter */}
          <div>
            <h4 className="text-sm font-medium text-text-primary mb-3">Billing Frequency</h4>
            <div className="flex flex-wrap gap-2">
              {billingFrequencyOptions?.map((option) => (
                <button
                  key={option?.value}
                  onClick={() => handleFilterChange('billingFrequency', option?.value)}
                  className={`
                    inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200
                    ${
                      filters?.billingFrequency?.includes(option?.value)
                        ? 'bg-primary text-white' :'bg-secondary-50 text-text-secondary hover:bg-secondary-100 hover:text-text-primary'
                    }
                  `}
                >
                  {option?.label}
                  {filters?.billingFrequency?.includes(option?.value) && (
                    <Icon name="Check" size={14} className="ml-1" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range Filter */}
          <div>
            <h4 className="text-sm font-medium text-text-primary mb-3">Creation Date Range</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-text-tertiary mb-1">Start Date</label>
                <input
                  type="date"
                  value={filters?.dateRange?.start || ''}
                  onChange={(e) => handleDateRangeChange('start', e?.target?.value)}
                  className="block w-full px-3 py-2 border border-border-light rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-text-tertiary mb-1">End Date</label>
                <input
                  type="date"
                  value={filters?.dateRange?.end || ''}
                  onChange={(e) => handleDateRangeChange('end', e?.target?.value)}
                  className="block w-full px-3 py-2 border border-border-light rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                />
              </div>
            </div>
            {(filters?.dateRange?.start || filters?.dateRange?.end) && (
              <button
                onClick={() => handleDateRangeChange('start', null) || handleDateRangeChange('end', null)}
                className="mt-2 text-xs text-primary hover:text-primary-700 transition-colors duration-200"
              >
                Clear date range
              </button>
            )}
          </div>

          {/* Quick Filters */}
          <div>
            <h4 className="text-sm font-medium text-text-primary mb-3">Quick Filters</h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setFilters(prev => ({
                    ...prev,
                    status: ['active'],
                    planType: [],
                    billingFrequency: []
                  }));
                }}
                className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-success-50 text-success-700 hover:bg-success-100 transition-colors duration-200"
              >
                <Icon name="CheckCircle" size={14} className="mr-1" />
                Active Only
              </button>
              
              <button
                onClick={() => {
                  setFilters(prev => ({
                    ...prev,
                    status: ['trial'],
                    planType: [],
                    billingFrequency: []
                  }));
                }}
                className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-accent-50 text-accent-700 hover:bg-accent-100 transition-colors duration-200"
              >
                <Icon name="Clock" size={14} className="mr-1" />
                Trial Only
              </button>
              
              <button
                onClick={() => {
                  setFilters(prev => ({
                    ...prev,
                    status: ['past_due'],
                    planType: [],
                    billingFrequency: []
                  }));
                }}
                className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-error-50 text-error-700 hover:bg-error-100 transition-colors duration-200"
              >
                <Icon name="AlertTriangle" size={14} className="mr-1" />
                Needs Attention
              </button>
              
              <button
                onClick={() => {
                  setFilters(prev => ({
                    ...prev,
                    status: [],
                    planType: ['enterprise'],
                    billingFrequency: []
                  }));
                }}
                className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-orange-50 text-orange-700 hover:bg-orange-100 transition-colors duration-200"
              >
                <Icon name="Star" size={14} className="mr-1" />
                Enterprise Only
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionFilters;