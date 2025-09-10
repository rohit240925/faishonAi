// src/pages/payment-gateway-configuration/index.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import GatewayConfigurationTabs from './components/GatewayConfigurationTabs';
import GatewayStatusMonitor from './components/GatewayStatusMonitor';
import TestingTools from './components/TestingTools';
import PriorityOrderManager from './components/PriorityOrderManager';
import SaveConfirmationModal from './components/SaveConfirmationModal';

const PaymentGatewayConfiguration = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('stripe');
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [configuration, setConfiguration] = useState({
    stripe: {
      isEnabled: true,
      mode: 'live',
      apiKeys: {
        publishableKey: 'pk_live_****',
        secretKey: 'sk_live_****',
        webhookSecret: 'whsec_****'
      },
      webhookUrl: 'https://api.yourapp.com/webhooks/stripe',
      enabledPaymentMethods: {
        card: true,
        bankTransfer: true,
        applePay: true,
        googlePay: true,
        klarna: false,
        sofort: false
      },
      supportedCurrencies: ['USD', 'EUR', 'GBP'],
      scaCompliance: {
        threeDSecure: true,
        authenticationFlow: 'automatic'
      },
      isConnected: true,
      lastTested: '2024-01-15T10:30:00Z'
    },
    razorpay: {
      isEnabled: true,
      mode: 'live',
      apiKeys: {
        keyId: 'rzp_live_****',
        keySecret: 'rzp_secret_****',
        webhookSecret: 'webhook_secret_****'
      },
      webhookUrl: 'https://api.yourapp.com/webhooks/razorpay',
      enabledPaymentMethods: {
        card: true,
        netbanking: true,
        upi: true,
        wallet: true,
        emi: false
      },
      supportedCurrencies: ['INR', 'USD'],
      isConnected: true,
      lastTested: '2024-01-15T10:15:00Z'
    },
    paddle: {
      isEnabled: false,
      mode: 'sandbox',
      apiKeys: {
        vendorId: 'vendor_id_****',
        authCode: 'auth_code_****',
        publicKey: 'public_key_****'
      },
      webhookUrl: 'https://api.yourapp.com/webhooks/paddle',
      enabledPaymentMethods: {
        card: true,
        paypal: true,
        applePay: false,
        googlePay: false
      },
      supportedCurrencies: ['USD', 'EUR', 'GBP'],
      isConnected: false,
      lastTested: null
    }
  });
  
  const [gatewayPriority, setGatewayPriority] = useState([
    { id: 'stripe', name: 'Stripe', enabled: true },
    { id: 'razorpay', name: 'Razorpay', enabled: true },
    { id: 'paddle', name: 'Paddle', enabled: false }
  ]);

  const [gatewayStatus] = useState({
    stripe: {
      status: 'healthy',
      successRate: 98.5,
      avgResponseTime: 245,
      lastError: null,
      errorCount: 2
    },
    razorpay: {
      status: 'healthy',
      successRate: 97.8,
      avgResponseTime: 320,
      lastError: null,
      errorCount: 5
    },
    paddle: {
      status: 'disconnected',
      successRate: 0,
      avgResponseTime: 0,
      lastError: 'Authentication failed',
      errorCount: 0
    }
  });

  const tabs = [
    { id: 'stripe', label: 'Stripe', icon: 'CreditCard' },
    { id: 'razorpay', label: 'Razorpay', icon: 'IndianRupee' },
    { id: 'paddle', label: 'Paddle', icon: 'Waves' }
  ];

  const handleConfigurationChange = (gateway, newConfig) => {
    setConfiguration(prev => ({
      ...prev,
      [gateway]: {
        ...prev?.[gateway],
        ...newConfig
      }
    }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Validate connections before saving
      const validationResults = await validateConnections();
      
      if (validationResults?.hasErrors) {
        throw new Error('Configuration validation failed');
      }
      
      setIsDirty(false);
      setShowSaveModal(false);
      
      // Show success notification
      console.log('Configuration saved successfully');
    } catch (error) {
      console.error('Failed to save configuration:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const validateConnections = async () => {
    // Simulate connection validation
    const enabledGateways = Object.entries(configuration)?.filter(([_, config]) => config?.isEnabled);
    
    const results = {
      hasErrors: false,
      validations: {}
    };
    
    for (const [gateway, config] of enabledGateways) {
      // Simulate validation
      results.validations[gateway] = {
        apiKeys: true,
        webhook: true,
        connection: config?.isConnected
      };
    }
    
    return results;
  };

  const handleTabChange = (tabId) => {
    if (isDirty) {
      const confirmChange = window.confirm(
        'You have unsaved changes. Are you sure you want to switch tabs?'
      );
      if (!confirmChange) return;
    }
    setActiveTab(tabId);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      <main className="content-offset pt-16">
        <div className="p-6">
          
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-text-primary mb-2">
                  Payment Gateway Configuration
                </h1>
                <p className="text-text-secondary">
                  Manage multi-provider payment processing with secure API integration
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                {isDirty && (
                  <div className="flex items-center text-warning-600 text-sm">
                    <Icon name="AlertCircle" size={16} className="mr-1" />
                    Unsaved changes
                  </div>
                )}
                
                <button
                  onClick={() => setShowSaveModal(true)}
                  disabled={!isDirty || isSaving}
                  className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
                >
                  {isSaving ? (
                    <>
                      <Icon name="Loader" size={18} className="mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Icon name="Save" size={18} className="mr-2" />
                      Save Configuration
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Gateway Status Overview */}
          <div className="mb-8">
            <GatewayStatusMonitor gatewayStatus={gatewayStatus} />
          </div>

          {/* Main Configuration Area */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Configuration Tabs */}
            <div className="lg:col-span-8">
              <div className="bg-surface rounded-lg shadow-card border border-border-light overflow-hidden">
                {/* Tab Navigation - Desktop */}
                <div className="hidden md:block border-b border-border-light">
                  <div className="flex">
                    {tabs?.map((tab) => {
                      const isConnected = configuration?.[tab?.id]?.isConnected;
                      const isEnabled = configuration?.[tab?.id]?.isEnabled;
                      
                      return (
                        <button
                          key={tab?.id}
                          onClick={() => handleTabChange(tab?.id)}
                          className={`flex-1 flex items-center justify-center px-6 py-4 text-sm font-medium transition-colors duration-200 relative ${
                            activeTab === tab?.id
                              ? 'text-primary bg-primary-50 border-b-2 border-primary' :'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                          }`}
                        >
                          <Icon name={tab?.icon} size={18} className="mr-2" />
                          {tab?.label}
                          <div className="ml-2 flex items-center space-x-1">
                            {isEnabled && (
                              <div className={`w-2 h-2 rounded-full ${
                                isConnected ? 'bg-success-500' : 'bg-error-500'
                              }`}></div>
                            )}
                            {!isEnabled && (
                              <div className="w-2 h-2 rounded-full bg-secondary-300"></div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Tab Navigation - Mobile (Accordion) */}
                <div className="md:hidden">
                  {tabs?.map((tab) => {
                    const isConnected = configuration?.[tab?.id]?.isConnected;
                    const isEnabled = configuration?.[tab?.id]?.isEnabled;
                    const isActive = activeTab === tab?.id;
                    
                    return (
                      <div key={tab?.id} className="border-b border-border-light last:border-b-0">
                        <button
                          onClick={() => handleTabChange(tab?.id)}
                          className="w-full flex items-center justify-between px-4 py-4 text-left hover:bg-surface-hover transition-colors duration-200"
                        >
                          <div className="flex items-center">
                            <Icon name={tab?.icon} size={18} className="mr-3 text-secondary-500" />
                            <span className="font-medium text-text-primary">{tab?.label}</span>
                            <div className="ml-2 flex items-center space-x-1">
                              {isEnabled && (
                                <div className={`w-2 h-2 rounded-full ${
                                  isConnected ? 'bg-success-500' : 'bg-error-500'
                                }`}></div>
                              )}
                              {!isEnabled && (
                                <div className="w-2 h-2 rounded-full bg-secondary-300"></div>
                              )}
                            </div>
                          </div>
                          <Icon 
                            name="ChevronDown" 
                            size={18} 
                            className={`text-secondary-500 transform transition-transform duration-200 ${
                              isActive ? 'rotate-180' : ''
                            }`} 
                          />
                        </button>
                        {isActive && (
                          <div className="px-4 pb-4">
                            <GatewayConfigurationTabs 
                              activeTab={activeTab}
                              configuration={configuration}
                              onConfigurationChange={handleConfigurationChange}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Tab Content - Desktop */}
                <div className="hidden md:block p-6">
                  <GatewayConfigurationTabs 
                    activeTab={activeTab}
                    configuration={configuration}
                    onConfigurationChange={handleConfigurationChange}
                  />
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              {/* Gateway Priority */}
              <PriorityOrderManager 
                gatewayPriority={gatewayPriority}
                onPriorityChange={setGatewayPriority}
              />
              
              {/* Testing Tools */}
              <TestingTools 
                activeGateway={activeTab}
                configuration={configuration}
              />
            </div>
          </div>
        </div>
      </main>
      {/* Save Confirmation Modal */}
      {showSaveModal && (
        <SaveConfirmationModal
          isOpen={showSaveModal}
          onClose={() => setShowSaveModal(false)}
          onConfirm={handleSave}
          isSaving={isSaving}
          configuration={configuration}
        />
      )}
    </div>
  );
};

export default PaymentGatewayConfiguration;