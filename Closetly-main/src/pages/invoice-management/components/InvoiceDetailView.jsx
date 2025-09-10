import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const InvoiceDetailView = ({ invoice, onStatusChange, onClose }) => {
  const [activeTab, setActiveTab] = useState('details');
  
  // Format currency based on currency code
  const formatCurrency = (amount, currency) => {
    const currencySymbols = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      INR: '₹',
      AUD: 'A$',
      CAD: 'C$',
      JPY: '¥',
      NOK: 'kr',
      AED: 'د.إ'
    };
    
    const symbol = currencySymbols?.[currency] || currency;
    
    // Format based on currency
    if (currency === 'JPY') {
      return `${symbol}${Math.round(amount)?.toLocaleString()}`;
    }
    
    return `${symbol}${amount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };
  
  // Get status badge styling
  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: {
        bgColor: 'bg-secondary-100',
        textColor: 'text-secondary-800',
        icon: 'FileEdit'
      },
      sent: {
        bgColor: 'bg-primary-50',
        textColor: 'text-primary-700',
        icon: 'Send'
      },
      paid: {
        bgColor: 'bg-success-50',
        textColor: 'text-success-700',
        icon: 'CheckCircle'
      },
      overdue: {
        bgColor: 'bg-error-50',
        textColor: 'text-error-700',
        icon: 'AlertTriangle'
      }
    };
    
    const config = statusConfig?.[status] || statusConfig?.draft;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config?.bgColor} ${config?.textColor}`}>
        <Icon name={config?.icon} size={14} className="mr-1" />
        {status?.charAt(0)?.toUpperCase() + status?.slice(1)}
      </span>
    );
  };
  
  // Mock payment history data
  const paymentHistory = invoice?.status === 'paid' ? [
    {
      id: 'pmt-001',
      date: invoice?.paidDate,
      amount: invoice?.total,
      method: invoice?.paymentMethod,
      status: 'successful',
      transactionId: 'txn_' + Math.random()?.toString(36)?.substr(2, 9)
    }
  ] : [];
  
  // Mock communication logs
  const communicationLogs = [
    {
      id: 'comm-001',
      date: new Date(new Date(invoice.issueDate).getTime() + 1000 * 60 * 60)?.toISOString(),
      type: 'email',
      subject: `Invoice ${invoice?.id} from Your Company`,
      recipient: invoice?.customer?.email,
      status: 'delivered'
    }
  ];
  
  if (invoice?.status === 'overdue') {
    communicationLogs?.push({
      id: 'comm-002',
      date: new Date(new Date(invoice.dueDate).getTime() + 1000 * 60 * 60 * 24)?.toISOString(),
      type: 'email',
      subject: `Reminder: Overdue Invoice ${invoice?.id}`,
      recipient: invoice?.customer?.email,
      status: 'delivered'
    });
  }
  
  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex border-b border-border-light mb-6">
        <button
          onClick={() => setActiveTab('details')}
          className={`px-4 py-2 text-sm font-medium border-b-2 ${
            activeTab === 'details' ?'border-primary text-primary' :'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          Invoice Details
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`px-4 py-2 text-sm font-medium border-b-2 ${
            activeTab === 'payments' ?'border-primary text-primary' :'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          Payment History
        </button>
        <button
          onClick={() => setActiveTab('communications')}
          className={`px-4 py-2 text-sm font-medium border-b-2 ${
            activeTab === 'communications' ?'border-primary text-primary' :'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          Communications
        </button>
      </div>
      {/* Invoice Details Tab */}
      {activeTab === 'details' && (
        <div className="flex-1 overflow-y-auto">
          {/* Invoice Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <div className="flex items-center mb-2">
                <h3 className="text-lg font-semibold text-text-primary mr-3">Invoice {invoice?.id}</h3>
                {getStatusBadge(invoice?.status)}
              </div>
              <p className="text-text-secondary">
                Issued on {formatDate(invoice?.issueDate)} • Due on {formatDate(invoice?.dueDate)}
              </p>
            </div>
            
            <div className="flex items-center space-x-3 mt-4 md:mt-0">
              {invoice?.status === 'draft' && (
                <button
                  onClick={() => onStatusChange('sent')}
                  className="bg-primary text-white px-3 py-1.5 rounded-lg text-sm flex items-center hover:bg-primary-700 transition-colors duration-200"
                >
                  <Icon name="Send" size={16} className="mr-1.5" />
                  Send Invoice
                </button>
              )}
              
              {(invoice?.status === 'sent' || invoice?.status === 'overdue') && (
                <button
                  onClick={() => onStatusChange('paid')}
                  className="bg-success text-white px-3 py-1.5 rounded-lg text-sm flex items-center hover:bg-success-700 transition-colors duration-200"
                >
                  <Icon name="CheckCircle" size={16} className="mr-1.5" />
                  Mark as Paid
                </button>
              )}
              
              <button
                className="bg-surface border border-border-light text-text-primary px-3 py-1.5 rounded-lg text-sm flex items-center hover:bg-surface-hover transition-colors duration-200"
              >
                <Icon name="Download" size={16} className="mr-1.5" />
                Download PDF
              </button>
            </div>
          </div>
          
          {/* Invoice Content */}
          <div className="bg-surface-hover rounded-lg border border-border-light p-6 mb-6">
            {/* Company and Customer Info */}
            <div className="flex flex-col md:flex-row justify-between mb-8">
              <div>
                <h4 className="text-sm font-medium text-text-tertiary mb-1">From</h4>
                <div className="text-text-primary font-medium">Your Company Name</div>
                <div className="text-text-secondary text-sm">123 Business Street</div>
                <div className="text-text-secondary text-sm">San Francisco, CA 94107</div>
                <div className="text-text-secondary text-sm">billing@yourcompany.com</div>
                <div className="text-text-secondary text-sm">Tax ID: US-TAX-987654321</div>
              </div>
              
              <div className="mt-4 md:mt-0">
                <h4 className="text-sm font-medium text-text-tertiary mb-1">Bill To</h4>
                <div className="text-text-primary font-medium">{invoice?.customer?.name}</div>
                <div className="text-text-secondary text-sm">{invoice?.customer?.address}</div>
                <div className="text-text-secondary text-sm">{invoice?.customer?.email}</div>
                <div className="text-text-secondary text-sm">Tax ID: {invoice?.customer?.taxId}</div>
              </div>
            </div>
            
            {/* Invoice Items */}
            <div className="mb-8">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border-light">
                    <th className="text-left py-2 text-xs font-medium text-text-tertiary">Description</th>
                    <th className="text-right py-2 text-xs font-medium text-text-tertiary">Quantity</th>
                    <th className="text-right py-2 text-xs font-medium text-text-tertiary">Unit Price</th>
                    <th className="text-right py-2 text-xs font-medium text-text-tertiary">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice?.items?.map((item, index) => (
                    <tr key={index} className="border-b border-border-light">
                      <td className="py-3 text-text-primary">{item?.description}</td>
                      <td className="py-3 text-right text-text-secondary">{item?.quantity}</td>
                      <td className="py-3 text-right text-text-secondary font-data">
                        {formatCurrency(item?.unitPrice, invoice?.currency)}
                      </td>
                      <td className="py-3 text-right text-text-primary font-medium font-data">
                        {formatCurrency(item?.amount, invoice?.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Invoice Summary */}
            <div className="flex justify-end">
              <div className="w-full md:w-64">
                <div className="flex justify-between py-2">
                  <span className="text-text-secondary">Subtotal</span>
                  <span className="text-text-primary font-medium font-data">
                    {formatCurrency(invoice?.subtotal, invoice?.currency)}
                  </span>
                </div>
                
                <div className="flex justify-between py-2">
                  <span className="text-text-secondary">
                    Tax ({(invoice?.tax?.rate * 100)?.toFixed(1)}%)
                  </span>
                  <span className="text-text-primary font-medium font-data">
                    {formatCurrency(invoice?.tax?.amount, invoice?.currency)}
                  </span>
                </div>
                
                <div className="flex justify-between py-2 border-t border-border-light">
                  <span className="text-text-primary font-medium">Total</span>
                  <span className="text-text-primary font-bold font-data">
                    {formatCurrency(invoice?.total, invoice?.currency)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Notes and Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-text-tertiary mb-2">Notes</h4>
              <div className="bg-surface-hover rounded-lg border border-border-light p-4 text-text-secondary">
                {invoice?.notes || 'No notes provided.'}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-text-tertiary mb-2">Payment Information</h4>
              <div className="bg-surface-hover rounded-lg border border-border-light p-4">
                {invoice?.paymentMethod ? (
                  <div>
                    {invoice?.paymentMethod?.type === 'credit_card' && (
                      <div className="flex items-center text-text-secondary">
                        <Icon name="CreditCard" size={16} className="mr-2 text-secondary-500" />
                        {invoice?.paymentMethod?.brand} •••• {invoice?.paymentMethod?.last4} (expires {invoice?.paymentMethod?.expiryDate})
                      </div>
                    )}
                    
                    {invoice?.paymentMethod?.type === 'bank_transfer' && (
                      <div className="flex items-center text-text-secondary">
                        <Icon name="Building" size={16} className="mr-2 text-secondary-500" />
                        Bank Transfer to {invoice?.paymentMethod?.bankName} (•••• {invoice?.paymentMethod?.accountLast4})
                      </div>
                    )}
                    
                    {invoice?.paymentMethod?.type === 'sepa_debit' && (
                      <div className="flex items-center text-text-secondary">
                        <Icon name="CreditCard" size={16} className="mr-2 text-secondary-500" />
                        SEPA Debit from {invoice?.paymentMethod?.bankName} (•••• {invoice?.paymentMethod?.accountLast4})
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-text-secondary">No payment method specified.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Payment History Tab */}
      {activeTab === 'payments' && (
        <div className="flex-1 overflow-y-auto">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Payment History</h3>
            
            {paymentHistory?.length > 0 ? (
              <div className="bg-surface-hover rounded-lg border border-border-light overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-secondary-50 border-b border-border-light">
                      <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Method</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Transaction ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-light">
                    {paymentHistory?.map((payment) => (
                      <tr key={payment?.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                          {formatDate(payment?.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary font-data">
                          {formatCurrency(payment?.amount, invoice?.currency)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                          {payment?.method?.type === 'credit_card' ? 
                            `${payment?.method?.brand} •••• ${payment?.method?.last4}` : 
                            payment?.method?.type?.replace('_', ' ')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-50 text-success-700">
                            <Icon name="CheckCircle" size={12} className="mr-1" />
                            Successful
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary font-mono">
                          {payment?.transactionId}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-surface-hover rounded-lg border border-border-light p-6 text-center">
                <div className="w-12 h-12 bg-secondary-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Icon name="CreditCard" size={20} className="text-secondary-500" />
                </div>
                <h4 className="text-text-primary font-medium mb-1">No Payments Yet</h4>
                <p className="text-text-secondary text-sm mb-4">
                  This invoice hasn't been paid yet. You can record a payment manually or mark it as paid.
                </p>
                <button
                  onClick={() => onStatusChange('paid')}
                  className="bg-success text-white px-4 py-2 rounded-lg text-sm flex items-center mx-auto hover:bg-success-700 transition-colors duration-200"
                >
                  <Icon name="CheckCircle" size={16} className="mr-1.5" />
                  Mark as Paid
                </button>
              </div>
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-4">Payment Details</h3>
            
            <div className="bg-surface-hover rounded-lg border border-border-light p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-text-tertiary mb-2">Payment Terms</h4>
                  <p className="text-text-secondary">
                    Due {new Date(invoice.dueDate)?.getDate() - new Date(invoice.issueDate)?.getDate()} days after issue
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-text-tertiary mb-2">Payment Instructions</h4>
                  <p className="text-text-secondary">
                    {invoice?.status === 'paid' ? 'This invoice has been paid in full.': 'Please include the invoice number in your payment reference.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Communications Tab */}
      {activeTab === 'communications' && (
        <div className="flex-1 overflow-y-auto">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-text-primary">Communication History</h3>
              
              <button
                className="bg-primary text-white px-3 py-1.5 rounded-lg text-sm flex items-center hover:bg-primary-700 transition-colors duration-200"
              >
                <Icon name="Mail" size={16} className="mr-1.5" />
                Send Reminder
              </button>
            </div>
            
            {communicationLogs?.length > 0 ? (
              <div className="bg-surface-hover rounded-lg border border-border-light overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-secondary-50 border-b border-border-light">
                      <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Date & Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Subject</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Recipient</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-light">
                    {communicationLogs?.map((log) => (
                      <tr key={log?.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                          {new Date(log.date)?.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Icon name="Mail" size={16} className="mr-2 text-secondary-500" />
                            <span className="text-sm text-text-secondary capitalize">{log?.type}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                          {log?.subject}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                          {log?.recipient}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-50 text-success-700">
                            <Icon name="CheckCircle" size={12} className="mr-1" />
                            {log?.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-surface-hover rounded-lg border border-border-light p-6 text-center">
                <div className="w-12 h-12 bg-secondary-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Icon name="Mail" size={20} className="text-secondary-500" />
                </div>
                <h4 className="text-text-primary font-medium mb-1">No Communications Yet</h4>
                <p className="text-text-secondary text-sm">
                  There are no communication records for this invoice.
                </p>
              </div>
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-4">Communication Templates</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-surface-hover rounded-lg border border-border-light p-4 hover:border-primary-100 transition-colors duration-200 cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-text-primary font-medium">Invoice Reminder</h4>
                  <Icon name="Mail" size={16} className="text-secondary-500" />
                </div>
                <p className="text-text-secondary text-sm mb-3">
                  Gentle reminder for upcoming invoice payment due date.
                </p>
                <button className="text-primary text-sm font-medium hover:text-primary-700 transition-colors duration-200">
                  Use Template
                </button>
              </div>
              
              <div className="bg-surface-hover rounded-lg border border-border-light p-4 hover:border-primary-100 transition-colors duration-200 cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-text-primary font-medium">Overdue Notice</h4>
                  <Icon name="AlertTriangle" size={16} className="text-error-500" />
                </div>
                <p className="text-text-secondary text-sm mb-3">
                  Notification for overdue invoice with payment instructions.
                </p>
                <button className="text-primary text-sm font-medium hover:text-primary-700 transition-colors duration-200">
                  Use Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceDetailView;