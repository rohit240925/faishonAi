// src/pages/dunning-management/components/RuleEngine.jsx
import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const RuleEngine = () => {
  const [rules, setRules] = useState([]);
  const [activeRule, setActiveRule] = useState(null);
  const [isCreatingRule, setIsCreatingRule] = useState(false);
  const [ruleForm, setRuleForm] = useState({
    name: '',
    description: '',
    priority: 1,
    enabled: true,
    conditions: [],
    actions: []
  });

  // Mock existing rules
  const mockRules = [
    {
      id: 'RULE-001',
      name: 'High-Value Customer Priority',
      description: 'Prioritize customers with high subscription values',
      priority: 1,
      enabled: true,
      conditions: [
        { field: 'customer.lifetimeValue', operator: 'greater_than', value: '10000' },
        { field: 'subscription.plan', operator: 'equals', value: 'enterprise' }
      ],
      actions: [
        { type: 'set_workflow', value: 'high-value-workflow' },
        { type: 'extend_grace_period', value: '14' },
        { type: 'notify_account_manager', value: 'true' }
      ],
      lastModified: '2024-01-15T10:30:00Z',
      executionCount: 45
    },
    {
      id: 'RULE-002',
      name: 'New Customer Grace',
      description: 'Extend grace period for customers less than 90 days old',
      priority: 2,
      enabled: true,
      conditions: [
        { field: 'customer.accountAge', operator: 'less_than', value: '90' },
        { field: 'payment.failureCount', operator: 'equals', value: '1' }
      ],
      actions: [
        { type: 'extend_grace_period', value: '10' },
        { type: 'send_welcome_email', value: 'true' }
      ],
      lastModified: '2024-01-12T14:20:00Z',
      executionCount: 23
    },
    {
      id: 'RULE-003',
      name: 'Weekend Retry Delay',
      description: 'Delay retry attempts during weekends',
      priority: 3,
      enabled: false,
      conditions: [
        { field: 'system.dayOfWeek', operator: 'in', value: 'saturday,sunday' }
      ],
      actions: [
        { type: 'delay_retry', value: '48' }
      ],
      lastModified: '2024-01-08T09:15:00Z',
      executionCount: 0
    }
  ];

  // Available condition fields
  const conditionFields = [
    { value: 'customer.lifetimeValue', label: 'Customer Lifetime Value', type: 'number' },
    { value: 'customer.accountAge', label: 'Account Age (days)', type: 'number' },
    { value: 'customer.segment', label: 'Customer Segment', type: 'text' },
    { value: 'subscription.plan', label: 'Subscription Plan', type: 'text' },
    { value: 'subscription.value', label: 'Subscription Value', type: 'number' },
    { value: 'payment.amount', label: 'Payment Amount', type: 'number' },
    { value: 'payment.failureCount', label: 'Failure Count', type: 'number' },
    { value: 'payment.failureReason', label: 'Failure Reason', type: 'text' },
    { value: 'system.dayOfWeek', label: 'Day of Week', type: 'text' },
    { value: 'system.timeOfDay', label: 'Time of Day', type: 'time' }
  ];

  // Available operators
  const operators = [
    { value: 'equals', label: 'equals', types: ['text', 'number'] },
    { value: 'not_equals', label: 'does not equal', types: ['text', 'number'] },
    { value: 'greater_than', label: 'greater than', types: ['number'] },
    { value: 'less_than', label: 'less than', types: ['number'] },
    { value: 'greater_than_or_equal', label: 'greater than or equal', types: ['number'] },
    { value: 'less_than_or_equal', label: 'less than or equal', types: ['number'] },
    { value: 'contains', label: 'contains', types: ['text'] },
    { value: 'starts_with', label: 'starts with', types: ['text'] },
    { value: 'in', label: 'is one of', types: ['text'] },
    { value: 'not_in', label: 'is not one of', types: ['text'] }
  ];

  // Available actions
  const actionTypes = [
    { value: 'set_workflow', label: 'Use Specific Workflow' },
    { value: 'extend_grace_period', label: 'Extend Grace Period' },
    { value: 'delay_retry', label: 'Delay Next Retry' },
    { value: 'skip_retry', label: 'Skip Retry Attempt' },
    { value: 'notify_account_manager', label: 'Notify Account Manager' },
    { value: 'send_welcome_email', label: 'Send Welcome Email' },
    { value: 'escalate_immediately', label: 'Escalate Immediately' },
    { value: 'add_tag', label: 'Add Customer Tag' }
  ];

  React.useEffect(() => {
    setRules(mockRules);
  }, []);

  const addCondition = () => {
    setRuleForm(prev => ({
      ...prev,
      conditions: [...prev?.conditions, { field: '', operator: '', value: '' }]
    }));
  };

  const updateCondition = (index, field, value) => {
    setRuleForm(prev => ({
      ...prev,
      conditions: prev?.conditions?.map((condition, i) => 
        i === index ? { ...condition, [field]: value } : condition
      )
    }));
  };

  const removeCondition = (index) => {
    setRuleForm(prev => ({
      ...prev,
      conditions: prev?.conditions?.filter((_, i) => i !== index)
    }));
  };

  const addAction = () => {
    setRuleForm(prev => ({
      ...prev,
      actions: [...prev?.actions, { type: '', value: '' }]
    }));
  };

  const updateAction = (index, field, value) => {
    setRuleForm(prev => ({
      ...prev,
      actions: prev?.actions?.map((action, i) => 
        i === index ? { ...action, [field]: value } : action
      )
    }));
  };

  const removeAction = (index) => {
    setRuleForm(prev => ({
      ...prev,
      actions: prev?.actions?.filter((_, i) => i !== index)
    }));
  };

  const handleCreateRule = () => {
    setIsCreatingRule(true);
    setRuleForm({
      name: '',
      description: '',
      priority: rules?.length + 1,
      enabled: true,
      conditions: [],
      actions: []
    });
  };

  const handleSaveRule = () => {
    const newRule = {
      id: `RULE-${Date.now()}`,
      ...ruleForm,
      lastModified: new Date()?.toISOString(),
      executionCount: 0
    };
    
    setRules(prev => [...prev, newRule]);
    setIsCreatingRule(false);
    setRuleForm({ name: '', description: '', priority: 1, enabled: true, conditions: [], actions: [] });
  };

  const handleCancelRule = () => {
    setIsCreatingRule(false);
    setRuleForm({ name: '', description: '', priority: 1, enabled: true, conditions: [], actions: [] });
  };

  const toggleRuleStatus = (ruleId) => {
    setRules(prev => prev?.map(rule => 
      rule?.id === ruleId ? { ...rule, enabled: !rule?.enabled } : rule
    ));
  };

  const getFieldType = (fieldValue) => {
    const field = conditionFields?.find(f => f?.value === fieldValue);
    return field?.type || 'text';
  };

  const getAvailableOperators = (fieldValue) => {
    const fieldType = getFieldType(fieldValue);
    return operators?.filter(op => op?.types?.includes(fieldType));
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderConditionBuilder = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-text-primary">Conditions</h4>
        <button
          onClick={addCondition}
          className="text-sm text-primary hover:text-primary-700 transition-colors duration-200 flex items-center"
        >
          <Icon name="Plus" size={16} className="mr-1" />
          Add Condition
        </button>
      </div>
      
      {ruleForm?.conditions?.length === 0 ? (
        <div className="text-center py-6 text-text-secondary border-2 border-dashed border-border-light rounded-lg">
          <Icon name="Filter" size={24} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">No conditions added yet</p>
          <p className="text-xs">Add conditions to define when this rule should execute</p>
        </div>
      ) : (
        <div className="space-y-3">
          {ruleForm?.conditions?.map((condition, index) => (
            <div key={index} className="grid grid-cols-12 gap-3 items-center p-3 bg-secondary-25 rounded-lg">
              <div className="col-span-4">
                <select
                  value={condition?.field}
                  onChange={(e) => updateCondition(index, 'field', e?.target?.value)}
                  className="w-full border border-border-light rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select field...</option>
                  {conditionFields?.map((field) => (
                    <option key={field?.value} value={field?.value}>
                      {field?.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="col-span-3">
                <select
                  value={condition?.operator}
                  onChange={(e) => updateCondition(index, 'operator', e?.target?.value)}
                  className="w-full border border-border-light rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  disabled={!condition?.field}
                >
                  <option value="">Select operator...</option>
                  {getAvailableOperators(condition?.field)?.map((operator) => (
                    <option key={operator?.value} value={operator?.value}>
                      {operator?.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="col-span-4">
                <input
                  type={getFieldType(condition?.field) === 'number' ? 'number' : 'text'}
                  value={condition?.value}
                  onChange={(e) => updateCondition(index, 'value', e?.target?.value)}
                  placeholder="Enter value..."
                  className="w-full border border-border-light rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              
              <div className="col-span-1">
                <button
                  onClick={() => removeCondition(index)}
                  className="p-1 text-error hover:bg-error-50 rounded transition-colors duration-200"
                >
                  <Icon name="X" size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderActionBuilder = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-text-primary">Actions</h4>
        <button
          onClick={addAction}
          className="text-sm text-primary hover:text-primary-700 transition-colors duration-200 flex items-center"
        >
          <Icon name="Plus" size={16} className="mr-1" />
          Add Action
        </button>
      </div>
      
      {ruleForm?.actions?.length === 0 ? (
        <div className="text-center py-6 text-text-secondary border-2 border-dashed border-border-light rounded-lg">
          <Icon name="Zap" size={24} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">No actions added yet</p>
          <p className="text-xs">Add actions to define what happens when conditions are met</p>
        </div>
      ) : (
        <div className="space-y-3">
          {ruleForm?.actions?.map((action, index) => (
            <div key={index} className="grid grid-cols-12 gap-3 items-center p-3 bg-secondary-25 rounded-lg">
              <div className="col-span-5">
                <select
                  value={action?.type}
                  onChange={(e) => updateAction(index, 'type', e?.target?.value)}
                  className="w-full border border-border-light rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select action...</option>
                  {actionTypes?.map((actionType) => (
                    <option key={actionType?.value} value={actionType?.value}>
                      {actionType?.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="col-span-6">
                <input
                  type="text"
                  value={action?.value}
                  onChange={(e) => updateAction(index, 'value', e?.target?.value)}
                  placeholder="Enter value..."
                  className="w-full border border-border-light rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              
              <div className="col-span-1">
                <button
                  onClick={() => removeAction(index)}
                  className="p-1 text-error hover:bg-error-50 rounded transition-colors duration-200"
                >
                  <Icon name="X" size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-text-primary">Automation Rules</h2>
          <p className="text-text-secondary">Create conditional rules for automated dunning workflow routing</p>
        </div>
        <button
          onClick={handleCreateRule}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center hover:bg-primary-700 transition-colors duration-200"
        >
          <Icon name="Plus" size={18} className="mr-2" />
          Create Rule
        </button>
      </div>
      {/* Rules List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <div className="space-y-4">
            {rules?.map((rule) => (
              <div
                key={rule?.id}
                className={`bg-surface rounded-lg border border-border-light shadow-card p-4 cursor-pointer transition-all duration-200 ${
                  activeRule?.id === rule?.id ? 'ring-2 ring-primary' : 'hover:shadow-md'
                }`}
                onClick={() => setActiveRule(rule)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-medium text-text-primary">{rule?.name}</h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        rule?.enabled ? 'bg-success-50 text-success-700' : 'bg-secondary-50 text-secondary-700'
                      }`}>
                        <div className={`w-2 h-2 rounded-full mr-1 ${
                          rule?.enabled ? 'bg-success-500' : 'bg-secondary-400'
                        }`}></div>
                        {rule?.enabled ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary mb-2">{rule?.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-text-tertiary">
                      <span>Priority: {rule?.priority}</span>
                      <span>Executed: {rule?.executionCount} times</span>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={(e) => {
                        e?.stopPropagation();
                        toggleRuleStatus(rule?.id);
                      }}
                      className={`p-1.5 rounded-lg transition-colors duration-200 ${
                        rule?.enabled
                          ? 'text-warning hover:bg-warning-50' :'text-success hover:bg-success-50'
                      }`}
                      title={rule?.enabled ? 'Disable Rule' : 'Enable Rule'}
                    >
                      <Icon name={rule?.enabled ? 'Pause' : 'Play'} size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e?.stopPropagation();
                        console.log('Edit rule:', rule?.id);
                      }}
                      className="p-1.5 text-secondary-600 hover:text-primary hover:bg-primary-50 rounded-lg transition-colors duration-200"
                      title="Edit Rule"
                    >
                      <Icon name="Edit" size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-text-tertiary">
                  <span>{rule?.conditions?.length} condition(s), {rule?.actions?.length} action(s)</span>
                  <span>Modified: {formatDate(rule?.lastModified)}</span>
                </div>
              </div>
            ))}

            {rules?.length === 0 && (
              <div className="text-center py-8">
                <Icon name="Filter" size={32} className="text-secondary-400 mx-auto mb-3" />
                <h3 className="text-sm font-medium text-text-primary mb-1">No rules created yet</h3>
                <p className="text-xs text-text-secondary mb-4">Create automated rules to customize dunning behavior</p>
                <button
                  onClick={handleCreateRule}
                  className="bg-primary text-white px-4 py-2 rounded-lg flex items-center mx-auto hover:bg-primary-700 transition-colors duration-200"
                >
                  <Icon name="Plus" size={18} className="mr-2" />
                  Create First Rule
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Rule Details/Creator */}
        <div className="lg:col-span-7">
          {isCreatingRule ? (
            <div className="bg-surface rounded-lg border border-border-light shadow-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-text-primary">Create New Rule</h3>
                <div className="flex space-x-3">
                  <button
                    onClick={handleCancelRule}
                    className="px-3 py-1.5 text-sm border border-border-light rounded hover:bg-surface-hover transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveRule}
                    className="px-3 py-1.5 text-sm bg-primary text-white rounded hover:bg-primary-700 transition-colors duration-200"
                    disabled={!ruleForm?.name || ruleForm?.conditions?.length === 0 || ruleForm?.actions?.length === 0}
                  >
                    Save Rule
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Rule Name</label>
                    <input
                      type="text"
                      value={ruleForm?.name}
                      onChange={(e) => setRuleForm(prev => ({ ...prev, name: e?.target?.value }))}
                      className="w-full border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter rule name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Priority</label>
                    <input
                      type="number"
                      value={ruleForm?.priority}
                      onChange={(e) => setRuleForm(prev => ({ ...prev, priority: parseInt(e?.target?.value) || 1 }))}
                      className="w-full border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      min="1"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Description</label>
                  <textarea
                    value={ruleForm?.description}
                    onChange={(e) => setRuleForm(prev => ({ ...prev, description: e?.target?.value }))}
                    rows={2}
                    className="w-full border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Describe what this rule does"
                  />
                </div>

                {renderConditionBuilder()}
                {renderActionBuilder()}
              </div>
            </div>
          ) : activeRule ? (
            <div className="bg-surface rounded-lg border border-border-light shadow-card p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Icon name="Filter" size={20} className="text-primary" />
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary">{activeRule?.name}</h3>
                    <p className="text-text-secondary">{activeRule?.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    activeRule?.enabled ? 'bg-success-50 text-success-700' : 'bg-secondary-50 text-secondary-700'
                  }`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      activeRule?.enabled ? 'bg-success-500' : 'bg-secondary-400'
                    }`}></div>
                    {activeRule?.enabled ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-text-primary">{activeRule?.priority}</div>
                    <div className="text-sm text-text-secondary">Priority</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-text-primary">{activeRule?.executionCount}</div>
                    <div className="text-sm text-text-secondary">Executions</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-text-primary">{activeRule?.conditions?.length}</div>
                    <div className="text-sm text-text-secondary">Conditions</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-text-primary mb-3">Conditions</h4>
                  <div className="space-y-2">
                    {activeRule?.conditions?.map((condition, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-secondary-25 rounded-lg">
                        <Icon name="Filter" size={16} className="text-primary" />
                        <span className="text-sm">
                          <span className="font-medium">{condition?.field}</span>
                          <span className="text-text-secondary mx-2">{condition?.operator?.replace('_', ' ')}</span>
                          <span className="font-medium">{condition?.value}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-text-primary mb-3">Actions</h4>
                  <div className="space-y-2">
                    {activeRule?.actions?.map((action, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-accent-25 rounded-lg">
                        <Icon name="Zap" size={16} className="text-accent-600" />
                        <span className="text-sm">
                          <span className="font-medium">{action?.type?.replace('_', ' ')}</span>
                          {action?.value && (
                            <span className="text-text-secondary mx-2">→</span>
                          )}
                          {action?.value && (
                            <span className="font-medium">{action?.value}</span>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-border-light text-sm text-text-tertiary">
                  Last modified: {formatDate(activeRule?.lastModified)}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-surface rounded-lg border border-border-light shadow-card p-8 text-center">
              <Icon name="Filter" size={48} className="text-secondary-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-text-primary mb-2">Select a Rule</h3>
              <p className="text-text-secondary mb-6">Choose a rule from the list to view its details and configuration</p>
              <button
                onClick={handleCreateRule}
                className="bg-primary text-white px-4 py-2 rounded-lg flex items-center mx-auto hover:bg-primary-700 transition-colors duration-200"
              >
                <Icon name="Plus" size={18} className="mr-2" />
                Create New Rule
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RuleEngine;