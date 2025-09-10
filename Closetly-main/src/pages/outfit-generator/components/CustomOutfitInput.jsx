import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const CustomOutfitInput = ({ 
  customPrompt, 
  onCustomPromptChange, 
  preferences, 
  onPreferencesChange 
}) => {
  const [inputMode, setInputMode] = useState('text'); // 'text' or 'url'

  const handlePoseChange = (keepPose) => {
    onPreferencesChange({ keepPose });
  };

  const handleExpressionChange = (expression) => {
    onPreferencesChange({ expression });
  };

  const handleCreativityChange = (creativity) => {
    onPreferencesChange({ creativity: parseFloat(creativity) });
  };

  const handleBackgroundChange = (background) => {
    onPreferencesChange({ background });
  };

  const predefinedExpressions = [
    { value: 'natural', label: 'Natural' },
    { value: 'confident smile', label: 'Confident Smile' },
    { value: 'bright eyes', label: 'Bright Eyes' },
    { value: 'serious', label: 'Serious' },
    { value: 'happy', label: 'Happy' },
    { value: 'professional', label: 'Professional' },
    { value: 'relaxed', label: 'Relaxed' },
    { value: 'confident smile with bright eyes', label: 'Confident & Bright' }
  ];

  return (
    <div className="space-y-6">
      {/* Input Mode Toggle */}
      <div className="flex items-center space-x-2 p-1 bg-surface-hover rounded-xl">
        <button
          onClick={() => setInputMode('text')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 ${
            inputMode === 'text' ?'bg-primary text-white shadow-sm' :'text-text-secondary hover:text-text-primary'
          }`}
        >
          Text Description
        </button>
        <button
          onClick={() => setInputMode('url')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 ${
            inputMode === 'url' ?'bg-primary text-white shadow-sm' :'text-text-secondary hover:text-text-primary'
          }`}
        >
          Image URL
        </button>
      </div>
      {/* Custom Input */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-text-primary">
          {inputMode === 'text' ? 'Describe Your Desired Outfit' : 'Outfit Image URL'}
        </label>
        
        {inputMode === 'text' ? (
          <textarea
            value={customPrompt}
            onChange={(e) => onCustomPromptChange(e?.target?.value)}
            placeholder="Describe the outfit you want to try on... e.g., 'elegant black evening dress with gold accessories' or 'casual denim jacket with white sneakers'"
            className="w-full p-4 border border-border-light rounded-xl resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
            rows={4}
          />
        ) : (
          <input
            type="url"
            value={customPrompt}
            onChange={(e) => onCustomPromptChange(e?.target?.value)}
            placeholder="https://your-image-url.com/outfit.jpg"
            className="w-full p-3 border border-border-light rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        )}
        
        <p className="text-xs text-text-tertiary">
          {inputMode === 'text' ?'Be specific about colors, styles, and accessories for best results' :'Provide a direct link to an outfit image you want to apply'
          }
        </p>
      </div>
      {/* Pose Control */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-text-primary">
          Pose & Position
        </label>
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="pose"
              checked={preferences?.keepPose}
              onChange={() => handlePoseChange(true)}
              className="text-primary focus:ring-primary"
            />
            <span className="text-sm text-text-secondary">Keep Original Pose</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="pose"
              checked={!preferences?.keepPose}
              onChange={() => handlePoseChange(false)}
              className="text-primary focus:ring-primary"
            />
            <span className="text-sm text-text-secondary">Adjust for Outfit</span>
          </label>
        </div>
      </div>
      {/* Expression Control */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-text-primary">
          Facial Expression
        </label>
        <select
          value={preferences?.expression}
          onChange={(e) => handleExpressionChange(e?.target?.value)}
          className="w-full p-3 border border-border-light rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          {predefinedExpressions?.map((expr) => (
            <option key={expr?.value} value={expr?.value}>
              {expr?.label}
            </option>
          ))}
        </select>
      </div>
      {/* Creativity Slider */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-text-primary">
          Creativity Level: {(preferences?.creativity * 100)?.toFixed(0)}%
        </label>
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={preferences?.creativity}
            onChange={(e) => handleCreativityChange(e?.target?.value)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
          />
          <div className="flex justify-between text-xs text-text-tertiary">
            <span>Subtle (0%)</span>
            <span>Balanced (50%)</span>
            <span>Bold (100%)</span>
          </div>
        </div>
      </div>
      {/* Background Control */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-text-primary">
          Background Setting
        </label>
        <select
          value={preferences?.background}
          onChange={(e) => handleBackgroundChange(e?.target?.value)}
          className="w-full p-3 border border-border-light rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="keep">Keep Original Background</option>
          <option value="clean">Clean/Remove Background</option>
          <option value="studio">Professional Studio</option>
          <option value="outdoor">Outdoor Setting</option>
          <option value="indoor">Indoor Setting</option>
          <option value="fashion">Fashion Show Backdrop</option>
        </select>
      </div>
      {/* Safety Settings Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Shield" size={20} className="text-blue-600 mt-0.5" />
          <div>
            <p className="font-medium text-blue-800 text-sm">Safety & Content Filters</p>
            <p className="text-xs text-blue-700 mt-1">
              NSFW filters are active. Logo handling follows platform policies. 
              Identity consistency is maintained throughout generation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomOutfitInput;