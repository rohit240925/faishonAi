// src/pages/dunning-management/components/MonitoringDashboard.jsx
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import Icon from '../../../components/AppIcon';

const MonitoringDashboard = ({ metrics, campaigns, selectedDateRange, formatCurrency }) => {
  const [selectedMetric, setSelectedMetric] = useState('recovery');

  // Mock historical data for charts
  const recoveryTrendData = [
    { period: 'Week 1', recoveryRate: 65, revenueRecovered: 35000, attempts: 89 },
    { period: 'Week 2', recoveryRate: 72, revenueRecovered: 42000, attempts: 94 },
    { period: 'Week 3', recoveryRate: 68, revenueRecovered: 38000, attempts: 87 },
    { period: 'Week 4', recoveryRate: 75, revenueRecovered: 45600, attempts: 91 }
  ];

  const stepSuccessData = Object.entries(metrics?.successRateByStep || {})?.map(([step, rate]) => ({
    step: step?.replace(/([A-Z])/g, ' $1')?.replace(/^./, str => str?.toUpperCase()),
    successRate: rate,
    fill: getStepColor(step)
  }));

  const customerSegmentData = [
    { segment: 'Enterprise', campaigns: 8, recoveryRate: 85, value: 65000 },
    { segment: 'Professional', campaigns: 12, recoveryRate: 72, value: 28000 },
    { segment: 'Starter', campaigns: 3, recoveryRate: 45, value: 8500 }
  ];

  const campaignTypeData = [
    { type: 'Automated', count: 18, fill: '#3b82f6' },
    { type: 'Manual', count: 5, fill: '#f59e0b' }
  ];

  function getStepColor(step) {
    const colors = {
      'First Retry': '#10b981',
      'Email Reminder': '#3b82f6',
      'Grace Period': '#f59e0b',
      'Final Notice': '#ef4444',
      'Account Suspension': '#6b7280'
    };
    return colors?.[step] || '#6b7280';
  }

  const metricCards = [
    {
      id: 'recovery',
      title: 'Recovery Rate',
      value: `${metrics?.recoveryRate || 0}%`,
      change: '+5.2%',
      trend: 'up',
      icon: 'TrendingUp',
      color: 'text-success-600',
      bgColor: 'bg-success-50'
    },
    {
      id: 'revenue',
      title: 'Revenue Recovered',
      value: formatCurrency?.(metrics?.revenueRecovered || 0) || '$0',
      change: '+12.8%',
      trend: 'up',
      icon: 'DollarSign',
      color: 'text-primary',
      bgColor: 'bg-primary-50'
    },
    {
      id: 'campaigns',
      title: 'Active Campaigns',
      value: metrics?.activeCampaigns || 0,
      change: '-3',
      trend: 'down',
      icon: 'Target',
      color: 'text-warning-600',
      bgColor: 'bg-warning-50'
    },
    {
      id: 'resolution',
      title: 'Avg Resolution Time',
      value: `${metrics?.avgResolutionTime || 0} days`,
      change: '-0.5d',
      trend: 'down',
      icon: 'Clock',
      color: 'text-accent-600',
      bgColor: 'bg-accent-50'
    }
  ];

  const getRecentFailures = () => {
    // Mock recent payment failures
    return [
      {
        id: 'PF-001',
        customer: 'Acme Corp',
        amount: 299.99,
        reason: 'Insufficient funds',
        time: '2 minutes ago',
        severity: 'high'
      },
      {
        id: 'PF-002',
        customer: 'Tech Solutions',
        amount: 149.99,
        reason: 'Card expired',
        time: '15 minutes ago',
        severity: 'medium'
      },
      {
        id: 'PF-003',
        customer: 'Digital Marketing',
        amount: 99.99,
        reason: 'Payment declined',
        time: '1 hour ago',
        severity: 'low'
      }
    ];
  };

  const recentFailures = getRecentFailures();

  const getSeverityColor = (severity) => {
    const colors = {
      high: 'bg-error-50 text-error-700',
      medium: 'bg-warning-50 text-warning-700',
      low: 'bg-accent-50 text-accent-700'
    };
    return colors?.[severity] || colors?.low;
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards?.map((metric) => (
          <div 
            key={metric?.id}
            className={`bg-surface rounded-lg border border-border-light shadow-card p-4 cursor-pointer transition-all duration-200 ${
              selectedMetric === metric?.id ? 'ring-2 ring-primary' : 'hover:shadow-md'
            }`}
            onClick={() => setSelectedMetric(metric?.id)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm font-medium">{metric?.title}</p>
                <p className="text-xl font-bold text-text-primary mt-1">{metric?.value}</p>
                <div className="flex items-center mt-2">
                  <Icon 
                    name={metric?.trend === 'up' ? 'TrendingUp' : 'TrendingDown'} 
                    size={14} 
                    className={metric?.trend === 'up' ? 'text-success-600' : 'text-error-600'}
                  />
                  <span className={`text-sm ml-1 ${
                    metric?.trend === 'up' ? 'text-success-600' : 'text-error-600'
                  }`}>
                    {metric?.change}
                  </span>
                  <span className="text-text-tertiary text-sm ml-1">vs last period</span>
                </div>
              </div>
              <div className={`w-12 h-12 ${metric?.bgColor} rounded-full flex items-center justify-center`}>
                <Icon name={metric?.icon} size={20} className={metric?.color} />
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recovery Trend Chart */}
        <div className="bg-surface rounded-lg border border-border-light shadow-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-text-primary">Recovery Trends</h3>
            <div className="flex space-x-2">
              <button className="px-3 py-1.5 text-sm bg-primary-50 text-primary rounded-lg">
                Recovery Rate
              </button>
              <button className="px-3 py-1.5 text-sm text-text-secondary hover:bg-surface-hover rounded-lg transition-colors duration-200">
                Revenue
              </button>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={recoveryTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="period" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="recoveryRate" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  name="Recovery Rate (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Step Success Rates */}
        <div className="bg-surface rounded-lg border border-border-light shadow-card p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-6">Success Rate by Step</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stepSuccessData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" stroke="#64748b" />
                <YAxis dataKey="step" type="category" stroke="#64748b" width={80} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="successRate" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Customer Segments */}
        <div className="bg-surface rounded-lg border border-border-light shadow-card p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-6">Performance by Segment</h3>
          <div className="space-y-4">
            {customerSegmentData?.map((segment, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-secondary-25 rounded-lg">
                <div>
                  <div className="font-medium text-text-primary">{segment?.segment}</div>
                  <div className="text-sm text-text-secondary">{segment?.campaigns} campaigns</div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-text-primary">{segment?.recoveryRate}%</div>
                  <div className="text-sm text-text-secondary">{formatCurrency?.(segment?.value) || '$0'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Campaign Distribution */}
        <div className="bg-surface rounded-lg border border-border-light shadow-card p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-6">Campaign Distribution</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={campaignTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {campaignTypeData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry?.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-6 mt-4">
            {campaignTypeData?.map((item, index) => (
              <div key={index} className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: item?.fill }}
                ></div>
                <span className="text-sm text-text-secondary">
                  {item?.type} ({item?.count})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Recent Failures */}
      <div className="bg-surface rounded-lg border border-border-light shadow-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-text-primary">Recent Payment Failures</h3>
          <button className="text-sm text-primary hover:text-primary-700 transition-colors duration-200">
            View All
          </button>
        </div>
        
        <div className="space-y-3">
          {recentFailures?.map((failure) => (
            <div key={failure?.id} className="flex items-center justify-between p-4 border border-border-light rounded-lg hover:bg-secondary-25 transition-colors duration-200">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 rounded-full bg-error-500"></div>
                <div>
                  <div className="font-medium text-text-primary">{failure?.customer}</div>
                  <div className="text-sm text-text-secondary">{failure?.reason}</div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="font-medium text-text-primary">{formatCurrency?.(failure?.amount) || '$0'}</div>
                  <div className="text-sm text-text-secondary">{failure?.time}</div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(failure?.severity)}`}>
                  {failure?.severity}
                </span>
                <button className="p-1.5 text-secondary-600 hover:text-primary hover:bg-primary-50 rounded-lg transition-colors duration-200">
                  <Icon name="ArrowRight" size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Real-time Updates */}
      <div className="bg-surface rounded-lg border border-border-light shadow-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">Real-time Activity</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-text-secondary">Live updates</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-success-50 rounded-lg">
            <div className="text-2xl font-bold text-success-700">12</div>
            <div className="text-sm text-success-600">Successful Recoveries Today</div>
          </div>
          <div className="text-center p-4 bg-warning-50 rounded-lg">
            <div className="text-2xl font-bold text-warning-700">8</div>
            <div className="text-sm text-warning-600">Active Retry Attempts</div>
          </div>
          <div className="text-center p-4 bg-error-50 rounded-lg">
            <div className="text-2xl font-bold text-error-700">3</div>
            <div className="text-sm text-error-600">New Failures (Last Hour)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonitoringDashboard;