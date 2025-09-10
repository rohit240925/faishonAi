// src/pages/customer-portal/components/MobileHeader.jsx
import React from 'react';
import Icon from '../../../components/AppIcon';

const MobileHeader = ({ customer, onSupportClick }) => {
  const getInitials = (name) => {
    return name
      ?.split(' ')
      ?.map(word => word?.[0])
      ?.join('')
      ?.toUpperCase() || 'U';
  };

  return (
    <header className="lg:hidden bg-surface border-b border-border-light sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo/Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Icon name="Zap" size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-text-primary">Portal</h1>
          </div>
        </div>

        {/* User Avatar & Support */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onSupportClick}
            className="p-2 text-text-secondary hover:text-primary hover:bg-surface-hover rounded-lg transition-colors"
            aria-label="Support"
          >
            <Icon name="MessageCircle" size={20} />
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {getInitials(customer?.name)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;