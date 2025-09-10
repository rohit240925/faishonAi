import React from 'react';
import Icon from '../../../components/AppIcon';

const PreferencesPanel = ({ preferences, onPreferencesChange }) => {
  const outfitTypes = [
    { id: 'business', label: 'Business Suits', icon: 'Briefcase', description: 'Professional attire' },
    { id: 'streetwear', label: 'Streetwear', icon: 'Zap', description: 'Urban casual style' },
    { id: 'gym', label: 'Gym Wear', icon: 'Dumbbell', description: 'Athletic clothing' },
    { id: 'formal', label: 'Formal Wear', icon: 'Crown', description: 'Evening & special events' },
    { id: 'smart-casual', label: 'Smart Casual', icon: 'Star', description: 'Versatile everyday' },
    { id: 'casual', label: 'Casual', icon: 'Coffee', description: 'Relaxed comfort' }
  ];

  const handleOutfitTypeToggle = (typeId) => {
    const currentTypes = preferences?.outfitTypes || [];
    let newTypes;
    
    if (currentTypes?.includes(typeId)) {
      newTypes = currentTypes?.filter(type => type !== typeId);
    } else {
      newTypes = [...currentTypes, typeId];
    }
    
    onPreferencesChange({ outfitTypes: newTypes });
  };

  const handleCountChange = (count) => {
    onPreferencesChange({ count: Math.min(Math.max(1, count), outfitTypes?.length) });
  };

  const handleCreativityChange = (creativity) => {
    onPreferencesChange({ creativity: parseFloat(creativity) });
  };

  return (
    <div className="space-y-6">
      {/* Outfit Types Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-text-primary">
          Outfit Categories
        </label>
        <div className="space-y-2">
          {outfitTypes?.map((type) => (
            <label
              key={type?.id}
              className={`
                flex items-center space-x-3 p-3 rounded-xl border cursor-pointer transition-all duration-200
                ${preferences?.outfitTypes?.includes(type?.id)
                  ? 'border-primary bg-primary-50' :'border-border-light hover:bg-surface-hover'
                }
              `}
            >
              <input
                type="checkbox"
                checked={preferences?.outfitTypes?.includes(type?.id) || false}
                onChange={() => handleOutfitTypeToggle(type?.id)}
                className="sr-only"
              />
              <div className={`
                w-8 h-8 rounded-lg flex items-center justify-center
                ${preferences?.outfitTypes?.includes(type?.id)
                  ? 'bg-primary text-white' :'bg-gray-100 text-gray-500'
                }
              `}>
                <Icon name={type?.icon} size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary">
                  {type?.label}
                </p>
                <p className="text-xs text-text-tertiary">
                  {type?.description}
                </p>
              </div>
              {preferences?.outfitTypes?.includes(type?.id) && (
                <Icon name="Check" size={16} className="text-primary" />
              )}
            </label>
          ))}
        </div>
      </div>
      {/* Number of Variations */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-text-primary">
          Number of Variations: {preferences?.count || 10}
        </label>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => handleCountChange((preferences?.count || 10) - 1)}
            disabled={preferences?.count <= 1}
            className="w-8 h-8 rounded-lg border border-border-light flex items-center justify-center hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon name="Minus" size={14} />
          </button>
          <div className="flex-1">
            <input
              type="range"
              min="1"
              max={outfitTypes?.length}
              value={preferences?.count || 10}
              onChange={(e) => handleCountChange(parseInt(e?.target?.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <button
            onClick={() => handleCountChange((preferences?.count || 10) + 1)}
            disabled={preferences?.count >= outfitTypes?.length}
            className="w-8 h-8 rounded-lg border border-border-light flex items-center justify-center hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon name="Plus" size={14} />
          </button>
        </div>
        <div className="flex justify-between text-xs text-text-tertiary">
          <span>1 variation</span>
          <span>{outfitTypes?.length} max</span>
        </div>
      </div>
      {/* Creativity Level */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-text-primary">
          Style Creativity: {Math.round((preferences?.creativity || 0.7) * 100)}%
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={preferences?.creativity || 0.7}
          onChange={(e) => handleCreativityChange(e?.target?.value)}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-text-tertiary">
          <span>Conservative</span>
          <span>Balanced</span>
          <span>Bold & Creative</span>
        </div>
      </div>
      {/* Fit & Style Preferences */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-text-primary">
          Style Preferences
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'palette', label: 'Color Palette', icon: 'Palette' },
            { id: 'silhouette', label: 'Silhouette', icon: 'User' },
            { id: 'fabric', label: 'Fabric Type', icon: 'Layers' },
            { id: 'accessories', label: 'Accessories', icon: 'Watch' }
          ]?.map((pref) => (
            <button
              key={pref?.id}
              className="flex items-center space-x-2 p-3 border border-border-light rounded-xl hover:bg-surface-hover transition-colors duration-200"
            >
              <Icon name={pref?.icon} size={16} className="text-text-secondary" />
              <span className="text-sm text-text-secondary">{pref?.label}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Quality Settings */}
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Sparkles" size={20} className="text-purple-600 mt-0.5" />
          <div>
            <p className="font-medium text-purple-800 text-sm">High-Quality Generation</p>
            <p className="text-xs text-purple-700 mt-1">
              Up to 4K resolution with realistic fabric textures, lighting, and natural drape effects.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreferencesPanel;