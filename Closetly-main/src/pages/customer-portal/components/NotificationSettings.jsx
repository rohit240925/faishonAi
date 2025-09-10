// src/pages/customer-portal/components/NotificationSettings.jsx
import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const NotificationSettings = ({ notifications, onUpdate }) => {
  const [settings, setSettings] = useState(notifications || {});
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  const notificationTypes = [
    {
      id: 'billingReminders',
      title: 'Billing Reminders',
      description: 'Get notified before your subscription renews and when payments are due',
      icon: 'Bell',
      category: 'billing'
    },
    {
      id: 'usageAlerts',
      title: 'Usage Alerts',
      description: 'Receive alerts when you approach your plan limits',
      icon: 'TrendingUp',
      category: 'usage'
    },
    {
      id: 'subscriptionChanges',
      title: 'Subscription Changes',
      description: 'Get notified about plan changes, upgrades, and cancellations',
      icon: 'RefreshCw',
      category: 'subscription'
    },
    {
      id: 'securityAlerts',
      title: 'Security Alerts',
      description: 'Important notifications about account security and login activity',
      icon: 'Shield',
      category: 'security'
    },
    {
      id: 'marketingEmails',
      title: 'Marketing Communications',
      description: 'Product updates, feature announcements, and promotional offers',
      icon: 'Mail',
      category: 'marketing'
    }
  ];

  const categories = {
    billing: { name: 'Billing & Payments', color: 'text-blue-600', bgColor: 'bg-blue-50' },
    usage: { name: 'Usage & Limits', color: 'text-green-600', bgColor: 'bg-green-50' },
    subscription: { name: 'Subscription', color: 'text-purple-600', bgColor: 'bg-purple-50' },
    security: { name: 'Security', color: 'text-red-600', bgColor: 'bg-red-50' },
    marketing: { name: 'Marketing', color: 'text-orange-600', bgColor: 'bg-orange-50' }
  };

  const handleToggle = (settingId) => {
    const newSettings = {
      ...settings,
      [settingId]: !settings?.[settingId]
    };
    setSettings(newSettings);
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      onUpdate(settings);
      setHasChanges(false);
      setSaving(false);
    }, 1000);
  };

  const handleReset = () => {
    setSettings(notifications || {});
    setHasChanges(false);
  };

  const groupedNotifications = notificationTypes?.reduce((acc, notification) => {
    if (!acc?.[notification?.category]) {
      acc[notification.category] = [];
    }
    acc?.[notification?.category]?.push(notification);
    return acc;
  }, {});

  return (
    <div className="bg-surface rounded-lg shadow-card border border-border-light p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-text-primary">Notification Settings</h2>
          <p className="text-sm text-text-secondary mt-1">
            Choose what notifications you'd like to receive
          </p>
        </div>
        {hasChanges && (
          <div className="flex space-x-2">
            <button
              onClick={handleReset}
              className="px-4 py-2 border border-border-light text-text-secondary rounded-lg hover:bg-surface-hover transition-colors text-sm"
            >
              Reset
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Icon name="Save" size={16} className="mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        )}
      </div>
      {/* Notification Categories */}
      <div className="space-y-6">
        {Object.entries(groupedNotifications)?.map(([categoryId, notifications]) => {
          const category = categories?.[categoryId];
          return (
            <div key={categoryId} className="space-y-4">
              <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${category?.color} ${category?.bgColor}`}>
                {category?.name}
              </div>
              <div className="space-y-3">
                {notifications?.map((notification) => (
                  <div
                    key={notification?.id}
                    className="flex items-start space-x-4 p-4 border border-border-light rounded-lg hover:bg-surface-hover transition-colors"
                  >
                    <div className={`p-2 rounded-lg ${category?.bgColor}`}>
                      <Icon name={notification?.icon} size={20} className={category?.color} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-medium text-text-primary">
                          {notification?.title}
                        </h3>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings?.[notification?.id] || false}
                            onChange={() => handleToggle(notification?.id)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary peer-focus:ring-offset-2 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                      <p className="text-sm text-text-secondary mt-1">
                        {notification?.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {/* Email Preferences */}
      <div className="mt-8 pt-6 border-t border-border-light">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Email Preferences</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-border-light rounded-lg">
            <div>
              <h4 className="font-medium text-text-primary">Email Frequency</h4>
              <p className="text-sm text-text-secondary">How often should we send digest emails?</p>
            </div>
            <select className="border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
              <option value="immediate">Immediate</option>
              <option value="daily">Daily Digest</option>
              <option value="weekly">Weekly Digest</option>
              <option value="never">Never</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between p-4 border border-border-light rounded-lg">
            <div>
              <h4 className="font-medium text-text-primary">Email Format</h4>
              <p className="text-sm text-text-secondary">Choose your preferred email format</p>
            </div>
            <select className="border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
              <option value="html">HTML (Rich formatting)</option>
              <option value="text">Plain Text</option>
            </select>
          </div>
        </div>
      </div>
      {/* Communication Channels */}
      <div className="mt-8 pt-6 border-t border-border-light">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Communication Channels</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3 p-4 border border-border-light rounded-lg">
            <Icon name="Mail" size={20} className="text-primary" />
            <div className="flex-1">
              <h4 className="font-medium text-text-primary">Email</h4>
              <p className="text-sm text-text-secondary">john.doe@company.com</p>
            </div>
            <Icon name="CheckCircle" size={20} className="text-success" />
          </div>
          
          <div className="flex items-center space-x-3 p-4 border border-border-light rounded-lg opacity-50">
            <Icon name="MessageSquare" size={20} className="text-secondary-400" />
            <div className="flex-1">
              <h4 className="font-medium text-text-secondary">SMS</h4>
              <p className="text-sm text-text-tertiary">Not configured</p>
            </div>
            <button className="text-sm text-primary hover:text-primary-600 font-medium">
              Add Phone
            </button>
          </div>
        </div>
      </div>
      {/* Success Message */}
      {!hasChanges && settings !== notifications && (
        <div className="mt-6 p-4 bg-success-50 border border-success-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="CheckCircle" size={20} className="text-success-600" />
            <span className="text-sm font-medium text-success-800">
              Your notification preferences have been saved successfully.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationSettings;