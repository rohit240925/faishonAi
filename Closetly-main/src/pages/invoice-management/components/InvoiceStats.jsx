import React from 'react';
import Icon from '../../../components/AppIcon';

const InvoiceStats = ({ invoices }) => {
  // Calculate statistics
  const calculateStats = () => {
    const stats = {
      total: invoices?.length || 0,
      draft: 0,
      sent: 0,
      paid: 0,
      overdue: 0,
      totalAmount: 0,
      paidAmount: 0,
      overdueAmount: 0
    };
    
    invoices?.forEach(invoice => {
      // Count by status
      if (invoice?.status) {
        stats[invoice.status]++;
      }
      
      // Calculate amounts
      const amount = invoice?.amount || 0;
      stats.totalAmount += amount;
      
      if (invoice?.status === 'paid') {
        stats.paidAmount += amount;
      } else if (invoice?.status === 'overdue') {
        stats.overdueAmount += amount;
      }
    });
    
    return stats;
  };
  
  const stats = calculateStats();
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })?.format(amount || 0);
  };
  
  // Calculate collection rate
  const collectionRate = stats?.totalAmount > 0 
    ? Math.round((stats?.paidAmount / stats?.totalAmount) * 100) 
    : 0;
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Invoices Card */}
      <div className="financial-card card-hover">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-text-secondary text-sm font-medium mb-1">Total Invoices</p>
            <h3 className="financial-metric text-text-primary mb-2">{stats?.total}</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center">
                  <span className="inline-block w-2 h-2 rounded-full bg-secondary-400 mr-2"></span>
                  <span className="text-text-tertiary">Draft</span>
                </div>
                <span className="font-medium text-text-secondary">{stats?.draft}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center">
                  <span className="inline-block w-2 h-2 rounded-full bg-primary mr-2"></span>
                  <span className="text-text-tertiary">Sent</span>
                </div>
                <span className="font-medium text-text-secondary">{stats?.sent}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center">
                  <span className="inline-block w-2 h-2 rounded-full bg-success mr-2"></span>
                  <span className="text-text-tertiary">Paid</span>
                </div>
                <span className="font-medium text-text-secondary">{stats?.paid}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center">
                  <span className="inline-block w-2 h-2 rounded-full bg-error mr-2"></span>
                  <span className="text-text-tertiary">Overdue</span>
                </div>
                <span className="font-medium text-text-secondary">{stats?.overdue}</span>
              </div>
            </div>
          </div>
          <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
            <Icon name="FileText" size={24} className="text-primary" />
          </div>
        </div>
      </div>

      {/* Total Amount Card */}
      <div className="financial-card card-hover">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-text-secondary text-sm font-medium mb-1">Total Amount</p>
            <h3 className="financial-metric text-text-primary font-data mb-2">
              {formatCurrency(stats?.totalAmount)}
            </h3>
            <div className="financial-trend text-text-tertiary mb-3">
              <Icon name="TrendingUp" size={16} className="text-primary mr-1" />
              Collection Rate: {collectionRate}%
            </div>
            <div className="w-full bg-secondary-100 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-primary to-success h-2 rounded-full transition-all duration-500" 
                style={{ width: `${collectionRate}%` }}
              ></div>
            </div>
          </div>
          <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
            <Icon name="DollarSign" size={24} className="text-primary" />
          </div>
        </div>
      </div>

      {/* Paid Amount Card */}
      <div className="financial-card card-hover">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-text-secondary text-sm font-medium mb-1">Paid Amount</p>
            <h3 className="financial-metric text-success font-data mb-2">
              {formatCurrency(stats?.paidAmount)}
            </h3>
            <div className="financial-trend text-success mb-3">
              <Icon name="CheckCircle" size={16} className="mr-1" />
              {stats?.paid} invoices paid
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-text-tertiary">Paid vs Total</span>
              <span className="font-medium text-text-secondary font-data">
                {stats?.totalAmount > 0 ? Math.round((stats?.paidAmount / stats?.totalAmount) * 100) : 0}%
              </span>
            </div>
          </div>
          <div className="w-12 h-12 bg-success-50 rounded-lg flex items-center justify-center">
            <Icon name="CheckCircle" size={24} className="text-success" />
          </div>
        </div>
      </div>

      {/* Overdue Amount Card */}
      <div className="financial-card card-hover">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-text-secondary text-sm font-medium mb-1">Overdue Amount</p>
            <h3 className="financial-metric text-error font-data mb-2">
              {formatCurrency(stats?.overdueAmount)}
            </h3>
            <div className="financial-trend text-error mb-3">
              <Icon name="AlertTriangle" size={16} className="mr-1" />
              {stats?.overdue} overdue invoices
            </div>
            {stats?.overdue > 0 && (
              <button className="btn-primary text-xs px-3 py-1.5 btn-hover-lift flex items-center">
                <Icon name="Mail" size={14} className="mr-1" />
                Send Reminders
              </button>
            )}
          </div>
          <div className="w-12 h-12 bg-error-50 rounded-lg flex items-center justify-center">
            <Icon name="AlertTriangle" size={24} className="text-error" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceStats;