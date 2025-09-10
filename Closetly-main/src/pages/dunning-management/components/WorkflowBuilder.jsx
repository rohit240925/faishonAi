// src/pages/dunning-management/components/WorkflowBuilder.jsx
import React, { useState, useRef, useCallback } from 'react';
import Icon from '../../../components/AppIcon';

const WorkflowBuilder = ({ isOpen, onClose, onSave }) => {
  const [workflowName, setWorkflowName] = useState('');
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [draggedNode, setDraggedNode] = useState(null);
  const canvasRef = useRef(null);

  // Available workflow components
  const workflowComponents = [
    {
      id: 'start',
      type: 'start',
      label: 'Start',
      icon: 'Play',
      color: 'bg-success-50 border-success-200',
      description: 'Trigger when payment fails'
    },
    {
      id: 'retry',
      type: 'action',
      label: 'Retry Payment',
      icon: 'RefreshCw',
      color: 'bg-primary-50 border-primary-200',
      description: 'Attempt to charge payment method again'
    },
    {
      id: 'email',
      type: 'action',
      label: 'Send Email',
      icon: 'Mail',
      color: 'bg-accent-50 border-accent-200',
      description: 'Send notification email to customer'
    },
    {
      id: 'grace',
      type: 'action',
      label: 'Grace Period',
      icon: 'Clock',
      color: 'bg-warning-50 border-warning-200',
      description: 'Wait before next action'
    },
    {
      id: 'escalate',
      type: 'action',
      label: 'Escalate',
      icon: 'AlertTriangle',
      color: 'bg-error-50 border-error-200',
      description: 'Escalate to manual review'
    },
    {
      id: 'condition',
      type: 'condition',
      label: 'Condition',
      icon: 'GitBranch',
      color: 'bg-purple-50 border-purple-200',
      description: 'Branch based on customer attributes'
    },
    {
      id: 'suspend',
      type: 'action',
      label: 'Suspend Account',
      icon: 'UserX',
      color: 'bg-red-50 border-red-200',
      description: 'Suspend customer account'
    },
    {
      id: 'end',
      type: 'end',
      label: 'End',
      icon: 'Square',
      color: 'bg-secondary-50 border-secondary-200',
      description: 'End workflow execution'
    }
  ];

  const handleDragStart = (e, component) => {
    setDraggedNode(component);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    if (!draggedNode) return;

    const canvas = canvasRef?.current;
    const rect = canvas?.getBoundingClientRect();
    const x = e?.clientX - rect?.left;
    const y = e?.clientY - rect?.top;

    const newNode = {
      id: `${draggedNode?.id}_${Date.now()}`,
      type: draggedNode?.type,
      label: draggedNode?.label,
      icon: draggedNode?.icon,
      color: draggedNode?.color,
      x: x - 50, // Center the node on drop
      y: y - 25,
      config: {}
    };

    setNodes([...nodes, newNode]);
    setDraggedNode(null);
  };

  const handleNodeClick = (node) => {
    setSelectedNode(node);
  };

  const handleSaveWorkflow = () => {
    const workflowData = {
      name: workflowName,
      description: workflowDescription,
      nodes,
      connections
    };
    onSave(workflowData);
  };

  const renderNodeConfig = () => {
    if (!selectedNode) {
      return (
        <div className="text-center py-8 text-text-secondary">
          <Icon name="MousePointer" size={32} className="mx-auto mb-3 opacity-50" />
          <p>Select a node to configure its properties</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-3 pb-3 border-b border-border-light">
          <div className={`w-8 h-8 rounded-lg ${selectedNode?.color} flex items-center justify-center`}>
            <Icon name={selectedNode?.icon} size={16} />
          </div>
          <div>
            <h4 className="font-medium text-text-primary">{selectedNode?.label}</h4>
            <p className="text-sm text-text-secondary">Configure node properties</p>
          </div>
        </div>
        {selectedNode?.type === 'retry' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Retry Interval</label>
              <select className="w-full border border-border-light rounded-lg px-3 py-2 text-sm">
                <option>1 hour</option>
                <option>6 hours</option>
                <option>24 hours</option>
                <option>3 days</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Max Attempts</label>
              <input
                type="number"
                min="1"
                max="10"
                defaultValue="3"
                className="w-full border border-border-light rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>
        )}
        {selectedNode?.type === 'email' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Email Template</label>
              <select className="w-full border border-border-light rounded-lg px-3 py-2 text-sm">
                <option>Payment Failed Reminder</option>
                <option>Update Payment Method</option>
                <option>Account Suspension Warning</option>
                <option>Final Notice</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Send Delay</label>
              <select className="w-full border border-border-light rounded-lg px-3 py-2 text-sm">
                <option>Immediate</option>
                <option>1 hour</option>
                <option>24 hours</option>
                <option>3 days</option>
              </select>
            </div>
          </div>
        )}
        {selectedNode?.type === 'grace' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Grace Period Duration</label>
              <select className="w-full border border-border-light rounded-lg px-3 py-2 text-sm">
                <option>3 days</option>
                <option>7 days</option>
                <option>14 days</option>
                <option>30 days</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="allowAccess" className="rounded" />
              <label htmlFor="allowAccess" className="text-sm text-text-secondary">Allow service access during grace period</label>
            </div>
          </div>
        )}
        {selectedNode?.type === 'condition' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Condition Type</label>
              <select className="w-full border border-border-light rounded-lg px-3 py-2 text-sm">
                <option>Customer Value</option>
                <option>Subscription Plan</option>
                <option>Payment History</option>
                <option>Account Age</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Operator</label>
              <select className="w-full border border-border-light rounded-lg px-3 py-2 text-sm">
                <option>Greater than</option>
                <option>Less than</option>
                <option>Equal to</option>
                <option>Contains</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Value</label>
              <input
                type="text"
                placeholder="Enter condition value"
                className="w-full border border-border-light rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-surface rounded-lg shadow-modal w-full max-w-7xl h-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-light">
          <div>
            <h2 className="text-xl font-semibold text-text-primary">Workflow Builder</h2>
            <p className="text-text-secondary">Create automated dunning workflows with drag-and-drop components</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-hover rounded-lg transition-colors duration-200"
          >
            <Icon name="X" size={20} className="text-text-secondary" />
          </button>
        </div>

        {/* Workflow Details */}
        <div className="p-6 border-b border-border-light bg-secondary-25">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Workflow Name</label>
              <input
                type="text"
                value={workflowName}
                onChange={(e) => setWorkflowName(e?.target?.value)}
                placeholder="Enter workflow name"
                className="w-full border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Description</label>
              <input
                type="text"
                value={workflowDescription}
                onChange={(e) => setWorkflowDescription(e?.target?.value)}
                placeholder="Describe this workflow"
                className="w-full border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Component Palette */}
          <div className="w-80 border-r border-border-light p-4 overflow-y-auto">
            <h3 className="font-medium text-text-primary mb-4">Workflow Components</h3>
            <div className="space-y-2">
              {workflowComponents?.map((component) => (
                <div
                  key={component?.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, component)}
                  className={`p-3 border-2 border-dashed ${component?.color} rounded-lg cursor-move hover:shadow-sm transition-shadow duration-200`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon name={component?.icon} size={20} />
                    <div>
                      <div className="font-medium text-sm">{component?.label}</div>
                      <div className="text-xs text-text-secondary mt-1">{component?.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 relative">
              <div
                ref={canvasRef}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="w-full h-full bg-secondary-25 relative overflow-auto"
                style={{
                  backgroundImage: 'radial-gradient(circle, #e2e8f0 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }}
              >
                {/* Canvas Instructions */}
                {nodes?.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-text-secondary">
                      <Icon name="MousePointer" size={48} className="mx-auto mb-4 opacity-30" />
                      <p className="text-lg font-medium mb-2">Drag components here to build your workflow</p>
                      <p className="text-sm">Start by dragging a "Start" component from the palette</p>
                    </div>
                  </div>
                )}

                {/* Render Nodes */}
                {nodes?.map((node) => (
                  <div
                    key={node?.id}
                    onClick={() => handleNodeClick(node)}
                    className={`absolute w-24 h-12 ${node?.color} border-2 rounded-lg cursor-pointer hover:shadow-md transition-shadow duration-200 flex items-center justify-center ${
                      selectedNode?.id === node?.id ? 'ring-2 ring-primary' : ''
                    }`}
                    style={{ left: node?.x, top: node?.y }}
                  >
                    <div className="text-center">
                      <Icon name={node?.icon} size={16} className="mx-auto mb-1" />
                      <div className="text-xs font-medium">{node?.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Canvas Toolbar */}
            <div className="border-t border-border-light p-4 bg-surface">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-text-secondary">
                  <Icon name="Info" size={16} />
                  <span>Drag components from the palette to the canvas</span>
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1.5 text-sm border border-border-light rounded hover:bg-surface-hover transition-colors duration-200">
                    Clear Canvas
                  </button>
                  <button className="px-3 py-1.5 text-sm border border-border-light rounded hover:bg-surface-hover transition-colors duration-200">
                    Auto Layout
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Properties Panel */}
          <div className="w-80 border-l border-border-light p-4 overflow-y-auto">
            <h3 className="font-medium text-text-primary mb-4">Node Properties</h3>
            {renderNodeConfig()}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border-light bg-secondary-25">
          <div className="text-sm text-text-secondary">
            {nodes?.length} components added
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-text-secondary border border-border-light rounded-lg hover:bg-surface-hover transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveWorkflow}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
              disabled={!workflowName || nodes?.length === 0}
            >
              Save Workflow
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowBuilder;