// src/pages/payment-gateway-configuration/components/PriorityOrderManager.jsx
import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const PriorityOrderManager = ({ gatewayPriority, onPriorityChange }) => {
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  
  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
  };
  
  const handleDragOver = (e, index) => {
    e?.preventDefault();
    setDragOverIndex(index);
  };
  
  const handleDragLeave = () => {
    setDragOverIndex(null);
  };
  
  const handleDrop = (e, dropIndex) => {
    e?.preventDefault();
    
    if (draggedItem === null || draggedItem === dropIndex) {
      setDraggedItem(null);
      setDragOverIndex(null);
      return;
    }
    
    const newPriority = [...gatewayPriority];
    const draggedGateway = newPriority?.[draggedItem];
    
    // Remove dragged item
    newPriority?.splice(draggedItem, 1);
    
    // Insert at new position
    newPriority?.splice(dropIndex, 0, draggedGateway);
    
    onPriorityChange(newPriority);
    setDraggedItem(null);
    setDragOverIndex(null);
  };
  
  const handleToggleEnabled = (index) => {
    const newPriority = gatewayPriority?.map((gateway, i) => 
      i === index ? { ...gateway, enabled: !gateway?.enabled } : gateway
    );
    onPriorityChange(newPriority);
  };
  
  const moveUp = (index) => {
    if (index === 0) return;
    
    const newPriority = [...gatewayPriority];
    [newPriority[index], newPriority[index - 1]] = [newPriority?.[index - 1], newPriority?.[index]];
    onPriorityChange(newPriority);
  };
  
  const moveDown = (index) => {
    if (index === gatewayPriority?.length - 1) return;
    
    const newPriority = [...gatewayPriority];
    [newPriority[index], newPriority[index + 1]] = [newPriority?.[index + 1], newPriority?.[index]];
    onPriorityChange(newPriority);
  };
  
  const getGatewayIcon = (gatewayId) => {
    switch (gatewayId) {
      case 'stripe':
        return 'CreditCard';
      case 'razorpay':
        return 'IndianRupee';
      case 'paddle':
        return 'Waves';
      default:
        return 'Settings';
    }
  };
  
  return (
    <div className="bg-surface rounded-lg border border-border-light shadow-card p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-6 flex items-center">
        <Icon name="ArrowUpDown" size={20} className="mr-2 text-secondary-500" />
        Gateway Priority
      </h3>
      <div className="mb-4 p-3 bg-accent-50 border border-accent-200 rounded-lg">
        <div className="flex items-start">
          <Icon name="Info" size={16} className="text-accent-600 mr-2 mt-0.5" />
          <div className="text-xs text-accent-700">
            <p className="font-medium mb-1">Fallback Routing</p>
            <p>When a payment fails with the primary gateway, the system will automatically try the next enabled gateway in order.</p>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        {gatewayPriority?.map((gateway, index) => (
          <div
            key={gateway?.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            className={`relative flex items-center justify-between p-4 border border-border-light rounded-lg transition-all duration-200 cursor-move ${
              draggedItem === index ? 'opacity-50 transform scale-95' : ''
            } ${
              dragOverIndex === index ? 'border-primary bg-primary-50' : 'hover:bg-surface-hover'
            } ${
              !gateway?.enabled ? 'opacity-60' : ''
            }`}
          >
            {/* Priority Indicator */}
            <div className="flex items-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 ${
                index === 0 && gateway?.enabled
                  ? 'bg-primary text-white' :'bg-secondary-200 text-secondary-600'
              }`}>
                {index + 1}
              </div>
              
              <div className="flex items-center">
                <Icon name={getGatewayIcon(gateway?.id)} size={18} className="mr-2 text-secondary-500" />
                <div>
                  <span className="text-sm font-medium text-text-primary">{gateway?.name}</span>
                  {index === 0 && gateway?.enabled && (
                    <span className="ml-2 px-2 py-0.5 bg-primary-50 text-primary text-xs rounded-full font-medium">
                      Primary
                    </span>
                  )}
                  {!gateway?.enabled && (
                    <span className="ml-2 px-2 py-0.5 bg-secondary-100 text-secondary-600 text-xs rounded-full font-medium">
                      Disabled
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Controls */}
            <div className="flex items-center space-x-2">
              {/* Enable/Disable Toggle */}
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={gateway?.enabled}
                  onChange={() => handleToggleEnabled(index)}
                  className="rounded border-border-medium text-primary focus:ring-primary mr-2"
                />
                <span className="text-xs text-text-secondary">Enabled</span>
              </label>
              
              {/* Mobile: Up/Down buttons */}
              <div className="flex md:hidden items-center space-x-1">
                <button
                  onClick={() => moveUp(index)}
                  disabled={index === 0}
                  className="p-1 text-secondary-500 hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200"
                  title="Move up"
                >
                  <Icon name="ChevronUp" size={16} />
                </button>
                <button
                  onClick={() => moveDown(index)}
                  disabled={index === gatewayPriority?.length - 1}
                  className="p-1 text-secondary-500 hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200"
                  title="Move down"
                >
                  <Icon name="ChevronDown" size={16} />
                </button>
              </div>
              
              {/* Desktop: Drag handle */}
              <div className="hidden md:flex items-center">
                <Icon name="GripVertical" size={16} className="text-secondary-400" />
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Gateway Stats */}
      <div className="mt-6 pt-6 border-t border-border-light">
        <h4 className="text-sm font-medium text-text-primary mb-3">Routing Statistics</h4>
        
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-text-secondary">Primary Gateway Success:</span>
            <span className="text-text-primary font-medium">94.2%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Fallback Activations:</span>
            <span className="text-text-primary font-medium">127 (24h)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Recovery Rate:</span>
            <span className="text-success-600 font-medium">98.7%</span>
          </div>
        </div>
      </div>
      {/* Usage Instructions */}
      <details className="mt-4">
        <summary className="cursor-pointer text-xs text-primary hover:text-primary-700 transition-colors duration-200 flex items-center">
          <Icon name="HelpCircle" size={14} className="mr-1" />
          How does gateway routing work?
        </summary>
        <div className="mt-2 p-3 bg-secondary-50 rounded text-xs text-text-secondary leading-relaxed">
          <p className="mb-2">
            <strong>Priority Order:</strong> Payments are attempted starting from the top gateway.
          </p>
          <p className="mb-2">
            <strong>Automatic Fallback:</strong> If a payment fails due to gateway issues (not customer-related), the system automatically tries the next enabled gateway.
          </p>
          <p>
            <strong>Smart Routing:</strong> The system learns from failures and may temporarily adjust routing for optimal success rates.
          </p>
        </div>
      </details>
    </div>
  );
};

export default PriorityOrderManager;