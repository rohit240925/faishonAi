// src/pages/customer-portal/components/BillingHistory.jsx
import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const BillingHistory = ({ invoices, formatCurrency, formatDate, onDownload, onDispute }) => {
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');
  const [disputeDescription, setDisputeDescription] = useState('');

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-success-100 text-success-800';
      case 'pending':
        return 'bg-warning-100 text-warning-800';
      case 'overdue':
        return 'bg-error-100 text-error-800';
      case 'failed':
        return 'bg-error-100 text-error-800';
      default:
        return 'bg-secondary-100 text-secondary-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return 'CheckCircle';
      case 'pending':
        return 'Clock';
      case 'overdue':
        return 'AlertTriangle';
      case 'failed':
        return 'XCircle';
      default:
        return 'FileText';
    }
  };

  const handleDisputeSubmit = () => {
    onDispute(selectedInvoice?.id, {
      reason: disputeReason,
      description: disputeDescription
    });
    setShowDisputeModal(false);
    setSelectedInvoice(null);
    setDisputeReason('');
    setDisputeDescription('');
  };

  const disputeReasons = [
    'Billing error',
    'Service not received',
    'Duplicate charge',
    'Unauthorized charge',
    'Quality issue',
    'Other'
  ];

  return (
    <div className="bg-surface rounded-lg shadow-card border border-border-light p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-text-primary">Billing History</h2>
        <button className="inline-flex items-center px-4 py-2 border border-border-light text-text-secondary rounded-lg hover:bg-surface-hover transition-colors text-sm">
          <Icon name="Download" size={16} className="mr-2" />
          Export All
        </button>
      </div>
      {/* Invoices List */}
      <div className="space-y-4">
        {invoices?.map((invoice) => (
          <div
            key={invoice?.id}
            className="border border-border-light rounded-lg p-4 hover:bg-surface-hover transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="font-medium text-text-primary">{invoice?.number}</h3>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    getStatusColor(invoice?.status)
                  }`}>
                    <Icon name={getStatusIcon(invoice?.status)} size={12} className="mr-1" />
                    {invoice?.status?.charAt(0)?.toUpperCase() + invoice?.status?.slice(1)}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-text-secondary">
                  <div>
                    <span className="font-medium">Amount:</span> {formatCurrency(invoice?.amount, invoice?.currency)}
                  </div>
                  <div>
                    <span className="font-medium">Date:</span> {formatDate(invoice?.date)}
                  </div>
                  <div>
                    <span className="font-medium">Due:</span> {formatDate(invoice?.dueDate)}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onDownload(invoice?.id)}
                  className="inline-flex items-center px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors text-sm"
                >
                  <Icon name="Download" size={14} className="mr-1" />
                  PDF
                </button>
                
                {(invoice?.status === 'paid' || invoice?.status === 'overdue') && (
                  <button
                    onClick={() => {
                      setSelectedInvoice(invoice);
                      setShowDisputeModal(true);
                    }}
                    className="inline-flex items-center px-3 py-1.5 border border-warning text-warning rounded-lg hover:bg-warning-50 transition-colors text-sm"
                  >
                    <Icon name="AlertCircle" size={14} className="mr-1" />
                    Dispute
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {invoices?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="FileText" size={48} className="text-secondary-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">No invoices found</h3>
          <p className="text-text-secondary">Your billing history will appear here once you have invoices.</p>
        </div>
      )}
      {/* Dispute Modal */}
      {showDisputeModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-lg shadow-modal max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <Icon name="AlertCircle" size={24} className="text-warning mr-3" />
              <h3 className="text-lg font-semibold text-text-primary">Dispute Invoice</h3>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-text-secondary mb-2">
                Invoice: <span className="font-medium text-text-primary">{selectedInvoice?.number}</span>
              </p>
              <p className="text-sm text-text-secondary">
                Amount: <span className="font-medium text-text-primary">{formatCurrency(selectedInvoice?.amount, selectedInvoice?.currency)}</span>
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-text-primary mb-2">
                Reason for dispute
              </label>
              <select
                value={disputeReason}
                onChange={(e) => setDisputeReason(e?.target?.value)}
                className="w-full border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select a reason</option>
                {disputeReasons?.map((reason) => (
                  <option key={reason} value={reason}>{reason}</option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-text-primary mb-2">
                Description
              </label>
              <textarea
                value={disputeDescription}
                onChange={(e) => setDisputeDescription(e?.target?.value)}
                placeholder="Please provide additional details about your dispute..."
                rows={3}
                className="w-full border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowDisputeModal(false);
                  setSelectedInvoice(null);
                  setDisputeReason('');
                  setDisputeDescription('');
                }}
                className="flex-1 px-4 py-2 border border-border-light text-text-secondary rounded-lg hover:bg-surface-hover transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDisputeSubmit}
                disabled={!disputeReason || !disputeDescription}
                className="flex-1 px-4 py-2 bg-warning text-white rounded-lg hover:bg-warning-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Dispute
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingHistory;