import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const LoginForm = ({ onSubmit, onForgotPassword, isLoading }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
        <h2 className="text-2xl font-semibold text-text-primary mb-2">Welcome Back</h2>
        <p className="text-text-secondary">Sign in to your BillFlow account</p>
      </div>
      {/* Submit Error */}
      {errors?.submit && (
        <div className="bg-error-50 border border-error-200 rounded-lg p-4 flex items-center space-x-3">
          <Icon name="AlertCircle" size={20} className="text-error-600 flex-shrink-0" />
          <span className="text-error-700 text-sm">{errors?.submit}</span>
        </div>
      )}
      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
          Email Address
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
            placeholder="Enter your email"
            disabled={isLoading}
          />
        </div>
        {errors?.email && (
          <p className="mt-1 text-sm text-error-600">{errors?.email}</p>
        )}
      </div>
      {/* Password Field */}
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
            placeholder="Enter your password"
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
      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="rememberMe"
            checked={formData?.rememberMe}
            onChange={handleInputChange}
            className="h-4 w-4 text-primary focus:ring-primary border-border-medium rounded"
            disabled={isLoading}
          />
          <span className="ml-2 text-sm text-text-secondary">Remember me</span>
        </label>
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-sm text-primary hover:text-primary-700 transition-colors duration-200"
          disabled={isLoading}
        >
          Forgot password?
        </button>
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
            <span>Signing in...</span>
          </>
        ) : (
          <>
            <Icon name="LogIn" size={20} />
            <span>Sign In</span>
          </>
        )}
      </button>
      {/* Demo Credentials */}
      <div className="mt-6 p-4 bg-accent-50 border border-accent-200 rounded-lg">
        <h4 className="text-sm font-medium text-accent-800 mb-2">Demo Credentials:</h4>
        <div className="text-xs text-accent-700 space-y-1">
          <p><strong>Admin:</strong> admin@billflow.com / Admin@123</p>
          <p><strong>Finance:</strong> finance@billflow.com / Finance@123</p>
          <p><strong>Customer:</strong> customer@company.com / Customer@123</p>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;