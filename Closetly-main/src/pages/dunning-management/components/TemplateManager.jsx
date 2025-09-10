// src/pages/dunning-management/components/TemplateManager.jsx
import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const TemplateManager = () => {
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isEditing, setIsEditing] = useState(false);

  // Mock email templates
  const emailTemplates = [
    {
      id: 'TEMP-001',
      name: 'Payment Failed - First Notice',
      category: 'initial',
      subject: 'Payment Failed - Action Required',
      description: 'Initial notification when payment fails',
      lastModified: '2024-01-10T10:30:00Z',
      status: 'active',
      usageCount: 245,
      conversionRate: 15.2,
      content: `
Dear {{customer_name}},

We were unable to process your payment for {{subscription_name}} on {{failure_date}}.

Payment Details:
- Amount: {{amount}}
- Failure Reason: {{failure_reason}}
- Next Attempt: {{next_attempt_date}}

To avoid service interruption, please update your payment method or contact us.

Update Payment Method: {{update_payment_link}}

Best regards,
The Billing Team
      `?.trim()
    },
    {
      id: 'TEMP-002',
      name: 'Payment Retry Reminder',
      category: 'reminder',
      subject: 'Payment Retry Scheduled - {{subscription_name}}',
      description: 'Sent before automatic retry attempts',
      lastModified: '2024-01-08T14:15:00Z',
      status: 'active',
      usageCount: 189,
      conversionRate: 22.8,
      content: `
Hi {{customer_name}},

We'll be attempting to process your payment again in {{retry_hours}} hours.

If you've already updated your payment method, you can disregard this message.

Need help? Contact our support team.

Thank you,
Billing Support
      `?.trim()
    },
    {
      id: 'TEMP-003',
      name: 'Final Notice - Account Suspension',
      category: 'final',
      subject: 'URGENT: Account Suspension Notice',
      description: 'Final warning before account suspension',
      lastModified: '2024-01-05T09:45:00Z',
      status: 'active',
      usageCount: 67,
      conversionRate: 35.4,
      content: `
Important Notice for {{customer_name}},

This is your final notice regarding the failed payment for {{subscription_name}}.

Your account will be suspended in {{suspension_days}} days if payment is not received.

To prevent suspension:
1. Update your payment method: {{update_payment_link}}
2. Contact our billing team: {{support_contact}}

We value your business and want to help resolve this issue.

Urgent Support: {{urgent_contact}}
      `?.trim()
    },
    {
      id: 'TEMP-004',
      name: 'Payment Success Confirmation',
      category: 'success',
      subject: 'Payment Processed Successfully',
      description: 'Confirmation when payment is recovered',
      lastModified: '2024-01-12T16:20:00Z',
      status: 'active',
      usageCount: 456,
      conversionRate: 98.7,
      content: `
Great news, {{customer_name}}!

Your payment has been processed successfully.

Payment Summary:
- Amount: {{amount}}
- Service: {{subscription_name}}
- Next Billing: {{next_billing_date}}

Your service will continue without interruption.

Thank you for your business!
      `?.trim()
    }
  ];

  const categories = [
    { value: 'all', label: 'All Templates', count: emailTemplates?.length },
    { value: 'initial', label: 'Initial Notice', count: emailTemplates?.filter(t => t?.category === 'initial')?.length },
    { value: 'reminder', label: 'Reminders', count: emailTemplates?.filter(t => t?.category === 'reminder')?.length },
    { value: 'final', label: 'Final Notice', count: emailTemplates?.filter(t => t?.category === 'final')?.length },
    { value: 'success', label: 'Success', count: emailTemplates?.filter(t => t?.category === 'success')?.length }
  ];

  const mergeFields = [
    { field: '{{customer_name}}', description: 'Customer full name' },
    { field: '{{customer_email}}', description: 'Customer email address' },
    { field: '{{subscription_name}}', description: 'Subscription plan name' },
    { field: '{{amount}}', description: 'Payment amount' },
    { field: '{{failure_date}}', description: 'Date payment failed' },
    { field: '{{failure_reason}}', description: 'Reason for payment failure' },
    { field: '{{next_attempt_date}}', description: 'Next retry attempt date' },
    { field: '{{retry_hours}}', description: 'Hours until next retry' },
    { field: '{{suspension_days}}', description: 'Days until account suspension' },
    { field: '{{update_payment_link}}', description: 'Link to update payment method' },
    { field: '{{support_contact}}', description: 'Support contact information' },
    { field: '{{urgent_contact}}', description: 'Urgent support contact' },
    { field: '{{next_billing_date}}', description: 'Next billing date' }
  ];

  const filteredTemplates = emailTemplates?.filter(template => {
    const matchesSearch = !searchQuery || 
      template?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      template?.subject?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      template?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || template?.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { bgColor: 'bg-success-50', textColor: 'text-success-700', icon: 'CheckCircle' },
      draft: { bgColor: 'bg-warning-50', textColor: 'text-warning-700', icon: 'Edit' },
      inactive: { bgColor: 'bg-secondary-50', textColor: 'text-secondary-700', icon: 'Pause' }
    };
    
    const config = statusConfig?.[status] || statusConfig?.draft;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config?.bgColor} ${config?.textColor}`}>
        <Icon name={config?.icon} size={12} className="mr-1" />
        {status?.charAt(0)?.toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleEditTemplate = (template) => {
    setActiveTemplate(template);
    setIsEditing(true);
    setPreviewMode(false);
  };

  const handlePreviewTemplate = (template) => {
    setActiveTemplate(template);
    setPreviewMode(true);
    setIsEditing(false);
  };

  const handleSaveTemplate = () => {
    console.log('Saving template:', activeTemplate);
    setIsEditing(false);
  };

  const insertMergeField = (field) => {
    // In a real implementation, this would insert the field at cursor position
    console.log('Inserting merge field:', field);
  };

  const handleCreateTemplate = () => {
    const newTemplate = {
      id: `TEMP-${Date.now()}`,
      name: 'New Template',
      category: 'initial',
      subject: '',
      description: '',
      lastModified: new Date()?.toISOString(),
      status: 'draft',
      usageCount: 0,
      conversionRate: 0,
      content: ''
    };
    setActiveTemplate(newTemplate);
    setIsEditing(true);
    setPreviewMode(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-text-primary">Email Templates</h2>
          <p className="text-text-secondary">Manage and customize dunning email templates with merge fields</p>
        </div>
        <button
          onClick={handleCreateTemplate}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center hover:bg-primary-700 transition-colors duration-200"
        >
          <Icon name="Plus" size={18} className="mr-2" />
          Create Template
        </button>
      </div>
      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon name="Search" size={20} className="text-secondary-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e?.target?.value)}
              placeholder="Search templates..."
              className="block w-full pl-10 pr-3 py-2 border border-border-light rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            />
          </div>
        </div>
        <div className="flex space-x-2 overflow-x-auto">
          {categories?.map((category) => (
            <button
              key={category?.value}
              onClick={() => setSelectedCategory(category?.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                selectedCategory === category?.value
                  ? 'bg-primary text-white' :'bg-surface border border-border-light text-text-secondary hover:text-text-primary hover:bg-surface-hover'
              }`}
            >
              {category?.label} ({category?.count})
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Templates List */}
        <div className="lg:col-span-5">
          <div className="space-y-4">
            {filteredTemplates?.map((template) => (
              <div
                key={template?.id}
                className={`bg-surface rounded-lg border border-border-light shadow-card p-4 cursor-pointer transition-all duration-200 ${
                  activeTemplate?.id === template?.id ? 'ring-2 ring-primary' : 'hover:shadow-md'
                }`}
                onClick={() => handlePreviewTemplate(template)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-medium text-text-primary">{template?.name}</h3>
                      {getStatusBadge(template?.status)}
                    </div>
                    <p className="text-sm text-text-secondary mb-2">{template?.description}</p>
                    <p className="text-xs text-text-tertiary">Subject: {template?.subject}</p>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={(e) => {
                        e?.stopPropagation();
                        handleEditTemplate(template);
                      }}
                      className="p-1.5 text-secondary-600 hover:text-primary hover:bg-primary-50 rounded-lg transition-colors duration-200"
                      title="Edit Template"
                    >
                      <Icon name="Edit" size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e?.stopPropagation();
                        console.log('Duplicate template:', template?.id);
                      }}
                      className="p-1.5 text-secondary-600 hover:text-accent hover:bg-accent-50 rounded-lg transition-colors duration-200"
                      title="Duplicate Template"
                    >
                      <Icon name="Copy" size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <div className="text-sm font-medium text-text-primary">{template?.usageCount}</div>
                    <div className="text-xs text-text-secondary">Uses</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-text-primary">{template?.conversionRate}%</div>
                    <div className="text-xs text-text-secondary">Success Rate</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-text-primary">{formatDate(template?.lastModified)}</div>
                    <div className="text-xs text-text-secondary">Modified</div>
                  </div>
                </div>
              </div>
            ))}

            {filteredTemplates?.length === 0 && (
              <div className="text-center py-8">
                <Icon name="Mail" size={32} className="text-secondary-400 mx-auto mb-3" />
                <h3 className="text-sm font-medium text-text-primary mb-1">No templates found</h3>
                <p className="text-xs text-text-secondary">Try adjusting your search or category filter</p>
              </div>
            )}
          </div>
        </div>

        {/* Template Editor/Preview */}
        <div className="lg:col-span-7">
          {activeTemplate ? (
            <div className="bg-surface rounded-lg border border-border-light shadow-card">
              {/* Editor Header */}
              <div className="flex items-center justify-between p-4 border-b border-border-light">
                <div className="flex items-center space-x-3">
                  <Icon name="Mail" size={20} className="text-primary" />
                  <div>
                    <h3 className="font-medium text-text-primary">{activeTemplate?.name}</h3>
                    <p className="text-sm text-text-secondary">
                      {isEditing ? 'Editing Template' : 'Preview Mode'}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-3 py-1.5 text-sm border border-border-light rounded hover:bg-surface-hover transition-colors duration-200"
                    >
                      <Icon name="Edit" size={16} className="mr-1" />
                      Edit
                    </button>
                  )}
                  {isEditing && (
                    <>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-3 py-1.5 text-sm border border-border-light rounded hover:bg-surface-hover transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveTemplate}
                        className="px-3 py-1.5 text-sm bg-primary text-white rounded hover:bg-primary-700 transition-colors duration-200"
                      >
                        Save Template
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setPreviewMode(!previewMode)}
                    className={`px-3 py-1.5 text-sm rounded transition-colors duration-200 ${
                      previewMode ? 'bg-primary text-white' : 'border border-border-light hover:bg-surface-hover'
                    }`}
                  >
                    <Icon name="Eye" size={16} className="mr-1" />
                    Preview
                  </button>
                </div>
              </div>

              {/* Template Content */}
              <div className="p-6">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">Template Name</label>
                        <input
                          type="text"
                          value={activeTemplate?.name}
                          onChange={(e) => setActiveTemplate({...activeTemplate, name: e?.target?.value})}
                          className="w-full border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">Category</label>
                        <select
                          value={activeTemplate?.category}
                          onChange={(e) => setActiveTemplate({...activeTemplate, category: e?.target?.value})}
                          className="w-full border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          <option value="initial">Initial Notice</option>
                          <option value="reminder">Reminder</option>
                          <option value="final">Final Notice</option>
                          <option value="success">Success</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Subject Line</label>
                      <input
                        type="text"
                        value={activeTemplate?.subject}
                        onChange={(e) => setActiveTemplate({...activeTemplate, subject: e?.target?.value})}
                        className="w-full border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Email subject line"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Description</label>
                      <input
                        type="text"
                        value={activeTemplate?.description}
                        onChange={(e) => setActiveTemplate({...activeTemplate, description: e?.target?.value})}
                        className="w-full border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Brief description of template purpose"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Email Content</label>
                      <textarea
                        value={activeTemplate?.content}
                        onChange={(e) => setActiveTemplate({...activeTemplate, content: e?.target?.value})}
                        rows={12}
                        className="w-full border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-mono"
                        placeholder="Email content with merge fields..."
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-secondary-25 rounded-lg p-4">
                      <div className="text-sm text-text-secondary mb-1">Subject:</div>
                      <div className="font-medium text-text-primary">{activeTemplate?.subject}</div>
                    </div>
                    
                    <div className="bg-secondary-25 rounded-lg p-4">
                      <div className="text-sm text-text-secondary mb-3">Content Preview:</div>
                      <div className="whitespace-pre-wrap text-sm text-text-primary leading-relaxed border border-border-light rounded bg-surface p-4">
                        {activeTemplate?.content}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-surface rounded-lg border border-border-light shadow-card p-8 text-center">
              <Icon name="Mail" size={48} className="text-secondary-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-text-primary mb-2">Select a Template</h3>
              <p className="text-text-secondary mb-6">Choose a template from the list to preview or edit its content</p>
              <button
                onClick={handleCreateTemplate}
                className="bg-primary text-white px-4 py-2 rounded-lg flex items-center mx-auto hover:bg-primary-700 transition-colors duration-200"
              >
                <Icon name="Plus" size={18} className="mr-2" />
                Create New Template
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Merge Fields Reference */}
      {isEditing && (
        <div className="bg-surface rounded-lg border border-border-light shadow-card p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Available Merge Fields</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {mergeFields?.map((field, index) => (
              <button
                key={index}
                onClick={() => insertMergeField(field?.field)}
                className="text-left p-3 bg-secondary-25 hover:bg-secondary-50 rounded-lg transition-colors duration-200 border border-border-light"
              >
                <div className="font-mono text-sm text-primary font-medium">{field?.field}</div>
                <div className="text-xs text-text-secondary mt-1">{field?.description}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateManager;