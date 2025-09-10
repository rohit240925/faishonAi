import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const InvoiceScheduler = ({ onSave, onCancel }) => {
  const [scheduleData, setScheduleData] = useState({
    customer: '',
    frequency: 'monthly',
    startDate: '',
    endDate: '',
    dayOfMonth: '1',
    dayOfWeek: 'monday',
    template: 'standard',
    items: [
      {
        description: '',
        quantity: 1,
        unitPrice: 0,
        amount: 0
      }
    ],
    notes: '',
    sendAutomatically: true,
    reminderDays: 3
  });
  
  // Mock customer data for dropdown
  const customers = [
    {
      id: 'CUST-001',
      name: 'Acme Corporation',
      email: 'billing@acmecorp.com'
    },
    {
      id: 'CUST-002',
      name: 'TechStart Inc.',
      email: 'accounts@techstart.io'
    },
    {
      id: 'CUST-003',
      name: 'Global Solutions Ltd.',
      email: 'finance@globalsolutions.co.uk'
    }
  ];
  
  // Frequency options
  const frequencyOptions = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'biweekly', label: 'Bi-weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'annually', label: 'Annually' }
  ];
  
  // Template options
  const templateOptions = [
    { value: 'standard', label: 'Standard Invoice' },
    { value: 'detailed', label: 'Detailed with Usage' },
    { value: 'minimal', label: 'Minimal' }
  ];
  
  // Handle form field changes
  const handleChange = (field, value) => {
    setScheduleData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle item change
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...scheduleData?.items];
    
    if (field === 'quantity' || field === 'unitPrice') {
      const numValue = parseFloat(value) || 0;
      updatedItems[index][field] = numValue;
      
      // Recalculate amount
      const quantity = field === 'quantity' ? numValue : updatedItems?.[index]?.quantity;
      const unitPrice = field === 'unitPrice' ? numValue : updatedItems?.[index]?.unitPrice;
      updatedItems[index].amount = quantity * unitPrice;
    } else {
      updatedItems[index][field] = value;
    }
    
    setScheduleData(prev => ({
      ...prev,
      items: updatedItems
    }));
  };
  
  // Add new item
  const handleAddItem = () => {
    setScheduleData(prev => ({
      ...prev,
      items: [
        ...prev?.items,
        {
          description: '',
          quantity: 1,
          unitPrice: 0,
          amount: 0
        }
      ]
    }));
  };
  
  // Remove item
  const handleRemoveItem = (index) => {
    if (scheduleData?.items?.length === 1) {
      return; // Keep at least one item
    }
    
    const updatedItems = scheduleData?.items?.filter((_, i) => i !== index);
    
    setScheduleData(prev => ({
      ...prev,
      items: updatedItems
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e?.preventDefault();
    onSave(scheduleData);
  };
  
  // Get next occurrence dates based on frequency
  const getNextOccurrences = () => {
    if (!scheduleData?.startDate) {
      return [];
    }
    
    const startDate = new Date(scheduleData.startDate);
    const occurrences = [];
    let currentDate = new Date(startDate);
    
    // Generate next 3 occurrences
    for (let i = 0; i < 3; i++) {
      if (scheduleData?.frequency === 'weekly') {
        if (i > 0) {
          currentDate?.setDate(currentDate?.getDate() + 7);
        }
      } else if (scheduleData?.frequency === 'biweekly') {
        if (i > 0) {
          currentDate?.setDate(currentDate?.getDate() + 14);
        }
      } else if (scheduleData?.frequency === 'monthly') {
        if (i > 0) {
          currentDate?.setMonth(currentDate?.getMonth() + 1);
        }
        // Set to specified day of month
        currentDate?.setDate(parseInt(scheduleData?.dayOfMonth));
      } else if (scheduleData?.frequency === 'quarterly') {
        if (i > 0) {
          currentDate?.setMonth(currentDate?.getMonth() + 3);
        }
        // Set to specified day of month
        currentDate?.setDate(parseInt(scheduleData?.dayOfMonth));
      } else if (scheduleData?.frequency === 'annually') {
        if (i > 0) {
          currentDate?.setFullYear(currentDate?.getFullYear() + 1);
        }
      }
      
      occurrences?.push(new Date(currentDate));
    }
    
    return occurrences;
  };
  
  // Format date for display
  const formatDate = (date) => {
    return date?.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  const nextOccurrences = getNextOccurrences();
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        {/* Customer and Frequency */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Customer</label>
            <select
              value={scheduleData?.customer}
              onChange={(e) => handleChange('customer', e?.target?.value)}
              className="block w-full px-3 py-2 border border-border-light rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            >
              <option value="">Select a customer</option>
              {customers?.map((customer) => (
                <option key={customer?.id} value={customer?.id}>
                  {customer?.name} ({customer?.email})
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Frequency</label>
            <select
              value={scheduleData?.frequency}
              onChange={(e) => handleChange('frequency', e?.target?.value)}
              className="block w-full px-3 py-2 border border-border-light rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            >
              {frequencyOptions?.map((option) => (
                <option key={option?.value} value={option?.value}>
                  {option?.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Schedule Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Start Date</label>
            <input
              type="date"
              value={scheduleData?.startDate}
              onChange={(e) => handleChange('startDate', e?.target?.value)}
              className="block w-full px-3 py-2 border border-border-light rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">End Date (Optional)</label>
            <input
              type="date"
              value={scheduleData?.endDate}
              onChange={(e) => handleChange('endDate', e?.target?.value)}
              className="block w-full px-3 py-2 border border-border-light rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          {(scheduleData?.frequency === 'monthly' || scheduleData?.frequency === 'quarterly') && (
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Day of Month</label>
              <select
                value={scheduleData?.dayOfMonth}
                onChange={(e) => handleChange('dayOfMonth', e?.target?.value)}
                className="block w-full px-3 py-2 border border-border-light rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {Array.from({ length: 28 }, (_, i) => i + 1)?.map((day) => (
                  <option key={day} value={day?.toString()}>
                    {day}
                  </option>
                ))}
                <option value="last">Last day of month</option>
              </select>
            </div>
          )}
          
          {scheduleData?.frequency === 'weekly' && (
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Day of Week</label>
              <select
                value={scheduleData?.dayOfWeek}
                onChange={(e) => handleChange('dayOfWeek', e?.target?.value)}
                className="block w-full px-3 py-2 border border-border-light rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="monday">Monday</option>
                <option value="tuesday">Tuesday</option>
                <option value="wednesday">Wednesday</option>
                <option value="thursday">Thursday</option>
                <option value="friday">Friday</option>
                <option value="saturday">Saturday</option>
                <option value="sunday">Sunday</option>
              </select>
            </div>
          )}
        </div>
        
        {/* Next Occurrences Preview */}
        {nextOccurrences?.length > 0 && (
          <div className="bg-surface-hover rounded-lg border border-border-light p-4">
            <h4 className="text-sm font-medium text-text-secondary mb-2">Next Invoice Dates</h4>
            <div className="space-y-2">
              {nextOccurrences?.map((date, index) => (
                <div key={index} className="flex items-center">
                  <Icon name="Calendar" size={16} className="text-primary mr-2" />
                  <span className="text-text-primary">{formatDate(date)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Template Selection */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Invoice Template</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {templateOptions?.map((template) => (
              <div
                key={template?.value}
                className={`
                  border rounded-lg p-4 cursor-pointer transition-colors duration-200
                  ${scheduleData?.template === template?.value 
                    ? 'border-primary bg-primary-50' :'border-border-light hover:border-primary-100'}
                `}
                onClick={() => handleChange('template', template?.value)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-text-primary">{template?.label}</span>
                  {scheduleData?.template === template?.value && (
                    <Icon name="CheckCircle" size={16} className="text-primary" />
                  )}
                </div>
                <p className="text-xs text-text-secondary">
                  {template?.value === 'standard' && 'Basic invoice with standard line items and totals.'}
                  {template?.value === 'detailed' && 'Detailed invoice with usage metrics and breakdowns.'}
                  {template?.value === 'minimal' && 'Simplified invoice with minimal details.'}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Line Items */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-text-secondary">Line Items</label>
            <button
              type="button"
              onClick={handleAddItem}
              className="text-primary text-sm font-medium hover:text-primary-700 transition-colors duration-200 flex items-center"
            >
              <Icon name="Plus" size={16} className="mr-1" />
              Add Item
            </button>
          </div>
          
          <div className="bg-surface-hover rounded-lg border border-border-light overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-secondary-50 border-b border-border-light">
                  <th className="px-4 py-2 text-left text-xs font-medium text-secondary-500">Description</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-secondary-500 w-20">Qty</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-secondary-500 w-32">Unit Price</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-secondary-500 w-32">Amount</th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-secondary-500 w-16"></th>
                </tr>
              </thead>
              <tbody>
                {scheduleData?.items?.map((item, index) => (
                  <tr key={index} className="border-b border-border-light">
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={item?.description}
                        onChange={(e) => handleItemChange(index, 'description', e?.target?.value)}
                        className="block w-full px-2 py-1 border border-border-light rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                        placeholder="Item description"
                        required
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={item?.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e?.target?.value)}
                        className="block w-full px-2 py-1 border border-border-light rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm text-right"
                        min="1"
                        required
                      />
                    </td>
                    <td className="px-4 py-2">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                          <span className="text-secondary-400 text-sm">$</span>
                        </div>
                        <input
                          type="number"
                          value={item?.unitPrice}
                          onChange={(e) => handleItemChange(index, 'unitPrice', e?.target?.value)}
                          className="block w-full pl-6 pr-2 py-1 border border-border-light rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm text-right"
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>
                    </td>
                    <td className="px-4 py-2 text-right font-medium">
                      ${item?.amount?.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="text-secondary-500 hover:text-error transition-colors duration-200"
                        disabled={scheduleData?.items?.length === 1}
                      >
                        <Icon name="Trash2" size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Automation Settings */}
        <div>
          <h4 className="text-sm font-medium text-text-secondary mb-3">Automation Settings</h4>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="sendAutomatically"
                checked={scheduleData?.sendAutomatically}
                onChange={(e) => handleChange('sendAutomatically', e?.target?.checked)}
                className="rounded border-border-medium text-primary focus:ring-primary h-4 w-4"
              />
              <label htmlFor="sendAutomatically" className="ml-2 text-text-primary">
                Send invoices automatically
              </label>
            </div>
            
            {scheduleData?.sendAutomatically && (
              <div className="pl-6">
                <label className="block text-sm text-text-secondary mb-1">
                  Send payment reminder (days before due date)
                </label>
                <select
                  value={scheduleData?.reminderDays}
                  onChange={(e) => handleChange('reminderDays', parseInt(e?.target?.value))}
                  className="block w-full sm:w-32 px-3 py-2 border border-border-light rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="0">No reminder</option>
                  <option value="1">1 day</option>
                  <option value="2">2 days</option>
                  <option value="3">3 days</option>
                  <option value="5">5 days</option>
                  <option value="7">7 days</option>
                </select>
              </div>
            )}
          </div>
        </div>
        
        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Notes</label>
          <textarea
            value={scheduleData?.notes}
            onChange={(e) => handleChange('notes', e?.target?.value)}
            className="block w-full px-3 py-2 border border-border-light rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            rows="3"
            placeholder="Add any notes or payment instructions..."
          ></textarea>
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-border-light">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-border-light rounded-lg text-text-secondary hover:bg-surface-hover transition-colors duration-200"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
          >
            Save Schedule
          </button>
        </div>
      </div>
    </form>
  );
};

export default InvoiceScheduler;