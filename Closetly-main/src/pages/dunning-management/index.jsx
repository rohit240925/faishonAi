// src/pages/dunning-management/index.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import PageHeader from '../../components/ui/PageHeader';
import Icon from '../../components/AppIcon';

import WorkflowBuilder from './components/WorkflowBuilder';
import ActiveCampaignsTable from './components/ActiveCampaignsTable';
import MonitoringDashboard from './components/MonitoringDashboard';
import RuleEngine from './components/RuleEngine';
import TemplateManager from './components/TemplateManager';
import IntegrationSettings from './components/IntegrationSettings';

const DunningManagement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [dunningData, setDunningData] = useState({
    activeCampaigns: [],
    workflows: [],
    templates: [],
    rules: [],
    metrics: {
      recoveryRate: 0,
      totalRecovered: 0,
      activeCampaigns: 0,
      failedPayments: 0
    }
  });

  // Mock data
  const mockData = {
    activeCampaigns: [
      {
        id: 'DC-001',
        customerName: 'Acme Corporation',
        amount: 999.99,
        currency: 'USD',
        stage: 'Second Reminder',
        daysPastDue: 7,
        nextAction: '2024-01-20',
        status: 'active'
      },
      {
        id: 'DC-002',
        customerName: 'TechStart Inc.',
        amount: 499.00,
        currency: 'USD',
        stage: 'Final Notice',
        daysPastDue: 14,
        nextAction: '2024-01-18',
        status: 'active'
      }
    ],
    workflows: [
      {
        id: 'WF-001',
        name: 'Standard Dunning Flow',
        status: 'active',
        stages: 4,
        successRate: 68.5
      }
    ],
    templates: [
      {
        id: 'TPL-001',
        name: 'Payment Reminder',
        type: 'email',
        language: 'en',
        lastModified: '2024-01-15'
      }
    ],
    rules: [
      {
        id: 'RULE-001',
        name: 'High Value Customer Rule',
        condition: 'amount > 1000',
        action: 'extend_timeline',
        status: 'active'
      }
    ],
    metrics: {
      recoveryRate: 72.3,
      totalRecovered: 45600,
      activeCampaigns: 23,
      failedPayments: 89
    }
  };

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setDunningData(mockData);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'BarChart3' },
    { id: 'campaigns', label: 'Active Campaigns', icon: 'Mail' },
    { id: 'workflows', label: 'Workflows', icon: 'GitBranch' },
    { id: 'rules', label: 'Rules Engine', icon: 'Settings' },
    { id: 'templates', label: 'Templates', icon: 'FileText' },
    { id: 'integrations', label: 'Integrations', icon: 'Link' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <MonitoringDashboard 
            data={dunningData} 
            metrics={dunningData?.metrics}
            campaigns={dunningData?.activeCampaigns}
            selectedDateRange="last30days"
            formatCurrency={(amount) => `$${amount?.toLocaleString()}`}
          />
        );
      case 'campaigns':
        return (
          <ActiveCampaignsTable 
            campaigns={dunningData?.activeCampaigns}
            isLoading={false}
            onCampaignAction={(id, action) => console.log('Campaign action:', id, action)}
            formatCurrency={(amount) => `$${amount?.toLocaleString()}`}
          />
        );
      case 'workflows':
        return <WorkflowBuilder 
          workflows={dunningData?.workflows}
          isOpen={true}
          onClose={() => {}}
          onSave={(workflow) => console.log('Save workflow:', workflow)}
        />;
      case 'rules':
        return <RuleEngine rules={dunningData?.rules} />;
      case 'templates':
        return <TemplateManager templates={dunningData?.templates} />;
      case 'integrations':
        return <IntegrationSettings />;
      default:
        return (
          <MonitoringDashboard 
            data={dunningData}
            metrics={dunningData?.metrics}
            campaigns={dunningData?.activeCampaigns}
            selectedDateRange="last30days"
            formatCurrency={(amount) => `$${amount?.toLocaleString()}`}
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Sidebar />
        
        <main className="content-offset pt-16">
          <div className="p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-text-secondary">Loading dunning management...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      <main className="content-offset pt-16">
        <div className="p-6">
          
          <PageHeader 
            title="Dunning Management"
            description="Manage payment recovery workflows and campaigns"
            actions={[]}
            customIcon="CreditCard"
          />
          
          {/* Tab Navigation */}
          <div className="bg-surface rounded-lg shadow-card border border-border-light mb-6">
            <div className="border-b border-border-light">
              <nav className="flex space-x-8 px-6" aria-label="Tabs">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab?.id
                        ? 'border-primary text-primary' :'border-transparent text-text-secondary hover:text-text-primary hover:border-border-light'
                    }`}
                  >
                    <Icon name={tab?.icon} size={18} />
                    <span>{tab?.label}</span>
                  </button>
                ))}
              </nav>
            </div>
            
            <div className="p-6">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DunningManagement;