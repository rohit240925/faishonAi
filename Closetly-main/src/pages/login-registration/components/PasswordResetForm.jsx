import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const PasswordResetForm = ({ onSubmit, onBack, isLoading }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/?.test(email);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!email?.trim()) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      await onSubmit(email);
      setIsSubmitted(true);
    } catch (error) {
      setError(error?.message);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e?.target?.value);
    if (error) setError('');
  };

  if (isSubmitted) {
    return (
      <div className="text-center space-y-6">
        {/* Success Icon */}
        <div className="w-16 h-16 mx-auto bg-success-50 rounded-full flex items-center justify-center">
          <Icon name="Mail" size={32} className="text-success-600" />
        </div>

        {/* Success Message */}
        <div>
          <h2 className="text-2xl font-semibold text-text-primary mb-2">Check Your Email</h2>
          <p className="text-text-secondary mb-4">
            We've sent password reset instructions to:
          </p>
          <p className="text-primary font-medium">{email}</p>
        </div>

        {/* Instructions */}
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 text-left">
          <h3 className="font-medium text-primary-800 mb-2">Next steps:</h3>
          <ul className="text-sm text-primary-700 space-y-1">
            <li>• Check your email inbox and spam folder</li>
            <li>• Click the reset link in the email</li>
            <li>• Create a new password</li>
            <li>• Sign in with your new password</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={onBack}
            className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <Icon name="ArrowLeft" size={20} />
            <span>Back to Sign In</span>
          </button>
          
          <button
            onClick={() => setIsSubmitted(false)}
            className="w-full text-primary hover:text-primary-700 py-2 text-sm font-medium transition-colors duration-200"
          >
            Didn't receive the email? Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-12 h-12 mx-auto bg-primary-50 rounded-full flex items-center justify-center mb-4">
          <Icon name="Key" size={24} className="text-primary-600" />
        </div>
        <h2 className="text-2xl font-semibold text-text-primary mb-2">Reset Password</h2>
        <p className="text-text-secondary">
          Enter your email address and we'll send you instructions to reset your password.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-error-50 border border-error-200 rounded-lg p-4 flex items-center space-x-3">
          <Icon name="AlertCircle" size={20} className="text-error-600 flex-shrink-0" />
          <span className="text-error-700 text-sm">{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="reset-email" className="block text-sm font-medium text-text-primary mb-2">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon name="Mail" size={20} className="text-secondary-400" />
            </div>
            <input
              type="email"
              id="reset-email"
              value={email}
              onChange={handleEmailChange}
              className={`block w-full pl-10 pr-3 py-3 border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200 ${
                error ? 'border-error-300' : 'border-border-light'
              }`}
              placeholder="Enter your email address"
              disabled={isLoading}
              autoComplete="email"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Sending...</span>
            </>
          ) : (
            <>
              <Icon name="Send" size={20} />
              <span>Send Reset Instructions</span>
            </>
          )}
        </button>

        {/* Back to Login */}
        <button
          type="button"
          onClick={onBack}
          className="w-full text-text-secondary hover:text-text-primary py-2 text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
          disabled={isLoading}
        >
          <Icon name="ArrowLeft" size={16} />
          <span>Back to Sign In</span>
        </button>
      </form>

      {/* Help Text */}
      <div className="text-center">
        <p className="text-xs text-text-tertiary">
          Still having trouble?{' '}
          <button className="text-primary hover:text-primary-700 underline">
            Contact support
          </button>
        </p>
      </div>
    </div>
  );
};

export default PasswordResetForm;