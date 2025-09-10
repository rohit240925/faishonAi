import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const InvoiceGenerationForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    customer: {
      id: '',
      name: '',
      email: '',
      address: '',
      taxId: ''
    },
    amount: 0,
    currency: 'USD',
    dueDate: '',
    paymentMethod: null,
    items: [
      {
        description: '',
        quantity: 1,
        unitPrice: 0,
        amount: 0
      }
    ],
    subtotal: 0,
    tax: {
      rate: 0,
      amount: 0
    },
    total: 0,
    notes: ''
  });
  
  // Mock customer data for dropdown
  const customers = [
    {
      id: 'CUST-001',
      name: 'Acme Corporation',
      email: 'billing@acmecorp.com',
      address: '123 Business Ave, Suite 100, San Francisco, CA 94107',
      taxId: 'US-TAX-123456'
    },
    {
      id: 'CUST-002',
      name: 'TechStart Inc.',
      email: 'accounts@techstart.io',
      address: '456 Innovation Blvd, Austin, TX 78701',
      taxId: 'US-TAX-789012'
    },
    {
      id: 'CUST-003',
      name: 'Global Solutions Ltd.',
      email: 'finance@globalsolutions.co.uk',
      address: '10 Regent Street, London, UK SW1Y 4PP',
      taxId: 'GB-VAT-123456789'
    }
  ];
  
  // Currency options
  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' }
  ];
  
  // Tax rate options
  const taxRates = [
    { rate: 0, label: 'No Tax (0%)' },
    { rate: 0.05, label: 'GST/HST (5%)' },
    { rate: 0.07, label: 'Sales Tax (7%)' },
    { rate: 0.1, label: 'VAT (10%)' },
    { rate: 0.18, label: 'GST (18%)' },
    { rate: 0.2, label: 'VAT (20%)' }
  ];
  
  // Handle customer selection
  const handleCustomerSelect = (customerId) => {
    const selectedCustomer = customers?.find(c => c?.id === customerId);
    if (selectedCustomer) {
      setFormData(prev => ({
        ...prev,
        customer: selectedCustomer
      }));
    }
  };
  
  // Handle item change
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData?.items];
    
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
    
    // Update form data with new items
    setFormData(prev => {
      const newData = { ...prev, items: updatedItems };
      
      // Recalculate subtotal, tax, and total
      const subtotal = updatedItems?.reduce((sum, item) => sum + item?.amount, 0);
      const taxAmount = subtotal * prev?.tax?.rate;
      
      newData.subtotal = subtotal;
      newData.amount = subtotal;
      newData.tax = {
        rate: prev?.tax?.rate,
        amount: taxAmount
      };
      newData.total = subtotal + taxAmount;
      
      return newData;
    });
  };
  
  // Add new item
  const handleAddItem = () => {
    setFormData(prev => ({
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
    if (formData?.items?.length === 1) {
      return; // Keep at least one item
    }
    
    const updatedItems = formData?.items?.filter((_, i) => i !== index);
    
    setFormData(prev => {
      const newData = { ...prev, items: updatedItems };
      
      // Recalculate subtotal, tax, and total
      const subtotal = updatedItems?.reduce((sum, item) => sum + item?.amount, 0);
      const taxAmount = subtotal * prev?.tax?.rate;
      
      newData.subtotal = subtotal;
      newData.amount = subtotal;
      newData.tax = {
        rate: prev?.tax?.rate,
        amount: taxAmount
      };
      newData.total = subtotal + taxAmount;
      
      return newData;
    });
  };
  
  // Handle tax rate change
  const handleTaxRateChange = (rate) => {
    const taxRate = parseFloat(rate);
    const taxAmount = formData?.subtotal * taxRate;
    
    setFormData(prev => ({
      ...prev,
      tax: {
        rate: taxRate,
        amount: taxAmount
      },
      total: prev?.subtotal + taxAmount
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e?.preventDefault();
    onSubmit(formData);
  };
  
  // Calculate due date (default to 14 days from now)
  const getDefaultDueDate = () => {
    const date = new Date();
    date?.setDate(date?.getDate() + 14);
    return date?.toISOString()?.split('T')?.[0];
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        {/* Customer Selection */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Customer</label>
          <select
            value={formData?.customer?.id}
            onChange={(e) => handleCustomerSelect(e?.target?.value)}
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
        
        {/* Customer Details (if selected) */}
        {formData?.customer?.id && (
          <div className="bg-surface-hover rounded-lg border border-border-light p-4">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-primary-50 rounded-full flex items-center justify-center text-primary font-medium mr-3">
                {formData?.customer?.name?.charAt(0)}
              </div>
              <div>
                <div className="text-text-primary font-medium">{formData?.customer?.name}</div>
                <div className="text-text-secondary text-sm">{formData?.customer?.email}</div>
                <div className="text-text-secondary text-sm mt-1">{formData?.customer?.address}</div>
                <div className="text-text-secondary text-sm">Tax ID: {formData?.customer?.taxId}</div>
              </div>
            </div>
          </div>
        )}
        
        {/* Invoice Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Currency</label>
            <select
              value={formData?.currency}
              onChange={(e) => setFormData(prev => ({ ...prev, currency: e?.target?.value }))}
              className="block w-full px-3 py-2 border border-border-light rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {currencies?.map((currency) => (
                <option key={currency?.code} value={currency?.code}>
                  {currency?.code} ({currency?.symbol}) - {currency?.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Due Date</label>
            <input
              type="date"
              value={formData?.dueDate || getDefaultDueDate()}
              onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e?.target?.value }))}
              className="block w-full px-3 py-2 border border-border-light rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Tax Rate</label>
            <select
              value={formData?.tax?.rate}
              onChange={(e) => handleTaxRateChange(e?.target?.value)}
              className="block w-full px-3 py-2 border border-border-light rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {taxRates?.map((tax) => (
                <option key={tax?.rate} value={tax?.rate}>
                  {tax?.label}
                </option>
              ))}
            </select>
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
                {formData?.items?.map((item, index) => (
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
                          <span className="text-secondary-400 text-sm">
                            {currencies?.find(c => c?.code === formData?.currency)?.symbol}
                          </span>
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
                      {currencies?.find(c => c?.code === formData?.currency)?.symbol}
                      {item?.amount?.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="text-secondary-500 hover:text-error transition-colors duration-200"
                        disabled={formData?.items?.length === 1}
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
        
        {/* Invoice Summary */}
        <div className="flex justify-end">
          <div className="w-full md:w-64">
            <div className="flex justify-between py-2">
              <span className="text-text-secondary">Subtotal</span>
              <span className="text-text-primary font-medium">
                {currencies?.find(c => c?.code === formData?.currency)?.symbol}
                {formData?.subtotal?.toFixed(2)}
              </span>
            </div>
            
            <div className="flex justify-between py-2">
              <span className="text-text-secondary">
                Tax ({(formData?.tax?.rate * 100)?.toFixed(1)}%)
              </span>
              <span className="text-text-primary font-medium">
                {currencies?.find(c => c?.code === formData?.currency)?.symbol}
                {formData?.tax?.amount?.toFixed(2)}
              </span>
            </div>
            
            <div className="flex justify-between py-2 border-t border-border-light">
              <span className="text-text-primary font-medium">Total</span>
              <span className="text-text-primary font-bold">
                {currencies?.find(c => c?.code === formData?.currency)?.symbol}
                {formData?.total?.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
        
        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Notes</label>
          <textarea
            value={formData?.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e?.target?.value }))}
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
            Generate Invoice
          </button>
        </div>
      </div>
    </form>
  );
};

export default InvoiceGenerationForm;