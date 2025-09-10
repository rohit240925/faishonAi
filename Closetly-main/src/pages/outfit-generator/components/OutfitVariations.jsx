import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { downloadGeneratedImage, saveImageToPortal } from '../../../services/geminiService';

const OutfitVariations = ({ variations, isGenerating, userPhoto, onRegenerateVariation }) => {
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [savedImages, setSavedImages] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('virtual-fashiongen-saved') || '[]');
    } catch {
      return [];
    }
  });

  const outfitTypeIcons = {
    business: 'Briefcase',
    casual: 'Coffee',
    formal: 'Crown',
    streetwear: 'Zap',
    gym: 'Dumbbell',
    'smart-casual': 'Star',
    professional: 'Briefcase',
    elegant: 'Crown',
    athletic: 'Dumbbell'
  };

  const outfitTypeColors = {
    business: 'blue',
    casual: 'green',
    formal: 'purple',
    streetwear: 'orange',
    gym: 'red',
    'smart-casual': 'indigo',
    professional: 'blue',
    elegant: 'purple',
    athletic: 'red'
  };

  const downloadImage = async (variation) => {
    try {
      if (variation?.imageData) {
        await downloadGeneratedImage(variation?.imageData, `virtual-fashiongen-${variation?.id}`);
      } else {
        alert('No image data available for download');
      }
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download image. Please try again.');
    }
  };

  const saveToPortal = async (variation) => {
    try {
      const result = await saveImageToPortal(variation, 'current-user');
      if (result?.success) {
        setSavedImages(prev => [...prev, variation]);
        alert('Image saved to your customer portal!');
      }
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save image. Please try again.');
    }
  };

  const regenerateWithNewStyle = async (variation, newStyle) => {
    if (onRegenerateVariation) {
      await onRegenerateVariation(variation?.id, { style: newStyle });
    }
  };

  if (isGenerating) {
    return (
      <div className="bg-surface dark:bg-dark-surface rounded-2xl shadow-card border border-border-light dark:border-dark-border-light p-8">
        <div className="flex items-center justify-center space-x-4 mb-6">
          <div className="animate-spin">
            <Icon name="Sparkles" size={24} className="text-purple-600 dark:text-dark-primary" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary dark:text-dark-text-primary">
            Generating Fashion Images...
          </h3>
        </div>
        <div className="space-y-4">
          {[...Array(6)]?.map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-surface-hover dark:bg-dark-surface-hover rounded-xl"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-surface-hover dark:bg-dark-surface-hover rounded w-1/3"></div>
                  <div className="h-3 bg-surface-hover dark:bg-dark-surface-hover rounded w-2/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 bg-blue-50 dark:bg-dark-primary-100 border border-blue-200 dark:border-dark-border-light rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <Icon name="Info" size={20} className="text-blue-600 dark:text-dark-primary" />
            <div>
              <p className="font-medium text-blue-800 dark:text-dark-text-primary">Processing Your Image</p>
              <p className="text-sm text-blue-700 dark:text-dark-text-secondary">
                AI is analyzing your photo and generating personalized fashion images. This may take a few moments.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variations?.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header with View Toggle */}
      <div className="bg-surface dark:bg-dark-surface rounded-2xl shadow-card border border-border-light dark:border-dark-border-light p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon name="Sparkles" size={24} className="text-purple-600 dark:text-dark-primary" />
            <h3 className="text-xl font-bold text-text-primary dark:text-dark-text-primary">
              Generated Fashion Images
            </h3>
            <span className="bg-purple-100 dark:bg-dark-primary-200 text-purple-800 dark:text-dark-text-primary px-3 py-1 rounded-full text-sm font-medium">
              {variations?.length} Generated
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                viewMode === 'grid' ?'bg-primary dark:bg-dark-primary text-white' :'text-text-secondary dark:text-dark-text-secondary hover:bg-surface-hover dark:hover:bg-dark-surface-hover'
              }`}
            >
              <Icon name="Grid3X3" size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                viewMode === 'list' ?'bg-primary dark:bg-dark-primary text-white' :'text-text-secondary dark:text-dark-text-secondary hover:bg-surface-hover dark:hover:bg-dark-surface-hover'
              }`}
            >
              <Icon name="List" size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Variations Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {variations?.map((variation) => (
            <div 
              key={variation?.id} 
              className="bg-surface dark:bg-dark-surface rounded-2xl shadow-card border border-border-light dark:border-dark-border-light overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              {/* Image Display - Show actual generated image */}
              <div className="aspect-square bg-surface-hover dark:bg-dark-surface-hover overflow-hidden">
                {variation?.imageData ? (
                  <img
                    src={`data:image/png;base64,${variation?.imageData}`}
                    alt="Generated fashion look"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                    onClick={() => setSelectedVariation(variation)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center cursor-pointer" onClick={() => setSelectedVariation(variation)}>
                    <div className="text-center">
                      <Icon 
                        name={outfitTypeIcons?.[variation?.category] || 'Shirt'} 
                        size={48} 
                        className="text-text-tertiary dark:text-dark-text-tertiary mx-auto mb-2" 
                      />
                      <p className="text-sm text-text-tertiary dark:text-dark-text-tertiary">
                        Fashion Generated
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full bg-${outfitTypeColors?.[variation?.category] || 'purple'}-500`}></div>
                    <span className="text-sm font-medium text-text-primary dark:text-dark-text-primary capitalize">
                      {variation?.category || 'Fashion Look'}
                    </span>
                  </div>
                  <span className="text-xs text-text-tertiary dark:text-dark-text-tertiary">
                    {new Date(variation?.timestamp)?.toLocaleTimeString()}
                  </span>
                </div>
                
                {/* Never display prompts/descriptions to users */}
                <p className="text-sm text-text-secondary dark:text-dark-text-secondary mb-4">
                  AI-generated fashion variation using {variation?.style} style
                </p>
                
                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {/* Individual regeneration with different styles */}
                    <div className="relative group">
                      <button className="p-2 text-text-tertiary dark:text-dark-text-tertiary hover:text-primary dark:hover:text-dark-primary hover:bg-surface-hover dark:hover:bg-dark-surface-hover rounded-lg transition-all duration-200">
                        <Icon name="RefreshCw" size={16} />
                      </button>
                      
                      {/* Style options dropdown (simplified) */}
                      <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-surface dark:bg-dark-surface border border-border-light dark:border-dark-border-light rounded-lg shadow-lg p-2 z-10">
                        <div className="text-xs text-text-secondary dark:text-dark-text-secondary mb-1">Regenerate with:</div>
                        {['realistic', 'artistic', 'vintage', 'modern']?.map((style) => (
                          <button
                            key={style}
                            onClick={() => regenerateWithNewStyle(variation, style)}
                            className="block w-full text-left px-2 py-1 text-xs text-text-secondary dark:text-dark-text-secondary hover:text-primary dark:hover:text-dark-primary hover:bg-surface-hover dark:hover:bg-dark-surface-hover rounded"
                          >
                            {style}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => downloadImage(variation)}
                      className="p-2 text-text-tertiary dark:text-dark-text-tertiary hover:text-primary dark:hover:text-dark-primary hover:bg-surface dark:hover:bg-dark-surface rounded-lg transition-all duration-200"
                      title="Download high-resolution image"
                    >
                      <Icon name="Download" size={16} />
                    </button>
                    
                    <button
                      onClick={() => saveToPortal(variation)}
                      className="p-2 text-text-tertiary dark:text-dark-text-tertiary hover:text-primary dark:hover:text-dark-primary hover:bg-surface dark:hover:bg-dark-surface rounded-lg transition-all duration-200"
                      title="Save to customer portal"
                    >
                      <Icon name="Save" size={16} />
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => setSelectedVariation(variation)}
                    className="bg-primary dark:bg-dark-primary text-white px-3 py-1 rounded-lg text-sm hover:bg-primary-600 dark:hover:bg-dark-primary-600 transition-colors duration-200"
                  >
                    View Full
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // List View
        <div className="bg-surface dark:bg-dark-surface rounded-2xl shadow-card border border-border-light dark:border-dark-border-light p-6">
          <div className="space-y-4">
            {variations?.map((variation) => (
              <div 
                key={variation?.id}
                className="flex items-center space-x-4 p-4 border border-border-light dark:border-dark-border-light rounded-xl hover:bg-surface-hover dark:hover:bg-dark-surface-hover transition-colors duration-200"
              >
                <div className="w-16 h-16 bg-surface-hover dark:bg-dark-surface-hover rounded-xl overflow-hidden flex-shrink-0">
                  {variation?.imageData ? (
                    <img
                      src={`data:image/png;base64,${variation?.imageData}`}
                      alt="Generated fashion"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Icon name="Image" size={24} className="text-text-tertiary dark:text-dark-text-tertiary" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-text-primary dark:text-dark-text-primary capitalize">
                      {variation?.category || 'Fashion Look'} - {variation?.style}
                    </span>
                    <span className="text-xs text-text-tertiary dark:text-dark-text-tertiary">
                      {new Date(variation?.timestamp)?.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
                    AI-generated fashion image with personalized styling
                  </p>
                </div>
                
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <button
                    onClick={() => downloadImage(variation)}
                    className="p-2 text-text-tertiary dark:text-dark-text-tertiary hover:text-primary dark:hover:text-dark-primary hover:bg-surface dark:hover:bg-dark-surface rounded-lg transition-all duration-200"
                  >
                    <Icon name="Download" size={16} />
                  </button>
                  <button
                    onClick={() => saveToPortal(variation)}
                    className="p-2 text-text-tertiary dark:text-dark-text-tertiary hover:text-primary dark:hover:text-dark-primary hover:bg-surface dark:hover:bg-dark-surface rounded-lg transition-all duration-200"
                  >
                    <Icon name="Save" size={16} />
                  </button>
                  <button 
                    onClick={() => setSelectedVariation(variation)}
                    className="bg-primary dark:bg-dark-primary text-white px-3 py-1 rounded-lg text-sm hover:bg-primary-600 dark:hover:bg-dark-primary-600 transition-colors duration-200"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full Image Modal */}
      {selectedVariation && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-surface dark:bg-dark-surface rounded-2xl shadow-modal max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex">
              {/* Image */}
              <div className="flex-1">
                {selectedVariation?.imageData ? (
                  <img
                    src={`data:image/png;base64,${selectedVariation?.imageData}`}
                    alt="Generated fashion look"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-64 flex items-center justify-center bg-surface-hover dark:bg-dark-surface-hover">
                    <Icon name="Image" size={64} className="text-text-tertiary dark:text-dark-text-tertiary" />
                  </div>
                )}
              </div>
              
              {/* Details Panel */}
              <div className="w-80 p-6 border-l border-border-light dark:border-dark-border-light">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-text-primary dark:text-dark-text-primary capitalize">
                    {selectedVariation?.category || 'Fashion Look'}
                  </h3>
                  <button
                    onClick={() => setSelectedVariation(null)}
                    className="p-2 hover:bg-surface-hover dark:hover:bg-dark-surface-hover rounded-xl transition-colors duration-200"
                  >
                    <Icon name="X" size={20} className="text-text-secondary dark:text-dark-text-secondary" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <span className="text-sm text-text-tertiary dark:text-dark-text-tertiary">Style:</span>
                    <p className="font-medium text-text-primary dark:text-dark-text-primary capitalize">{selectedVariation?.style}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm text-text-tertiary dark:text-dark-text-tertiary">Generated:</span>
                    <p className="font-medium text-text-primary dark:text-dark-text-primary">
                      {new Date(selectedVariation?.timestamp)?.toLocaleString()}
                    </p>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="space-y-3 pt-4">
                    <button
                      onClick={() => downloadImage(selectedVariation)}
                      className="w-full bg-primary dark:bg-dark-primary text-white py-2 px-4 rounded-xl font-medium hover:bg-primary-600 dark:hover:bg-dark-primary-600 transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      <Icon name="Download" size={18} />
                      <span>Download High-Res</span>
                    </button>
                    
                    <button
                      onClick={() => saveToPortal(selectedVariation)}
                      className="w-full border border-border-light dark:border-dark-border-light py-2 px-4 rounded-xl font-medium hover:bg-surface-hover dark:hover:bg-dark-surface-hover transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      <Icon name="Save" size={18} />
                      <span>Save to Portal</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OutfitVariations;