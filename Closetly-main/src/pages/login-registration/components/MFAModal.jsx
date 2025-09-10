import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const MFAModal = ({ isOpen, onClose, onVerify, method, onMethodChange, isLoading }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (isOpen && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setCanResend(true);
    }
  }, [isOpen, timeLeft]);

  useEffect(() => {
    if (isOpen) {
      setCode('');
      setError('');
      setTimeLeft(30);
      setCanResend(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!code?.trim()) {
      setError('Please enter the verification code');
      return;
    }

    if (code?.length !== 6) {
      setError('Verification code must be 6 digits');
      return;
    }

    try {
      await onVerify(code);
    } catch (error) {
      setError(error?.message);
    }
  };

  const handleCodeChange = (e) => {
    const value = e?.target?.value?.replace(/\D/g, '')?.slice(0, 6);
    setCode(value);
    if (error) setError('');
  };

  const handleResend = () => {
    setTimeLeft(30);
    setCanResend(false);
    setError('');
    // Simulate resend logic
    console.log('Resending verification code...');
  };

  const handleMethodChange = (newMethod) => {
    onMethodChange(newMethod);
    setCode('');
    setError('');
    setTimeLeft(30);
    setCanResend(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-1000">
      <div className="bg-surface rounded-2xl shadow-modal w-full max-w-md transform transition-all duration-300 ease-in-out">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-light">
          <h2 className="text-xl font-semibold text-text-primary">Two-Factor Authentication</h2>
          <button
            onClick={onClose}
            className="p-2 text-secondary-500 hover:text-text-primary hover:bg-surface-hover rounded-lg transition-colors duration-200"
            disabled={isLoading}
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Method Selection */}
          <div className="mb-6">
            <p className="text-sm text-text-secondary mb-4">
              Choose your preferred verification method:
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleMethodChange('totp')}
                className={`p-4 border rounded-lg text-left transition-colors duration-200 ${
                  method === 'totp' ?'border-primary bg-primary-50 text-primary' :'border-border-light hover:bg-surface-hover text-text-secondary'
                }`}
                disabled={isLoading}
              >
                <div className="flex items-center space-x-3">
                  <Icon name="Smartphone" size={20} />
                  <div>
                    <p className="font-medium text-sm">Authenticator App</p>
                    <p className="text-xs opacity-75">Google Authenticator</p>
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => handleMethodChange('sms')}
                className={`p-4 border rounded-lg text-left transition-colors duration-200 ${
                  method === 'sms' ?'border-primary bg-primary-50 text-primary' :'border-border-light hover:bg-surface-hover text-text-secondary'
                }`}
                disabled={isLoading}
              >
                <div className="flex items-center space-x-3">
                  <Icon name="MessageSquare" size={20} />
                  <div>
                    <p className="font-medium text-sm">SMS</p>
                    <p className="text-xs opacity-75">Text message</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="mb-6 p-4 bg-primary-50 border border-primary-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <Icon name="Info" size={20} className="text-primary-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="text-primary-800 font-medium mb-1">
                  {method === 'totp' ? 'Authenticator App' : 'SMS Verification'}
                </p>
                <p className="text-primary-700">
                  {method === 'totp' ?'Enter the 6-digit code from your authenticator app.' :'Enter the 6-digit code sent to your phone number ending in ****1234.'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 bg-error-50 border border-error-200 rounded-lg p-4 flex items-center space-x-3">
              <Icon name="AlertCircle" size={20} className="text-error-600 flex-shrink-0" />
              <span className="text-error-700 text-sm">{error}</span>
            </div>
          )}

          {/* Code Input Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="mfa-code" className="block text-sm font-medium text-text-primary mb-2">
                Verification Code
              </label>
              <input
                type="text"
                id="mfa-code"
                value={code}
                onChange={handleCodeChange}
                className="block w-full px-4 py-3 border border-border-light rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-center text-2xl font-mono tracking-widest"
                placeholder="000000"
                maxLength={6}
                disabled={isLoading}
                autoComplete="one-time-code"
              />
            </div>

            {/* Timer and Resend */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="text-primary hover:text-primary-700 font-medium"
                    disabled={isLoading}
                  >
                    Resend code
                  </button>
                ) : (
                  `Resend code in ${timeLeft}s`
                )}
              </span>
              <span className="text-text-tertiary">Demo code: 123456</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || code?.length !== 6}
              className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <Icon name="Shield" size={20} />
                  <span>Verify Code</span>
                </>
              )}
            </button>
          </form>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-xs text-text-tertiary">
              Having trouble? Contact{' '}
              <button className="text-primary hover:text-primary-700 underline">
                support
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MFAModal;