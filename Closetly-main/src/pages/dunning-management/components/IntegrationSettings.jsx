// src/pages/dunning-management/components/IntegrationSettings.jsx
import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const IntegrationSettings = () => {
  const [activeIntegration, setActiveIntegration] = useState(null);
  const [testResults, setTestResults] = useState({});
  const [isTesting, setIsTesting] = useState({});

  // Mock integration configurations
  const [integrations, setIntegrations] = useState({
    slack: {
      name: 'Slack',
      description: 'Send notifications to Slack channels',
      icon: 'MessageCircle',
      enabled: true,
      configured: true,
      status: 'connected',
      config: {
        webhookUrl: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX',
        channel: '#billing-alerts',
        username: 'Dunning Bot',
        notifications: {
          paymentFailed: true,
          retryScheduled: false,
          campaignCompleted: true,
          escalation: true
        }
      }
    },
    zapier: {
      name: 'Zapier',
      description: 'Trigger workflows in thousands of apps',
      icon: 'Zap',
      enabled: false,
      configured: false,
      status: 'disconnected',
      config: {
        webhookUrl: '',
        triggers: {
          paymentFailed: false,
          campaignStarted: false,
          paymentRecovered: false
        }
      }
    },
    salesforce: {
      name: 'Salesforce',
      description: 'Update customer records and create tasks',
      icon: 'Users',
      enabled: true,
      configured: true,
      status: 'connected',
      config: {
        instanceUrl: 'https://your-domain.salesforce.com',
        clientId: 'your_client_id',
        clientSecret: '••••••••••••••••',
        actions: {
          createTask: true,
          updateAccount: true,
          createCase: false
        }
      }
    },
    webhook: {
      name: 'Custom Webhook',
      description: 'Send data to your custom endpoints',
      icon: 'Link',
      enabled: true,
      configured: true,
      status: 'connected',
      config: {
        endpointUrl: 'https://api.yourapp.com/webhooks/dunning',
        method: 'POST',
        headers: {
          'Authorization': 'Bearer your_api_token',
          'Content-Type': 'application/json'
        },
        events: {
          paymentFailed: true,
          retryAttempt: true,
          campaignCompleted: true,
          escalation: true
        }
      }
    },
    email: {
      name: 'Email Integration',
      description: 'Enhanced email delivery and tracking',
      icon: 'Mail',
      enabled: true,
      configured: true,
      status: 'connected',
      config: {
        provider: 'sendgrid',
        apiKey: '••••••••••••••••',
        fromEmail: 'billing@yourcompany.com',
        fromName: 'Billing Team',
        features: {
          deliveryTracking: true,
          openTracking: true,
          clickTracking: true,
          bounceHandling: true
        }
      }
    },
    sms: {
      name: 'SMS Notifications',
      description: 'Send SMS alerts via Twilio',
      icon: 'Smartphone',
      enabled: false,
      configured: false,
      status: 'disconnected',
      config: {
        provider: 'twilio',
        accountSid: '',
        authToken: '',
        fromNumber: '',
        notifications: {
          urgentFailures: false,
          finalNotice: false,
          paymentRecovered: false
        }
      }
    }
  });

  const handleToggleIntegration = (integrationKey) => {
    setIntegrations(prev => ({
      ...prev,
      [integrationKey]: {
        ...prev?.[integrationKey],
        enabled: !prev?.[integrationKey]?.enabled
      }
    }));
  };

  const handleTestConnection = async (integrationKey) => {
    setIsTesting(prev => ({ ...prev, [integrationKey]: true }));
    
    // Simulate API call
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% success rate for demo
      setTestResults(prev => ({
        ...prev,
        [integrationKey]: {
          success,
          message: success ? 'Connection successful!' : 'Connection failed. Please check your configuration.',
          timestamp: new Date()?.toISOString()
        }
      }));
      setIsTesting(prev => ({ ...prev, [integrationKey]: false }));
    }, 2000);
  };

  const handleUpdateConfig = (integrationKey, configPath, value) => {
    setIntegrations(prev => {
      const integration = { ...prev?.[integrationKey] };
      const configKeys = configPath?.split('.');
      let current = integration?.config;
      
      for (let i = 0; i < configKeys?.length - 1; i++) {
        current = current?.[configKeys?.[i]];
      }
      
      current[configKeys[configKeys.length - 1]] = value;
      
      return {
        ...prev,
        [integrationKey]: integration
      };
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      connected: { bgColor: 'bg-success-50', textColor: 'text-success-700', icon: 'CheckCircle' },
      disconnected: { bgColor: 'bg-error-50', textColor: 'text-error-700', icon: 'XCircle' },
      warning: { bgColor: 'bg-warning-50', textColor: 'text-warning-700', icon: 'AlertTriangle' }
    };
    
    const config = statusConfig?.[status] || statusConfig?.disconnected;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config?.bgColor} ${config?.textColor}`}>
        <Icon name={config?.icon} size={12} className="mr-1" />
        {status?.charAt(0)?.toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  const renderSlackConfig = () => {
    const config = integrations?.slack?.config;
    
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Webhook URL</label>
          <input
            type="url"
            value={config?.webhookUrl}
            onChange={(e) => handleUpdateConfig('slack', 'webhookUrl', e?.target?.value)}
            className="w-full border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="https://hooks.slack.com/services/..."
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Channel</label>
            <input
              type="text"
              value={config?.channel}
              onChange={(e) => handleUpdateConfig('slack', 'channel', e?.target?.value)}
              className="w-full border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="#billing-alerts"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Bot Username</label>
            <input
              type="text"
              value={config?.username}
              onChange={(e) => handleUpdateConfig('slack', 'username', e?.target?.value)}
              className="w-full border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Dunning Bot"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-3">Notification Types</label>
          <div className="space-y-2">
            {Object.entries(config?.notifications)?.map(([key, enabled]) => (
              <div key={key} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id={`slack-${key}`}
                  checked={enabled}
                  onChange={(e) => handleUpdateConfig('slack', `notifications.${key}`, e?.target?.checked)}
                  className="rounded border-border-medium text-primary focus:ring-primary"
                />
                <label htmlFor={`slack-${key}`} className="text-sm text-text-primary">
                  {key?.replace(/([A-Z])/g, ' $1')?.replace(/^./, str => str?.toUpperCase())}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderWebhookConfig = () => {
    const config = integrations?.webhook?.config;
    
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Endpoint URL</label>
          <input
            type="url"
            value={config?.endpointUrl}
            onChange={(e) => handleUpdateConfig('webhook', 'endpointUrl', e?.target?.value)}
            className="w-full border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="https://api.yourapp.com/webhooks/dunning"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">HTTP Method</label>
          <select
            value={config?.method}
            onChange={(e) => handleUpdateConfig('webhook', 'method', e?.target?.value)}
            className="w-full border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="PATCH">PATCH</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-3">Headers</label>
          <div className="space-y-2">
            {Object.entries(config?.headers)?.map(([key, value]) => (
              <div key={key} className="grid grid-cols-5 gap-2">
                <div className="col-span-2">
                  <input
                    type="text"
                    value={key}
                    readOnly
                    className="w-full border border-border-light rounded-lg px-3 py-2 text-sm bg-secondary-25"
                  />
                </div>
                <div className="col-span-3">
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleUpdateConfig('webhook', `headers.${key}`, e?.target?.value)}
                    className="w-full border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-3">Events to Send</label>
          <div className="space-y-2">
            {Object.entries(config?.events)?.map(([key, enabled]) => (
              <div key={key} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id={`webhook-${key}`}
                  checked={enabled}
                  onChange={(e) => handleUpdateConfig('webhook', `events.${key}`, e?.target?.checked)}
                  className="rounded border-border-medium text-primary focus:ring-primary"
                />
                <label htmlFor={`webhook-${key}`} className="text-sm text-text-primary">
                  {key?.replace(/([A-Z])/g, ' $1')?.replace(/^./, str => str?.toUpperCase())}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderEmailConfig = () => {
    const config = integrations?.email?.config;
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Email Provider</label>
            <select
              value={config?.provider}
              onChange={(e) => handleUpdateConfig('email', 'provider', e?.target?.value)}
              className="w-full border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="sendgrid">SendGrid</option>
              <option value="mailgun">Mailgun</option>
              <option value="amazonses">Amazon SES</option>
              <option value="postmark">Postmark</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">API Key</label>
            <input
              type="password"
              value={config?.apiKey}
              onChange={(e) => handleUpdateConfig('email', 'apiKey', e?.target?.value)}
              className="w-full border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="••••••••••••••••"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">From Email</label>
            <input
              type="email"
              value={config?.fromEmail}
              onChange={(e) => handleUpdateConfig('email', 'fromEmail', e?.target?.value)}
              className="w-full border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="billing@yourcompany.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">From Name</label>
            <input
              type="text"
              value={config?.fromName}
              onChange={(e) => handleUpdateConfig('email', 'fromName', e?.target?.value)}
              className="w-full border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Billing Team"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-3">Tracking Features</label>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(config?.features)?.map(([key, enabled]) => (
              <div key={key} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id={`email-${key}`}
                  checked={enabled}
                  onChange={(e) => handleUpdateConfig('email', `features.${key}`, e?.target?.checked)}
                  className="rounded border-border-medium text-primary focus:ring-primary"
                />
                <label htmlFor={`email-${key}`} className="text-sm text-text-primary">
                  {key?.replace(/([A-Z])/g, ' $1')?.replace(/^./, str => str?.toUpperCase())}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderConfigForm = () => {
    if (!activeIntegration) return null;
    
    switch (activeIntegration) {
      case 'slack':
        return renderSlackConfig();
      case 'webhook':
        return renderWebhookConfig();
      case 'email':
        return renderEmailConfig();
      default:
        return (
          <div className="text-center py-8 text-text-secondary">
            <Icon name="Settings" size={32} className="mx-auto mb-3 opacity-50" />
            <p>Configuration options for this integration are coming soon.</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-text-primary">Integration Settings</h2>
          <p className="text-text-secondary">Connect with external systems and notification channels</p>
        </div>
        <button className="bg-primary text-white px-4 py-2 rounded-lg flex items-center hover:bg-primary-700 transition-colors duration-200">
          <Icon name="Plus" size={18} className="mr-2" />
          Add Integration
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Integrations List */}
        <div className="lg:col-span-5">
          <div className="space-y-4">
            {Object.entries(integrations)?.map(([key, integration]) => (
              <div
                key={key}
                className={`bg-surface rounded-lg border border-border-light shadow-card p-4 cursor-pointer transition-all duration-200 ${
                  activeIntegration === key ? 'ring-2 ring-primary' : 'hover:shadow-md'
                }`}
                onClick={() => setActiveIntegration(key)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      integration?.enabled ? 'bg-primary-50' : 'bg-secondary-100'
                    }`}>
                      <Icon name={integration?.icon} size={20} className={integration?.enabled ? 'text-primary' : 'text-secondary-500'} />
                    </div>
                    <div>
                      <h3 className="font-medium text-text-primary">{integration?.name}</h3>
                      <p className="text-sm text-text-secondary">{integration?.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    {getStatusBadge(integration?.status)}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e?.stopPropagation();
                          handleToggleIntegration(key);
                        }}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                          integration?.enabled ? 'bg-primary' : 'bg-secondary-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            integration?.enabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e?.stopPropagation();
                        handleTestConnection(key);
                      }}
                      disabled={!integration?.configured || isTesting?.[key]}
                      className="px-3 py-1.5 text-xs border border-border-light rounded hover:bg-surface-hover transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {isTesting?.[key] ? (
                        <>
                          <Icon name="Loader" size={14} className="mr-1 animate-spin" />
                          Testing...
                        </>
                      ) : (
                        <>
                          <Icon name="Zap" size={14} className="mr-1" />
                          Test
                        </>
                      )}
                    </button>
                  </div>
                  
                  {testResults?.[key] && (
                    <div className={`text-xs flex items-center ${
                      testResults?.[key]?.success ? 'text-success-600' : 'text-error-600'
                    }`}>
                      <Icon name={testResults?.[key]?.success ? 'CheckCircle' : 'XCircle'} size={14} className="mr-1" />
                      {testResults?.[key]?.message}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Configuration Panel */}
        <div className="lg:col-span-7">
          {activeIntegration ? (
            <div className="bg-surface rounded-lg border border-border-light shadow-card p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                    <Icon name={integrations?.[activeIntegration]?.icon} size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary">
                      {integrations?.[activeIntegration]?.name} Configuration
                    </h3>
                    <p className="text-text-secondary">
                      {integrations?.[activeIntegration]?.description}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleTestConnection(activeIntegration)}
                    disabled={isTesting?.[activeIntegration]}
                    className="px-3 py-1.5 text-sm border border-border-light rounded hover:bg-surface-hover transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {isTesting?.[activeIntegration] ? (
                      <>
                        <Icon name="Loader" size={16} className="mr-2 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      <>
                        <Icon name="Zap" size={16} className="mr-2" />
                        Test Connection
                      </>
                    )}
                  </button>
                  <button className="px-3 py-1.5 text-sm bg-primary text-white rounded hover:bg-primary-700 transition-colors duration-200">
                    Save Configuration
                  </button>
                </div>
              </div>
              
              {renderConfigForm()}
              
              {testResults?.[activeIntegration] && (
                <div className={`mt-6 p-4 rounded-lg border ${
                  testResults?.[activeIntegration]?.success
                    ? 'bg-success-50 border-success-200' :'bg-error-50 border-error-200'
                }`}>
                  <div className="flex items-center space-x-3">
                    <Icon 
                      name={testResults?.[activeIntegration]?.success ? 'CheckCircle' : 'XCircle'} 
                      size={20} 
                      className={testResults?.[activeIntegration]?.success ? 'text-success-600' : 'text-error-600'} 
                    />
                    <div>
                      <div className={`font-medium ${
                        testResults?.[activeIntegration]?.success ? 'text-success-800' : 'text-error-800'
                      }`}>
                        {testResults?.[activeIntegration]?.success ? 'Connection Successful' : 'Connection Failed'}
                      </div>
                      <div className={`text-sm ${
                        testResults?.[activeIntegration]?.success ? 'text-success-700' : 'text-error-700'
                      }`}>
                        {testResults?.[activeIntegration]?.message}
                      </div>
                      <div className="text-xs text-text-tertiary mt-1">
                        Tested at {new Date(testResults[activeIntegration].timestamp)?.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-surface rounded-lg border border-border-light shadow-card p-8 text-center">
              <Icon name="Link" size={48} className="text-secondary-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-text-primary mb-2">Select an Integration</h3>
              <p className="text-text-secondary mb-6">Choose an integration from the list to configure its settings</p>
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                <div className="text-center p-3 bg-secondary-25 rounded-lg">
                  <div className="text-lg font-semibold text-text-primary">
                    {Object.values(integrations)?.filter(i => i?.enabled)?.length}
                  </div>
                  <div className="text-sm text-text-secondary">Active</div>
                </div>
                <div className="text-center p-3 bg-secondary-25 rounded-lg">
                  <div className="text-lg font-semibold text-text-primary">
                    {Object.values(integrations)?.filter(i => i?.configured)?.length}
                  </div>
                  <div className="text-sm text-text-secondary">Configured</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IntegrationSettings;