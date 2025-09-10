import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, Loader2, Palette, CheckCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { subscriptionService } from '../../services/subscriptionService';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import ThemeToggle from '../../components/ui/ThemeToggle';
import { cn } from '../../utils/cn';

const LoginRegistration = () => {
  const { signIn, signUp, signInWithGoogle, user, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [mode, setMode] = useState('signin'); // 'signin' or 'signup'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      const redirectTo = searchParams?.get('redirect') || '/ai-fashion-generation-studio';
      navigate(redirectTo);
    }
  }, [user, navigate, searchParams]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  // Validate form
  const validateForm = () => {
    if (!formData?.email || !formData?.password) {
      setError('Please fill in all required fields');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (formData?.password?.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (mode === 'signup') {
      if (!formData?.fullName?.trim()) {
        setError('Full name is required');
        return false;
      }
      
      if (formData?.password !== formData?.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      if (mode === 'signin') {
        const { error } = await signIn(formData?.email, formData?.password);
        if (error) {
          setError(error?.message || 'Failed to sign in');
        } else {
          setSuccess('Successfully signed in!');
          // User will be redirected by useEffect
        }
      } else {
        const { error } = await signUp(formData?.email, formData?.password, {
          fullName: formData?.fullName
        });
        
        if (error) {
          setError(error?.message || 'Failed to create account');
        } else {
          setSuccess('Account created successfully! Please check your email to verify your account.');
          
          // Send welcome email
          try {
            await subscriptionService?.sendNotificationEmail(
              formData?.email,
              'welcome',
              {
                name: formData?.fullName,
                planName: 'Basic',
                monthlyCredits: '1000',
                storageLimit: '1GB',
                loginUrl: `${window.location?.origin}/ai-fashion-generation-studio`
              }
            );
          } catch (emailError) {
            console.error('Welcome email error:', emailError);
            // Don't show error to user - account creation was successful
          }
        }
      }
    } catch (error) {
      setError(error?.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Google OAuth
  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      const { error } = await signInWithGoogle();
      if (error) {
        setError(error?.message || 'Failed to sign in with Google');
      }
      // Success will be handled by auth state change
    } catch (error) {
      setError(error?.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const features = [
    'AI-powered fashion generation',
    'Virtual wardrobe overlay',
    'Multiple style selections',
    'Inspiration photo uploads (Pro+)',
    'Secure cloud storage',
    'Professional results'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 dark:from-background dark:via-background/98 dark:to-primary/10">
      {/* Header */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
        <Link 
          to="/" 
          className="flex items-center space-x-2 text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
            <Palette className="w-5 h-5 text-white" />
          </div>
          <span>FashionGen</span>
        </Link>
        <ThemeToggle />
      </div>
      <div className="flex min-h-screen pt-20 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
            {/* Left Side - Feature Showcase */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                  Create Stunning{' '}
                  <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    AI Fashion
                  </span>{' '}
                  Overlays
                </h1>
                <p className="text-xl text-muted-foreground">
                  Transform your photos with AI-powered virtual wardrobe technology. 
                  Perfect for fashion enthusiasts, influencers, and creative professionals.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {features?.map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="flex items-start space-x-3"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6"
              >
                <h3 className="font-semibold mb-2">Get Started Today</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Join thousands of users creating amazing fashion content with AI
                </p>
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-muted-foreground">Free tier includes:</span>
                  <span className="font-medium">1000 credits • 1GB storage</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Side - Authentication Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full max-w-md mx-auto"
            >
              <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl shadow-xl p-8">
                {/* Mode Toggle */}
                <div className="flex bg-muted/50 rounded-lg p-1 mb-6">
                  <button
                    onClick={() => setMode('signin')}
                    className={cn(
                      "flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all",
                      mode === 'signin'
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setMode('signup')}
                    className={cn(
                      "flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all",
                      mode === 'signup'
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Sign Up
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={mode}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h2 className="text-2xl font-bold mb-2">
                      {mode === 'signin' ? 'Welcome back' : 'Create account'}
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      {mode === 'signin' ?'Sign in to your FashionGen account' :'Start creating amazing fashion content today'
                      }
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {mode === 'signup' && (
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Full Name
                          </label>
                          <Input
                            type="text"
                            name="fullName"
                            value={formData?.fullName}
                            onChange={handleInputChange}
                            placeholder="Enter your full name"
                            iconName="User"
                            required
                          />
                        </div>
                      )}

                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Email Address
                        </label>
                        <Input
                          type="email"
                          name="email"
                          value={formData?.email}
                          onChange={handleInputChange}
                          placeholder="Enter your email"
                          iconName="Mail"
                          required
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Password
                        </label>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData?.password}
                            onChange={handleInputChange}
                            placeholder="Enter your password"
                            iconName="Lock"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {mode === 'signup' && (
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Confirm Password
                          </label>
                          <div className="relative">
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              name="confirmPassword"
                              value={formData?.confirmPassword}
                              onChange={handleInputChange}
                              placeholder="Confirm your password"
                              iconName="Lock"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Error Message */}
                      {error && (
                        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                          <p className="text-destructive text-sm">{error}</p>
                        </div>
                      )}

                      {/* Success Message */}
                      {success && (
                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                          <p className="text-green-600 text-sm">{success}</p>
                        </div>
                      )}

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting || loading}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            {mode === 'signin' ? 'Signing in...' : 'Creating account...'}
                          </>
                        ) : (
                          <>
                            {mode === 'signin' ? 'Sign In' : 'Create Account'}
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>

                      {/* Divider */}
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                        </div>
                      </div>

                      {/* Google OAuth */}
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={handleGoogleSignIn}
                        disabled={isSubmitting || loading}
                      >
                        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Continue with Google
                      </Button>
                    </form>

                    {mode === 'signin' && (
                      <div className="mt-4 text-center">
                        <Link
                          to="/reset-password"
                          className="text-sm text-primary hover:underline"
                        >
                          Forgot your password?
                        </Link>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Terms */}
                {mode === 'signup' && (
                  <p className="mt-6 text-xs text-muted-foreground text-center">
                    By creating an account, you agree to our{' '}
                    <Link to="/privacy-policy-terms-of-service" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy-policy-terms-of-service" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRegistration;