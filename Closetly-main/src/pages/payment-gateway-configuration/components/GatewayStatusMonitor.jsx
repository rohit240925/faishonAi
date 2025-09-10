// src/pages/payment-gateway-configuration/components/GatewayStatusMonitor.jsx
import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const GatewayStatusMonitor = ({ gatewayStatus }) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [showErrorLogs, setShowErrorLogs] = useState(false);
  
  const timeRangeOptions = [
    { value: '1h', label: 'Last Hour' },
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' }
  ];
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return {
          bg: 'bg-success-50',
          text: 'text-success-700',
          icon: 'CheckCircle',
          dot: 'bg-success-500'
        };
      case 'warning':
        return {
          bg: 'bg-warning-50',
          text: 'text-warning-700',
          icon: 'AlertTriangle',
          dot: 'bg-warning-500'
        };
      case 'error':
        return {
          bg: 'bg-error-50',
          text: 'text-error-700',
          icon: 'XCircle',
          dot: 'bg-error-500'
        };
      default:
        return {
          bg: 'bg-secondary-50',
          text: 'text-secondary-700',
          icon: 'Minus',
          dot: 'bg-secondary-400'
        };
    }
  };
  
  const errorLogs = [
    {
      id: 1,
      gateway: 'stripe',
      timestamp: '2024-01-15T09:45:00Z',
      error: 'Card declined: insufficient_funds',
      level: 'warning'
    },
    {
      id: 2,
      gateway: 'razorpay',
      timestamp: '2024-01-15T08:30:00Z',
      error: 'Network timeout during payment processing',
      level: 'error'
    },
    {
      id: 3,
      gateway: 'stripe',
      timestamp: '2024-01-15T07:15:00Z',
      error: 'Webhook signature verification failed',
      level: 'error'
    }
  ];
  
  return (
    <div className="space-y-6">
      {/* Status Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(gatewayStatus)?.map(([gateway, status]) => {
          const statusConfig = getStatusColor(status?.status);
          
          return (
            <div key={gateway} className="bg-surface rounded-lg border border-border-light shadow-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${statusConfig?.dot} mr-2`}></div>
                  <h3 className="text-lg font-semibold text-text-primary capitalize">{gateway}</h3>
                </div>
                
                <div className={`flex items-center ${statusConfig?.bg} rounded-full px-2 py-1`}>
                  <Icon name={statusConfig?.icon} size={14} className={`mr-1 ${statusConfig?.text}`} />
                  <span className={`text-xs font-medium ${statusConfig?.text} capitalize`}>
                    {status?.status}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-secondary">Success Rate</span>
                  <span className="text-sm font-medium text-text-primary">
                    {status?.successRate}%
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-secondary">Avg Response</span>
                  <span className="text-sm font-medium text-text-primary">
                    {status?.avgResponseTime}ms
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-secondary">Errors ({selectedTimeRange})</span>
                  <span className={`text-sm font-medium ${
                    status?.errorCount > 5 ? 'text-error-600' : 'text-text-primary'
                  }`}>
                    {status?.errorCount}
                  </span>
                </div>
                
                {status?.lastError && (
                  <div className="mt-3 p-2 bg-error-50 rounded border-l-4 border-error-500">
                    <p className="text-xs text-error-700 font-medium">Last Error:</p>
                    <p className="text-xs text-error-600 mt-1">{status?.lastError}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {/* Status Monitor Controls */}
      <div className="bg-surface rounded-lg border border-border-light shadow-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-text-primary flex items-center">
            <Icon name="Activity" size={20} className="mr-2 text-secondary-500" />
            Gateway Health Monitor
          </h3>
          
          <div className="flex items-center space-x-4">
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e?.target?.value)}
              className="px-3 py-2 border border-border-light rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {timeRangeOptions?.map((option) => (
                <option key={option?.value} value={option?.value}>
                  {option?.label}
                </option>
              ))}
            </select>
            
            <button
              onClick={() => setShowErrorLogs(!showErrorLogs)}
              className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                showErrorLogs
                  ? 'bg-primary text-white' :'bg-secondary-50 text-text-secondary hover:bg-secondary-100'
              }`}
            >
              <Icon name="AlertCircle" size={16} className="mr-2" />
              Error Logs
            </button>
          </div>
        </div>
        
        {/* Real-time Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-secondary-50 rounded-lg">
            <div className="text-2xl font-bold text-text-primary mb-1">98.2%</div>
            <div className="text-sm text-text-secondary">Overall Uptime</div>
          </div>
          
          <div className="text-center p-4 bg-secondary-50 rounded-lg">
            <div className="text-2xl font-bold text-text-primary mb-1">267ms</div>
            <div className="text-sm text-text-secondary">Avg Response Time</div>
          </div>
          
          <div className="text-center p-4 bg-secondary-50 rounded-lg">
            <div className="text-2xl font-bold text-text-primary mb-1">1,247</div>
            <div className="text-sm text-text-secondary">Transactions</div>
          </div>
          
          <div className="text-center p-4 bg-secondary-50 rounded-lg">
            <div className="text-2xl font-bold text-error-600 mb-1">7</div>
            <div className="text-sm text-text-secondary">Total Errors</div>
          </div>
        </div>
        
        {/* Error Logs */}
        {showErrorLogs && (
          <div className="border-t border-border-light pt-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base font-medium text-text-primary">Recent Error Logs</h4>
              <div className="flex items-center space-x-2">
                <button className="text-sm text-primary hover:text-primary-700 transition-colors duration-200">
                  <Icon name="Download" size={16} className="mr-1 inline" />
                  Export
                </button>
                <button className="text-sm text-secondary-600 hover:text-text-primary transition-colors duration-200">
                  <Icon name="Filter" size={16} className="mr-1 inline" />
                  Filter
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              {errorLogs?.map((log) => (
                <div key={log?.id} className="flex items-start justify-between p-3 bg-secondary-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <span className="text-sm font-medium text-text-primary capitalize mr-2">
                        {log?.gateway}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        log?.level === 'error' ?'bg-error-50 text-error-700' :'bg-warning-50 text-warning-700'
                      }`}>
                        {log?.level}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary mb-1">{log?.error}</p>
                    <p className="text-xs text-text-tertiary">
                      {new Date(log.timestamp)?.toLocaleString()}
                    </p>
                  </div>
                  
                  <button className="ml-4 p-1 text-secondary-500 hover:text-text-primary transition-colors duration-200">
                    <Icon name="ExternalLink" size={16} />
                  </button>
                </div>
              ))}
            </div>
            
            {errorLogs?.length === 0 && (
              <div className="text-center py-8">
                <Icon name="CheckCircle" size={32} className="text-success-500 mx-auto mb-2" />
                <p className="text-text-secondary">No errors found in the selected time range</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GatewayStatusMonitor;