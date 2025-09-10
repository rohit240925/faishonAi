// src/pages/dunning-management/components/ConfigurationPanel.jsx
import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const ConfigurationPanel = () => {
  const [activeSection, setActiveSection] = useState('retry');
  const [hasChanges, setHasChanges] = useState(false);
  const [config, setConfig] = useState({
    retry: {
      maxAttempts: 3,
      retryIntervals: [24, 72, 168], // hours
      enableSmartRetry: true,
      retryOnWeekends: false,
      fallbackPaymentMethod: true
    },
    grace: {
      defaultGracePeriod: 7, // days
      allowServiceAccess: true,
      gracePeriodByPlan: {
        enterprise: 14,
        professional: 10,
        starter: 7
      }
    },
    escalation: {
      enableAutoEscalation: true,
      escalationThreshold: 3,
      escalationRecipients: ['billing@company.com', 'accounts@company.com'],
      highValueThreshold: 1000
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      slackIntegration: true,
      webhookUrl: '',
      notificationTimezone: 'UTC'
    }
  });

  const configSections = [
    {
      id: 'retry',
      label: 'Retry Settings',
      icon: 'RefreshCw',
      description: 'Configure automatic payment retry logic'
    },
    {
      id: 'grace',
      label: 'Grace Periods',
      icon: 'Clock',
      description: 'Set grace periods and service access policies'
    },
    {
      id: 'escalation',
      label: 'Escalation Rules',
      icon: 'AlertTriangle',
      description: 'Define when and how to escalate failed payments'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: 'Bell',
      description: 'Configure notification channels and settings'
    }
  ];

  const updateConfig = (section, field, value) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev?.[section],
        [field]: value
      }
    }));
    setHasChanges(true);
  };

  const updateNestedConfig = (section, parentField, childField, value) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev?.[section],
        [parentField]: {
          ...prev?.[section]?.[parentField],
          [childField]: value
        }
      }
    }));
    setHasChanges(true);
  };

  const handleSaveConfig = () => {
    console.log('Saving configuration:', config);
    setHasChanges(false);
    // Show success message
  };

  const handleResetConfig = () => {
    // Reset to default values
    setHasChanges(false);
  };

  const renderRetrySettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Maximum Retry Attempts
          </label>
          <select
            value={config?.retry?.maxAttempts}
            onChange={(e) => updateConfig('retry', 'maxAttempts', parseInt(e?.target?.value))}
            className="w-full border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value={1}>1 attempt</option>
            <option value={2}>2 attempts</option>
            <option value={3}>3 attempts</option>
            <option value={4}>4 attempts</option>
            <option value={5}>5 attempts</option>
          </select>
          <p className="text-xs text-text-tertiary mt-1">
            Number of automatic retry attempts before escalation
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Smart Retry Logic
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="smartRetry"
              checked={config?.retry?.enableSmartRetry}
              onChange={(e) => updateConfig('retry', 'enableSmartRetry', e?.target?.checked)}
              className="rounded border-border-medium text-primary focus:ring-primary"
            />
            <label htmlFor="smartRetry" className="text-sm text-text-primary">
              Enable intelligent retry timing
            </label>
          </div>
          <p className="text-xs text-text-tertiary mt-1">
            Automatically adjust retry intervals based on failure reason
          </p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-secondary mb-2">
          Retry Intervals (hours)
        </label>
        <div className="grid grid-cols-3 gap-3">
          {config?.retry?.retryIntervals?.map((interval, index) => (
            <div key={index}>
              <label className="block text-xs text-text-tertiary mb-1">
                Attempt {index + 1}
              </label>
              <input
                type="number"
                value={interval}
                onChange={(e) => {
                  const newIntervals = [...config?.retry?.retryIntervals];
                  newIntervals[index] = parseInt(e?.target?.value) || 0;
                  updateConfig('retry', 'retryIntervals', newIntervals);
                }}
                className="w-full border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                min="1"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="weekendRetry"
            checked={config?.retry?.retryOnWeekends}
            onChange={(e) => updateConfig('retry', 'retryOnWeekends', e?.target?.checked)}
            className="rounded border-border-medium text-primary focus:ring-primary"
          />
          <label htmlFor="weekendRetry" className="text-sm text-text-primary">
            Allow retries on weekends
          </label>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="fallbackPayment"
            checked={config?.retry?.fallbackPaymentMethod}
            onChange={(e) => updateConfig('retry', 'fallbackPaymentMethod', e?.target?.checked)}
            className="rounded border-border-medium text-primary focus:ring-primary"
          />
          <label htmlFor="fallbackPayment" className="text-sm text-text-primary">
            Try fallback payment methods
          </label>
        </div>
      </div>
    </div>
  );

  const renderGraceSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Default Grace Period (days)
          </label>
          <select
            value={config?.grace?.defaultGracePeriod}
            onChange={(e) => updateConfig('grace', 'defaultGracePeriod', parseInt(e?.target?.value))}
            className="w-full border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value={3}>3 days</option>
            <option value={7}>7 days</option>
            <option value={14}>14 days</option>
            <option value={30}>30 days</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Service Access During Grace
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="serviceAccess"
              checked={config?.grace?.allowServiceAccess}
              onChange={(e) => updateConfig('grace', 'allowServiceAccess', e?.target?.checked)}
              className="rounded border-border-medium text-primary focus:ring-primary"
            />
            <label htmlFor="serviceAccess" className="text-sm text-text-primary">
              Allow continued service access
            </label>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-secondary mb-4">
          Grace Period by Plan Type
        </label>
        <div className="space-y-3">
          {Object.entries(config?.grace?.gracePeriodByPlan)?.map(([plan, days]) => (
            <div key={plan} className="flex items-center justify-between p-3 bg-secondary-25 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  plan === 'enterprise' ? 'bg-purple-500' :
                  plan === 'professional' ? 'bg-blue-500' : 'bg-green-500'
                }`}></div>
                <span className="text-sm font-medium text-text-primary capitalize">{plan}</span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={days}
                  onChange={(e) => updateNestedConfig('grace', 'gracePeriodByPlan', plan, parseInt(e?.target?.value) || 0)}
                  className="w-20 border border-border-light rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  min="1"
                />
                <span className="text-sm text-text-secondary">days</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderEscalationSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Auto-Escalation
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="autoEscalation"
              checked={config?.escalation?.enableAutoEscalation}
              onChange={(e) => updateConfig('escalation', 'enableAutoEscalation', e?.target?.checked)}
              className="rounded border-border-medium text-primary focus:ring-primary"
            />
            <label htmlFor="autoEscalation" className="text-sm text-text-primary">
              Enable automatic escalation
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Escalation Threshold
          </label>
          <select
            value={config?.escalation?.escalationThreshold}
            onChange={(e) => updateConfig('escalation', 'escalationThreshold', parseInt(e?.target?.value))}
            className="w-full border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value={2}>After 2 failed attempts</option>
            <option value={3}>After 3 failed attempts</option>
            <option value={4}>After 4 failed attempts</option>
            <option value={5}>After 5 failed attempts</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-secondary mb-2">
          High-Value Payment Threshold ($)
        </label>
        <input
          type="number"
          value={config?.escalation?.highValueThreshold}
          onChange={(e) => updateConfig('escalation', 'highValueThreshold', parseFloat(e?.target?.value) || 0)}
          className="w-full border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="1000"
        />
        <p className="text-xs text-text-tertiary mt-1">
          Payments above this amount get immediate escalation
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-secondary mb-2">
          Escalation Recipients
        </label>
        <div className="space-y-2">
          {config?.escalation?.escalationRecipients?.map((email, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  const newRecipients = [...config?.escalation?.escalationRecipients];
                  newRecipients[index] = e?.target?.value;
                  updateConfig('escalation', 'escalationRecipients', newRecipients);
                }}
                className="flex-1 border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="email@company.com"
              />
              <button
                onClick={() => {
                  const newRecipients = config?.escalation?.escalationRecipients?.filter((_, i) => i !== index);
                  updateConfig('escalation', 'escalationRecipients', newRecipients);
                }}
                className="p-2 text-error hover:bg-error-50 rounded-lg transition-colors duration-200"
              >
                <Icon name="Trash2" size={16} />
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              const newRecipients = [...config?.escalation?.escalationRecipients, ''];
              updateConfig('escalation', 'escalationRecipients', newRecipients);
            }}
            className="flex items-center text-sm text-primary hover:text-primary-700 transition-colors duration-200"
          >
            <Icon name="Plus" size={16} className="mr-1" />
            Add Recipient
          </button>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-medium text-text-primary">Notification Channels</h4>
          
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="emailNotifications"
              checked={config?.notifications?.emailNotifications}
              onChange={(e) => updateConfig('notifications', 'emailNotifications', e?.target?.checked)}
              className="rounded border-border-medium text-primary focus:ring-primary"
            />
            <label htmlFor="emailNotifications" className="text-sm text-text-primary">
              Email notifications
            </label>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="smsNotifications"
              checked={config?.notifications?.smsNotifications}
              onChange={(e) => updateConfig('notifications', 'smsNotifications', e?.target?.checked)}
              className="rounded border-border-medium text-primary focus:ring-primary"
            />
            <label htmlFor="smsNotifications" className="text-sm text-text-primary">
              SMS notifications
            </label>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="slackIntegration"
              checked={config?.notifications?.slackIntegration}
              onChange={(e) => updateConfig('notifications', 'slackIntegration', e?.target?.checked)}
              className="rounded border-border-medium text-primary focus:ring-primary"
            />
            <label htmlFor="slackIntegration" className="text-sm text-text-primary">
              Slack integration
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Notification Timezone
          </label>
          <select
            value={config?.notifications?.notificationTimezone}
            onChange={(e) => updateConfig('notifications', 'notificationTimezone', e?.target?.value)}
            className="w-full border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="UTC">UTC</option>
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
            <option value="Europe/London">London</option>
            <option value="Europe/Paris">Paris</option>
            <option value="Asia/Tokyo">Tokyo</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-secondary mb-2">
          Webhook URL (Optional)
        </label>
        <input
          type="url"
          value={config?.notifications?.webhookUrl}
          onChange={(e) => updateConfig('notifications', 'webhookUrl', e?.target?.value)}
          className="w-full border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="https://your-app.com/webhook/dunning"
        />
        <p className="text-xs text-text-tertiary mt-1">
          Receive real-time notifications via webhook for integration with external systems
        </p>
      </div>
    </div>
  );

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'retry':
        return renderRetrySettings();
      case 'grace':
        return renderGraceSettings();
      case 'escalation':
        return renderEscalationSettings();
      case 'notifications':
        return renderNotificationSettings();
      default:
        return renderRetrySettings();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-text-primary">Dunning Configuration</h2>
          <p className="text-text-secondary">Configure retry intervals, grace periods, and escalation rules</p>
        </div>
        {hasChanges && (
          <div className="flex space-x-3">
            <button
              onClick={handleResetConfig}
              className="px-4 py-2 text-text-secondary border border-border-light rounded-lg hover:bg-surface-hover transition-colors duration-200"
            >
              Reset
            </button>
            <button
              onClick={handleSaveConfig}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center"
            >
              <Icon name="Save" size={18} className="mr-2" />
              Save Changes
            </button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Section Navigation */}
        <div className="lg:col-span-3">
          <div className="bg-surface rounded-lg border border-border-light shadow-card p-4">
            <h3 className="font-medium text-text-primary mb-4">Configuration Sections</h3>
            <div className="space-y-2">
              {configSections?.map((section) => (
                <button
                  key={section?.id}
                  onClick={() => setActiveSection(section?.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors duration-200 ${
                    activeSection === section?.id
                      ? 'bg-primary text-white' :'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon name={section?.icon} size={18} />
                    <div>
                      <div className="font-medium">{section?.label}</div>
                      <div className="text-xs opacity-80">{section?.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Configuration Content */}
        <div className="lg:col-span-9">
          <div className="bg-surface rounded-lg border border-border-light shadow-card p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Icon 
                name={configSections?.find(s => s?.id === activeSection)?.icon || 'Settings'} 
                size={24} 
                className="text-primary" 
              />
              <div>
                <h3 className="text-lg font-semibold text-text-primary">
                  {configSections?.find(s => s?.id === activeSection)?.label}
                </h3>
                <p className="text-text-secondary">
                  {configSections?.find(s => s?.id === activeSection)?.description}
                </p>
              </div>
            </div>
            
            {renderSectionContent()}
          </div>
        </div>
      </div>
      {/* Configuration Status */}
      {hasChanges && (
        <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Icon name="AlertTriangle" size={20} className="text-warning-600" />
            <div>
              <div className="font-medium text-warning-800">Unsaved Changes</div>
              <div className="text-sm text-warning-700">
                You have unsaved configuration changes. Don't forget to save your settings.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfigurationPanel;