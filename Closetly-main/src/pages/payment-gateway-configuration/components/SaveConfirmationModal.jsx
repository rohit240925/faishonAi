// src/pages/payment-gateway-configuration/components/SaveConfirmationModal.jsx
import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const SaveConfirmationModal = ({ isOpen, onClose, onConfirm, isSaving, configuration }) => {
  const [validationResults, setValidationResults] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      validateConfiguration();
    }
  }, [isOpen]);
  
  const validateConfiguration = async () => {
    setIsValidating(true);
    
    try {
      // Simulate validation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const enabledGateways = Object.entries(configuration)?.filter(([_, config]) => config?.isEnabled);
      
      const results = {
        isValid: true,
        warnings: [],
        errors: [],
        gateways: {}
      };
      
      enabledGateways?.forEach(([gateway, config]) => {
        const gatewayValidation = {
          apiKeys: true,
          webhook: true,
          connection: config?.isConnected,
          paymentMethods: Object.values(config?.enabledPaymentMethods || {})?.some(Boolean),
          currencies: config?.supportedCurrencies?.length > 0
        };
        
        results.gateways[gateway] = gatewayValidation;
        
        // Check for issues
        if (!config?.isConnected) {
          results?.warnings?.push(`${gateway} is enabled but not connected`);
        }
        
        if (!gatewayValidation?.paymentMethods) {
          results?.errors?.push(`${gateway} has no payment methods enabled`);
          results.isValid = false;
        }
        
        if (!gatewayValidation?.currencies) {
          results?.errors?.push(`${gateway} has no currencies configured`);
          results.isValid = false;
        }
        
        // Check for missing API keys
        const apiKeys = config?.apiKeys || {};
        const missingKeys = Object.entries(apiKeys)?.filter(([_, value]) => !value || value?.includes('****'))?.map(([key]) => key);
        
        if (missingKeys?.length > 0) {
          results?.warnings?.push(`${gateway} has incomplete API keys: ${missingKeys?.join(', ')}`);
        }
      });
      
      if (enabledGateways?.length === 0) {
        results?.errors?.push('No payment gateways are enabled');
        results.isValid = false;
      }
      
      setValidationResults(results);
    } catch (error) {
      setValidationResults({
        isValid: false,
        errors: ['Validation failed: ' + error?.message],
        warnings: [],
        gateways: {}
      });
    } finally {
      setIsValidating(false);
    }
  };
  
  const handleConfirm = () => {
    if (validationResults?.isValid || validationResults?.errors?.length === 0) {
      onConfirm();
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-1000 p-4">
      <div className="bg-surface rounded-lg shadow-modal border border-border-light max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-light">
          <h2 className="text-xl font-semibold text-text-primary flex items-center">
            <Icon name="Save" size={24} className="mr-2 text-primary" />
            Save Configuration
          </h2>
          <button
            onClick={onClose}
            disabled={isSaving}
            className="p-2 text-secondary-500 hover:text-text-primary hover:bg-surface-hover rounded-lg transition-colors duration-200 disabled:opacity-50"
          >
            <Icon name="X" size={20} />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {/* Validation Status */}
          {isValidating ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <Icon name="Loader" size={32} className="text-primary mx-auto mb-4 animate-spin" />
                <p className="text-text-secondary">Validating configuration...</p>
              </div>
            </div>
          ) : validationResults && (
            <div className="space-y-4 mb-6">
              {/* Overall Status */}
              <div className={`flex items-center p-4 rounded-lg ${
                validationResults?.isValid
                  ? 'bg-success-50 border border-success-200' :'bg-error-50 border border-error-200'
              }`}>
                <Icon 
                  name={validationResults?.isValid ? 'CheckCircle' : 'XCircle'} 
                  size={20} 
                  className={`mr-3 ${
                    validationResults?.isValid ? 'text-success-600' : 'text-error-600'
                  }`} 
                />
                <div>
                  <p className={`font-medium ${
                    validationResults?.isValid ? 'text-success-700' : 'text-error-700'
                  }`}>
                    {validationResults?.isValid 
                      ? 'Configuration is valid and ready to save' :'Configuration has errors that must be fixed'
                    }
                  </p>
                </div>
              </div>
              
              {/* Errors */}
              {validationResults?.errors?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-error-700 flex items-center">
                    <Icon name="AlertTriangle" size={16} className="mr-1" />
                    Errors ({validationResults?.errors?.length})
                  </h4>
                  <div className="space-y-1">
                    {validationResults?.errors?.map((error, index) => (
                      <div key={index} className="flex items-start text-sm text-error-600">
                        <Icon name="X" size={14} className="mr-2 mt-0.5 flex-shrink-0" />
                        {error}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Warnings */}
              {validationResults?.warnings?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-warning-700 flex items-center">
                    <Icon name="AlertTriangle" size={16} className="mr-1" />
                    Warnings ({validationResults?.warnings?.length})
                  </h4>
                  <div className="space-y-1">
                    {validationResults?.warnings?.map((warning, index) => (
                      <div key={index} className="flex items-start text-sm text-warning-600">
                        <Icon name="AlertCircle" size={14} className="mr-2 mt-0.5 flex-shrink-0" />
                        {warning}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Gateway Validation Details */}
              {Object.keys(validationResults?.gateways)?.length > 0 && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm text-primary hover:text-primary-700 transition-colors duration-200 flex items-center">
                    <Icon name="ChevronRight" size={16} className="mr-1 transform transition-transform duration-200" />
                    Gateway Validation Details
                  </summary>
                  <div className="mt-3 space-y-3">
                    {Object.entries(validationResults?.gateways)?.map(([gateway, validation]) => (
                      <div key={gateway} className="border border-border-light rounded-lg p-3">
                        <h5 className="text-sm font-medium text-text-primary mb-2 capitalize">
                          {gateway} Gateway
                        </h5>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {Object.entries(validation)?.map(([check, passed]) => (
                            <div key={check} className="flex items-center">
                              <Icon 
                                name={passed ? 'Check' : 'X'} 
                                size={12} 
                                className={`mr-1 ${
                                  passed ? 'text-success-600' : 'text-error-600'
                                }`} 
                              />
                              <span className={`capitalize ${
                                passed ? 'text-text-secondary' : 'text-error-600'
                              }`}>
                                {check?.replace(/([A-Z])/g, ' $1')?.trim()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </details>
              )}
            </div>
          )}
          
          {/* Configuration Summary */}
          <div className="bg-secondary-50 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-medium text-text-primary mb-3">Configuration Summary</h4>
            <div className="space-y-2 text-sm">
              {Object.entries(configuration)?.map(([gateway, config]) => (
                <div key={gateway} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      config?.isEnabled ? 'bg-success-500' : 'bg-secondary-300'
                    }`}></div>
                    <span className="text-text-secondary capitalize">{gateway}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-text-tertiary">
                    <span>{config?.mode}</span>
                    <span>•</span>
                    <span>{config?.supportedCurrencies?.length || 0} currencies</span>
                    <span>•</span>
                    <span>
                      {Object.values(config?.enabledPaymentMethods || {})?.filter(Boolean)?.length} methods
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Impact Warning */}
          <div className="bg-warning-50 border border-warning-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <Icon name="AlertTriangle" size={18} className="text-warning-600 mr-2 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-warning-700 mb-1">Important</p>
                <p className="text-warning-600">
                  Changes to payment gateway configuration will affect all future transactions. 
                  Existing active subscriptions and pending payments will continue using their original gateway settings.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border-light">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2 text-text-secondary hover:text-text-primary border border-border-light rounded-lg transition-colors duration-200 disabled:opacity-50"
          >
            Cancel
          </button>
          
          <button
            onClick={handleConfirm}
            disabled={isSaving || isValidating || (!validationResults?.isValid && validationResults?.errors?.length > 0)}
            className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
          >
            {isSaving ? (
              <>
                <Icon name="Loader" size={18} className="mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Icon name="Save" size={18} className="mr-2" />
                Save Configuration
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveConfirmationModal;