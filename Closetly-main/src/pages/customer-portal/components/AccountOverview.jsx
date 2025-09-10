// src/pages/customer-portal/components/AccountOverview.jsx
import React from 'react';
import Icon from '../../../components/AppIcon';

const AccountOverview = ({ customer, subscription, usage, formatCurrency, formatDate }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-success-100 text-success-800';
      case 'past_due':
        return 'bg-warning-100 text-warning-800';
      case 'canceled':
        return 'bg-error-100 text-error-800';
      default:
        return 'bg-secondary-100 text-secondary-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return 'CheckCircle';
      case 'past_due':
        return 'AlertTriangle';
      case 'canceled':
        return 'XCircle';
      default:
        return 'Clock';
    }
  };

  return (
    <div className="bg-surface rounded-lg shadow-card border border-border-light p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-text-primary">Account Overview</h2>
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          getStatusColor(subscription?.status)
        }`}>
          <Icon name={getStatusIcon(subscription?.status)} size={16} className="mr-1" />
          {subscription?.status?.charAt(0)?.toUpperCase() + subscription?.status?.slice(1)}
        </div>
      </div>

      {/* Customer Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-sm font-medium text-text-secondary mb-2">Account Holder</h3>
          <p className="text-lg font-medium text-text-primary">{customer?.name}</p>
          <p className="text-sm text-text-secondary">{customer?.email}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-text-secondary mb-2">Member Since</h3>
          <p className="text-lg font-medium text-text-primary">
            {formatDate(customer?.joinedDate)}
          </p>
        </div>
      </div>

      {/* Subscription Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 className="text-sm font-medium text-text-secondary mb-2">Current Plan</h3>
          <p className="text-lg font-medium text-text-primary">{subscription?.plan?.name}</p>
          <p className="text-sm text-text-secondary">
            {formatCurrency(subscription?.plan?.price)}/{subscription?.plan?.interval}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-text-secondary mb-2">Next Billing Date</h3>
          <p className="text-lg font-medium text-text-primary">
            {formatDate(subscription?.nextBillingDate)}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-text-secondary mb-2">Billing Period</h3>
          <p className="text-sm text-text-primary">
            {formatDate(subscription?.currentPeriodStart)} - {formatDate(subscription?.currentPeriodEnd)}
          </p>
        </div>
      </div>

      {/* Usage Summary */}
      <div className="mt-6 pt-6 border-t border-border-light">
        <h3 className="text-sm font-medium text-text-secondary mb-4">Usage Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* API Calls */}
          <div className="bg-surface-hover rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-text-primary">API Calls</span>
              <Icon name="Zap" size={16} className="text-primary" />
            </div>
            <div className="flex items-end space-x-2">
              <span className="text-lg font-semibold text-text-primary">
                {usage?.apiCalls?.current?.toLocaleString()}
              </span>
              <span className="text-sm text-text-secondary">
                / {usage?.apiCalls?.limit?.toLocaleString()}
              </span>
            </div>
            <div className="mt-2">
              <div className="w-full bg-secondary-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(usage?.apiCalls?.percentage || 0, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Storage */}
          <div className="bg-surface-hover rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-text-primary">Storage</span>
              <Icon name="HardDrive" size={16} className="text-primary" />
            </div>
            <div className="flex items-end space-x-2">
              <span className="text-lg font-semibold text-text-primary">
                {usage?.storage?.current}
              </span>
              <span className="text-sm text-text-secondary">
                / {usage?.storage?.limit} {usage?.storage?.unit}
              </span>
            </div>
            <div className="mt-2">
              <div className="w-full bg-secondary-200 rounded-full h-2">
                <div
                  className="bg-warning h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(usage?.storage?.percentage || 0, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Users */}
          <div className="bg-surface-hover rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-text-primary">Users</span>
              <Icon name="Users" size={16} className="text-primary" />
            </div>
            <div className="flex items-end space-x-2">
              <span className="text-lg font-semibold text-text-primary">
                {usage?.users?.current}
              </span>
              <span className="text-sm text-text-secondary">
                / {usage?.users?.limit}
              </span>
            </div>
            <div className="mt-2">
              <div className="w-full bg-secondary-200 rounded-full h-2">
                <div
                  className="bg-success h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(usage?.users?.percentage || 0, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountOverview;