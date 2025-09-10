// src/pages/subscription-management/components/CreateSubscriptionForm.jsx
import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const CreateSubscriptionForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    customer: {
      name: '',
      email: '',
      address: '',
      taxId: ''
    },
    plan: {
      id: '',
      name: '',
      type: '',
      price: 0,
      currency: 'USD',
      billingFrequency: 'monthly'
    },
    trial: {
      isTrialActive: false,
      trialEndDate: ''
    },
    paymentMethod: {
      type: 'credit_card',
      last4: '',
      brand: '',
      expiryDate: '',
      bankName: ''
    },
    metadata: {
      source: 'direct_signup',
      salesRep: ''
    }
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Available plans
  const availablePlans = [
    {
      id: 'plan_basic',
      name: 'Basic',
      type: 'basic',
      price: 19.99,
      credits: 100,
      currency: 'USD',
      features: ['100 credits/month', 'Email support', 'Basic analytics']
    },
    {
      id: 'plan_pro',
      name: 'Pro',
      type: 'pro',
      price: 29.99,
      credits: 250,
      currency: 'USD',
      features: ['250 credits/month', 'Priority support', 'Advanced analytics']
    },
    {
      id: 'plan_max',
      name: 'Max',
      type: 'max',
      price: 59.99,
      credits: 500,
      currency: 'USD',
      features: ['500 credits/month', 'Dedicated support', 'Full analytics suite']
    }
  ];

  // Top-up option
  const topUpOption = {
    id: 'topup_100',
    name: 'Credit Top-Up',
    price: 19.99,
    credits: 100,
    currency: 'USD',
    features: ['100 additional credits']
  };

  // Handle input changes
  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev?.[section],
        [field]: value
      }
    }));
    
    // Clear error when user starts typing
    if (errors?.[`${section}.${field}`]) {
      setErrors(prev => ({
        ...prev,
        [`${section}.${field}`]: ''
      }));
    }
  };

  // Handle plan selection
  const handlePlanSelect = (plan) => {
    setFormData(prev => ({
      ...prev,
      plan: {
        ...plan,
        billingFrequency: prev?.plan?.billingFrequency
      }
    }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Customer validation
    if (!formData?.customer?.name) newErrors['customer.name'] = 'Customer name is required';
    if (!formData?.customer?.email) newErrors['customer.email'] = 'Email is required';
    if (formData?.customer?.email && !/\S+@\S+\.\S+/?.test(formData?.customer?.email)) {
      newErrors['customer.email'] = 'Invalid email format';
    }

    // Plan validation
    if (!formData?.plan?.id) newErrors['plan.id'] = 'Please select a plan';

    // Trial validation
    if (formData?.trial?.isTrialActive && !formData?.trial?.trialEndDate) {
      newErrors['trial.trialEndDate'] = 'Trial end date is required';
    }

    // Payment method validation
    if (formData?.paymentMethod?.type === 'credit_card') {
      if (!formData?.paymentMethod?.last4) newErrors['paymentMethod.last4'] = 'Card number is required';
      if (!formData?.paymentMethod?.brand) newErrors['paymentMethod.brand'] = 'Card brand is required';
      if (!formData?.paymentMethod?.expiryDate) newErrors['paymentMethod.expiryDate'] = 'Expiry date is required';
    } else if (formData?.paymentMethod?.type === 'bank_transfer') {
      if (!formData?.paymentMethod?.bankName) newErrors['paymentMethod.bankName'] = 'Bank name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Calculate MRR based on billing frequency
      const mrr = formData?.plan?.billingFrequency === 'monthly' ? formData?.plan?.price :
                  formData?.plan?.billingFrequency === 'quarterly' ? formData?.plan?.price / 3 :
                  formData?.plan?.price / 12;

      // Set next billing date
      const nextBillingDate = new Date();
      if (formData?.trial?.isTrialActive) {
        nextBillingDate?.setTime(new Date(formData.trial.trialEndDate)?.getTime());
      } else {
        if (formData?.plan?.billingFrequency === 'monthly') {
          nextBillingDate?.setMonth(nextBillingDate?.getMonth() + 1);
        } else if (formData?.plan?.billingFrequency === 'quarterly') {
          nextBillingDate?.setMonth(nextBillingDate?.getMonth() + 3);
        } else {
          nextBillingDate?.setFullYear(nextBillingDate?.getFullYear() + 1);
        }
      }

      // Set renewal date (1 year from now)
      const renewalDate = new Date();
      renewalDate?.setFullYear(renewalDate?.getFullYear() + 1);

      const subscriptionData = {
        ...formData,
        mrr: formData?.trial?.isTrialActive ? 0 : mrr,
        nextBillingDate: nextBillingDate?.toISOString()?.split('T')?.[0],
        renewalDate: renewalDate?.toISOString()?.split('T')?.[0]
      };

      await onSubmit(subscriptionData);
    } catch (error) {
      console.error('Error creating subscription:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle next step
  const handleNextStep = () => {
    if (currentStep === 1) {
      // Validate customer info
      const customerErrors = {};
      if (!formData?.customer?.name) customerErrors['customer.name'] = 'Customer name is required';
      if (!formData?.customer?.email) customerErrors['customer.email'] = 'Email is required';
      if (formData?.customer?.email && !/\S+@\S+\.\S+/?.test(formData?.customer?.email)) {
        customerErrors['customer.email'] = 'Invalid email format';
      }
      
      if (Object.keys(customerErrors)?.length > 0) {
        setErrors(customerErrors);
        return;
      }
    } else if (currentStep === 2) {
      // Validate plan selection
      if (!formData?.plan?.id) {
        setErrors({ 'plan.id': 'Please select a plan' });
        return;
      }
    }
    
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const steps = [
    { number: 1, title: 'Customer Info', icon: 'User' },
    { number: 2, title: 'Plan Selection', icon: 'Package' },
    { number: 3, title: 'Trial & Billing', icon: 'Calendar' },
    { number: 4, title: 'Payment Method', icon: 'CreditCard' }
  ];

  return (
    <div className="max-h-[80vh] overflow-hidden flex flex-col">
      {/* Progress Steps */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          {steps?.map((step, index) => (
            <div key={step?.number} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                currentStep >= step?.number
                  ? 'bg-primary border-primary text-white' :'border-border-medium text-text-tertiary'
              }`}>
                {currentStep > step?.number ? (
                  <Icon name="Check" size={16} />
                ) : (
                  <Icon name={step?.icon} size={16} />
                )}
              </div>
              <div className="ml-2">
                <p className={`text-sm font-medium ${
                  currentStep >= step?.number ? 'text-text-primary' : 'text-text-tertiary'
                }`}>
                  {step?.title}
                </p>
              </div>
              {index < steps?.length - 1 && (
                <div className={`w-16 h-0.5 mx-4 ${
                  currentStep > step?.number ? 'bg-primary' : 'bg-border-light'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Form Content */}
      <div className="flex-1 overflow-y-auto">
        <form onSubmit={handleSubmit}>
          {/* Step 1: Customer Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-text-primary mb-4">Customer Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    value={formData?.customer?.name}
                    onChange={(e) => handleInputChange('customer', 'name', e?.target?.value)}
                    className={`block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm ${
                      errors?.['customer.name'] ? 'border-error' : 'border-border-light'
                    }`}
                    placeholder="Enter customer name"
                  />
                  {errors?.['customer.name'] && (
                    <p className="text-xs text-error mt-1">{errors?.['customer.name']}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData?.customer?.email}
                    onChange={(e) => handleInputChange('customer', 'email', e?.target?.value)}
                    className={`block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm ${
                      errors?.['customer.email'] ? 'border-error' : 'border-border-light'
                    }`}
                    placeholder="customer@company.com"
                  />
                  {errors?.['customer.email'] && (
                    <p className="text-xs text-error mt-1">{errors?.['customer.email']}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Address
                </label>
                <textarea
                  value={formData?.customer?.address}
                  onChange={(e) => handleInputChange('customer', 'address', e?.target?.value)}
                  rows={3}
                  className="block w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  placeholder="Enter customer address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Tax ID
                </label>
                <input
                  type="text"
                  value={formData?.customer?.taxId}
                  onChange={(e) => handleInputChange('customer', 'taxId', e?.target?.value)}
                  className="block w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  placeholder="Enter tax ID (optional)"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Sales Representative
                </label>
                <input
                  type="text"
                  value={formData?.metadata?.salesRep}
                  onChange={(e) => handleInputChange('metadata', 'salesRep', e?.target?.value)}
                  className="block w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  placeholder="Enter sales rep name (optional)"
                />
              </div>
            </div>
          )}

          {/* Step 2: Plan Selection */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-text-primary mb-4">Select Plan</h3>
              
              {errors?.['plan.id'] && (
                <div className="bg-error-50 border border-error-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-error-700">{errors?.['plan.id']}</p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availablePlans?.map((plan) => (
                  <div
                    key={plan?.id}
                    onClick={() => handlePlanSelect(plan)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                      formData?.plan?.id === plan?.id
                        ? 'border-primary bg-primary-50' :'border-border-light hover:border-primary-300 hover:bg-primary-25'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-text-primary">{plan?.name}</h4>
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        formData?.plan?.id === plan?.id
                          ? 'border-primary bg-primary' :'border-border-medium'
                      }`}>
                        {formData?.plan?.id === plan?.id && (
                          <div className="w-full h-full rounded-full bg-white scale-50"></div>
                        )}
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <span className="text-2xl font-bold text-text-primary">
                        ${plan?.price?.toFixed(2)}
                      </span>
                      <span className="text-sm text-text-secondary">/month</span>
                    </div>
                    
                    <ul className="space-y-1">
                      {plan?.features?.map((feature, index) => (
                        <li key={index} className="flex items-center text-xs text-text-secondary">
                          <Icon name="Check" size={12} className="text-success-600 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Billing Frequency
                </label>
                <select
                  value={formData?.plan?.billingFrequency}
                  onChange={(e) => handleInputChange('plan', 'billingFrequency', e?.target?.value)}
                  className="block w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annual">Annual</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 3: Trial & Billing */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-text-primary mb-4">Trial & Billing Settings</h3>
              
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="trial"
                  checked={formData?.trial?.isTrialActive}
                  onChange={(e) => handleInputChange('trial', 'isTrialActive', e?.target?.checked)}
                  className="rounded border-border-medium text-primary focus:ring-primary"
                />
                <label htmlFor="trial" className="text-sm font-medium text-text-primary">
                  Start with trial period
                </label>
              </div>
              
              {formData?.trial?.isTrialActive && (
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Trial End Date *
                  </label>
                  <input
                    type="date"
                    value={formData?.trial?.trialEndDate}
                    onChange={(e) => handleInputChange('trial', 'trialEndDate', e?.target?.value)}
                    min={new Date()?.toISOString()?.split('T')?.[0]}
                    className={`block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm ${
                      errors?.['trial.trialEndDate'] ? 'border-error' : 'border-border-light'
                    }`}
                  />
                  {errors?.['trial.trialEndDate'] && (
                    <p className="text-xs text-error mt-1">{errors?.['trial.trialEndDate']}</p>
                  )}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Source
                </label>
                <select
                  value={formData?.metadata?.source}
                  onChange={(e) => handleInputChange('metadata', 'source', e?.target?.value)}
                  className="block w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                >
                  <option value="direct_signup">Direct Signup</option>
                  <option value="marketing_campaign">Marketing Campaign</option>
                  <option value="referral">Referral</option>
                  <option value="partner_referral">Partner Referral</option>
                  <option value="enterprise_sales">Enterprise Sales</option>
                  <option value="free_trial">Free Trial</option>
                  <option value="organic">Organic</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 4: Payment Method */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-text-primary mb-4">Payment Method</h3>
              
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Payment Type
                </label>
                <select
                  value={formData?.paymentMethod?.type}
                  onChange={(e) => handleInputChange('paymentMethod', 'type', e?.target?.value)}
                  className="block w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                >
                  <option value="credit_card">Credit Card</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="sepa_debit">SEPA Debit</option>
                </select>
              </div>
              
              {formData?.paymentMethod?.type === 'credit_card' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Card Brand *
                    </label>
                    <select
                      value={formData?.paymentMethod?.brand}
                      onChange={(e) => handleInputChange('paymentMethod', 'brand', e?.target?.value)}
                      className={`block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm ${
                        errors?.['paymentMethod.brand'] ? 'border-error' : 'border-border-light'
                      }`}
                    >
                      <option value="">Select brand</option>
                      <option value="Visa">Visa</option>
                      <option value="Mastercard">Mastercard</option>
                      <option value="Amex">American Express</option>
                    </select>
                    {errors?.['paymentMethod.brand'] && (
                      <p className="text-xs text-error mt-1">{errors?.['paymentMethod.brand']}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Last 4 Digits *
                    </label>
                    <input
                      type="text"
                      value={formData?.paymentMethod?.last4}
                      onChange={(e) => handleInputChange('paymentMethod', 'last4', e?.target?.value?.slice(0, 4))}
                      className={`block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm ${
                        errors?.['paymentMethod.last4'] ? 'border-error' : 'border-border-light'
                      }`}
                      placeholder="1234"
                      maxLength={4}
                    />
                    {errors?.['paymentMethod.last4'] && (
                      <p className="text-xs text-error mt-1">{errors?.['paymentMethod.last4']}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Expiry Date *
                    </label>
                    <input
                      type="text"
                      value={formData?.paymentMethod?.expiryDate}
                      onChange={(e) => {
                        let value = e?.target?.value?.replace(/\D/g, '');
                        if (value?.length >= 2) {
                          value = value?.substring(0, 2) + '/' + value?.substring(2, 4);
                        }
                        handleInputChange('paymentMethod', 'expiryDate', value);
                      }}
                      className={`block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm ${
                        errors?.['paymentMethod.expiryDate'] ? 'border-error' : 'border-border-light'
                      }`}
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                    {errors?.['paymentMethod.expiryDate'] && (
                      <p className="text-xs text-error mt-1">{errors?.['paymentMethod.expiryDate']}</p>
                    )}
                  </div>
                </div>
              )}
              
              {formData?.paymentMethod?.type === 'bank_transfer' && (
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Bank Name *
                  </label>
                  <input
                    type="text"
                    value={formData?.paymentMethod?.bankName}
                    onChange={(e) => handleInputChange('paymentMethod', 'bankName', e?.target?.value)}
                    className={`block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm ${
                      errors?.['paymentMethod.bankName'] ? 'border-error' : 'border-border-light'
                    }`}
                    placeholder="Enter bank name"
                  />
                  {errors?.['paymentMethod.bankName'] && (
                    <p className="text-xs text-error mt-1">{errors?.['paymentMethod.bankName']}</p>
                  )}
                </div>
              )}
              
              {formData?.paymentMethod?.type === 'sepa_debit' && (
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Bank Name *
                  </label>
                  <input
                    type="text"
                    value={formData?.paymentMethod?.bankName}
                    onChange={(e) => handleInputChange('paymentMethod', 'bankName', e?.target?.value)}
                    className={`block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm ${
                      errors?.['paymentMethod.bankName'] ? 'border-error' : 'border-border-light'
                    }`}
                    placeholder="Enter bank name"
                  />
                  {errors?.['paymentMethod.bankName'] && (
                    <p className="text-xs text-error mt-1">{errors?.['paymentMethod.bankName']}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </form>
      </div>
      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-border-light mt-6">
        <button
          type="button"
          onClick={() => currentStep === 1 ? onCancel() : setCurrentStep(prev => prev - 1)}
          className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors duration-200"
        >
          {currentStep === 1 ? 'Cancel' : 'Previous'}
        </button>
        
        <div className="flex items-center space-x-3">
          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors duration-200 flex items-center"
            >
              Next
              <Icon name="ChevronRight" size={16} className="ml-1" />
            </button>
          ) : (
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors duration-200 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Icon name="Loader" size={16} className="animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <Icon name="Check" size={16} className="mr-2" />
                  Create Subscription
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateSubscriptionForm;