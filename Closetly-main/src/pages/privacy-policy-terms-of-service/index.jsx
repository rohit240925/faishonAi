import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import { useTheme } from '../../components/ui/ThemeProvider';
import ThemeToggle from '../../components/ui/ThemeToggle';

const PrivacyPolicyTermsOfService = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [activeSection, setActiveSection] = useState('privacy');
  const [activeSubSection, setActiveSubSection] = useState('data-collection');

  const privacySections = [
    {
      id: 'data-collection',
      title: 'Data Collection & Usage',
      icon: 'Database',
    },
    {
      id: 'image-processing',
      title: 'AI Image Processing',
      icon: 'Camera',
    },
    {
      id: 'storage-security',
      title: 'Storage & Security',
      icon: 'Shield',
    },
    {
      id: 'user-rights',
      title: 'Your Rights',
      icon: 'UserCheck',
    },
    {
      id: 'data-retention',
      title: 'Data Retention',
      icon: 'Clock',
    },
    {
      id: 'cookies-tracking',
      title: 'Cookies & Tracking',
      icon: 'Cookie',
    }
  ];

  const termsSections = [
    {
      id: 'acceptable-use',
      title: 'Acceptable Use',
      icon: 'CheckCircle',
    },
    {
      id: 'ai-generation',
      title: 'AI Generation Rights',
      icon: 'Sparkles',
    },
    {
      id: 'intellectual-property',
      title: 'Intellectual Property',
      icon: 'Copyright',
    },
    {
      id: 'platform-limits',
      title: 'Platform Limitations',
      icon: 'AlertTriangle',
    },
    {
      id: 'account-termination',
      title: 'Account & Termination',
      icon: 'UserX',
    },
    {
      id: 'liability-disputes',
      title: 'Liability & Disputes',
      icon: 'Scale',
    }
  ];

  const currentSections = activeSection === 'privacy' ? privacySections : termsSections;

  return (
    <div className="min-h-screen bg-background dark:bg-dark-background transition-colors duration-300">
      <Helmet>
        <title>Privacy Policy & Terms of Service - Virtual FashionGen</title>
        <meta name="description" content="Privacy policy and terms of service for Virtual FashionGen's AI-powered fashion generation platform" />
      </Helmet>

      {/* Header with Theme Toggle */}
      <div className="bg-surface dark:bg-dark-surface border-b border-border-light dark:border-dark-border-light">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-primary dark:text-dark-primary hover:text-primary-600 dark:hover:text-dark-primary-600 transition-colors duration-200"
            >
              <Icon name="ArrowLeft" size={20} />
              <span className="font-medium">Back to Home</span>
            </button>
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Shield" size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-text-primary dark:text-dark-text-primary mb-2">
            Legal Documentation
          </h1>
          <p className="text-text-secondary dark:text-dark-text-secondary">
            Your privacy and rights on Virtual FashionGen
          </p>
          <div className="flex items-center justify-center mt-4 text-sm text-text-tertiary dark:text-dark-text-tertiary">
            <Icon name="Calendar" size={16} className="mr-2" />
            <span>Last updated: January 4, 2025</span>
            <span className="mx-2">•</span>
            <span>Version 1.0</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-surface dark:bg-dark-surface rounded-2xl shadow-card border border-border-light dark:border-dark-border-light p-6 sticky top-6">
              {/* Section Toggle */}
              <div className="flex mb-6 bg-surface-hover dark:bg-dark-surface-hover rounded-xl p-1">
                <button
                  onClick={() => setActiveSection('privacy')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeSection === 'privacy' ?'bg-primary text-white shadow-sm' :'text-text-secondary dark:text-dark-text-secondary hover:text-primary dark:hover:text-dark-primary'
                  }`}
                >
                  Privacy Policy
                </button>
                <button
                  onClick={() => setActiveSection('terms')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeSection === 'terms' ?'bg-primary text-white shadow-sm' :'text-text-secondary dark:text-dark-text-secondary hover:text-primary dark:hover:text-dark-primary'
                  }`}
                >
                  Terms of Service
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-1">
                {currentSections?.map((section) => (
                  <button
                    key={section?.id}
                    onClick={() => setActiveSubSection(section?.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                      activeSubSection === section?.id
                        ? 'bg-primary-50 dark:bg-dark-primary-100 text-primary dark:text-dark-primary border-l-2 border-primary dark:border-dark-primary' :'text-text-secondary dark:text-dark-text-secondary hover:bg-surface-hover dark:hover:bg-dark-surface-hover hover:text-primary dark:hover:text-dark-primary'
                    }`}
                  >
                    <Icon name={section?.icon} size={16} />
                    <span className="text-sm font-medium">{section?.title}</span>
                  </button>
                ))}
              </nav>

              {/* Quick Links - Updated per requirements */}
              <div className="mt-8 pt-6 border-t border-border-light dark:border-dark-border-light">
                <h4 className="text-sm font-medium text-text-primary dark:text-dark-text-primary mb-3">Contact Information</h4>
                <div className="space-y-2">
                  <a 
                    href="mailto:privacy@virtualfashiongen.com"
                    className="w-full flex items-center space-x-3 text-sm text-text-secondary dark:text-dark-text-secondary hover:text-primary dark:hover:text-dark-primary transition-colors duration-200"
                  >
                    <Icon name="Mail" size={14} />
                    <span>Contact Privacy Team</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-surface dark:bg-dark-surface rounded-2xl shadow-card border border-border-light dark:border-dark-border-light">
              <div className="p-8">
                {/* Content Header */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary mb-2">
                    {activeSection === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
                  </h2>
                  <p className="text-text-secondary dark:text-dark-text-secondary">
                    {activeSection === 'privacy' ?'How we collect, use, and protect your personal information and generated content.' :'Your rights and responsibilities when using Virtual FashionGen\'s AI-powered platform.'
                    }
                  </p>
                </div>

                {/* Dynamic Content based on activeSection and activeSubSection */}
                <div className="prose prose-lg max-w-none dark:prose-invert">
                  {activeSection === 'privacy' && (
                    <div>
                      {activeSubSection === 'data-collection' && (
                        <div>
                          <h3 className="flex items-center space-x-2 text-xl font-semibold mb-4">
                            <Icon name="Database" size={20} className="text-primary dark:text-dark-primary" />
                            <span>Data Collection & Usage</span>
                          </h3>
                          <div className="bg-blue-50 dark:bg-dark-primary-100 border border-blue-200 dark:border-dark-border-light rounded-xl p-6 mb-6">
                            <h4 className="font-semibold text-blue-800 dark:text-dark-text-primary mb-2">What We Collect</h4>
                            <ul className="text-blue-700 dark:text-dark-text-secondary space-y-2">
                              <li>• Personal photos you upload for AI fashion generation</li>
                              <li>• Account information (email, username, preferences)</li>
                              <li>• Usage data and generation history</li>
                              <li>• Device and browser information for optimization</li>
                            </ul>
                          </div>
                          <p className="text-text-primary dark:text-dark-text-primary mb-4">
                            Virtual FashionGen collects information necessary to provide AI-powered fashion generation services. 
                            We prioritize transparency and only collect data that enhances your experience.
                          </p>
                          <p className="text-text-primary dark:text-dark-text-primary mb-4">
                            <strong>Photo Processing:</strong> Uploaded images are processed using Google's Gemini AI to analyze your features and generate personalized outfit recommendations. Images are temporarily stored during processing and permanently deleted after 24 hours unless saved to your personal portfolio.
                          </p>
                        </div>
                      )}

                      {activeSubSection === 'image-processing' && (
                        <div>
                          <h3 className="flex items-center space-x-2 text-xl font-semibold mb-4">
                            <Icon name="Camera" size={20} className="text-primary dark:text-dark-primary" />
                            <span>AI Image Processing</span>
                          </h3>
                          <div className="bg-purple-50 dark:bg-dark-accent-100 border border-purple-200 dark:border-dark-border-light rounded-xl p-6 mb-6">
                            <h4 className="font-semibold text-purple-800 dark:text-dark-text-primary mb-2">AI Processing Details</h4>
                            <ul className="text-purple-700 dark:text-dark-text-secondary space-y-2">
                              <li>• Gemini AI analyzes facial features and body proportions</li>
                              <li>• Style preferences are learned from your interactions</li>
                              <li>• Generated content remains your intellectual property</li>
                              <li>• No human review of your personal photos</li>
                            </ul>
                          </div>
                          <p className="text-text-primary dark:text-dark-text-primary mb-4">
                            Our AI fashion generation uses Google's Gemini model to create personalized outfit recommendations based on your uploaded photos. The processing happens securely in Google's infrastructure with enterprise-grade privacy protections.
                          </p>
                          <p className="text-text-primary dark:text-dark-text-primary">
                            <strong>Content Filtering:</strong> All generated content passes through automated safety filters to ensure appropriate and respectful results. NSFW content is automatically blocked.
                          </p>
                        </div>
                      )}

                      {activeSubSection === 'storage-security' && (
                        <div>
                          <h3 className="flex items-center space-x-2 text-xl font-semibold mb-4">
                            <Icon name="Shield" size={20} className="text-primary dark:text-dark-primary" />
                            <span>Storage & Security</span>
                          </h3>
                          <div className="bg-green-50 dark:bg-dark-success-100 border border-green-200 dark:border-dark-border-light rounded-xl p-6 mb-6">
                            <h4 className="font-semibold text-green-800 dark:text-dark-text-primary mb-2">Security Measures</h4>
                            <ul className="text-green-700 dark:text-dark-text-secondary space-y-2">
                              <li>• End-to-end encryption for all data transmission</li>
                              <li>• Secure cloud storage with access controls</li>
                              <li>• Regular security audits and vulnerability assessments</li>
                              <li>• GDPR and CCPA compliance</li>
                            </ul>
                          </div>
                          <p className="text-text-primary dark:text-dark-text-primary mb-4">
                            Your photos and generated content are stored using industry-standard encryption. Access is restricted to authorized systems only, with comprehensive audit logs maintained.
                          </p>
                        </div>
                      )}

                      {activeSubSection === 'user-rights' && (
                        <div>
                          <h3 className="flex items-center space-x-2 text-xl font-semibold mb-4">
                            <Icon name="UserCheck" size={20} className="text-primary dark:text-dark-primary" />
                            <span>Your Rights</span>
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="bg-yellow-50 dark:bg-dark-warning-100 border border-yellow-200 dark:border-dark-border-light rounded-xl p-4">
                              <h5 className="font-semibold text-yellow-800 dark:text-dark-text-primary mb-2">Access & Control</h5>
                              <ul className="text-yellow-700 dark:text-dark-text-secondary text-sm space-y-1">
                                <li>• View all your data</li>
                                <li>• Download your content</li>
                                <li>• Update preferences</li>
                                <li>• Delete your account</li>
                              </ul>
                            </div>
                            <div className="bg-orange-50 dark:bg-dark-warning-100 border border-orange-200 dark:border-dark-border-light rounded-xl p-4">
                              <h5 className="font-semibold text-orange-800 dark:text-dark-text-primary mb-2">Data Protection</h5>
                              <ul className="text-orange-700 dark:text-dark-text-secondary text-sm space-y-1">
                                <li>• Opt-out of data processing</li>
                                <li>• Request data correction</li>
                                <li>• Limit data usage</li>
                                <li>• File privacy complaints</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeSubSection === 'data-retention' && (
                        <div>
                          <h3 className="flex items-center space-x-2 text-xl font-semibold mb-4">
                            <Icon name="Clock" size={20} className="text-primary dark:text-dark-primary" />
                            <span>Data Retention</span>
                          </h3>
                          <div className="bg-indigo-50 dark:bg-dark-primary-100 border border-indigo-200 dark:border-dark-border-light rounded-xl p-6 mb-6">
                            <h4 className="font-semibold text-indigo-800 dark:text-dark-text-primary mb-2">Retention Periods</h4>
                            <div className="text-indigo-700 dark:text-dark-text-secondary space-y-2">
                              <p><strong>Uploaded Photos:</strong> Deleted after 24 hours unless saved to personal portfolio</p>
                              <p><strong>Personal Portfolio Images:</strong> Retained for 72 hours unless manually deleted</p>
                              <p><strong>Generated Content:</strong> Kept until you delete or account closure</p>
                              <p><strong>Account Data:</strong> Retained for service provision</p>
                              <p><strong>Usage Analytics:</strong> Aggregated and anonymized after 12 months</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeSubSection === 'cookies-tracking' && (
                        <div>
                          <h3 className="flex items-center space-x-2 text-xl font-semibold mb-4">
                            <Icon name="Cookie" size={20} className="text-primary dark:text-dark-primary" />
                            <span>Cookies & Tracking</span>
                          </h3>
                          <p className="text-text-primary dark:text-dark-text-primary mb-4">
                            We use cookies and similar technologies to enhance your experience, remember your preferences, and provide personalized content.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeSection === 'terms' && (
                    <div>
                      {activeSubSection === 'acceptable-use' && (
                        <div>
                          <h3 className="flex items-center space-x-2 text-xl font-semibold mb-4">
                            <Icon name="CheckCircle" size={20} className="text-primary dark:text-dark-primary" />
                            <span>Acceptable Use Policy</span>
                          </h3>
                          <div className="bg-red-50 dark:bg-dark-error-100 border border-red-200 dark:border-dark-border-light rounded-xl p-6 mb-6">
                            <h4 className="font-semibold text-red-800 dark:text-dark-text-primary mb-2">Prohibited Activities</h4>
                            <ul className="text-red-700 dark:text-dark-text-secondary space-y-2">
                              <li>• Uploading inappropriate, offensive, or illegal content</li>
                              <li>• Using the service for commercial purposes without permission</li>
                              <li>• Attempting to reverse engineer or hack the platform</li>
                              <li>• Violating intellectual property rights</li>
                            </ul>
                          </div>
                        </div>
                      )}

                      {activeSubSection === 'ai-generation' && (
                        <div>
                          <h3 className="flex items-center space-x-2 text-xl font-semibold mb-4">
                            <Icon name="Sparkles" size={20} className="text-primary dark:text-dark-primary" />
                            <span>AI Generation Rights</span>
                          </h3>
                          <div className="bg-purple-50 dark:bg-dark-accent-100 border border-purple-200 dark:border-dark-border-light rounded-xl p-6 mb-6">
                            <h4 className="font-semibold text-purple-800 dark:text-dark-text-primary mb-2">Your Generated Content</h4>
                            <ul className="text-purple-700 dark:text-dark-text-secondary space-y-2">
                              <li>• You own the rights to AI-generated fashion content</li>
                              <li>• Commercial use permitted with attribution</li>
                              <li>• Platform retains right to showcase anonymized results</li>
                              <li>• No liability for AI generation accuracy</li>
                            </ul>
                          </div>
                        </div>
                      )}

                      {activeSubSection === 'intellectual-property' && (
                        <div>
                          <h3 className="flex items-center space-x-2 text-xl font-semibold mb-4">
                            <Icon name="Copyright" size={20} className="text-primary dark:text-dark-primary" />
                            <span>Intellectual Property</span>
                          </h3>
                          <p className="text-text-primary dark:text-dark-text-primary mb-4">
                            Virtual FashionGen respects intellectual property rights and expects users to do the same. The platform, AI models, and underlying technology remain our property.
                          </p>
                        </div>
                      )}

                      {activeSubSection === 'platform-limits' && (
                        <div>
                          <h3 className="flex items-center space-x-2 text-xl font-semibold mb-4">
                            <Icon name="AlertTriangle" size={20} className="text-primary dark:text-dark-primary" />
                            <span>Platform Limitations</span>
                          </h3>
                          <div className="bg-yellow-50 dark:bg-dark-warning-100 border border-yellow-200 dark:border-dark-border-light rounded-xl p-6 mb-6">
                            <h4 className="font-semibold text-yellow-800 dark:text-dark-text-primary mb-2">Usage Limits</h4>
                            <ul className="text-yellow-700 dark:text-dark-text-secondary space-y-2">
                              <li>• API rate limits apply based on your subscription</li>
                              <li>• Storage limits for saved generated content</li>
                              <li>• AI generation subject to model availability</li>
                              <li>• Premium features require active subscription</li>
                            </ul>
                          </div>
                        </div>
                      )}

                      {activeSubSection === 'account-termination' && (
                        <div>
                          <h3 className="flex items-center space-x-2 text-xl font-semibold mb-4">
                            <Icon name="UserX" size={20} className="text-primary dark:text-dark-primary" />
                            <span>Account & Termination</span>
                          </h3>
                          <p className="text-text-primary dark:text-dark-text-primary mb-4">
                            Either party may terminate the account relationship. Upon termination, your data will be deleted according to our retention policy.
                          </p>
                        </div>
                      )}

                      {activeSubSection === 'liability-disputes' && (
                        <div>
                          <h3 className="flex items-center space-x-2 text-xl font-semibold mb-4">
                            <Icon name="Scale" size={20} className="text-primary dark:text-dark-primary" />
                            <span>Liability & Disputes</span>
                          </h3>
                          <p className="text-text-primary dark:text-dark-text-primary mb-4">
                            Virtual FashionGen provides services "as is" without warranties. Disputes are subject to arbitration under applicable law.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* FAQ Section */}
                <div className="mt-12 pt-8 border-t border-border-light dark:border-dark-border-light">
                  <h3 className="text-xl font-semibold text-text-primary dark:text-dark-text-primary mb-4">Frequently Asked Questions</h3>
                  <div className="space-y-4">
                    <div className="bg-surface-hover dark:bg-dark-surface-hover rounded-xl p-4">
                      <button className="w-full flex items-center justify-between text-left">
                        <span className="font-medium text-text-primary dark:text-dark-text-primary">How long are my photos stored?</span>
                        <Icon name="ChevronDown" size={16} className="text-text-secondary dark:text-dark-text-secondary" />
                      </button>
                      <div className="mt-2 text-sm text-text-secondary dark:text-dark-text-secondary">
                        Uploaded photos are automatically deleted after 24 hours unless you save generated content to your personal portfolio. Portfolio images are retained for 72 hours unless manually deleted.
                      </div>
                    </div>
                    
                    <div className="bg-surface-hover dark:bg-dark-surface-hover rounded-xl p-4">
                      <button className="w-full flex items-center justify-between text-left">
                        <span className="font-medium text-text-primary dark:text-dark-text-primary">Can I use generated content commercially?</span>
                        <Icon name="ChevronDown" size={16} className="text-text-secondary dark:text-dark-text-secondary" />
                      </button>
                      <div className="mt-2 text-sm text-text-secondary dark:text-dark-text-secondary">
                        Yes, you own the rights to AI-generated content and can use it commercially with proper attribution to Virtual FashionGen.
                      </div>
                    </div>
                    
                    <div className="bg-surface-hover dark:bg-dark-surface-hover rounded-xl p-4">
                      <button className="w-full flex items-center justify-between text-left">
                        <span className="font-medium text-text-primary dark:text-dark-text-primary">How do I delete my account and data?</span>
                        <Icon name="ChevronDown" size={16} className="text-text-secondary dark:text-dark-text-secondary" />
                      </button>
                      <div className="mt-2 text-sm text-text-secondary dark:text-dark-text-secondary">
                        Visit your account settings and select "Delete Account." All personal data will be permanently removed within 30 days.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Section */}
                <div className="mt-12 pt-8 border-t border-border-light dark:border-dark-border-light">
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-dark-accent-100 dark:to-dark-primary-100 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-text-primary dark:text-dark-text-primary mb-2">Questions or Concerns?</h3>
                    <p className="text-text-secondary dark:text-dark-text-secondary mb-4">
                      Our privacy team is here to help with any questions about your data or rights.
                    </p>
                    <div className="flex items-center space-x-4">
                      <a 
                        href="mailto:privacy@virtualfashiongen.com"
                        className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors duration-200"
                      >
                        <Icon name="Mail" size={16} />
                        <span>Contact Privacy Team</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyTermsOfService;