// src/pages/payment-gateway-configuration/components/TestingTools.jsx
import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const TestingTools = ({ activeGateway, configuration }) => {
  const [testResults, setTestResults] = useState(null);
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [selectedTestType, setSelectedTestType] = useState('connection');
  const [testAmount, setTestAmount] = useState(10.00);
  const [testCurrency, setTestCurrency] = useState('USD');
  
  const testTypes = [
    {
      id: 'connection',
      label: 'API Connection',
      description: 'Test basic API connectivity and authentication',
      icon: 'Wifi'
    },
    {
      id: 'transaction',
      label: 'Test Transaction',
      description: 'Simulate a payment transaction',
      icon: 'CreditCard'
    },
    {
      id: 'webhook',
      label: 'Webhook Validation',
      description: 'Test webhook endpoint configuration',
      icon: 'Webhook'
    },
    {
      id: 'refund',
      label: 'Refund Process',
      description: 'Test refund functionality',
      icon: 'RotateCcw'
    }
  ];
  
  const handleRunTest = async () => {
    setIsRunningTest(true);
    setTestResults(null);
    
    try {
      // Simulate API test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock test results
      const mockResults = {
        connection: {
          success: true,
          responseTime: 245,
          message: 'API connection successful',
          details: {
            endpoint: `https://api.${activeGateway}.com`,
            statusCode: 200,
            authentication: 'Valid'
          }
        },
        transaction: {
          success: Math.random() > 0.1,
          responseTime: 1240,
          message: Math.random() > 0.1 ? 'Test transaction completed successfully' : 'Transaction failed: Card declined',
          details: {
            transactionId: 'test_' + Math.random()?.toString(36)?.substr(2, 9),
            amount: testAmount,
            currency: testCurrency,
            paymentMethod: 'test_card_4242'
          }
        },
        webhook: {
          success: configuration?.[activeGateway]?.isConnected || false,
          responseTime: 156,
          message: configuration?.[activeGateway]?.isConnected 
            ? 'Webhook endpoint responding correctly' : 'Webhook endpoint validation failed',
          details: {
            endpoint: configuration?.[activeGateway]?.webhookUrl,
            lastEvent: '2024-01-15T10:30:00Z',
            eventsProcessed: 47
          }
        },
        refund: {
          success: true,
          responseTime: 890,
          message: 'Refund process test completed',
          details: {
            refundId: 'refund_' + Math.random()?.toString(36)?.substr(2, 9),
            amount: testAmount * 0.5,
            currency: testCurrency,
            status: 'succeeded'
          }
        }
      };
      
      setTestResults(mockResults?.[selectedTestType]);
    } catch (error) {
      setTestResults({
        success: false,
        message: 'Test failed: ' + error?.message,
        details: {}
      });
    } finally {
      setIsRunningTest(false);
    }
  };
  
  const isGatewayEnabled = configuration?.[activeGateway]?.isEnabled;
  
  return (
    <div className="bg-surface rounded-lg border border-border-light shadow-card p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-6 flex items-center">
        <Icon name="TestTube" size={20} className="mr-2 text-secondary-500" />
        Testing Tools
      </h3>
      {!isGatewayEnabled && (
        <div className="mb-6 p-4 bg-warning-50 border border-warning-200 rounded-lg">
          <div className="flex items-center">
            <Icon name="AlertTriangle" size={18} className="text-warning-600 mr-2" />
            <p className="text-sm text-warning-700">
              {activeGateway} gateway is disabled. Enable it to run tests.
            </p>
          </div>
        </div>
      )}
      {/* Test Type Selection */}
      <div className="space-y-3 mb-6">
        <label className="block text-sm font-medium text-text-primary">Test Type</label>
        <div className="space-y-2">
          {testTypes?.map((test) => (
            <label key={test?.id} className="flex items-start cursor-pointer">
              <input
                type="radio"
                name="testType"
                value={test?.id}
                checked={selectedTestType === test?.id}
                onChange={(e) => setSelectedTestType(e?.target?.value)}
                className="mt-1 border-border-medium text-primary focus:ring-primary mr-3"
                disabled={!isGatewayEnabled}
              />
              <div className="flex-1">
                <div className="flex items-center">
                  <Icon name={test?.icon} size={16} className="mr-2 text-secondary-500" />
                  <span className="text-sm font-medium text-text-primary">{test?.label}</span>
                </div>
                <p className="text-xs text-text-secondary mt-1">{test?.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>
      {/* Transaction Test Options */}
      {selectedTestType === 'transaction' && (
        <div className="space-y-4 mb-6 p-4 bg-secondary-50 rounded-lg">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-text-primary mb-1">Amount</label>
              <input
                type="number"
                value={testAmount}
                onChange={(e) => setTestAmount(parseFloat(e?.target?.value))}
                min="0.01"
                step="0.01"
                className="w-full px-2 py-1 text-sm border border-border-light rounded focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent"
                disabled={!isGatewayEnabled}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-primary mb-1">Currency</label>
              <select
                value={testCurrency}
                onChange={(e) => setTestCurrency(e?.target?.value)}
                className="w-full px-2 py-1 text-sm border border-border-light rounded focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent"
                disabled={!isGatewayEnabled}
              >
                {configuration?.[activeGateway]?.supportedCurrencies?.map((currency) => (
                  <option key={currency} value={currency}>{currency}</option>
                )) || <option value="USD">USD</option>}
              </select>
            </div>
          </div>
        </div>
      )}
      {/* Run Test Button */}
      <button
        onClick={handleRunTest}
        disabled={!isGatewayEnabled || isRunningTest}
        className="w-full flex items-center justify-center px-4 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 mb-6"
      >
        {isRunningTest ? (
          <>
            <Icon name="Loader" size={18} className="mr-2 animate-spin" />
            Running Test...
          </>
        ) : (
          <>
            <Icon name="Play" size={18} className="mr-2" />
            Run {testTypes?.find(t => t?.id === selectedTestType)?.label} Test
          </>
        )}
      </button>
      {/* Test Results */}
      {testResults && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-medium text-text-primary">Test Results</h4>
            <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              testResults?.success
                ? 'bg-success-50 text-success-700' : 'bg-error-50 text-error-700'
            }`}>
              <Icon 
                name={testResults?.success ? 'CheckCircle' : 'XCircle'} 
                size={14} 
                className="mr-1" 
              />
              {testResults?.success ? 'Passed' : 'Failed'}
            </div>
          </div>
          
          <div className="p-4 bg-secondary-50 rounded-lg">
            <p className="text-sm text-text-primary mb-3">{testResults?.message}</p>
            
            {testResults?.responseTime && (
              <div className="flex items-center text-xs text-text-secondary mb-2">
                <Icon name="Clock" size={14} className="mr-1" />
                Response time: {testResults?.responseTime}ms
              </div>
            )}
            
            {/* Test Details */}
            {Object.keys(testResults?.details || {})?.length > 0 && (
              <details className="mt-3">
                <summary className="cursor-pointer text-xs text-primary hover:text-primary-700 transition-colors duration-200">
                  View Details
                </summary>
                <div className="mt-2 p-2 bg-surface rounded border border-border-light">
                  {Object.entries(testResults?.details)?.map(([key, value]) => (
                    <div key={key} className="flex justify-between text-xs mb-1">
                      <span className="text-text-secondary capitalize">
                        {key?.replace(/([A-Z])/g, ' $1')?.trim()}:
                      </span>
                      <span className="text-text-primary font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </details>
            )}
          </div>
        </div>
      )}
      {/* Sandbox Environment Notice */}
      {configuration?.[activeGateway]?.mode === 'test' && (
        <div className="mt-6 p-3 bg-accent-50 border border-accent-200 rounded-lg">
          <div className="flex items-center">
            <Icon name="TestTube" size={16} className="text-accent-600 mr-2" />
            <p className="text-xs text-accent-700">
              <strong>Test Mode:</strong> All transactions will be simulated using sandbox environment.
            </p>
          </div>
        </div>
      )}
      {/* Test Cards Info */}
      {selectedTestType === 'transaction' && configuration?.[activeGateway]?.mode === 'test' && (
        <details className="mt-4">
          <summary className="cursor-pointer text-sm text-primary hover:text-primary-700 transition-colors duration-200 flex items-center">
            <Icon name="CreditCard" size={16} className="mr-1" />
            Test Card Numbers
          </summary>
          <div className="mt-2 p-3 bg-surface border border-border-light rounded text-xs">
            <div className="grid grid-cols-1 gap-2">
              <div className="flex justify-between">
                <span className="text-text-secondary">Success:</span>
                <span className="text-text-primary font-mono">4242 4242 4242 4242</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Decline:</span>
                <span className="text-text-primary font-mono">4000 0000 0000 0002</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">3D Secure:</span>
                <span className="text-text-primary font-mono">4000 0000 0000 3220</span>
              </div>
            </div>
          </div>
        </details>
      )}
    </div>
  );
};

export default TestingTools;