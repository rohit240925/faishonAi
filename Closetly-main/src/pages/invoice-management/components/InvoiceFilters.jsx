import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const InvoiceFilters = ({ filters, setFilters, totalInvoices, filteredCount }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Status options with enhanced styling
  const statusOptions = [
    { 
      value: 'draft', 
      label: 'Draft', 
      icon: 'FileEdit',
      color: 'text-secondary-600',
      bgColor: 'bg-secondary-100',
      hoverColor: 'hover:bg-secondary-200'
    },
    { 
      value: 'sent', 
      label: 'Sent', 
      icon: 'Send',
      color: 'text-primary-700',
      bgColor: 'bg-primary-50',
      hoverColor: 'hover:bg-primary-100'
    },
    { 
      value: 'paid', 
      label: 'Paid', 
      icon: 'CheckCircle',
      color: 'text-success-700',
      bgColor: 'bg-success-50',
      hoverColor: 'hover:bg-success-100'
    },
    { 
      value: 'overdue', 
      label: 'Overdue', 
      icon: 'AlertTriangle',
      color: 'text-error-700',
      bgColor: 'bg-error-50',
      hoverColor: 'hover:bg-error-100'
    }
  ];
  
  const handleStatusToggle = (status) => {
    const currentStatuses = filters?.status || [];
    let newStatuses;
    
    if (currentStatuses?.includes(status)) {
      newStatuses = currentStatuses?.filter(s => s !== status);
    } else {
      newStatuses = [...currentStatuses, status];
    }
    
    setFilters(prev => ({
      ...prev,
      status: newStatuses
    }));
  };
  
  const handleDateRangeChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      dateRange: {
        ...prev?.dateRange,
        [type]: value
      }
    }));
  };
  
  const handleAmountRangeChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      amountRange: {
        ...prev?.amountRange,
        [type]: parseFloat(value) || 0
      }
    }));
  };
  
  const handleCustomerChange = (value) => {
    setFilters(prev => ({
      ...prev,
      customer: value
    }));
  };
  
  const clearAllFilters = () => {
    setFilters({
      dateRange: { start: null, end: null },
      status: [],
      customer: '',
      amountRange: { min: 0, max: 10000 }
    });
  };
  
  const hasActiveFilters = 
    filters?.status?.length > 0 || 
    filters?.customer || 
    filters?.dateRange?.start || 
    filters?.dateRange?.end ||
    filters?.amountRange?.min > 0 ||
    filters?.amountRange?.max < 10000;
  
  return (
    <div className="financial-card mb-8">
      <div className="p-6">
        {/* Filter Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold text-text-primary flex items-center">
              <Icon name="Filter" size={20} className="mr-2 text-primary" />
              Filters
            </h3>
            
            <div className="flex items-center space-x-3">
              <div className="px-3 py-1 bg-primary-50 rounded-full">
                <span className="text-sm font-medium text-primary">
                  {filteredCount} of {totalInvoices}
                </span>
              </div>
              
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-error hover:text-error-600 font-medium transition-colors duration-200 flex items-center focus-ring rounded px-2 py-1"
                >
                  <Icon name="X" size={16} className="mr-1" />
                  Clear All
                </button>
              )}
            </div>
          </div>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center text-sm text-text-secondary hover:text-primary transition-colors duration-200 focus-ring rounded px-3 py-2"
          >
            <span className="mr-2 font-medium">{isExpanded ? 'Hide Filters' : 'More Filters'}</span>
            <Icon 
              name={isExpanded ? "ChevronUp" : "ChevronDown"} 
              size={16} 
              className="transition-transform duration-200" 
            />
          </button>
        </div>
        
        {/* Quick Status Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          {statusOptions?.map((option) => {
            const isSelected = filters?.status?.includes(option?.value);
            return (
              <button
                key={option?.value}
                onClick={() => handleStatusToggle(option?.value)}
                className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus-ring ${
                  isSelected
                    ? `${option?.bgColor} ${option?.color} ring-2 ring-primary/20 shadow-sm`
                    : `bg-surface-hover text-text-secondary hover:bg-surface-active ${option?.hoverColor}`
                }`}
              >
                <Icon 
                  name={option?.icon} 
                  size={16} 
                  className="mr-2" 
                />
                {option?.label}
                {isSelected && (
                  <Icon name="Check" size={14} className="ml-2" />
                )}
              </button>
            );
          })}
        </div>
        
        {/* Expanded Filters */}
        {isExpanded && (
          <div className="border-t border-border-light pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Customer Search */}
              <div>
                <label className="form-label">Customer</label>
                <div className="relative">
                  <Icon name="Search" size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary" />
                  <input
                    type="text"
                    placeholder="Search customers..."
                    value={filters?.customer}
                    onChange={(e) => handleCustomerChange(e?.target?.value)}
                    className="form-input pl-10 focus-ring"
                  />
                </div>
              </div>
              
              {/* Date Range */}
              <div>
                <label className="form-label">Date Range</label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <Icon name="Calendar" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary" />
                    <input
                      type="date"
                      value={filters?.dateRange?.start || ''}
                      onChange={(e) => handleDateRangeChange('start', e?.target?.value)}
                      className="form-input pl-10 focus-ring"
                      placeholder="Start date"
                    />
                  </div>
                  <div className="relative">
                    <Icon name="Calendar" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary" />
                    <input
                      type="date"
                      value={filters?.dateRange?.end || ''}
                      onChange={(e) => handleDateRangeChange('end', e?.target?.value)}
                      className="form-input pl-10 focus-ring"
                      placeholder="End date"
                    />
                  </div>
                </div>
              </div>
              
              {/* Amount Range */}
              <div>
                <label className="form-label">Amount Range (USD)</label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary font-medium">$</span>
                    <input
                      type="number"
                      placeholder="Min amount"
                      value={filters?.amountRange?.min || ''}
                      onChange={(e) => handleAmountRangeChange('min', e?.target?.value)}
                      className="form-input pl-8 focus-ring"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary font-medium">$</span>
                    <input
                      type="number"
                      placeholder="Max amount"
                      value={filters?.amountRange?.max || ''}
                      onChange={(e) => handleAmountRangeChange('max', e?.target?.value)}
                      className="form-input pl-8 focus-ring"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        )}
      </div>
      
      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="border-t border-border-light px-6 py-4 bg-primary-50/50">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-primary">Active Filters:</span>
            
            {filters?.status?.map((status) => {
              const statusOption = statusOptions?.find(opt => opt?.value === status);
              return (
                <span
                  key={status}
                  className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-primary text-primary-foreground shadow-sm"
                >
                  <Icon name={statusOption?.icon} size={12} className="mr-1" />
                  {status?.charAt(0)?.toUpperCase() + status?.slice(1)}
                  <button
                    onClick={() => handleStatusToggle(status)}
                    className="ml-2 hover:bg-primary-600 rounded-full p-0.5 transition-colors duration-200 focus-ring"
                  >
                    <Icon name="X" size={12} />
                  </button>
                </span>
              );
            })}
            
            {filters?.customer && (
              <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-primary text-primary-foreground shadow-sm">
                <Icon name="User" size={12} className="mr-1" />
                Customer: {filters?.customer}
                <button
                  onClick={() => handleCustomerChange('')}
                  className="ml-2 hover:bg-primary-600 rounded-full p-0.5 transition-colors duration-200 focus-ring"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            
            {(filters?.dateRange?.start || filters?.dateRange?.end) && (
              <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-primary text-primary-foreground shadow-sm">
                <Icon name="Calendar" size={12} className="mr-1" />
                {filters?.dateRange?.start || 'Start'} - {filters?.dateRange?.end || 'End'}
                <button
                  onClick={() => setFilters(prev => ({ ...prev, dateRange: { start: null, end: null } }))}
                  className="ml-2 hover:bg-primary-600 rounded-full p-0.5 transition-colors duration-200 focus-ring"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            
            {(filters?.amountRange?.min > 0 || filters?.amountRange?.max < 10000) && (
              <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-primary text-primary-foreground shadow-sm">
                <Icon name="DollarSign" size={12} className="mr-1" />
                ${filters?.amountRange?.min} - ${filters?.amountRange?.max}
                <button
                  onClick={() => setFilters(prev => ({ ...prev, amountRange: { min: 0, max: 10000 } }))}
                  className="ml-2 hover:bg-primary-600 rounded-full p-0.5 transition-colors duration-200 focus-ring"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceFilters;