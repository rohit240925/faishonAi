import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const QuickActions = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Create Subscription',
      description: 'Set up new customer subscription',
      icon: 'UserPlus',
      color: 'bg-primary',
      hoverColor: 'hover:bg-primary-700',
      textColor: 'text-white',
      path: '/subscription-management',
      stats: '12 this week'
    },
    {
      title: 'Generate Invoice',
      description: 'Create and send customer invoice',
      icon: 'FileText',
      color: 'bg-success-600',
      hoverColor: 'hover:bg-success-700',
      textColor: 'text-white',
      path: '/invoice-management',
      stats: '45 pending'
    },
    {
      title: 'Dunning Workflow',
      description: 'Manage failed payment recovery',
      icon: 'AlertCircle',
      color: 'bg-warning-600',
      hoverColor: 'hover:bg-warning-700',
      textColor: 'text-white',
      path: '/dunning-management',
      stats: '8 active'
    },
    {
      title: 'Usage Analytics',
      description: 'View detailed usage reports',
      icon: 'BarChart3',
      color: 'bg-accent-600',
      hoverColor: 'hover:bg-accent-700',
      textColor: 'text-white',
      path: '/usage-analytics-reporting',
      stats: 'Updated 2h ago'
    }
  ];

  const recentTasks = [
    {
      id: 1,
      title: 'Review failed payments',
      description: 'Check and retry 5 failed subscription payments',
      priority: 'high',
      dueDate: 'Today',
      icon: 'CreditCard'
    },
    {
      id: 2,
      title: 'Update payment gateway',
      description: 'Configure new Stripe webhook endpoints',
      priority: 'medium',
      dueDate: 'Tomorrow',
      icon: 'Settings'
    },
    {
      id: 3,
      title: 'Generate monthly reports',
      description: 'Prepare revenue reports for stakeholders',
      priority: 'low',
      dueDate: 'This week',
      icon: 'FileText'
    }
  ];

  const handleActionClick = (path) => {
    navigate(path);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-error-100 text-error-700 border-error-200';
      case 'medium':
        return 'bg-warning-100 text-warning-700 border-warning-200';
      case 'low':
        return 'bg-success-100 text-success-700 border-success-200';
      default:
        return 'bg-secondary-100 text-secondary-700 border-secondary-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="bg-surface rounded-lg shadow-card border border-border-light p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-text-primary">Quick Actions</h3>
          <Icon name="Zap" size={20} className="text-accent-600" />
        </div>
        
        <div className="space-y-3">
          {quickActions?.map((action, index) => (
            <button
              key={index}
              onClick={() => handleActionClick(action?.path)}
              className={`w-full ${action?.color} ${action?.hoverColor} ${action?.textColor} rounded-lg p-4 transition-all duration-200 transform hover:scale-105 hover:shadow-medium`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <Icon name={action?.icon} size={20} />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-semibold text-sm">{action?.title}</h4>
                  <p className="text-xs opacity-90">{action?.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-xs opacity-75">{action?.stats}</div>
                  <Icon name="ArrowRight" size={16} className="mt-1" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      {/* Pending Tasks */}
      <div className="bg-surface rounded-lg shadow-card border border-border-light p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-text-primary">Pending Tasks</h3>
          <span className="bg-primary-100 text-primary-700 text-xs font-medium px-2 py-1 rounded-full">
            {recentTasks?.length} tasks
          </span>
        </div>
        
        <div className="space-y-4">
          {recentTasks?.map((task) => (
            <div
              key={task?.id}
              className="border border-border-light rounded-lg p-4 hover:bg-surface-hover transition-colors duration-200"
            >
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center mt-1">
                  <Icon name={task?.icon} size={16} className="text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-text-primary text-sm">{task?.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(task?.priority)}`}>
                      {task?.priority}
                    </span>
                  </div>
                  <p className="text-text-secondary text-xs mb-2">{task?.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-text-tertiary text-xs">Due: {task?.dueDate}</span>
                    <button className="text-primary hover:text-primary-700 text-xs font-medium">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <button className="w-full mt-4 text-primary hover:text-primary-700 text-sm font-medium py-2 border border-border-light rounded-lg hover:bg-surface-hover transition-colors duration-200">
          View All Tasks
        </button>
      </div>
      {/* System Status */}
      <div className="bg-surface rounded-lg shadow-card border border-border-light p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-text-primary">System Status</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success-500 rounded-full"></div>
            <span className="text-sm text-success-600 font-medium">All Systems Operational</span>
          </div>
        </div>
        
        <div className="space-y-3">
          {[
            { name: 'Payment Processing', status: 'operational', uptime: '99.9%' },
            { name: 'API Services', status: 'operational', uptime: '99.8%' },
            { name: 'Webhook Delivery', status: 'operational', uptime: '99.7%' },
            { name: 'Email Notifications', status: 'operational', uptime: '99.9%' }
          ]?.map((service, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                <span className="text-sm text-text-primary">{service?.name}</span>
              </div>
              <span className="text-sm text-text-secondary">{service?.uptime}</span>
            </div>
          ))}
        </div>
        
        <button className="w-full mt-4 text-primary hover:text-primary-700 text-sm font-medium py-2 border border-border-light rounded-lg hover:bg-surface-hover transition-colors duration-200">
          View Status Page
        </button>
      </div>
    </div>
  );
};

export default QuickActions;