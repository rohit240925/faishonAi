// src/pages/billing-dashboard/components/MetricsCard.jsx
import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricsCard = ({ 
  title, 
  value, 
  change, 
  icon, 
  trend = 'up', 
  isInverted = false 
}) => {
  const getChangeColor = () => {
    if (change === 0) return 'text-secondary-500';
    
    if (isInverted) {
      return change > 0 ? 'text-error-600' : 'text-success-600';
    } else {
      return change > 0 ? 'text-success-600' : 'text-error-600';
    }
  };

  const getChangeIcon = () => {
    if (change === 0) return 'Minus';
    
    if (isInverted) {
      return change > 0 ? 'TrendingDown' : 'TrendingUp';
    } else {
      return change > 0 ? 'TrendingUp' : 'TrendingDown';
    }
  };

  const formatChange = (value) => {
    const sign = value > 0 ? '+' : '';
    return `${sign}${value?.toFixed(1)}%`;
  };

  return (
    <div className="bg-surface rounded-lg shadow-card border border-border-light p-6 hover:shadow-medium transition-shadow duration-200">
      <div className="flex items-center justify-between mb-6">
        <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
          <Icon name={icon} size={24} className="text-primary" />
        </div>
        <div className={`flex items-center space-x-1 ${getChangeColor()}`}>
          <Icon name={getChangeIcon()} size={16} />
          <span className="text-sm font-medium">{formatChange(change)}</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-text-secondary">{title}</h3>
        <p className="text-2xl font-bold text-text-primary">{value}</p>
      </div>
    </div>
  );
};

export default MetricsCard;