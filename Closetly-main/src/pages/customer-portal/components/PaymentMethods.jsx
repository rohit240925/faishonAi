// src/pages/customer-portal/components/PaymentMethods.jsx
import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const PaymentMethods = ({ paymentMethods, onAdd, onRemove }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(null);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvc: '',
    name: '',
    isDefault: false
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const getBrandIcon = (brand) => {
    switch (brand?.toLowerCase()) {
      case 'visa':
        return 'CreditCard';
      case 'mastercard':
        return 'CreditCard';
      case 'amex':
        return 'CreditCard';
      default:
        return 'CreditCard';
    }
  };

  const getBrandColor = (brand) => {
    switch (brand?.toLowerCase()) {
      case 'visa':
        return 'text-blue-600';
      case 'mastercard':
        return 'text-red-600';
      case 'amex':
        return 'text-green-600';
      default:
        return 'text-secondary-600';
    }
  };

  const formatCardNumber = (value) => {
    // Remove all non-digit characters
    const v = value?.replace(/\s+/g, '')?.replace(/[^0-9]/gi, '');
    // Add spaces every 4 digits
    const matches = v?.match(/\d{4,16}/g);
    const match = matches && matches?.[0] || '';
    const parts = [];
    for (let i = 0, len = match?.length; i < len; i += 4) {
      parts?.push(match?.substring(i, i + 4));
    }
    if (parts?.length) {
      return parts?.join(' ');
    } else {
      return v;
    }
  };

  const handleInputChange = (field, value) => {
    if (field === 'cardNumber') {
      value = formatCardNumber(value);
    }
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddPaymentMethod = async () => {
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      onAdd({
        ...formData,
        cardNumber: formData?.cardNumber?.replace(/\s/g, ''),
        last4: formData?.cardNumber?.slice(-4),
        brand: 'visa' // In real implementation, this would be detected
      });
      
      setFormData({
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        cvc: '',
        name: '',
        isDefault: false
      });
      setShowAddForm(false);
      setIsProcessing(false);
    }, 2000);
  };

  const handleRemovePaymentMethod = (paymentMethodId) => {
    onRemove(paymentMethodId);
    setShowRemoveConfirm(null);
  };

  const isFormValid = () => {
    return formData?.cardNumber?.replace(/\s/g, '')?.length >= 13 &&
           formData?.expiryMonth &&
           formData?.expiryYear &&
           formData?.cvc?.length >= 3 &&
           formData?.name?.trim();
  };

  const currentYear = new Date()?.getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);
  const months = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    return { value: month?.toString()?.padStart(2, '0'), label: month?.toString()?.padStart(2, '0') };
  });

  return (
    <div className="bg-surface rounded-lg shadow-card border border-border-light p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-text-primary">Payment Methods</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium"
        >
          <Icon name="Plus" size={16} className="mr-2" />
          Add Card
        </button>
      </div>
      {/* Payment Methods List */}
      <div className="space-y-4 mb-6">
        {paymentMethods?.map((method) => (
          <div
            key={method?.id}
            className={`border rounded-lg p-4 ${
              method?.isDefault
                ? 'border-primary bg-primary-50' :'border-border-light hover:bg-surface-hover'
            } transition-colors`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Icon
                  name={getBrandIcon(method?.brand)}
                  size={24}
                  className={getBrandColor(method?.brand)}
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-text-primary capitalize">
                      {method?.brand}
                    </span>
                    <span className="text-text-secondary">•••• {method?.last4}</span>
                    {method?.isDefault && (
                      <span className="text-xs bg-primary text-white px-2 py-1 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-text-secondary">
                    Expires {method?.expiryMonth}/{method?.expiryYear}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {!method?.isDefault && (
                  <button
                    onClick={() => console.log('Set as default:', method?.id)}
                    className="text-sm text-primary hover:text-primary-600 font-medium"
                  >
                    Set Default
                  </button>
                )}
                <button
                  onClick={() => setShowRemoveConfirm(method?.id)}
                  className="p-1 text-error hover:bg-error-50 rounded transition-colors"
                  disabled={method?.isDefault && paymentMethods?.length === 1}
                >
                  <Icon name="Trash2" size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {paymentMethods?.length === 0 && (
        <div className="text-center py-8">
          <Icon name="CreditCard" size={48} className="text-secondary-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">No payment methods</h3>
          <p className="text-text-secondary">Add a payment method to manage your subscription.</p>
        </div>
      )}
      {/* Add Payment Method Form */}
      {showAddForm && (
        <div className="border-t border-border-light pt-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Add Payment Method</h3>
          
          <div className="grid grid-cols-1 gap-4">
            {/* Card Number */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Card Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData?.cardNumber}
                  onChange={(e) => handleInputChange('cardNumber', e?.target?.value)}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className="w-full border border-border-light rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <Icon name="CreditCard" size={20} className="absolute right-3 top-2.5 text-secondary-400" />
              </div>
            </div>

            {/* Expiry and CVC */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Month
                </label>
                <select
                  value={formData?.expiryMonth}
                  onChange={(e) => handleInputChange('expiryMonth', e?.target?.value)}
                  className="w-full border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">MM</option>
                  {months?.map((month) => (
                    <option key={month?.value} value={month?.value}>
                      {month?.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Year
                </label>
                <select
                  value={formData?.expiryYear}
                  onChange={(e) => handleInputChange('expiryYear', e?.target?.value)}
                  className="w-full border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">YYYY</option>
                  {years?.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  CVC
                </label>
                <input
                  type="text"
                  value={formData?.cvc}
                  onChange={(e) => handleInputChange('cvc', e?.target?.value?.replace(/\D/g, ''))}
                  placeholder="123"
                  maxLength={4}
                  className="w-full border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            {/* Cardholder Name */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Cardholder Name
              </label>
              <input
                type="text"
                value={formData?.name}
                onChange={(e) => handleInputChange('name', e?.target?.value)}
                placeholder="John Doe"
                className="w-full border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Set as Default */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="setDefault"
                checked={formData?.isDefault}
                onChange={(e) => handleInputChange('isDefault', e?.target?.checked)}
                className="rounded border-border-light text-primary focus:ring-primary"
              />
              <label htmlFor="setDefault" className="text-sm text-text-secondary">
                Set as default payment method
              </label>
            </div>

            {/* Form Actions */}
            <div className="flex space-x-3 pt-4">
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 px-4 py-2 border border-border-light text-text-secondary rounded-lg hover:bg-surface-hover transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPaymentMethod}
                disabled={!isFormValid() || isProcessing}
                className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Icon name="Shield" size={16} className="mr-2" />
                    Add Card
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Remove Confirmation Modal */}
      {showRemoveConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-lg shadow-modal max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <Icon name="AlertTriangle" size={24} className="text-warning mr-3" />
              <h3 className="text-lg font-semibold text-text-primary">Remove Payment Method</h3>
            </div>
            <p className="text-text-secondary mb-6">
              Are you sure you want to remove this payment method? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowRemoveConfirm(null)}
                className="flex-1 px-4 py-2 border border-border-light text-text-secondary rounded-lg hover:bg-surface-hover transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRemovePaymentMethod(showRemoveConfirm)}
                className="flex-1 px-4 py-2 bg-error text-white rounded-lg hover:bg-error-600 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethods;