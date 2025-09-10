import React from 'react';
import Icon from '../../../components/AppIcon';

const InvoiceTable = ({ 
  invoices, 
  selectedInvoices, 
  onSelectInvoice, 
  onSelectAll, 
  onViewInvoice,
  onStatusChange,
  isLoading
}) => {
  const allSelected = invoices?.length > 0 && selectedInvoices?.length === invoices?.length;
  
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
  
  // Get status badge styling
  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: {
        className: 'status-badge status-draft',
        icon: 'FileEdit'
      },
      sent: {
        className: 'status-badge status-sent',
        icon: 'Send'
      },
      paid: {
        className: 'status-badge status-paid',
        icon: 'CheckCircle'
      },
      overdue: {
        className: 'status-badge status-overdue',
        icon: 'AlertTriangle'
      }
    };
    
    const config = statusConfig?.[status] || statusConfig?.draft;
    
    return (
      <span className={config?.className}>
        <Icon name={config?.icon} size={14} className="mr-1" />
        {status?.charAt(0)?.toUpperCase() + status?.slice(1)}
      </span>
    );
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Get payment method display
  const getPaymentMethodDisplay = (paymentMethod) => {
    if (!paymentMethod) return '-';
    
    const methodIcons = {
      credit_card: 'CreditCard',
      bank_transfer: 'Building',
      sepa_debit: 'CreditCard'
    };
    
    const icon = methodIcons?.[paymentMethod?.type] || 'CreditCard';
    
    let displayText = '';
    if (paymentMethod?.type === 'credit_card') {
      displayText = `${paymentMethod?.brand} •••• ${paymentMethod?.last4}`;
    } else if (paymentMethod?.type === 'bank_transfer') {
      displayText = `Bank Transfer`;
    } else if (paymentMethod?.type === 'sepa_debit') {
      displayText = `SEPA Debit`;
    }
    
    return (
      <div className="flex items-center">
        <Icon name={icon} size={16} className="mr-2 text-text-tertiary" />
        <span className="text-sm">{displayText}</span>
      </div>
    );
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="financial-card">
        <div className="p-8 flex flex-col items-center justify-center">
          <div className="animate-spin mb-4">
            <Icon name="Loader" size={32} className="text-primary" />
          </div>
          <p className="text-text-secondary">Loading invoices...</p>
        </div>
      </div>
    );
  }
  
  // Empty state
  if (invoices?.length === 0) {
    return (
      <div className="financial-card">
        <div className="p-12 flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-4">
            <Icon name="FileText" size={24} className="text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">No invoices found</h3>
          <p className="text-text-secondary text-center max-w-md mb-6">
            No invoices match your current filters. Try adjusting your search criteria or create a new invoice.
          </p>
          <button className="btn-primary btn-hover-lift flex items-center">
            <Icon name="Plus" size={18} className="mr-2" />
            Create Invoice
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="financial-card overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="table-header border-b border-border-light">
              <th className="px-6 py-4 text-left w-12">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => onSelectAll(e?.target?.checked)}
                  className="focus-ring rounded border-border-medium text-primary"
                />
              </th>
              <th className="px-6 py-4 text-left font-medium">Invoice</th>
              <th className="px-6 py-4 text-left font-medium">Customer</th>
              <th className="px-6 py-4 text-left font-medium">Amount</th>
              <th className="px-6 py-4 text-left font-medium">Status</th>
              <th className="px-6 py-4 text-left font-medium">Dates</th>
              <th className="px-6 py-4 text-left font-medium">Payment Method</th>
              <th className="px-6 py-4 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light">
            {invoices?.map((invoice) => (
              <tr 
                key={invoice?.id} 
                className="table-row-hover"
              >
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedInvoices?.includes(invoice?.id)}
                    onChange={() => onSelectInvoice(invoice?.id)}
                    className="focus-ring rounded border-border-medium text-primary"
                  />
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onViewInvoice(invoice?.id)}
                    className="text-primary font-semibold hover:text-primary-700 transition-colors duration-200 focus-ring rounded px-1"
                  >
                    {invoice?.id}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center text-primary font-semibold text-sm mr-3">
                      {invoice?.customer?.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-text-primary">{invoice?.customer?.name}</div>
                      <div className="text-sm text-text-secondary">{invoice?.customer?.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-semibold text-text-primary font-data">
                    {formatCurrency(invoice?.amount, invoice?.currency)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(invoice?.status)}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm space-y-1">
                    <div className="text-text-secondary">
                      <span className="font-medium">Issued:</span> {formatDate(invoice?.issueDate)}
                    </div>
                    <div className="text-text-secondary">
                      <span className="font-medium">Due:</span> {formatDate(invoice?.dueDate)}
                    </div>
                    {invoice?.paidDate && (
                      <div className="text-success">
                        <span className="font-medium">Paid:</span> {formatDate(invoice?.paidDate)}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-text-secondary">
                    {getPaymentMethodDisplay(invoice?.paymentMethod)}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-1">
                    <button
                      onClick={() => onViewInvoice(invoice?.id)}
                      className="p-2 text-text-tertiary hover:text-primary hover:bg-primary-50 rounded-lg transition-all duration-200 focus-ring"
                      title="View Invoice"
                    >
                      <Icon name="Eye" size={18} />
                    </button>
                    
                    {invoice?.status === 'draft' && (
                      <button
                        onClick={() => onStatusChange(invoice?.id, 'sent')}
                        className="p-2 text-text-tertiary hover:text-primary hover:bg-primary-50 rounded-lg transition-all duration-200 focus-ring"
                        title="Send Invoice"
                      >
                        <Icon name="Send" size={18} />
                      </button>
                    )}
                    
                    {(invoice?.status === 'sent' || invoice?.status === 'overdue') && (
                      <button
                        onClick={() => onStatusChange(invoice?.id, 'paid')}
                        className="p-2 text-text-tertiary hover:text-success hover:bg-success-50 rounded-lg transition-all duration-200 focus-ring"
                        title="Mark as Paid"
                      >
                        <Icon name="CheckCircle" size={18} />
                      </button>
                    )}
                    
                    <button
                      className="p-2 text-text-tertiary hover:text-primary hover:bg-primary-50 rounded-lg transition-all duration-200 focus-ring"
                      title="Download PDF"
                    >
                      <Icon name="Download" size={18} />
                    </button>
                    
                    <div className="relative group">
                      <button
                        className="p-2 text-text-tertiary hover:text-primary hover:bg-primary-50 rounded-lg transition-all duration-200 focus-ring"
                        title="More Options"
                      >
                        <Icon name="MoreVertical" size={18} />
                      </button>
                      
                      <div className="absolute right-0 mt-2 w-48 bg-surface rounded-lg shadow-modal border border-border-light z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        <div className="py-1">
                          <button className="flex items-center w-full px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors duration-200">
                            <Icon name="Mail" size={16} className="mr-2" />
                            Send Reminder
                          </button>
                          <button className="flex items-center w-full px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors duration-200">
                            <Icon name="Copy" size={16} className="mr-2" />
                            Duplicate
                          </button>
                          <button className="flex items-center w-full px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors duration-200">
                            <Icon name="Edit" size={16} className="mr-2" />
                            Edit
                          </button>
                          <div className="border-t border-border-light my-1"></div>
                          <button className="flex items-center w-full px-4 py-2 text-sm text-error hover:bg-error-50 transition-colors duration-200">
                            <Icon name="Trash2" size={16} className="mr-2" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden">
        <div className="divide-y divide-border-light">
          {invoices?.map((invoice) => (
            <div key={invoice?.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedInvoices?.includes(invoice?.id)}
                    onChange={() => onSelectInvoice(invoice?.id)}
                    className="focus-ring rounded border-border-medium text-primary"
                  />
                  <button
                    onClick={() => onViewInvoice(invoice?.id)}
                    className="text-primary font-semibold hover:text-primary-700 transition-colors duration-200"
                  >
                    {invoice?.id}
                  </button>
                </div>
                {getStatusBadge(invoice?.status)}
              </div>
              
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center text-primary font-semibold text-sm mr-3">
                  {invoice?.customer?.name?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <div className="font-medium text-text-primary">{invoice?.customer?.name}</div>
                  <div className="text-sm text-text-secondary">{invoice?.customer?.email}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-xs text-text-tertiary font-medium mb-1">Amount</div>
                  <div className="font-semibold text-text-primary font-data">
                    {formatCurrency(invoice?.amount, invoice?.currency)}
                  </div>
                </div>
                
                <div>
                  <div className="text-xs text-text-tertiary font-medium mb-1">Due Date</div>
                  <div className="text-sm text-text-secondary">
                    {formatDate(invoice?.dueDate)}
                  </div>
                </div>
                
                <div>
                  <div className="text-xs text-text-tertiary font-medium mb-1">Issue Date</div>
                  <div className="text-sm text-text-secondary">
                    {formatDate(invoice?.issueDate)}
                  </div>
                </div>
                
                <div>
                  <div className="text-xs text-text-tertiary font-medium mb-1">Payment</div>
                  <div className="text-sm text-text-secondary">
                    {invoice?.paymentMethod ? (
                      invoice?.paymentMethod?.type === 'credit_card' ? 
                        `${invoice?.paymentMethod?.brand} •••• ${invoice?.paymentMethod?.last4}` : 
                        invoice?.paymentMethod?.type?.replace('_', ' ')?.replace(/\b\w/g, l => l?.toUpperCase())
                    ) : 'Not set'}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-border-light">
                <button
                  onClick={() => onViewInvoice(invoice?.id)}
                  className="btn-secondary text-sm px-4 py-2 flex items-center"
                >
                  <Icon name="Eye" size={16} className="mr-2" />
                  View Details
                </button>
                
                <div className="flex items-center space-x-1">
                  {invoice?.status === 'draft' && (
                    <button
                      onClick={() => onStatusChange(invoice?.id, 'sent')}
                      className="p-2 text-text-tertiary hover:text-primary hover:bg-primary-50 rounded-lg transition-all duration-200"
                      title="Send Invoice"
                    >
                      <Icon name="Send" size={18} />
                    </button>
                  )}
                  
                  {(invoice?.status === 'sent' || invoice?.status === 'overdue') && (
                    <button
                      onClick={() => onStatusChange(invoice?.id, 'paid')}
                      className="p-2 text-text-tertiary hover:text-success hover:bg-success-50 rounded-lg transition-all duration-200"
                      title="Mark as Paid"
                    >
                      <Icon name="CheckCircle" size={18} />
                    </button>
                  )}
                  
                  <button
                    className="p-2 text-text-tertiary hover:text-primary hover:bg-primary-50 rounded-lg transition-all duration-200"
                    title="Download PDF"
                  >
                    <Icon name="Download" size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Pagination */}
      <div className="bg-surface-hover px-6 py-4 border-t border-border-light flex flex-col sm:flex-row justify-between items-center">
        <div className="text-sm text-text-secondary mb-4 sm:mb-0">
          Showing <span className="font-semibold text-text-primary">{invoices?.length}</span> of{' '}
          <span className="font-semibold text-text-primary">{invoices?.length}</span> invoices
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            className="p-2 text-text-tertiary hover:text-primary hover:bg-surface-hover rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-ring"
            disabled
          >
            <Icon name="ChevronLeft" size={18} />
          </button>
          
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
            1
          </button>
          
          <button
            className="p-2 text-text-tertiary hover:text-primary hover:bg-surface-hover rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-ring"
            disabled
          >
            <Icon name="ChevronRight" size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTable;