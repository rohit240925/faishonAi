// src/pages/invoice-management/index.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import PageHeader from '../../components/ui/PageHeader';
import Modal, { ModalBody, ModalFooter } from '../../components/ui/Modal';
import InvoiceTable from './components/InvoiceTable';
import InvoiceFilters from './components/InvoiceFilters';
import InvoiceDetailView from './components/InvoiceDetailView';
import InvoiceGenerationForm from './components/InvoiceGenerationForm';
import InvoiceStats from './components/InvoiceStats';
import InvoiceScheduler from './components/InvoiceScheduler';

const InvoiceManagement = () => {
  const navigate = useNavigate();
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [currentInvoice, setCurrentInvoice] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isSchedulerModalOpen, setIsSchedulerModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: { start: null, end: null },
    status: [],
    customer: '',
    amountRange: { min: 0, max: 10000 }
  });
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for invoices
  const mockInvoices = [
    {
      id: 'INV-2024-0001',
      customer: {
        id: 'CUST-001',
        name: 'Acme Corporation',
        email: 'billing@acmecorp.com',
        address: '123 Business Ave, Suite 100, San Francisco, CA 94107',
        taxId: 'US-TAX-123456'
      },
      amount: 1299.99,
      currency: 'USD',
      status: 'paid',
      issueDate: '2024-05-01',
      dueDate: '2024-05-15',
      paidDate: '2024-05-10',
      paymentMethod: {
        type: 'credit_card',
        last4: '4242',
        brand: 'Visa',
        expiryDate: '05/25'
      },
      items: [
        {
          description: 'Enterprise Plan - Monthly Subscription',
          quantity: 1,
          unitPrice: 999.99,
          amount: 999.99
        },
        {
          description: 'Additional User Seats (5)',
          quantity: 5,
          unitPrice: 60.00,
          amount: 300.00
        }
      ],
      subtotal: 1299.99,
      tax: {
        rate: 0.0,
        amount: 0.0
      },
      total: 1299.99,
      notes: 'Thank you for your business!',
      metadata: {
        subscriptionId: 'sub_12345',
        billingPeriod: 'May 2024'
      }
    },
    {
      id: 'INV-2024-0002',
      customer: {
        id: 'CUST-002',
        name: 'TechStart Inc.',
        email: 'accounts@techstart.io',
        address: '456 Innovation Blvd, Austin, TX 78701',
        taxId: 'US-TAX-789012'
      },
      amount: 499.00,
      currency: 'USD',
      status: 'sent',
      issueDate: '2024-05-02',
      dueDate: '2024-05-16',
      paidDate: null,
      paymentMethod: {
        type: 'bank_transfer',
        bankName: 'First National Bank',
        accountLast4: '6789'
      },
      items: [
        {
          description: 'Professional Plan - Monthly Subscription',
          quantity: 1,
          unitPrice: 499.00,
          amount: 499.00
        }
      ],
      subtotal: 499.00,
      tax: {
        rate: 0.0,
        amount: 0.0
      },
      total: 499.00,
      notes: 'Payment due within 14 days',
      metadata: {
        subscriptionId: 'sub_67890',
        billingPeriod: 'May 2024'
      }
    },
    {
      id: 'INV-2024-0003',
      customer: {
        id: 'CUST-003',
        name: 'Global Solutions Ltd.',
        email: 'finance@globalsolutions.co.uk',
        address: '10 Regent Street, London, UK SW1Y 4PP',
        taxId: 'GB-VAT-123456789'
      },
      amount: 2499.50,
      currency: 'GBP',
      status: 'overdue',
      issueDate: '2024-04-15',
      dueDate: '2024-04-29',
      paidDate: null,
      paymentMethod: {
        type: 'credit_card',
        last4: '1234',
        brand: 'Mastercard',
        expiryDate: '09/24'
      },
      items: [
        {
          description: 'Enterprise Plan - Monthly Subscription',
          quantity: 1,
          unitPrice: 1999.50,
          amount: 1999.50
        },
        {
          description: 'API Access Add-on',
          quantity: 1,
          unitPrice: 500.00,
          amount: 500.00
        }
      ],
      subtotal: 2499.50,
      tax: {
        rate: 0.20,
        amount: 499.90
      },
      total: 2999.40,
      notes: 'Payment overdue. Please contact our finance department.',
      metadata: {
        subscriptionId: 'sub_34567',
        billingPeriod: 'April 2024'
      }
    },
    {
      id: 'INV-2024-0004',
      customer: {
        id: 'CUST-004',
        name: 'Innovate Digital',
        email: 'accounts@innovatedigital.com',
        address: '789 Tech Park, Bangalore, India 560001',
        taxId: 'IN-GST-22AAAAA0000A1Z5'
      },
      amount: 75000.00,
      currency: 'INR',
      status: 'draft',
      issueDate: '2024-05-05',
      dueDate: '2024-05-19',
      paidDate: null,
      paymentMethod: null,
      items: [
        {
          description: 'Business Plan - Annual Subscription',
          quantity: 1,
          unitPrice: 60000.00,
          amount: 60000.00
        },
        {
          description: 'Implementation Services',
          quantity: 10,
          unitPrice: 1500.00,
          amount: 15000.00
        }
      ],
      subtotal: 75000.00,
      tax: {
        rate: 0.18,
        amount: 13500.00
      },
      total: 88500.00,
      notes: 'Draft invoice - not yet finalized',
      metadata: {
        subscriptionId: 'sub_89012',
        billingPeriod: 'May 2024 - April 2025'
      }
    },
    {
      id: 'INV-2024-0005',
      customer: {
        id: 'CUST-005',
        name: 'EuroTech GmbH',
        email: 'finance@eurotech.de',
        address: '123 Technologiepark, Berlin, Germany 10115',
        taxId: 'DE-VAT-987654321'
      },
      amount: 899.00,
      currency: 'EUR',
      status: 'paid',
      issueDate: '2024-04-20',
      dueDate: '2024-05-04',
      paidDate: '2024-04-25',
      paymentMethod: {
        type: 'sepa_debit',
        bankName: 'Deutsche Bank',
        accountLast4: '3456'
      },
      items: [
        {
          description: 'Business Plan - Monthly Subscription',
          quantity: 1,
          unitPrice: 799.00,
          amount: 799.00
        },
        {
          description: 'SMS Notifications Add-on',
          quantity: 1,
          unitPrice: 100.00,
          amount: 100.00
        }
      ],
      subtotal: 899.00,
      tax: {
        rate: 0.19,
        amount: 170.81
      },
      total: 1069.81,
      notes: 'Danke für Ihr Geschäft!',
      metadata: {
        subscriptionId: 'sub_45678',
        billingPeriod: 'April 2024'
      }
    },
    {
      id: 'INV-2024-0006',
      customer: {
        id: 'CUST-006',
        name: 'Pacific Designs',
        email: 'accounting@pacificdesigns.com.au',
        address: '42 Harbor View, Sydney, Australia 2000',
        taxId: 'AU-ABN-12345678901'
      },
      amount: 1499.00,
      currency: 'AUD',
      status: 'sent',
      issueDate: '2024-05-03',
      dueDate: '2024-05-17',
      paidDate: null,
      paymentMethod: {
        type: 'credit_card',
        last4: '9876',
        brand: 'Amex',
        expiryDate: '12/25'
      },
      items: [
        {
          description: 'Professional Plan - Quarterly Subscription',
          quantity: 1,
          unitPrice: 1299.00,
          amount: 1299.00
        },
        {
          description: 'Priority Support',
          quantity: 1,
          unitPrice: 200.00,
          amount: 200.00
        }
      ],
      subtotal: 1499.00,
      tax: {
        rate: 0.10,
        amount: 149.90
      },
      total: 1648.90,
      notes: 'Thank you for your business!',
      metadata: {
        subscriptionId: 'sub_56789',
        billingPeriod: 'May-July 2024'
      }
    },
    {
      id: 'INV-2024-0007',
      customer: {
        id: 'CUST-007',
        name: 'Northern Lights AS',
        email: 'finance@northernlights.no',
        address: '789 Fjord Street, Oslo, Norway 0150',
        taxId: 'NO-VAT-123456789'
      },
      amount: 7500.00,
      currency: 'NOK',
      status: 'overdue',
      issueDate: '2024-04-10',
      dueDate: '2024-04-24',
      paidDate: null,
      paymentMethod: {
        type: 'bank_transfer',
        bankName: 'Nordea Bank',
        accountLast4: '5432'
      },
      items: [
        {
          description: 'Enterprise Plan - Monthly Subscription',
          quantity: 1,
          unitPrice: 6000.00,
          amount: 6000.00
        },
        {
          description: 'Additional Storage (500GB)',
          quantity: 1,
          unitPrice: 1500.00,
          amount: 1500.00
        }
      ],
      subtotal: 7500.00,
      tax: {
        rate: 0.25,
        amount: 1875.00
      },
      total: 9375.00,
      notes: 'Payment is 15 days overdue. Please settle immediately.',
      metadata: {
        subscriptionId: 'sub_67890',
        billingPeriod: 'April 2024'
      }
    },
    {
      id: 'INV-2024-0008',
      customer: {
        id: 'CUST-008',
        name: 'Maple Software Inc.',
        email: 'ar@maplesoftware.ca',
        address: '456 Tech Avenue, Toronto, Canada M5V 2N4',
        taxId: 'CA-BN-123456789'
      },
      amount: 999.00,
      currency: 'CAD',
      status: 'paid',
      issueDate: '2024-04-25',
      dueDate: '2024-05-09',
      paidDate: '2024-05-02',
      paymentMethod: {
        type: 'credit_card',
        last4: '5678',
        brand: 'Visa',
        expiryDate: '08/26'
      },
      items: [
        {
          description: 'Business Plan - Monthly Subscription',
          quantity: 1,
          unitPrice: 899.00,
          amount: 899.00
        },
        {
          description: 'Phone Support Add-on',
          quantity: 1,
          unitPrice: 100.00,
          amount: 100.00
        }
      ],
      subtotal: 999.00,
      tax: {
        rate: 0.13,
        amount: 129.87
      },
      total: 1128.87,
      notes: 'Thank you for your prompt payment!',
      metadata: {
        subscriptionId: 'sub_78901',
        billingPeriod: 'April 2024'
      }
    },
    {
      id: 'INV-2024-0009',
      customer: {
        id: 'CUST-009',
        name: 'Sakura Technologies',
        email: 'finance@sakuratech.jp',
        address: '1-2-3 Shibuya, Tokyo, Japan 150-0002',
        taxId: 'JP-CT-1234567890123'
      },
      amount: 110000.00,
      currency: 'JPY',
      status: 'sent',
      issueDate: '2024-05-04',
      dueDate: '2024-05-18',
      paidDate: null,
      paymentMethod: {
        type: 'bank_transfer',
        bankName: 'Mizuho Bank',
        accountLast4: '9012'
      },
      items: [
        {
          description: 'Enterprise Plan - Monthly Subscription',
          quantity: 1,
          unitPrice: 100000.00,
          amount: 100000.00
        },
        {
          description: 'Custom Integration Services',
          quantity: 2,
          unitPrice: 5000.00,
          amount: 10000.00
        }
      ],
      subtotal: 110000.00,
      tax: {
        rate: 0.10,
        amount: 11000.00
      },
      total: 121000.00,
      notes: 'お支払いありがとうございます',
      metadata: {
        subscriptionId: 'sub_89012',
        billingPeriod: 'May 2024'
      }
    },
    {
      id: 'INV-2024-0010',
      customer: {
        id: 'CUST-010',
        name: 'Desert Solutions LLC',
        email: 'accounts@desertsolutions.ae',
        address: 'Business Bay, Dubai, UAE',
        taxId: 'AE-TRN-123456789012345'
      },
      amount: 3699.00,
      currency: 'AED',
      status: 'draft',
      issueDate: '2024-05-06',
      dueDate: '2024-05-20',
      paidDate: null,
      paymentMethod: null,
      items: [
        {
          description: 'Premium Plan - Annual Subscription',
          quantity: 1,
          unitPrice: 3499.00,
          amount: 3499.00
        },
        {
          description: 'White-label Feature',
          quantity: 1,
          unitPrice: 200.00,
          amount: 200.00
        }
      ],
      subtotal: 3699.00,
      tax: {
        rate: 0.05,
        amount: 184.95
      },
      total: 3883.95,
      notes: 'Draft invoice - pending approval',
      metadata: {
        subscriptionId: 'sub_90123',
        billingPeriod: 'May 2024 - April 2025'
      }
    }
  ];

  // Load mock data with simulated API delay
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      setInvoices(mockInvoices);
      setIsLoading(false);
    };
    
    loadData();
  }, []);

  // Handle invoice selection
  const handleSelectInvoice = (invoiceId) => {
    setSelectedInvoices(prev => {
      if (prev?.includes(invoiceId)) {
        return prev?.filter(id => id !== invoiceId);
      } else {
        return [...prev, invoiceId];
      }
    });
  };

  // Handle select all invoices
  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      setSelectedInvoices(invoices?.map(invoice => invoice?.id));
    } else {
      setSelectedInvoices([]);
    }
  };

  // Open invoice detail modal
  const handleViewInvoice = (invoiceId) => {
    const invoice = invoices?.find(inv => inv?.id === invoiceId);
    setCurrentInvoice(invoice);
    setIsDetailModalOpen(true);
  };

  // Handle bulk actions
  const handleBulkAction = (action) => {
    console.log(`Performing ${action} on invoices:`, selectedInvoices);
    
    // Simulate action and update UI
    if (action === 'send') {
      // Update status of selected invoices to 'sent'
      setInvoices(prev => 
        prev?.map(invoice => 
          selectedInvoices?.includes(invoice?.id) && invoice?.status === 'draft' 
            ? { ...invoice, status: 'sent' } 
            : invoice
        )
      );
    } else if (action === 'mark-paid') {
      // Update status of selected invoices to 'paid'
      const today = new Date()?.toISOString()?.split('T')?.[0];
      setInvoices(prev => 
        prev?.map(invoice => 
          selectedInvoices?.includes(invoice?.id) && (invoice?.status === 'sent' || invoice?.status === 'overdue')
            ? { ...invoice, status: 'paid', paidDate: today } 
            : invoice
        )
      );
    }
    
    // Clear selection after action
    setSelectedInvoices([]);
  };

  // Handle invoice status change
  const handleStatusChange = (invoiceId, newStatus) => {
    setInvoices(prev => 
      prev?.map(invoice => 
        invoice?.id === invoiceId 
          ? { ...invoice, status: newStatus, paidDate: newStatus === 'paid' ? new Date()?.toISOString()?.split('T')?.[0] : invoice?.paidDate } 
          : invoice
      )
    );
  };

  // Handle invoice generation
  const handleGenerateInvoice = (invoiceData) => {
    // Generate a new invoice ID
    const newId = `INV-2024-${String(invoices?.length + 1)?.padStart(4, '0')}`;
    
    // Create new invoice object
    const newInvoice = {
      id: newId,
      ...invoiceData,
      status: 'draft',
      issueDate: new Date()?.toISOString()?.split('T')?.[0],
      paidDate: null
    };
    
    // Add to invoices list
    setInvoices(prev => [newInvoice, ...prev]);
    
    // Close modal
    setIsGenerateModalOpen(false);
  };

  // Filter invoices based on current filters
  const filteredInvoices = invoices?.filter(invoice => {
    // Filter by status
    if (filters?.status?.length > 0 && !filters?.status?.includes(invoice?.status)) {
      return false;
    }
    
    // Filter by customer name
    if (filters?.customer && !invoice?.customer?.name?.toLowerCase()?.includes(filters?.customer?.toLowerCase())) {
      return false;
    }
    
    // Filter by amount range
    if (invoice?.amount < filters?.amountRange?.min || invoice?.amount > filters?.amountRange?.max) {
      return false;
    }
    
    // Filter by date range
    if (filters?.dateRange?.start && filters?.dateRange?.end) {
      const invoiceDate = new Date(invoice.issueDate);
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      
      if (invoiceDate < startDate || invoiceDate > endDate) {
        return false;
      }
    }
    
    return true;
  });

  // Enhanced page actions with better styling
  const pageActions = (
    <div className="flex flex-col sm:flex-row gap-3">
      <button
        onClick={() => setIsGenerateModalOpen(true)}
        className="btn-primary btn-hover-lift flex items-center justify-center min-w-[140px]"
      >
        <Icon name="FileText" size={18} className="mr-2" />
        Generate Invoice
      </button>
      
      <button
        onClick={() => setIsSchedulerModalOpen(true)}
        className="btn-secondary btn-hover-lift flex items-center justify-center min-w-[140px]"
      >
        <Icon name="Calendar" size={18} className="mr-2" />
        Schedule Invoices
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      
      {/* Main Content */}
      <main className="pt-16 lg:content-offset">
        <div className="p-6 max-w-7xl mx-auto">
          
          <PageHeader 
            title="Invoice Management"
            description="Manage and track your invoices, payments, and billing information with comprehensive financial insights"
            customIcon="FileText"
            actions={pageActions} 
          />
          
          {/* Enhanced Stats Cards */}
          <InvoiceStats invoices={invoices} />
          
          {/* Enhanced Filters */}
          <InvoiceFilters 
            filters={filters} 
            setFilters={setFilters} 
            totalInvoices={invoices?.length}
            filteredCount={filteredInvoices?.length}
          />
          
          {/* Enhanced Bulk Actions */}
          {selectedInvoices?.length > 0 && (
            <div className="financial-card mb-8 bg-gradient-to-r from-primary-50 to-success-50 border-primary-100">
              <div className="p-6 flex flex-col lg:flex-row justify-between items-start lg:items-center">
                <div className="flex items-center mb-4 lg:mb-0">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <Icon name="CheckSquare" size={20} className="text-primary" />
                  </div>
                  <div>
                    <span className="text-lg font-semibold text-text-primary">
                      {selectedInvoices?.length} invoice{selectedInvoices?.length > 1 ? 's' : ''} selected
                    </span>
                    <p className="text-sm text-text-secondary">Choose an action to perform on selected invoices</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleBulkAction('send')}
                    className="btn-primary text-sm px-4 py-2 btn-hover-lift flex items-center"
                    disabled={selectedInvoices?.length === 0}
                  >
                    <Icon name="Send" size={16} className="mr-2" />
                    Send ({selectedInvoices?.length})
                  </button>
                  
                  <button
                    onClick={() => handleBulkAction('mark-paid')}
                    className="btn-success text-sm px-4 py-2 btn-hover-lift flex items-center"
                    disabled={selectedInvoices?.length === 0}
                  >
                    <Icon name="CheckCircle" size={16} className="mr-2" />
                    Mark Paid
                  </button>
                  
                  <button
                    onClick={() => handleBulkAction('export')}
                    className="btn-secondary text-sm px-4 py-2 btn-hover-lift flex items-center"
                    disabled={selectedInvoices?.length === 0}
                  >
                    <Icon name="Download" size={16} className="mr-2" />
                    Export PDF
                  </button>
                  
                  <button
                    onClick={() => setSelectedInvoices([])}
                    className="text-sm text-text-secondary hover:text-text-primary px-4 py-2 rounded-lg border border-border-light hover:bg-surface-hover transition-all duration-200 flex items-center focus-ring"
                  >
                    <Icon name="X" size={16} className="mr-2" />
                    Clear Selection
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Enhanced Invoice Table */}
          <InvoiceTable 
            invoices={filteredInvoices}
            selectedInvoices={selectedInvoices}
            onSelectInvoice={handleSelectInvoice}
            onSelectAll={handleSelectAll}
            onViewInvoice={handleViewInvoice}
            onStatusChange={handleStatusChange}
            isLoading={isLoading}
          />
        </div>
      </main>
      {/* Invoice Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={`Invoice ${currentInvoice?.id}`}
        size="lg"
        footer={null}
      >
        <ModalBody>
          {currentInvoice && (
            <InvoiceDetailView 
              invoice={currentInvoice} 
              onStatusChange={(newStatus) => {
                handleStatusChange(currentInvoice?.id, newStatus);
                setCurrentInvoice({...currentInvoice, status: newStatus});
              }}
              onClose={() => setIsDetailModalOpen(false)}
            />
          )}
        </ModalBody>
      </Modal>

      {/* Generate Invoice Modal */}
      <Modal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        title="Generate New Invoice"
        size="lg"
        footer={null}
      >
        <ModalBody>
          <InvoiceGenerationForm 
            onSubmit={handleGenerateInvoice}
            onCancel={() => setIsGenerateModalOpen(false)}
          />
        </ModalBody>
      </Modal>

      {/* Invoice Scheduler Modal */}
      <Modal
        isOpen={isSchedulerModalOpen}
        onClose={() => setIsSchedulerModalOpen(false)}
        title="Schedule Recurring Invoices"
        size="lg"
        footer={null}
      >
        <ModalBody>
          <InvoiceScheduler 
            onSave={(scheduleData) => {
              console.log('Schedule data:', scheduleData);
              setIsSchedulerModalOpen(false);
            }}
            onCancel={() => setIsSchedulerModalOpen(false)}
          />
        </ModalBody>
      </Modal>
    </div>
  );
};

export default InvoiceManagement;