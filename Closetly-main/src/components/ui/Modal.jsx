import React, { useEffect, useRef } from 'react';
import Icon from '../AppIcon';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  footer,
  className = ''
}) => {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4'
  };

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
      document.body.style.overflow = 'hidden';
      
      // Focus the modal after a brief delay to ensure it's rendered
      setTimeout(() => {
        if (modalRef?.current) {
          modalRef?.current?.focus();
        }
      }, 100);
    } else {
      document.body.style.overflow = 'unset';
      
      // Return focus to the previously focused element
      if (previousFocusRef?.current) {
        previousFocusRef?.current?.focus();
      }
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event?.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleOverlayClick = (event) => {
    if (closeOnOverlayClick && event?.target === event?.currentTarget) {
      onClose();
    }
  };

  const handleModalClick = (event) => {
    event?.stopPropagation();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-1000"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        ref={modalRef}
        className={`
          bg-surface rounded-lg shadow-modal w-full ${sizeClasses?.[size]}
          transform transition-all duration-300 ease-in-out
          max-h-[90vh] flex flex-col
          ${className}
        `}
        onClick={handleModalClick}
        tabIndex={-1}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-border-light">
            {title && (
              <h2 id="modal-title" className="text-lg font-semibold text-text-primary">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 text-secondary-500 hover:text-text-primary hover:bg-surface-hover rounded-lg transition-colors duration-200"
                aria-label="Close modal"
              >
                <Icon name="X" size={20} />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="border-t border-border-light p-6">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

// Modal Footer Component for consistent styling
export const ModalFooter = ({ children, className = '' }) => (
  <div className={`flex items-center justify-end space-x-3 ${className}`}>
    {children}
  </div>
);

// Modal Body Component for consistent spacing
export const ModalBody = ({ children, className = '' }) => (
  <div className={`space-y-4 ${className}`}>
    {children}
  </div>
);

// Progress Modal for multi-step workflows
export const ProgressModal = ({
  isOpen,
  onClose,
  title,
  children,
  currentStep,
  totalSteps,
  stepLabels = [],
  size = 'lg',
  className = ''
}) => {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={size}
      className={className}
      closeOnOverlayClick={false}
      footer={null}
    >
      {/* Custom Header with Progress */}
      <div className="p-6 border-b border-border-light">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 text-secondary-500 hover:text-text-primary hover:bg-surface-hover rounded-lg transition-colors duration-200"
            aria-label="Close modal"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-text-secondary">
              {Math.round(progressPercentage)}% Complete
            </span>
          </div>
          <div className="w-full bg-secondary-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          
          {/* Step Labels */}
          {stepLabels?.length > 0 && (
            <div className="flex justify-between text-xs text-text-tertiary mt-2">
              {stepLabels?.map((label, index) => (
                <span
                  key={index}
                  className={`${
                    index + 1 <= currentStep ? 'text-primary font-medium' : ''
                  }`}
                >
                  {label}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {children}
      </div>
    </Modal>
  );
};

export default Modal;