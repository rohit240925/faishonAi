// src/pages/payment-gateway-configuration/components/GatewayConfigurationTabs.jsx
import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const GatewayConfigurationTabs = ({ activeTab, configuration, onConfigurationChange }) => {
  const [showApiKeys, setShowApiKeys] = useState({});
  
  const currentConfig = configuration?.[activeTab];
  
  const currencyOptions = {
    stripe: [
      { value: 'USD', label: 'USD ($)', rates: { EUR: 0.85, GBP: 0.73 } },
      { value: 'EUR', label: 'EUR (€)', rates: { USD: 1.18, GBP: 0.86 } },
      { value: 'GBP', label: 'GBP (£)', rates: { USD: 1.37, EUR: 1.16 } },
      { value: 'CAD', label: 'CAD (C$)', rates: { USD: 0.79 } },
      { value: 'AUD', label: 'AUD (A$)', rates: { USD: 0.73 } }
    ],
    razorpay: [
      { value: 'INR', label: 'INR (₹)', rates: { USD: 0.012 } },
      { value: 'USD', label: 'USD ($)', rates: { INR: 83.2 } }
    ],
    paddle: [
      { value: 'USD', label: 'USD ($)', rates: { EUR: 0.85, GBP: 0.73 } },
      { value: 'EUR', label: 'EUR (€)', rates: { USD: 1.18, GBP: 0.86 } },
      { value: 'GBP', label: 'GBP (£)', rates: { USD: 1.37, EUR: 1.16 } }
    ]
  };
  
  const paymentMethodOptions = {
    stripe: {
      card: { label: 'Credit/Debit Cards', icon: 'CreditCard' },
      bankTransfer: { label: 'Bank Transfer', icon: 'Building2' },
      applePay: { label: 'Apple Pay', icon: 'Smartphone' },
      googlePay: { label: 'Google Pay', icon: 'Smartphone' },
      klarna: { label: 'Klarna', icon: 'ShoppingBag' },
      sofort: { label: 'SOFORT', icon: 'Zap' }
    },
    razorpay: {
      card: { label: 'Credit/Debit Cards', icon: 'CreditCard' },
      netbanking: { label: 'Net Banking', icon: 'Building2' },
      upi: { label: 'UPI', icon: 'Smartphone' },
      wallet: { label: 'Digital Wallets', icon: 'Wallet' },
      emi: { label: 'EMI', icon: 'Calendar' }
    },
    paddle: {
      card: { label: 'Credit/Debit Cards', icon: 'CreditCard' },
      paypal: { label: 'PayPal', icon: 'DollarSign' },
      applePay: { label: 'Apple Pay', icon: 'Smartphone' },
      googlePay: { label: 'Google Pay', icon: 'Smartphone' }
    }
  };
  
  const toggleApiKeyVisibility = (field) => {
    setShowApiKeys(prev => ({
      ...prev,
      [`${activeTab}-${field}`]: !prev?.[`${activeTab}-${field}`]
    }));
  };
  
  const handleInputChange = (field, value) => {
    if (field?.includes('.')) {
      const [parent, child] = field?.split('.');
      onConfigurationChange(activeTab, {
        [parent]: {
          ...currentConfig?.[parent],
          [child]: value
        }
      });
    } else {
      onConfigurationChange(activeTab, { [field]: value });
    }
  };
  
  const handlePaymentMethodChange = (method, enabled) => {
    onConfigurationChange(activeTab, {
      enabledPaymentMethods: {
        ...currentConfig?.enabledPaymentMethods,
        [method]: enabled
      }
    });
  };
  
  const handleCurrencyChange = (currencies) => {
    onConfigurationChange(activeTab, {
      supportedCurrencies: currencies
    });
  };
  
  const maskApiKey = (key, show) => {
    if (!key) return '';
    if (show) return key;
    return key?.substring(0, 8) + '****';
  };
  
  const getConnectionStatus = () => {
    if (currentConfig?.isConnected) {
      return {
        color: 'text-success-600',
        bgColor: 'bg-success-50',
        icon: 'CheckCircle',
        text: 'Connected'
      };
    } else {
      return {
        color: 'text-error-600',
        bgColor: 'bg-error-50',
        icon: 'XCircle',
        text: 'Disconnected'
      };
    }
  };
  
  const status = getConnectionStatus();
  
  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
        <div className="flex items-center">
          <div className={`flex items-center ${status?.bgColor} rounded-full px-3 py-1`}>
            <Icon name={status?.icon} size={16} className={`mr-2 ${status?.color}`} />
            <span className={`text-sm font-medium ${status?.color}`}>
              {status?.text}
            </span>
          </div>
          {currentConfig?.lastTested && (
            <span className="ml-4 text-sm text-text-secondary">
              Last tested: {new Date(currentConfig.lastTested)?.toLocaleString()}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={currentConfig?.isEnabled}
              onChange={(e) => handleInputChange('isEnabled', e?.target?.checked)}
              className="rounded border-border-medium text-primary focus:ring-primary mr-2"
            />
            <span className="text-sm font-medium text-text-primary">Enable Gateway</span>
          </label>
        </div>
      </div>
      {/* Mode Toggle */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-text-primary">Environment Mode</label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name={`${activeTab}-mode`}
              value="test"
              checked={currentConfig?.mode === 'test'}
              onChange={(e) => handleInputChange('mode', e?.target?.value)}
              className="border-border-medium text-primary focus:ring-primary mr-2"
            />
            <span className="text-sm text-text-secondary">Test Mode</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name={`${activeTab}-mode`}
              value="live"
              checked={currentConfig?.mode === 'live'}
              onChange={(e) => handleInputChange('mode', e?.target?.value)}
              className="border-border-medium text-primary focus:ring-primary mr-2"
            />
            <span className="text-sm text-text-secondary">Live Mode</span>
          </label>
        </div>
      </div>
      {/* API Keys Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text-primary flex items-center">
          <Icon name="Key" size={20} className="mr-2 text-secondary-500" />
          API Credentials
        </h3>
        
        {Object.entries(currentConfig?.apiKeys)?.map(([key, value]) => {
          const fieldKey = `${activeTab}-${key}`;
          const isVisible = showApiKeys?.[fieldKey];
          
          return (
            <div key={key} className="space-y-2">
              <label className="block text-sm font-medium text-text-primary capitalize">
                {key?.replace(/([A-Z])/g, ' $1')?.trim()}
              </label>
              <div className="relative">
                <input
                  type={isVisible ? 'text' : 'password'}
                  value={maskApiKey(value, isVisible)}
                  onChange={(e) => handleInputChange(`apiKeys.${key}`, e?.target?.value)}
                  className="w-full px-3 py-2 pr-10 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  placeholder={`Enter ${key?.replace(/([A-Z])/g, ' $1')?.trim()?.toLowerCase()}`}
                />
                <button
                  type="button"
                  onClick={() => toggleApiKeyVisibility(key)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-secondary-500 hover:text-text-primary transition-colors duration-200"
                >
                  <Icon name={isVisible ? 'EyeOff' : 'Eye'} size={18} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {/* Webhook URL */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-text-primary">Webhook URL</label>
        <div className="relative">
          <input
            type="text"
            value={currentConfig?.webhookUrl}
            readOnly
            className="w-full px-3 py-2 pr-10 border border-border-light rounded-lg bg-surface-hover text-sm text-text-secondary"
          />
          <button
            onClick={() => navigator.clipboard?.writeText(currentConfig?.webhookUrl)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-secondary-500 hover:text-primary transition-colors duration-200"
            title="Copy to clipboard"
          >
            <Icon name="Copy" size={18} />
          </button>
        </div>
        <p className="text-xs text-text-tertiary">
          Configure this URL in your {activeTab} dashboard to receive webhook events
        </p>
      </div>
      {/* Payment Methods */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text-primary flex items-center">
          <Icon name="CreditCard" size={20} className="mr-2 text-secondary-500" />
          Enabled Payment Methods
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(paymentMethodOptions?.[activeTab] || {})?.map(([method, config]) => (
            <label key={method} className="flex items-center p-3 border border-border-light rounded-lg hover:bg-surface-hover transition-colors duration-200 cursor-pointer">
              <input
                type="checkbox"
                checked={currentConfig?.enabledPaymentMethods?.[method] || false}
                onChange={(e) => handlePaymentMethodChange(method, e?.target?.checked)}
                className="rounded border-border-medium text-primary focus:ring-primary mr-3"
              />
              <Icon name={config?.icon} size={18} className="mr-2 text-secondary-500" />
              <span className="text-sm font-medium text-text-primary">{config?.label}</span>
            </label>
          ))}
        </div>
      </div>
      {/* Currency Support */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text-primary flex items-center">
          <Icon name="DollarSign" size={20} className="mr-2 text-secondary-500" />
          Supported Currencies
        </h3>
        
        <div className="space-y-3">
          {currencyOptions?.[activeTab]?.map((currency) => {
            const isSelected = currentConfig?.supportedCurrencies?.includes(currency?.value);
            
            return (
              <div key={currency?.value} className="flex items-center justify-between p-3 border border-border-light rounded-lg">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      const newCurrencies = e?.target?.checked
                        ? [...(currentConfig?.supportedCurrencies || []), currency?.value]
                        : (currentConfig?.supportedCurrencies || [])?.filter(c => c !== currency?.value);
                      handleCurrencyChange(newCurrencies);
                    }}
                    className="rounded border-border-medium text-primary focus:ring-primary mr-3"
                  />
                  <span className="text-sm font-medium text-text-primary">{currency?.label}</span>
                </label>
                {isSelected && currency?.rates && (
                  <div className="text-xs text-text-tertiary">
                    {Object.entries(currency?.rates)?.slice(0, 2)?.map(([toCurrency, rate]) => (
                      <span key={toCurrency} className="mr-2">
                        1 {currency?.value} = {rate} {toCurrency}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {/* SCA Compliance (Stripe only) */}
      {activeTab === 'stripe' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-text-primary flex items-center">
            <Icon name="Shield" size={20} className="mr-2 text-secondary-500" />
            SCA Compliance Settings
          </h3>
          
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 border border-border-light rounded-lg">
              <div>
                <span className="text-sm font-medium text-text-primary">3D Secure Authentication</span>
                <p className="text-xs text-text-tertiary mt-1">
                  Require 3D Secure for card payments to meet SCA requirements
                </p>
              </div>
              <input
                type="checkbox"
                checked={currentConfig?.scaCompliance?.threeDSecure || false}
                onChange={(e) => handleInputChange('scaCompliance.threeDSecure', e?.target?.checked)}
                className="rounded border-border-medium text-primary focus:ring-primary"
              />
            </label>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">Authentication Flow</label>
              <select
                value={currentConfig?.scaCompliance?.authenticationFlow || 'automatic'}
                onChange={(e) => handleInputChange('scaCompliance.authenticationFlow', e?.target?.value)}
                className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              >
                <option value="automatic">Automatic</option>
                <option value="challenge_only">Challenge Only</option>
                <option value="off_session">Off Session</option>
              </select>
              <p className="text-xs text-text-tertiary">
                Choose when to trigger 3D Secure authentication
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GatewayConfigurationTabs;