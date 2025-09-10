// src/pages/subscription-management/components/QuickActionsPanel.jsx
import React, { useMemo } from 'react';
import Icon from '../../../components/AppIcon';

const QuickActionsPanel = ({ 
  onCreateSubscription, 
  subscriptions = [], 
  selectedSubscriptions = [], 
  onBulkAction 
}) => {
  // Calculate health metrics
  const healthMetrics = React.useMemo(() => {
    const total = subscriptions?.length;
    const active = subscriptions?.filter(sub => sub?.status === 'active')?.length;
    const trial = subscriptions?.filter(sub => sub?.status === 'trial')?.length;
    const pastDue = subscriptions?.filter(sub => sub?.status === 'past_due')?.length;
    const paused = subscriptions?.filter(sub => sub?.status === 'paused')?.length;
    
    // Calculate health score (0-100)
    const healthScore = total > 0 ? Math.round(
      ((active * 1.0 + trial * 0.8 + paused * 0.3) / total) * 100
    ) : 100;
    
    const trialConversionOpportunity = trial;
    const retentionRisk = pastDue + paused;
    
    return {
      healthScore,
      active,
      trial,
      pastDue,
      paused,
      total,
      trialConversionOpportunity,
      retentionRisk
    };
  }, [subscriptions]);

  // Get health score color
  const getHealthScoreColor = (score) => {
    if (score >= 80) return { bg: 'bg-success-50', text: 'text-success-700', border: 'border-success-200' };
    if (score >= 60) return { bg: 'bg-warning-50', text: 'text-warning-700', border: 'border-warning-200' };
    return { bg: 'bg-error-50', text: 'text-error-700', border: 'border-error-200' };
  };

  const healthColors = getHealthScoreColor(healthMetrics?.healthScore);

  return (
    <div className="space-y-6">
      {/* Create Subscription */}
      <div className="bg-surface rounded-lg border border-border-light shadow-card p-4">
        <h3 className="text-sm font-medium text-text-primary mb-4">Quick Actions</h3>
        
        <button
          onClick={onCreateSubscription}
          className="w-full bg-primary text-white px-4 py-3 rounded-lg flex items-center justify-center hover:bg-primary-700 transition-colors duration-200 font-medium"
        >
          <Icon name="Plus" size={18} className="mr-2" />
          Create Subscription
        </button>
        
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button className="flex items-center justify-center px-3 py-2 text-sm bg-surface-hover border border-border-light rounded-lg hover:bg-secondary-100 transition-colors duration-200">
            <Icon name="Upload" size={16} className="mr-1" />
            Import
          </button>
          
          <button className="flex items-center justify-center px-3 py-2 text-sm bg-surface-hover border border-border-light rounded-lg hover:bg-secondary-100 transition-colors duration-200">
            <Icon name="Download" size={16} className="mr-1" />
            Export
          </button>
        </div>
      </div>
      {/* Bulk Operations */}
      {selectedSubscriptions?.length > 0 && (
        <div className="bg-surface rounded-lg border border-border-light shadow-card p-4">
          <h3 className="text-sm font-medium text-text-primary mb-4">
            Bulk Operations
            <span className="ml-2 bg-primary-50 text-primary-700 px-2 py-1 rounded-full text-xs font-medium">
              {selectedSubscriptions?.length} selected
            </span>
          </h3>
          
          <div className="space-y-2">
            <button
              onClick={() => onBulkAction('pause')}
              className="w-full flex items-center justify-center px-3 py-2 text-sm bg-warning-50 text-warning-700 border border-warning-200 rounded-lg hover:bg-warning-100 transition-colors duration-200"
            >
              <Icon name="Pause" size={16} className="mr-2" />
              Pause Selected
            </button>
            
            <button
              onClick={() => onBulkAction('resume')}
              className="w-full flex items-center justify-center px-3 py-2 text-sm bg-success-50 text-success-700 border border-success-200 rounded-lg hover:bg-success-100 transition-colors duration-200"
            >
              <Icon name="Play" size={16} className="mr-2" />
              Resume Selected
            </button>
            
            <button
              onClick={() => onBulkAction('export')}
              className="w-full flex items-center justify-center px-3 py-2 text-sm bg-primary-50 text-primary-700 border border-primary-200 rounded-lg hover:bg-primary-100 transition-colors duration-200"
            >
              <Icon name="Download" size={16} className="mr-2" />
              Export Selected
            </button>
          </div>
        </div>
      )}
      {/* Subscription Health Summary */}
      <div className="bg-surface rounded-lg border border-border-light shadow-card p-4">
        <h3 className="text-sm font-medium text-text-primary mb-4">Subscription Health</h3>
        
        {/* Health Score */}
        <div className={`p-3 rounded-lg border ${healthColors?.bg} ${healthColors?.border} mb-4`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-text-primary">Overall Health Score</span>
            <span className={`text-lg font-bold ${healthColors?.text}`}>{healthMetrics?.healthScore}%</span>
          </div>
          
          <div className="w-full bg-white rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                healthMetrics?.healthScore >= 80 ? 'bg-success-500' :
                healthMetrics?.healthScore >= 60 ? 'bg-warning-500' : 'bg-error-500'
              }`}
              style={{ width: `${healthMetrics?.healthScore}%` }}
            />
          </div>
          
          <p className="text-xs text-text-tertiary mt-2">
            Based on active vs. total subscriptions
          </p>
        </div>
        
        {/* Metrics Breakdown */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-success-500 rounded-full mr-2"></div>
              <span className="text-sm text-text-secondary">Active</span>
            </div>
            <span className="text-sm font-medium text-text-primary">{healthMetrics?.active}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-accent-500 rounded-full mr-2"></div>
              <span className="text-sm text-text-secondary">Trial</span>
            </div>
            <span className="text-sm font-medium text-text-primary">{healthMetrics?.trial}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-warning-500 rounded-full mr-2"></div>
              <span className="text-sm text-text-secondary">Paused</span>
            </div>
            <span className="text-sm font-medium text-text-primary">{healthMetrics?.paused}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-error-500 rounded-full mr-2"></div>
              <span className="text-sm text-text-secondary">Past Due</span>
            </div>
            <span className="text-sm font-medium text-text-primary">{healthMetrics?.pastDue}</span>
          </div>
        </div>
      </div>
      {/* Action Items */}
      <div className="bg-surface rounded-lg border border-border-light shadow-card p-4">
        <h3 className="text-sm font-medium text-text-primary mb-4">Action Items</h3>
        
        <div className="space-y-3">
          {/* Trial Conversion Opportunities */}
          {healthMetrics?.trialConversionOpportunity > 0 && (
            <div className="p-3 bg-accent-50 border border-accent-200 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center">
                  <Icon name="Clock" size={16} className="text-accent-600 mr-2" />
                  <span className="text-sm font-medium text-text-primary">Trial Conversion</span>
                </div>
                <span className="bg-accent-100 text-accent-700 px-2 py-0.5 rounded-full text-xs font-medium">
                  {healthMetrics?.trialConversionOpportunity}
                </span>
              </div>
              <p className="text-xs text-text-secondary">
                {healthMetrics?.trialConversionOpportunity} trial{healthMetrics?.trialConversionOpportunity !== 1 ? 's' : ''} ready for conversion
              </p>
            </div>
          )}
          
          {/* Retention Risk */}
          {healthMetrics?.retentionRisk > 0 && (
            <div className="p-3 bg-error-50 border border-error-200 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center">
                  <Icon name="AlertTriangle" size={16} className="text-error-600 mr-2" />
                  <span className="text-sm font-medium text-text-primary">Retention Risk</span>
                </div>
                <span className="bg-error-100 text-error-700 px-2 py-0.5 rounded-full text-xs font-medium">
                  {healthMetrics?.retentionRisk}
                </span>
              </div>
              <p className="text-xs text-text-secondary">
                {healthMetrics?.retentionRisk} subscription{healthMetrics?.retentionRisk !== 1 ? 's' : ''} need{healthMetrics?.retentionRisk === 1 ? 's' : ''} immediate attention
              </p>
            </div>
          )}
          
          {/* All Good */}
          {healthMetrics?.trialConversionOpportunity === 0 && healthMetrics?.retentionRisk === 0 && healthMetrics?.total > 0 && (
            <div className="p-3 bg-success-50 border border-success-200 rounded-lg">
              <div className="flex items-center">
                <Icon name="CheckCircle" size={16} className="text-success-600 mr-2" />
                <span className="text-sm font-medium text-text-primary">All Subscriptions Healthy</span>
              </div>
              <p className="text-xs text-text-secondary mt-1">
                No immediate action required
              </p>
            </div>
          )}
          
          {/* No Subscriptions */}
          {healthMetrics?.total === 0 && (
            <div className="p-3 bg-secondary-50 border border-secondary-200 rounded-lg text-center">
              <Icon name="Users" size={24} className="text-secondary-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-text-primary mb-1">No Subscriptions Yet</p>
              <p className="text-xs text-text-secondary">
                Create your first subscription to get started
              </p>
            </div>
          )}
        </div>
      </div>
      {/* Quick Links */}
      <div className="bg-surface rounded-lg border border-border-light shadow-card p-4">
        <h3 className="text-sm font-medium text-text-primary mb-4">Quick Links</h3>
        
        <div className="space-y-2">
          <button className="w-full flex items-center px-3 py-2 text-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary rounded-lg transition-colors duration-200">
            <Icon name="FileText" size={16} className="mr-2" />
            Invoice Management
          </button>
          
          <button className="w-full flex items-center px-3 py-2 text-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary rounded-lg transition-colors duration-200">
            <Icon name="TrendingUp" size={16} className="mr-2" />
            Usage Analytics
          </button>
          
          <button className="w-full flex items-center px-3 py-2 text-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary rounded-lg transition-colors duration-200">
            <Icon name="Settings" size={16} className="mr-2" />
            Payment Settings
          </button>
          
          <button className="w-full flex items-center px-3 py-2 text-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary rounded-lg transition-colors duration-200">
            <Icon name="HelpCircle" size={16} className="mr-2" />
            Help & Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickActionsPanel;