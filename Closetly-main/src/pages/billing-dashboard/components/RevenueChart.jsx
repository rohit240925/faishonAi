import React, { useState } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';

const RevenueChart = ({ title, data, selectedCurrency, formatCurrency }) => {
  const [chartType, setChartType] = useState('line');
  const [selectedMetric, setSelectedMetric] = useState('mrr');

  const metricOptions = [
    { value: 'mrr', label: 'MRR', color: '#3b82f6' },
    { value: 'arr', label: 'ARR', color: '#059669' },
    { value: 'subscriptions', label: 'Subscriptions', color: '#f59e0b' }
  ];

  const chartTypes = [
    { value: 'line', label: 'Line Chart', icon: 'TrendingUp' },
    { value: 'area', label: 'Area Chart', icon: 'BarChart3' }
  ];

  const getCurrentMetric = () => {
    return metricOptions?.find(m => m?.value === selectedMetric);
  };

  const formatTooltipValue = (value, name) => {
    if (name === 'subscriptions') {
      return [value?.toLocaleString(), 'Subscriptions'];
    }
    return [formatCurrency(value), name?.toUpperCase()];
  };

  const renderChart = () => {
    const metric = getCurrentMetric();
    
    if (chartType === 'area') {
      return (
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={metric?.color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={metric?.color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="month" stroke="#64748b" />
          <YAxis stroke="#64748b" />
          <Tooltip
            formatter={formatTooltipValue}
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Area
            type="monotone"
            dataKey={selectedMetric}
            stroke={metric?.color}
            fillOpacity={1}
            fill="url(#colorGradient)"
            strokeWidth={2}
          />
        </AreaChart>
      );
    }

    return (
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="month" stroke="#64748b" />
        <YAxis stroke="#64748b" />
        <Tooltip
          formatter={formatTooltipValue}
          contentStyle={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}
        />
        <Line
          type="monotone"
          dataKey={selectedMetric}
          stroke={metric?.color}
          strokeWidth={3}
          dot={{ fill: metric?.color, strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: metric?.color, strokeWidth: 2 }}
        />
      </LineChart>
    );
  };

  return (
    <div className="bg-surface rounded-lg shadow-card border border-border-light p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
        <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          {/* Metric Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-text-secondary">Metric:</span>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e?.target?.value)}
              className="border border-border-light rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {metricOptions?.map((option) => (
                <option key={option?.value} value={option?.value}>
                  {option?.label}
                </option>
              ))}
            </select>
          </div>

          {/* Chart Type Selector */}
          <div className="flex items-center space-x-1 bg-surface-hover rounded-lg p-1">
            {chartTypes?.map((type) => (
              <button
                key={type?.value}
                onClick={() => setChartType(type?.value)}
                className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
                  chartType === type?.value
                    ? 'bg-primary text-white' :'text-text-secondary hover:text-text-primary'
                }`}
              >
                <Icon name={type?.icon} size={16} />
                <span className="hidden sm:inline">{type?.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
      {/* Chart Summary */}
      <div className="mt-6 pt-4 border-t border-border-light">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {metricOptions?.map((metric) => {
            const currentValue = data?.[data?.length - 1]?.[metric?.value];
            const previousValue = data?.[data?.length - 2]?.[metric?.value];
            const change = ((currentValue - previousValue) / previousValue) * 100;
            
            return (
              <div key={metric?.value} className="text-center">
                <div className="text-sm text-text-secondary mb-1">{metric?.label}</div>
                <div className="text-lg font-semibold text-text-primary">
                  {metric?.value === 'subscriptions' 
                    ? currentValue?.toLocaleString() 
                    : formatCurrency(currentValue)
                  }
                </div>
                <div className={`text-sm flex items-center justify-center space-x-1 ${
                  change > 0 ? 'text-success-600' : 'text-error-600'
                }`}>
                  <Icon name={change > 0 ? 'TrendingUp' : 'TrendingDown'} size={14} />
                  <span>{change > 0 ? '+' : ''}{change?.toFixed(1)}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;