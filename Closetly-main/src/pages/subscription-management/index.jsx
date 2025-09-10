// ...existing imports...
import { useSession } from '@supabase/auth-helpers-react';
// src/pages/subscription-management/index.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import PageHeader from '../../components/ui/PageHeader';
import Modal, { ModalBody, ModalFooter } from '../../components/ui/Modal';
import SubscriptionTable from './components/SubscriptionTable';
import SubscriptionFilters from './components/SubscriptionFilters';
import SubscriptionDetailView from './components/SubscriptionDetailView';
import CreateSubscriptionForm from './components/CreateSubscriptionForm';
import SubscriptionStats from './components/SubscriptionStats';
import QuickActionsPanel from './components/QuickActionsPanel';
import PlanModificationModal from './components/PlanModificationModal';

const SubscriptionManagement = () => {
  const session = useSession();

  // Call Supabase Edge Function to change plan
  const handleChangePlan = async (subscriptionId, newPriceId) => {
    if (!session?.access_token) {
      alert('You must be logged in to change your plan.');
      return;
    }
    try {
      const response = await fetch('https://srdmnbcunaaxblvwgfbw.functions.supabase.co/change-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ subscriptionId, newPriceId })
      });
      const data = await response.json();
      if (response.ok) {
        // Success: update UI or show confirmation
        alert('Plan changed successfully!');
      } else {
        // Error: show error message
        alert('Error changing plan: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Network error: ' + err.message);
    }
  };

  // Example usage: call handleChangePlan when user clicks a button
  // <Button onClick={() => handleChangePlan(subscriptionId, newPriceId)}>Change Plan</Button>
  const navigate = useNavigate();
  const [selectedSubscriptions, setSelectedSubscriptions] = useState([]);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPlanModificationModalOpen, setIsPlanModificationModalOpen] = useState(false);
  const [modificationData, setModificationData] = useState(null);
  const [filters, setFilters] = useState({
    status: [],
    planType: [],
    billingFrequency: [],
    dateRange: { start: null, end: null },
    searchQuery: ''
  });
  const [subscriptions, setSubscriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for subscriptions
  const mockSubscriptions = [
    {
      id: 'SUB-2024-0001',
      customer: {
        id: 'CUST-001',
        name: 'Acme Corporation',
        email: 'billing@acmecorp.com',
        avatar: null
      },
      plan: {
        id: 'plan_enterprise',
        name: 'Enterprise Plan',
        type: 'enterprise',
        price: 999.99,
        currency: 'USD',
        billingFrequency: 'monthly'
      },
      status: 'active',
      mrr: 999.99,
      nextBillingDate: '2024-06-01',
      createdDate: '2024-01-01',
      renewalDate: '2025-01-01',
      trial: {
        isTrialActive: false,
        trialEndDate: null
      },
      usage: {
        current: 8500,
        limit: 10000,
        percentage: 85
      },
      addOns: [
        { name: 'Additional Storage', price: 50.00, quantity: 2 },
        { name: 'Priority Support', price: 100.00, quantity: 1 }
      ],
      paymentMethod: {
        type: 'credit_card',
        last4: '4242',
        brand: 'Visa'
      },
      metadata: {
        source: 'direct_signup',
        salesRep: 'John Smith'
      }
    },
    {
      id: 'SUB-2024-0002',
      customer: {
        id: 'CUST-002',
        name: 'TechStart Inc.',
        email: 'accounts@techstart.io',
        avatar: null
      },
      plan: {
        id: 'plan_professional',
        name: 'Professional Plan',
        type: 'professional',
        price: 499.00,
        currency: 'USD',
        billingFrequency: 'monthly'
      },
      status: 'active',
      mrr: 499.00,
      nextBillingDate: '2024-05-25',
      createdDate: '2024-02-15',
      renewalDate: '2025-02-15',
      trial: {
        isTrialActive: false,
        trialEndDate: null
      },
      usage: {
        current: 3200,
        limit: 5000,
        percentage: 64
      },
      addOns: [],
      paymentMethod: {
        type: 'bank_transfer',
        bankName: 'Chase Bank'
      },
      metadata: {
        source: 'marketing_campaign',
        salesRep: 'Sarah Johnson'
      }
    },
    {
      id: 'SUB-2024-0003',
      customer: {
        id: 'CUST-003',
        name: 'Global Solutions Ltd.',
        email: 'finance@globalsolutions.co.uk',
        avatar: null
      },
      plan: {
        id: 'plan_business',
        name: 'Business Plan',
        type: 'business',
        price: 199.00,
        currency: 'USD',
        billingFrequency: 'quarterly'
      },
      status: 'paused',
      mrr: 66.33,
      nextBillingDate: '2024-07-15',
      createdDate: '2024-01-15',
      renewalDate: '2025-01-15',
      trial: {
        isTrialActive: false,
        trialEndDate: null
      },
      usage: {
        current: 0,
        limit: 2000,
        percentage: 0
      },
      addOns: [],
      paymentMethod: {
        type: 'credit_card',
        last4: '1234',
        brand: 'Mastercard'
      },
      metadata: {
        source: 'referral',
        salesRep: 'Mike Davis'
      }
    },
    {
      id: 'SUB-2024-0004',
      customer: {
        id: 'CUST-004',
        name: 'Innovate Digital',
        email: 'accounts@innovatedigital.com',
        avatar: null
      },
      plan: {
        id: 'plan_starter',
        name: 'Starter Plan',
        type: 'starter',
        price: 99.00,
        currency: 'USD',
        billingFrequency: 'monthly'
      },
      status: 'past_due',
      mrr: 99.00,
      nextBillingDate: '2024-05-10',
      createdDate: '2024-03-10',
      renewalDate: '2025-03-10',
      trial: {
        isTrialActive: false,
        trialEndDate: null
      },
      usage: {
        current: 850,
        limit: 1000,
        percentage: 85
      },
      addOns: [],
      paymentMethod: {
        type: 'credit_card',
        last4: '9876',
        brand: 'Amex'
      },
      metadata: {
        source: 'organic',
        salesRep: 'Lisa Chen'
      }
    },
    {
      id: 'SUB-2024-0005',
      customer: {
        id: 'CUST-005',
        name: 'EuroTech GmbH',
        email: 'finance@eurotech.de',
        avatar: null
      },
      plan: {
        id: 'plan_enterprise',
        name: 'Enterprise Plan',
        type: 'enterprise',
        price: 1299.00,
        currency: 'EUR',
        billingFrequency: 'annual'
      },
      status: 'active',
      mrr: 108.25,
      nextBillingDate: '2025-04-20',
      createdDate: '2024-04-20',
      renewalDate: '2025-04-20',
      trial: {
        isTrialActive: false,
        trialEndDate: null
      },
      usage: {
        current: 12000,
        limit: 15000,
        percentage: 80
      },
      addOns: [
        { name: 'API Access', price: 200.00, quantity: 1 },
        { name: 'White Label', price: 300.00, quantity: 1 }
      ],
      paymentMethod: {
        type: 'sepa_debit',
        bankName: 'Deutsche Bank'
      },
      metadata: {
        source: 'enterprise_sales',
        salesRep: 'Robert Wilson'
      }
    },
    {
      id: 'SUB-2024-0006',
      customer: {
        id: 'CUST-006',
        name: 'Startup Ventures',
        email: 'billing@startupventures.com',
        avatar: null
      },
      plan: {
        id: 'plan_starter',
        name: 'Starter Plan',
        type: 'starter',
        price: 99.00,
        currency: 'USD',
        billingFrequency: 'monthly'
      },
      status: 'trial',
      mrr: 0,
      nextBillingDate: '2024-05-30',
      createdDate: '2024-05-15',
      renewalDate: '2025-05-15',
      trial: {
        isTrialActive: true,
        trialEndDate: '2024-05-30'
      },
      usage: {
        current: 450,
        limit: 1000,
        percentage: 45
      },
      addOns: [],
      paymentMethod: {
        type: 'credit_card',
        last4: '5678',
        brand: 'Visa'
      },
      metadata: {
        source: 'free_trial',
        salesRep: null
      }
    },
    {
      id: 'SUB-2024-0007',
      customer: {
        id: 'CUST-007',
        name: 'Pacific Designs',
        email: 'accounting@pacificdesigns.com.au',
        avatar: null
      },
      plan: {
        id: 'plan_professional',
        name: 'Professional Plan',
        type: 'professional',
        price: 699.00,
        currency: 'AUD',
        billingFrequency: 'quarterly'
      },
      status: 'cancelled',
      mrr: 0,
      nextBillingDate: null,
      createdDate: '2024-01-01',
      renewalDate: null,
      cancelledDate: '2024-04-15',
      trial: {
        isTrialActive: false,
        trialEndDate: null
      },
      usage: {
        current: 0,
        limit: 5000,
        percentage: 0
      },
      addOns: [],
      paymentMethod: {
        type: 'credit_card',
        last4: '3456',
        brand: 'Visa'
      },
      metadata: {
        source: 'partner_referral',
        salesRep: 'Emma Thompson',
        cancellationReason: 'Budget constraints'
      }
    }
  ];

  // Load mock data with simulated API delay
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      setSubscriptions(mockSubscriptions);
      setIsLoading(false);
    };
    
    loadData();
  }, []);

  // Handle subscription selection
  const handleSelectSubscription = (subscriptionId) => {
    setSelectedSubscriptions(prev => {
      if (prev?.includes(subscriptionId)) {
        return prev?.filter(id => id !== subscriptionId);
      } else {
        return [...prev, subscriptionId];
      }
    });
  };

  // Handle select all subscriptions
  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      setSelectedSubscriptions(subscriptions?.map(sub => sub?.id));
    } else {
      setSelectedSubscriptions([]);
    }
  };

  // Open subscription detail modal
  const handleViewSubscription = (subscriptionId) => {
    const subscription = subscriptions?.find(sub => sub?.id === subscriptionId);
    setCurrentSubscription(subscription);
    setIsDetailModalOpen(true);
  };

  // Handle subscription actions
  const handleSubscriptionAction = (action, subscriptionId, data = null) => {
    const subscription = subscriptions?.find(sub => sub?.id === subscriptionId);
    
    switch (action) {
      case 'pause':
        setSubscriptions(prev => 
          prev?.map(sub => 
            sub?.id === subscriptionId 
              ? { ...sub, status: 'paused' } 
              : sub
          )
        );
        break;
        
      case 'resume':
        setSubscriptions(prev => 
          prev?.map(sub => 
            sub?.id === subscriptionId 
              ? { ...sub, status: 'active' } 
              : sub
          )
        );
        break;
        
      case 'cancel':
        setSubscriptions(prev => 
          prev?.map(sub => 
            sub?.id === subscriptionId 
              ? { 
                  ...sub, 
                  status: 'cancelled',
                  cancelledDate: new Date()?.toISOString()?.split('T')?.[0],
                  nextBillingDate: null,
                  renewalDate: null,
                  mrr: 0
                } 
              : sub
          )
        );
        break;
        
      case 'upgrade':
      case 'downgrade':
        setCurrentSubscription(subscription);
        setModificationData({ type: action, subscription });
        setIsPlanModificationModalOpen(true);
        break;
        
      default:
        console.log(`Action ${action} not implemented`);
    }
  };

  // Handle bulk actions
  const handleBulkAction = (action) => {
    console.log(`Performing ${action} on subscriptions:`, selectedSubscriptions);
    
    switch (action) {
      case 'pause':
        setSubscriptions(prev => 
          prev?.map(sub => 
            selectedSubscriptions?.includes(sub?.id) && sub?.status === 'active'
              ? { ...sub, status: 'paused' }
              : sub
          )
        );
        break;
        
      case 'resume':
        setSubscriptions(prev => 
          prev?.map(sub => 
            selectedSubscriptions?.includes(sub?.id) && sub?.status === 'paused'
              ? { ...sub, status: 'active' }
              : sub
          )
        );
        break;
        
      case 'export':
        // Simulate export functionality
        console.log('Exporting subscriptions:', selectedSubscriptions);
        break;
        
      default:
        console.log(`Bulk action ${action} not implemented`);
    }
    
    // Clear selection after action
    setSelectedSubscriptions([]);
  };

  // Handle create subscription
  const handleCreateSubscription = (subscriptionData) => {
    const newId = `SUB-2024-${String(subscriptions?.length + 1)?.padStart(4, '0')}`;
    
    const newSubscription = {
      id: newId,
      ...subscriptionData,
      status: subscriptionData?.trial?.isTrialActive ? 'trial' : 'active',
      createdDate: new Date()?.toISOString()?.split('T')?.[0],
      usage: {
        current: 0,
        limit: subscriptionData?.plan?.limits?.usage || 1000,
        percentage: 0
      }
    };
    
    setSubscriptions(prev => [newSubscription, ...prev]);
    setIsCreateModalOpen(false);
  };

  // Handle plan modification
  const handlePlanModification = (modificationData) => {
    const { subscriptionId, newPlan, prorationAmount, effectiveDate } = modificationData;
    
    setSubscriptions(prev => 
      prev?.map(sub => 
        sub?.id === subscriptionId 
          ? { 
              ...sub, 
              plan: newPlan,
              mrr: newPlan?.billingFrequency === 'monthly' ? newPlan?.price :
                   newPlan?.billingFrequency === 'quarterly' ? newPlan?.price / 3 :
                   newPlan?.price / 12
            } 
          : sub
      )
    );
    
    setIsPlanModificationModalOpen(false);
    setModificationData(null);
  };

  // Filter subscriptions based on current filters
  const filteredSubscriptions = subscriptions?.filter(subscription => {
    // Filter by status
    if (filters?.status?.length > 0 && !filters?.status?.includes(subscription?.status)) {
      return false;
    }
    
    // Filter by plan type
    if (filters?.planType?.length > 0 && !filters?.planType?.includes(subscription?.plan?.type)) {
      return false;
    }
    
    // Filter by billing frequency
    if (filters?.billingFrequency?.length > 0 && !filters?.billingFrequency?.includes(subscription?.plan?.billingFrequency)) {
      return false;
    }
    
    // Filter by search query
    if (filters?.searchQuery) {
      const query = filters?.searchQuery?.toLowerCase();
      const customerName = subscription?.customer?.name?.toLowerCase();
      const customerEmail = subscription?.customer?.email?.toLowerCase();
      const planName = subscription?.plan?.name?.toLowerCase();
      
      if (!customerName?.includes(query) && !customerEmail?.includes(query) && !planName?.includes(query)) {
        return false;
      }
    }
    
    // Filter by date range
    if (filters?.dateRange?.start && filters?.dateRange?.end) {
      const subscriptionDate = new Date(subscription.createdDate);
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      
      if (subscriptionDate < startDate || subscriptionDate > endDate) {
        return false;
      }
    }
    
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      {/* Main Content */}
      <main className="pt-16 lg:content-offset">
        <div className="p-6">
          
          <PageHeader 
            title="Subscription Management"
            description="Manage customer subscriptions, billing, and plan modifications"
            customIcon={<Icon name="CreditCard" size={24} />}
            actions={
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-primary text-white px-4 py-2 rounded-lg flex items-center hover:bg-primary-600 transition-colors duration-200"
              >
                <Icon name="Plus" size={16} className="mr-2" />
                New Subscription
              </button>
            }
          />
          
          {/* Stats Cards */}
          <SubscriptionStats subscriptions={subscriptions} />
          
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Main Content Area */}
            <div className="xl:col-span-3 space-y-6">
              {/* Filters */}
              <SubscriptionFilters 
                filters={filters} 
                setFilters={setFilters} 
                totalSubscriptions={subscriptions?.length}
                filteredCount={filteredSubscriptions?.length}
              />
              
              {/* Bulk Actions */}
              {selectedSubscriptions?.length > 0 && (
                <div className="bg-primary-50 border border-primary-100 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-center">
                  <div className="flex items-center mb-3 sm:mb-0">
                    <Icon name="CheckSquare" size={20} className="text-primary mr-2" />
                    <span className="text-text-primary font-medium">{selectedSubscriptions?.length} subscriptions selected</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleBulkAction('pause')}
                      className="bg-warning text-white px-3 py-1.5 rounded-lg text-sm flex items-center hover:bg-warning-700 transition-colors duration-200"
                    >
                      <Icon name="Pause" size={16} className="mr-1.5" />
                      Pause
                    </button>
                    
                    <button
                      onClick={() => handleBulkAction('resume')}
                      className="bg-success text-white px-3 py-1.5 rounded-lg text-sm flex items-center hover:bg-success-700 transition-colors duration-200"
                    >
                      <Icon name="Play" size={16} className="mr-1.5" />
                      Resume
                    </button>
                    
                    <button
                      onClick={() => handleBulkAction('export')}
                      className="bg-surface border border-border-light text-text-primary px-3 py-1.5 rounded-lg text-sm flex items-center hover:bg-surface-hover transition-colors duration-200"
                    >
                      <Icon name="Download" size={16} className="mr-1.5" />
                      Export
                    </button>
                    
                    <button
                      onClick={() => setSelectedSubscriptions([])}
                      className="bg-surface border border-border-light text-text-primary px-3 py-1.5 rounded-lg text-sm flex items-center hover:bg-surface-hover transition-colors duration-200"
                    >
                      <Icon name="X" size={16} className="mr-1.5" />
                      Clear
                    </button>
                  </div>
                </div>
              )}
              
              {/* Subscription Table */}
              <SubscriptionTable 
                subscriptions={filteredSubscriptions}
                selectedSubscriptions={selectedSubscriptions}
                onSelectSubscription={handleSelectSubscription}
                onSelectAll={handleSelectAll}
                onViewSubscription={handleViewSubscription}
                onSubscriptionAction={handleSubscriptionAction}
                isLoading={isLoading}
              />
            </div>
            
            {/* Quick Actions Panel */}
            <div className="xl:col-span-1">
              <QuickActionsPanel 
                onCreateSubscription={() => setIsCreateModalOpen(true)}
                subscriptions={subscriptions}
                selectedSubscriptions={selectedSubscriptions}
                onBulkAction={handleBulkAction}
              />
            </div>
          </div>
        </div>
      </main>
      {/* Subscription Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={`Subscription ${currentSubscription?.id}`}
        size="xl"
        footer={null}
      >
        {currentSubscription && (
          <SubscriptionDetailView 
            subscription={currentSubscription}
            onAction={(action, data) => {
              handleSubscriptionAction(action, currentSubscription?.id, data);
              if (action !== 'upgrade' && action !== 'downgrade') {
                setIsDetailModalOpen(false);
              }
            }}
            onClose={() => setIsDetailModalOpen(false)}
          />
        )}
      </Modal>
      {/* Create Subscription Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Subscription"
        size="lg"
        footer={null}
      >
        <CreateSubscriptionForm 
          onSubmit={handleCreateSubscription}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>
      {/* Plan Modification Modal */}
      <Modal
        isOpen={isPlanModificationModalOpen}
        onClose={() => {
          setIsPlanModificationModalOpen(false);
          setModificationData(null);
        }}
        title={`${modificationData?.type === 'upgrade' ? 'Upgrade' : 'Downgrade'} Subscription Plan`}
        size="lg"
        footer={null}
      >
        {modificationData && (
          <PlanModificationModal
            subscription={modificationData?.subscription}
            modificationType={modificationData?.type}
            onSubmit={handlePlanModification}
            onCancel={() => {
              setIsPlanModificationModalOpen(false);
              setModificationData(null);
            }}
          />
        )}
      </Modal>
    </div>
  );
};

export default SubscriptionManagement;