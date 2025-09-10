// src/pages/billing-dashboard/components/AlertBanner.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const AlertBanner = ({ alert }) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const getAlertStyles = (type) => {
    switch (type) {
      case 'error':
        return {
          container: 'bg-error-50 border-error-200',
          icon: 'text-error-600',
          title: 'text-error-800',
          message: 'text-error-700',
          button: 'bg-error-600 hover:bg-error-700 text-white',
          closeButton: 'text-error-500 hover:text-error-700'
        };
      case 'warning':
        return {
          container: 'bg-warning-50 border-warning-200',
          icon: 'text-warning-600',
          title: 'text-warning-800',
          message: 'text-warning-700',
          button: 'bg-warning-600 hover:bg-warning-700 text-white',
          closeButton: 'text-warning-500 hover:text-warning-700'
        };
      case 'info':
        return {
          container: 'bg-primary-50 border-primary-200',
          icon: 'text-primary-600',
          title: 'text-primary-800',
          message: 'text-primary-700',
          button: 'bg-primary-600 hover:bg-primary-700 text-white',
          closeButton: 'text-primary-500 hover:text-primary-700'
        };
      case 'success':
        return {
          container: 'bg-success-50 border-success-200',
          icon: 'text-success-600',
          title: 'text-success-800',
          message: 'text-success-700',
          button: 'bg-success-600 hover:bg-success-700 text-white',
          closeButton: 'text-success-500 hover:text-success-700'
        };
      default:
        return {
          container: 'bg-secondary-50 border-secondary-200',
          icon: 'text-secondary-600',
          title: 'text-secondary-800',
          message: 'text-secondary-700',
          button: 'bg-secondary-600 hover:bg-secondary-700 text-white',
          closeButton: 'text-secondary-500 hover:text-secondary-700'
        };
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'error':
        return 'AlertTriangle';
      case 'warning':
        return 'AlertCircle';
      case 'info':
        return 'Info';
      case 'success':
        return 'CheckCircle';
      default:
        return 'Bell';
    }
  };

  const styles = getAlertStyles(alert?.type);
  const iconName = getAlertIcon(alert?.type);

  const handleActionClick = () => {
    if (alert?.actionPath) {
      navigate(alert?.actionPath);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  return (
    <div className={`border rounded-lg p-4 ${styles?.container}`}>
      <div className="flex items-start space-x-4">
        {/* Alert Icon */}
        <div className="flex-shrink-0 mt-0.5">
          <Icon name={iconName} size={20} className={styles?.icon} />
        </div>

        {/* Alert Content */}
        <div className="flex-1 min-w-0">
          <h4 className={`font-medium text-sm mb-2 ${styles?.title}`}>
            {alert?.title}
          </h4>
          <p className={`text-sm leading-relaxed ${styles?.message}`}>
            {alert?.message}
          </p>
        </div>

        {/* Action Button */}
        {alert?.action && (
          <div className="flex-shrink-0">
            <button
              onClick={handleActionClick}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${styles?.button}`}
            >
              {alert?.action}
            </button>
          </div>
        )}

        {/* Close Button */}
        <div className="flex-shrink-0">
          <button
            onClick={handleDismiss}
            className={`p-1.5 rounded-md transition-colors duration-200 ${styles?.closeButton}`}
            aria-label="Dismiss alert"
          >
            <Icon name="X" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertBanner;