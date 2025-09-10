import React from 'react';
import Icon from '../../../components/AppIcon';

const GenerationControls = ({ 
  onGenerate, 
  isGenerating, 
  disabled, 
  buttonText = 'Generate Outfits' 
}) => {
  return (
    <div className="space-y-4">
      {/* Generate Button */}
      <button
        onClick={onGenerate}
        disabled={disabled || isGenerating}
        className={`
          w-full py-4 px-6 rounded-xl font-semibold transition-all duration-200
          ${disabled || isGenerating
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' :'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl'
          }
        `}
      >
        {isGenerating ? (
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-spin">
              <Icon name="Sparkles" size={20} />
            </div>
            <span>Generating...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-3">
            <Icon name="Zap" size={20} />
            <span>{buttonText}</span>
          </div>
        )}
      </button>

      {/* Generation Info */}
      <div className="text-center">
        <p className="text-xs text-text-tertiary mb-2">
          {isGenerating 
            ? 'AI is creating your personalized outfit variations...' 
            : 'Powered by Google Gemini AI'
          }
        </p>
        
        {isGenerating && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full animate-pulse"></div>
          </div>
        )}
      </div>

      {/* Tips */}
      {!isGenerating && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <Icon name="Info" size={16} className="text-blue-600 mt-0.5" />
            <div className="text-xs text-blue-700">
              <p className="font-medium mb-1">Tips for Best Results:</p>
              <ul className="space-y-1">
                <li>• Use a clear, front-facing photo with good lighting</li>
                <li>• Higher creativity = more unique but bold styles</li>
                <li>• Select multiple categories for variety</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Estimated Time */}
      {isGenerating && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <Icon name="Clock" size={16} className="text-amber-600" />
            <div className="text-xs text-amber-700">
              <p>Estimated time: 30-60 seconds for high-quality results</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerationControls;