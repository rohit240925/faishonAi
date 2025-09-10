import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
// src/pages/customer-portal/index.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import AccountOverview from './components/AccountOverview';
import SubscriptionCard from './components/SubscriptionCard';
import BillingHistory from './components/BillingHistory';
import PaymentMethods from './components/PaymentMethods';
import UsageTracking from './components/UsageTracking';
import NotificationSettings from './components/NotificationSettings';
import SupportWidget from './components/SupportWidget';
import BottomNavigation from './components/BottomNavigation';
import MobileHeader from './components/MobileHeader';
 // Adjust path as needed

const CustomerPortal = () => {
  const { user } = useAuth();
  const [selectedPlanId, setSelectedPlanId] = useState(null);

  // Call Supabase Edge Function to change plan
  const handleChangePlan = async (subscriptionId, newPriceId) => {
    if (!user) {
      alert('You must be logged in to change your plan.');
      console.error('User not found in AuthContext');
      return;
    }
    try {
      // Get JWT from Supabase client
      const { data: { session: supabaseSession } } = await supabase.auth.getSession();
      const token = supabaseSession?.access_token;
      if (!token) {
        alert('Session token not found.');
        console.error('Supabase session token not found:', supabaseSession);
        return;
      }
      console.log('Calling change-plan API with:', { subscriptionId, newPriceId, token });
      const response = await fetch('https://srdmnbcunaaxblvwgfbw.functions.supabase.co/change-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ subscriptionId, newPriceId })
      });
      const data = await response.json();
      console.log('API response:', response.status, data);
      if (response.ok) {
        setSelectedPlanId(newPriceId); // Set the chosen plan for this session
        alert('Plan changed successfully!');
      } else {
        alert('Error changing plan: ' + (data.error || 'Unknown error'));
        console.error('API error:', data.error, data);
      }
    } catch (err) {
      alert('Network error: ' + err.message);
      console.error('Network error:', err);
    }
  };

  // Example usage: call handleChangePlan when user clicks a button
  // <Button onClick={() => handleChangePlan(subscriptionId, newPriceId)}>Change Plan</Button>
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locale, setLocale] = useState('en-US');
  const [currency, setCurrency] = useState('USD');
  const [showSupportChat, setShowSupportChat] = useState(false);

  // Mock customer data
  useEffect(() => {
    const mockCustomerData = {
      customer: {
        id: 'cust_12345',
        name: 'John Doe',
        email: 'john.doe@company.com',
        avatar: null,
        joinedDate: '2023-06-15',
        preferredLanguage: 'en-US',
        timezone: 'America/New_York'
      },
      subscription: {
        id: 'sub_67890',
        plan: {
          name: 'Professional',
          price: 49.99,
          currency: 'USD',
          interval: 'month',
          features: [
            'Up to 10,000 API calls/month',
            '100GB Storage',
            '24/7 Support',
            'Advanced Analytics'
          ]
        },
        status: 'active',
        currentPeriodStart: '2024-01-01',
        currentPeriodEnd: '2024-02-01',
        nextBillingDate: '2024-02-01',
        cancelAtPeriodEnd: false,
        trialEnd: null
      },
      usage: {
        apiCalls: {
          current: 7543,
          limit: 10000,
          percentage: 75.43
        },
        storage: {
          current: 68.5,
          limit: 100,
          percentage: 68.5,
          unit: 'GB'
        },
        users: {
          current: 8,
          limit: 15,
          percentage: 53.33
        }
      },
      paymentMethods: [
        {
          id: 'pm_1',
          type: 'card',
          brand: 'visa',
          last4: '4242',
          expiryMonth: 12,
          expiryYear: 2025,
          isDefault: true
        },
        {
          id: 'pm_2',
          type: 'card',
          brand: 'mastercard',
          last4: '8888',
          expiryMonth: 8,
          expiryYear: 2026,
          isDefault: false
        }
      ],
      invoices: [
        {
          id: 'inv_001',
          number: 'INV-2024-001',
          amount: 49.99,
          currency: 'USD',
          status: 'paid',
          date: '2024-01-01',
          dueDate: '2024-01-15',
          pdfUrl: '/invoices/inv_001.pdf'
        },
        {
          id: 'inv_002',
          number: 'INV-2023-012',
          amount: 49.99,
          currency: 'USD',
          status: 'paid',
          date: '2023-12-01',
          dueDate: '2023-12-15',
          pdfUrl: '/invoices/inv_002.pdf'
        },
        {
          id: 'inv_003',
          number: 'INV-2023-011',
          amount: 49.99,
          currency: 'USD',
          status: 'overdue',
          date: '2023-11-01',
          dueDate: '2023-11-15',
          pdfUrl: '/invoices/inv_003.pdf'
        }
      ],
      notifications: {
        billingReminders: true,
        usageAlerts: true,
        subscriptionChanges: true,
        marketingEmails: false,
        securityAlerts: true
      }
    };

    setTimeout(() => {
      setCustomerData(mockCustomerData);
      setLocale(mockCustomerData?.customer?.preferredLanguage);
      setCurrency(mockCustomerData?.subscription?.plan?.currency);
      setLoading(false);
    }, 1000);
  }, []);

  const formatCurrency = (amount, currencyCode = currency) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode
    })?.format(amount);
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })?.format(new Date(date));
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleUpgradePlan = () => {
    console.log('Upgrade plan clicked');
    // Implement plan upgrade logic
  };

  const handleDowngradePlan = () => {
    console.log('Downgrade plan clicked');
    // Implement plan downgrade logic
  };

  const handleCancelSubscription = () => {
    console.log('Cancel subscription clicked');
    // Implement subscription cancellation logic
  };

  const handleAddPaymentMethod = () => {
    console.log('Add payment method clicked');
    // Implement add payment method logic
  };

  const handleRemovePaymentMethod = (paymentMethodId) => {
    console.log('Remove payment method:', paymentMethodId);
    // Implement remove payment method logic
  };

  const handleDownloadInvoice = (invoiceId) => {
    console.log('Download invoice:', invoiceId);
    // Implement invoice download logic
  };

  const handleDisputeInvoice = (invoiceId) => {
    console.log('Dispute invoice:', invoiceId);
    // Implement invoice dispute logic
  };

  const handleUpdateNotifications = (notificationSettings) => {
    console.log('Update notifications:', notificationSettings);
    // Implement notification settings update logic
  };

  const handleSupportChat = () => {
    setShowSupportChat(true);
  };

  const handleCloseSupportChat = () => {
    setShowSupportChat(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-text-secondary">Loading your account...</p>
        </div>
      </div>
    );
  }

  if (!customerData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-text-primary mb-2">Unable to Load Account</h1>
          <p className="text-text-secondary mb-4">We're having trouble loading your account information.</p>
          <button
            onClick={() => window.location?.reload()}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <AccountOverview
              customer={customerData?.customer}
              subscription={customerData?.subscription}
              usage={customerData?.usage}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
            />
            <SubscriptionCard
              subscription={customerData?.subscription}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
              onUpgrade={(newPriceId) => handleChangePlan(customerData?.subscription?.id, newPriceId)}
              onDowngrade={(newPriceId) => handleChangePlan(customerData?.subscription?.id, newPriceId)}
              onCancel={handleCancelSubscription}
            />
            <UsageTracking
              usage={customerData?.usage}
              subscription={customerData?.subscription}
            />
          </div>
        );
      case 'billing':
        return (
          <div className="space-y-6">
            <BillingHistory
              invoices={customerData?.invoices}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
              onDownload={handleDownloadInvoice}
              onDispute={handleDisputeInvoice}
            />
            <PaymentMethods
              paymentMethods={customerData?.paymentMethods}
              onAdd={handleAddPaymentMethod}
              onRemove={handleRemovePaymentMethod}
            />
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-6">
            <NotificationSettings
              notifications={customerData?.notifications}
              onUpdate={handleUpdateNotifications}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <MobileHeader
        customer={customerData?.customer}
        onSupportClick={handleSupportChat}
      />
      {/* Main Content */}
      <main className="pb-20 lg:pb-8">
        {/* Desktop Navigation - Hidden on mobile */}
        <div className="hidden lg:block bg-surface border-b border-border-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: 'Home' },
                { id: 'billing', label: 'Billing', icon: 'CreditCard' },
                { id: 'settings', label: 'Settings', icon: 'Settings' }
              ]?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => handleTabChange(tab?.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab?.id
                      ? 'border-primary text-primary' :'border-transparent text-text-secondary hover:text-text-primary hover:border-border-light'
                  }`}
                >
                  <Icon name={tab?.icon} size={20} />
                  <span>{tab?.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {renderTabContent()}
        </div>
      </main>
      {/* Mobile Bottom Navigation */}
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
      {/* Support Widget */}
      <SupportWidget
        isOpen={showSupportChat}
        onOpen={handleSupportChat}
        onClose={handleCloseSupportChat}
        customer={customerData?.customer}
      />
    </div>
  );
};

export default CustomerPortal;