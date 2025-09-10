import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const RegistrationForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    acceptTerms: false
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const roles = [
    { value: 'admin', label: 'Billing Administrator' },
    { value: 'finance', label: 'Finance Manager' },
    { value: 'owner', label: 'Business Owner' },
    { value: 'analyst', label: 'Finance Analyst' },
    { value: 'customer-success', label: 'Customer Success' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.companyName?.trim()) {
      newErrors.companyName = 'Company name is required';
    }

    if (!formData?.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/?.test(formData?.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, number and special character';
    }

    if (!formData?.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData?.password !== formData?.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData?.role) {
      newErrors.role = 'Please select your role';
    }

    if (!formData?.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      setErrors({ submit: error?.message });
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-text-primary mb-2">Create Account</h2>
        <p className="text-text-secondary">Join BillFlow and streamline your billing</p>
      </div>
      {/* Submit Error */}
      {errors?.submit && (
        <div className="bg-error-50 border border-error-200 rounded-lg p-4 flex items-center space-x-3">
          <Icon name="AlertCircle" size={20} className="text-error-600 flex-shrink-0" />
          <span className="text-error-700 text-sm">{errors?.submit}</span>
        </div>
      )}
      {/* Company Name */}
      <div>
        <label htmlFor="companyName" className="block text-sm font-medium text-text-primary mb-2">
          Company Name
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon name="Building" size={20} className="text-secondary-400" />
          </div>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData?.companyName}
            onChange={handleInputChange}
            className={`block w-full pl-10 pr-3 py-3 border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200 ${
              errors?.companyName ? 'border-error-300' : 'border-border-light'
            }`}
            placeholder="Enter your company name"
            disabled={isLoading}
          />
        </div>
        {errors?.companyName && (
          <p className="mt-1 text-sm text-error-600">{errors?.companyName}</p>
        )}
      </div>
      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
          Work Email
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon name="Mail" size={20} className="text-secondary-400" />
          </div>
          <input
            type="email"
            id="email"
            name="email"
            value={formData?.email}
            onChange={handleInputChange}
            className={`block w-full pl-10 pr-3 py-3 border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200 ${
              errors?.email ? 'border-error-300' : 'border-border-light'
            }`}
            placeholder="Enter your work email"
            disabled={isLoading}
          />
        </div>
        {errors?.email && (
          <p className="mt-1 text-sm text-error-600">{errors?.email}</p>
        )}
      </div>
      {/* Role Selection */}
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-text-primary mb-2">
          Your Role
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon name="UserCheck" size={20} className="text-secondary-400" />
          </div>
          <select
            id="role"
            name="role"
            value={formData?.role}
            onChange={handleInputChange}
            className={`block w-full pl-10 pr-8 py-3 border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200 appearance-none ${
              errors?.role ? 'border-error-300' : 'border-border-light'
            }`}
            disabled={isLoading}
          >
            <option value="">Select your role</option>
            {roles?.map((role) => (
              <option key={role?.value} value={role?.value}>
                {role?.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <Icon name="ChevronDown" size={20} className="text-secondary-400" />
          </div>
        </div>
        {errors?.role && (
          <p className="mt-1 text-sm text-error-600">{errors?.role}</p>
        )}
      </div>
      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-2">
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon name="Lock" size={20} className="text-secondary-400" />
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={formData?.password}
            onChange={handleInputChange}
            className={`block w-full pl-10 pr-12 py-3 border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200 ${
              errors?.password ? 'border-error-300' : 'border-border-light'
            }`}
            placeholder="Create a strong password"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-secondary-400 hover:text-text-primary transition-colors duration-200"
            disabled={isLoading}
          >
            <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={20} />
          </button>
        </div>
        {errors?.password && (
          <p className="mt-1 text-sm text-error-600">{errors?.password}</p>
        )}
      </div>
      {/* Confirm Password */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-primary mb-2">
          Confirm Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon name="Lock" size={20} className="text-secondary-400" />
          </div>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            name="confirmPassword"
            value={formData?.confirmPassword}
            onChange={handleInputChange}
            className={`block w-full pl-10 pr-12 py-3 border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200 ${
              errors?.confirmPassword ? 'border-error-300' : 'border-border-light'
            }`}
            placeholder="Confirm your password"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-secondary-400 hover:text-text-primary transition-colors duration-200"
            disabled={isLoading}
          >
            <Icon name={showConfirmPassword ? 'EyeOff' : 'Eye'} size={20} />
          </button>
        </div>
        {errors?.confirmPassword && (
          <p className="mt-1 text-sm text-error-600">{errors?.confirmPassword}</p>
        )}
      </div>
      {/* Terms Acceptance */}
      <div>
        <label className="flex items-start space-x-3">
          <input
            type="checkbox"
            name="acceptTerms"
            checked={formData?.acceptTerms}
            onChange={handleInputChange}
            className={`mt-1 h-4 w-4 text-primary focus:ring-primary border-border-medium rounded ${
              errors?.acceptTerms ? 'border-error-300' : ''
            }`}
            disabled={isLoading}
          />
          <span className="text-sm text-text-secondary">
            I agree to the{' '}
            <button type="button" className="text-primary hover:text-primary-700 underline">
              Terms of Service
            </button>{' '}
            and{' '}
            <button type="button" className="text-primary hover:text-primary-700 underline">
              Privacy Policy
            </button>
          </span>
        </label>
        {errors?.acceptTerms && (
          <p className="mt-1 text-sm text-error-600">{errors?.acceptTerms}</p>
        )}
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
            <span>Creating account...</span>
          </>
        ) : (
          <>
            <Icon name="UserPlus" size={20} />
            <span>Create Account</span>
          </>
        )}
      </button>
    </form>
  );
};

export default RegistrationForm;