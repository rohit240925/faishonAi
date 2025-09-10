// src/pages/dunning-management/components/ActiveCampaignsTable.jsx
import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';

const ActiveCampaignsTable = ({ campaigns, isLoading, onCampaignAction, formatCurrency }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedCampaigns, setSelectedCampaigns] = useState([]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { bgColor: 'bg-success-50', textColor: 'text-success-700', icon: 'Play' },
      pending: { bgColor: 'bg-warning-50', textColor: 'text-warning-700', icon: 'Clock' },
      escalated: { bgColor: 'bg-error-50', textColor: 'text-error-700', icon: 'AlertTriangle' },
      paused: { bgColor: 'bg-secondary-50', textColor: 'text-secondary-700', icon: 'Pause' },
      completed: { bgColor: 'bg-success-50', textColor: 'text-success-700', icon: 'CheckCircle' }
    };

    const config = statusConfig?.[status] || statusConfig?.active;
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config?.bgColor} ${config?.textColor}`}>
        <Icon name={config?.icon} size={12} className="mr-1" />
        {status?.charAt(0)?.toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  const getProbabilityBadge = (probability) => {
    let color = 'bg-error-50 text-error-700';
    if (probability >= 70) color = 'bg-success-50 text-success-700';
    else if (probability >= 40) color = 'bg-warning-50 text-warning-700';

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${color}`}>
        {probability}%
      </span>
    );
  };

  const getFailureReasonIcon = (reason) => {
    const reasonIcons = {
      'Insufficient funds': 'CreditCard',
      'Card expired': 'Calendar',
      'Payment method declined': 'XCircle',
      'Account closed': 'Lock',
      'Technical error': 'AlertCircle'
    };
    return reasonIcons?.[reason] || 'AlertCircle';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date?.getTime() - now?.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays > 1) return `In ${diffDays} days`;
    if (diffDays === -1) return 'Yesterday';
    return `${Math.abs(diffDays)} days ago`;
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig?.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedCampaigns = React.useMemo(() => {
    if (!sortConfig?.key) return campaigns;

    return [...campaigns]?.sort((a, b) => {
      let aValue, bValue;

      switch (sortConfig?.key) {
        case 'customer':
          aValue = a?.customerName;
          bValue = b?.customerName;
          break;
        case 'amount':
          aValue = a?.amount;
          bValue = b?.amount;
          break;
        case 'probability':
          aValue = a?.successProbability;
          bValue = b?.successProbability;
          break;
        case 'nextAction':
          aValue = new Date(a.nextActionDate);
          bValue = new Date(b.nextActionDate);
          break;
        default:
          aValue = a?.[sortConfig?.key];
          bValue = b?.[sortConfig?.key];
      }

      if (aValue < bValue) return sortConfig?.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig?.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [campaigns, sortConfig]);

  const filteredCampaigns = sortedCampaigns?.filter(campaign => {
    if (!searchQuery) return true;
    const query = searchQuery?.toLowerCase();
    return (campaign?.customerName?.toLowerCase()?.includes(query) ||
    campaign?.customerEmail?.toLowerCase()?.includes(query) ||
    campaign?.id?.toLowerCase()?.includes(query) || campaign?.failureReason?.toLowerCase()?.includes(query));
  });

  const allSelected = filteredCampaigns?.length > 0 && selectedCampaigns?.length === filteredCampaigns?.length;

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedCampaigns(filteredCampaigns?.map(c => c?.id));
    } else {
      setSelectedCampaigns([]);
    }
  };

  const handleSelectCampaign = (campaignId) => {
    setSelectedCampaigns(prev => 
      prev?.includes(campaignId)
        ? prev?.filter(id => id !== campaignId)
        : [...prev, campaignId]
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin mb-4">
          <Icon name="Loader" size={32} className="text-primary" />
        </div>
        <p className="text-text-secondary">Loading active campaigns...</p>
      </div>
    );
  }

  if (campaigns?.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Target" size={24} className="text-primary" />
        </div>
        <h3 className="text-lg font-medium text-text-primary mb-2">No Active Campaigns</h3>
        <p className="text-text-secondary mb-6">All payments are processing successfully. No dunning campaigns are currently active.</p>
        <button className="bg-primary text-white px-4 py-2 rounded-lg flex items-center mx-auto hover:bg-primary-700 transition-colors duration-200">
          <Icon name="Plus" size={18} className="mr-2" />
          Create Manual Campaign
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon name="Search" size={20} className="text-secondary-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
            placeholder="Search campaigns..."
            className="block w-full pl-10 pr-3 py-2 border border-border-light rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
          />
        </div>

        {selectedCampaigns?.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-text-secondary">
              {selectedCampaigns?.length} selected
            </span>
            <button
              onClick={() => onCampaignAction('pause', selectedCampaigns)}
              className="px-3 py-1.5 text-sm border border-border-light rounded hover:bg-surface-hover transition-colors duration-200"
            >
              Pause Selected
            </button>
            <button
              onClick={() => onCampaignAction('modify', selectedCampaigns)}
              className="px-3 py-1.5 text-sm bg-primary text-white rounded hover:bg-primary-700 transition-colors duration-200"
            >
              Modify Selected
            </button>
          </div>
        )}
      </div>
      {/* Desktop Table */}
      <div className="hidden lg:block bg-surface rounded-lg border border-border-light shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-secondary-50 border-b border-border-light">
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) => handleSelectAll(e?.target?.checked)}
                    className="rounded border-border-medium text-primary focus:ring-primary"
                  />
                </th>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort('customer')}
                    className="text-xs font-medium text-secondary-500 uppercase tracking-wider flex items-center hover:text-text-primary transition-colors duration-200"
                  >
                    Customer
                    <Icon name="ChevronsUpDown" size={14} className="ml-1" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <span className="text-xs font-medium text-secondary-500 uppercase tracking-wider">Failure Reason</span>
                </th>
                <th className="px-6 py-3 text-left">
                  <span className="text-xs font-medium text-secondary-500 uppercase tracking-wider">Current Step</span>
                </th>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort('nextAction')}
                    className="text-xs font-medium text-secondary-500 uppercase tracking-wider flex items-center hover:text-text-primary transition-colors duration-200"
                  >
                    Next Action
                    <Icon name="ChevronsUpDown" size={14} className="ml-1" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort('probability')}
                    className="text-xs font-medium text-secondary-500 uppercase tracking-wider flex items-center hover:text-text-primary transition-colors duration-200"
                  >
                    Success Rate
                    <Icon name="ChevronsUpDown" size={14} className="ml-1" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort('amount')}
                    className="text-xs font-medium text-secondary-500 uppercase tracking-wider flex items-center hover:text-text-primary transition-colors duration-200"
                  >
                    Amount
                    <Icon name="ChevronsUpDown" size={14} className="ml-1" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <span className="text-xs font-medium text-secondary-500 uppercase tracking-wider">Status</span>
                </th>
                <th className="px-6 py-3 text-right">
                  <span className="text-xs font-medium text-secondary-500 uppercase tracking-wider">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {filteredCampaigns?.map((campaign) => (
                <tr key={campaign?.id} className="hover:bg-secondary-50 transition-colors duration-150">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedCampaigns?.includes(campaign?.id)}
                      onChange={() => handleSelectCampaign(campaign?.id)}
                      className="rounded border-border-medium text-primary focus:ring-primary"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary-50 rounded-full flex items-center justify-center text-primary font-medium text-sm">
                        {campaign?.customerName?.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-text-primary">{campaign?.customerName}</div>
                        <div className="text-xs text-text-secondary">{campaign?.customerEmail}</div>
                        <div className="text-xs text-text-tertiary">{campaign?.subscriptionId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Icon name={getFailureReasonIcon(campaign?.failureReason)} size={16} className="text-error-500 mr-2" />
                      <span className="text-sm text-text-primary">{campaign?.failureReason}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-text-primary">{campaign?.currentStep}</div>
                    <div className="text-xs text-text-secondary">
                      Attempt {campaign?.attempts + 1} of {campaign?.maxAttempts}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-text-primary">{formatDate(campaign?.nextActionDate)}</div>
                    <div className="text-xs text-text-secondary">
                      {new Date(campaign.nextActionDate)?.toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getProbabilityBadge(campaign?.successProbability)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-text-primary">
                      {formatCurrency(campaign?.amount, campaign?.currency)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(campaign?.status)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onCampaignAction('view', campaign?.id)}
                        className="p-1.5 text-secondary-600 hover:text-primary hover:bg-primary-50 rounded-lg transition-colors duration-200"
                        title="View Details"
                      >
                        <Icon name="Eye" size={16} />
                      </button>
                      <button
                        onClick={() => onCampaignAction('modify', campaign?.id)}
                        className="p-1.5 text-secondary-600 hover:text-warning hover:bg-warning-50 rounded-lg transition-colors duration-200"
                        title="Modify Campaign"
                      >
                        <Icon name="Edit" size={16} />
                      </button>
                      {campaign?.status === 'active' ? (
                        <button
                          onClick={() => onCampaignAction('pause', campaign?.id)}
                          className="p-1.5 text-secondary-600 hover:text-error hover:bg-error-50 rounded-lg transition-colors duration-200"
                          title="Pause Campaign"
                        >
                          <Icon name="Pause" size={16} />
                        </button>
                      ) : (
                        <button
                          onClick={() => onCampaignAction('resume', campaign?.id)}
                          className="p-1.5 text-secondary-600 hover:text-success hover:bg-success-50 rounded-lg transition-colors duration-200"
                          title="Resume Campaign"
                        >
                          <Icon name="Play" size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {filteredCampaigns?.map((campaign) => (
          <div key={campaign?.id} className="bg-surface rounded-lg border border-border-light shadow-card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedCampaigns?.includes(campaign?.id)}
                  onChange={() => handleSelectCampaign(campaign?.id)}
                  className="rounded border-border-medium text-primary focus:ring-primary mr-3"
                />
                <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center text-primary font-medium">
                  {campaign?.customerName?.charAt(0)}
                </div>
                <div className="ml-3">
                  <div className="font-medium text-text-primary">{campaign?.customerName}</div>
                  <div className="text-sm text-text-secondary">{campaign?.customerEmail}</div>
                </div>
              </div>
              {getStatusBadge(campaign?.status)}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <div className="text-xs text-text-tertiary mb-1">Failure Reason</div>
                <div className="flex items-center">
                  <Icon name={getFailureReasonIcon(campaign?.failureReason)} size={14} className="text-error-500 mr-1" />
                  <span className="text-sm text-text-primary">{campaign?.failureReason}</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-text-tertiary mb-1">Amount</div>
                <div className="text-sm font-medium text-text-primary">
                  {formatCurrency(campaign?.amount, campaign?.currency)}
                </div>
              </div>
              <div>
                <div className="text-xs text-text-tertiary mb-1">Current Step</div>
                <div className="text-sm text-text-primary">{campaign?.currentStep}</div>
              </div>
              <div>
                <div className="text-xs text-text-tertiary mb-1">Success Rate</div>
                {getProbabilityBadge(campaign?.successProbability)}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border-light">
              <div>
                <div className="text-xs text-text-tertiary">Next Action</div>
                <div className="text-sm font-medium text-text-primary">{formatDate(campaign?.nextActionDate)}</div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onCampaignAction('view', campaign?.id)}
                  className="p-2 text-secondary-600 hover:text-primary hover:bg-primary-50 rounded-lg transition-colors duration-200"
                >
                  <Icon name="Eye" size={16} />
                </button>
                <button
                  onClick={() => onCampaignAction('modify', campaign?.id)}
                  className="p-2 text-secondary-600 hover:text-warning hover:bg-warning-50 rounded-lg transition-colors duration-200"
                >
                  <Icon name="Edit" size={16} />
                </button>
                {campaign?.status === 'active' ? (
                  <button
                    onClick={() => onCampaignAction('pause', campaign?.id)}
                    className="p-2 text-secondary-600 hover:text-error hover:bg-error-50 rounded-lg transition-colors duration-200"
                  >
                    <Icon name="Pause" size={16} />
                  </button>
                ) : (
                  <button
                    onClick={() => onCampaignAction('resume', campaign?.id)}
                    className="p-2 text-secondary-600 hover:text-success hover:bg-success-50 rounded-lg transition-colors duration-200"
                  >
                    <Icon name="Play" size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Results Summary */}
      {filteredCampaigns?.length > 0 && (
        <div className="text-sm text-text-secondary text-center">
          Showing {filteredCampaigns?.length} of {campaigns?.length} active campaigns
        </div>
      )}
      {/* No Results */}
      {campaigns?.length > 0 && filteredCampaigns?.length === 0 && (
        <div className="text-center py-8">
          <Icon name="Search" size={24} className="text-secondary-400 mx-auto mb-3" />
          <h3 className="text-sm font-medium text-text-primary mb-1">No results found</h3>
          <p className="text-xs text-text-secondary">
            No campaigns match "<span className="font-medium">{searchQuery}</span>"
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="mt-3 text-sm text-primary hover:text-primary-700 transition-colors duration-200"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
};

export default ActiveCampaignsTable;