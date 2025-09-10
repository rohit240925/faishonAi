// src/pages/usage-analytics-reporting/index.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import PageHeader from '../../components/ui/PageHeader';
import Icon from '../../components/AppIcon';

const UsageAnalyticsReporting = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Sidebar />
        
        <main className="content-offset pt-16">
          <div className="p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-text-secondary">Loading analytics...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      
      <main className="content-offset pt-16">
        <div className="p-6">
          
          <PageHeader 
            title="Usage Analytics & Reporting"
            description="Comprehensive usage metrics and revenue analytics"
            actions={[]}
            customIcon="TrendingUp"
          />
          
          <div className="bg-surface rounded-lg shadow-card border border-border-light p-8 text-center">
            <Icon name="TrendingUp" size={48} className="text-secondary-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-text-primary mb-2">
              Usage Analytics & Reporting
            </h2>
            <p className="text-text-secondary mb-6">
              Comprehensive usage metrics and revenue analytics will be available here.
            </p>
            <div className="text-sm text-text-tertiary">
              This feature is currently under development and will include:
              <ul className="mt-2 space-y-1 text-left max-w-md mx-auto">
                <li>• Real-time usage tracking</li>
                <li>• Revenue analytics dashboards</li>
                <li>• Customer behavior insights</li>
                <li>• Custom reporting tools</li>
                <li>• Data export capabilities</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UsageAnalyticsReporting;