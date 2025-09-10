import React, { useState, useEffect } from 'react';
import Icon from '../../components/AppIcon';
import Header from '../../components/ui/Header';
import PhotoUpload from './components/PhotoUpload';
import OutfitVariations from './components/OutfitVariations';
import CustomOutfitInput from './components/CustomOutfitInput';
import PreferencesPanel from './components/PreferencesPanel';
import GenerationControls from './components/GenerationControls';
import { generateOutfitVariations, generateCustomOutfit } from '../../services/geminiService';

const OutfitGenerator = () => {
  const [userPhoto, setUserPhoto] = useState(null);
  const [outfitVariations, setOutfitVariations] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('variations');
  const [preferences, setPreferences] = useState({
    outfitTypes: ['business', 'casual', 'formal', 'streetwear', 'gym', 'smart-casual'],
    count: 10,
    creativity: 0.7,
    keepPose: true,
    expression: 'confident smile',
    background: 'keep'
  });
  const [customPrompt, setCustomPrompt] = useState('');
  const [customOutfit, setCustomOutfit] = useState(null);

  // Check authentication status (mock)
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated with Google
    const checkAuth = () => {
      // Mock authentication check - in real app, check Google Auth
      const mockAuth = localStorage.getItem('google_auth') === 'true';
      setIsAuthenticated(mockAuth);
    };
    
    checkAuth();
  }, []);

  const handlePhotoUpload = (file) => {
    setUserPhoto(file);
    setOutfitVariations([]);
    setCustomOutfit(null);
  };

  const handleGenerateVariations = async () => {
    if (!userPhoto) return;
    
    setIsGenerating(true);
    try {
      const variations = await generateOutfitVariations(userPhoto, preferences);
      setOutfitVariations(variations);
    } catch (error) {
      console.error('Failed to generate outfit variations:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateCustomOutfit = async () => {
    if (!userPhoto || !customPrompt) return;
    
    setIsGenerating(true);
    try {
      const outfit = await generateCustomOutfit(userPhoto, customPrompt, {
        keepPose: preferences?.keepPose,
        expression: preferences?.expression,
        creativity: preferences?.creativity,
        background: preferences?.background
      });
      setCustomOutfit(outfit);
    } catch (error) {
      console.error('Failed to generate custom outfit:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePreferencesChange = (newPreferences) => {
    setPreferences({ ...preferences, ...newPreferences });
  };

  // Authentication Required Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-background to-pink-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-surface rounded-2xl shadow-modal border border-border-light p-8">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon name="Sparkles" size={32} className="text-purple-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-text-primary mb-4">
              Fashion Outfit Generator
            </h1>
            <p className="text-text-secondary mb-8">
              Create stunning outfit variations with AI. Google authentication required to access all features.
            </p>
            
            <button
              onClick={() => {
                // Mock Google authentication
                localStorage.setItem('google_auth', 'true');
                setIsAuthenticated(true);
              }}
              className="w-full bg-primary text-white py-3 px-6 rounded-xl font-medium hover:bg-primary-600 transition-colors duration-200 flex items-center justify-center space-x-3"
            >
              <Icon name="Chrome" size={20} />
              <span>Continue with Google</span>
            </button>
            
            <p className="text-xs text-text-tertiary mt-6">
              Secure login required to protect your personal photos and generated content.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-background to-pink-50">
      <Header 
        title="Fashion Outfit Generator" 
        subtitle="Create stunning outfit variations with AI"
      />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Photo Upload Section */}
        <div className="mb-8">
          <PhotoUpload 
            onPhotoUpload={handlePhotoUpload} 
            currentPhoto={userPhoto}
            isGenerating={isGenerating}
          />
        </div>

        {/* Main Content */}
        {userPhoto && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Controls Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-surface rounded-2xl shadow-card border border-border-light p-6 sticky top-6">
                {/* Tab Navigation */}
                <div className="flex flex-col space-y-2 mb-6">
                  <button
                    onClick={() => setActiveTab('variations')}
                    className={`text-left px-4 py-3 rounded-xl transition-colors duration-200 ${
                      activeTab === 'variations' 
                        ? 'bg-primary text-white shadow-sm' :'text-text-secondary hover:bg-surface-hover'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon name="Sparkles" size={18} />
                      <span className="font-medium">10 Variations</span>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('custom')}
                    className={`text-left px-4 py-3 rounded-xl transition-colors duration-200 ${
                      activeTab === 'custom' ?'bg-primary text-white shadow-sm' :'text-text-secondary hover:bg-surface-hover'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon name="Palette" size={18} />
                      <span className="font-medium">Custom Outfit</span>
                    </div>
                  </button>
                </div>

                {/* Controls based on active tab */}
                {activeTab === 'variations' && (
                  <>
                    <PreferencesPanel 
                      preferences={preferences}
                      onPreferencesChange={handlePreferencesChange}
                    />
                    <GenerationControls
                      onGenerate={handleGenerateVariations}
                      isGenerating={isGenerating}
                      disabled={!userPhoto}
                      buttonText="Generate 10 Variations"
                    />
                  </>
                )}

                {activeTab === 'custom' && (
                  <>
                    <CustomOutfitInput
                      customPrompt={customPrompt}
                      onCustomPromptChange={setCustomPrompt}
                      preferences={preferences}
                      onPreferencesChange={handlePreferencesChange}
                    />
                    <GenerationControls
                      onGenerate={handleGenerateCustomOutfit}
                      isGenerating={isGenerating}
                      disabled={!userPhoto || !customPrompt}
                      buttonText="Generate Custom Outfit"
                    />
                  </>
                )}
              </div>
            </div>

            {/* Results Section */}
            <div className="lg:col-span-3">
              {activeTab === 'variations' && (
                <OutfitVariations
                  variations={outfitVariations}
                  isGenerating={isGenerating}
                  userPhoto={userPhoto}
                  onRegenerateVariation={handleGenerateVariations}
                />
              )}

              {activeTab === 'custom' && customOutfit && (
                <div className="bg-surface rounded-2xl shadow-card border border-border-light p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <Icon name="Palette" size={24} className="text-purple-600" />
                    <h3 className="text-xl font-bold text-text-primary">Custom Outfit Result</h3>
                  </div>
                  
                  <div className="prose prose-sm max-w-none">
                    <div className="bg-accent-50 p-4 rounded-xl border border-accent-200">
                      <p className="text-text-primary whitespace-pre-wrap">{customOutfit}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!isGenerating && outfitVariations?.length === 0 && !customOutfit && (
                <div className="bg-surface rounded-2xl shadow-card border border-border-light p-12 text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon name="Sparkles" size={32} className="text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary mb-4">
                    Ready to Generate Outfits
                  </h3>
                  <p className="text-text-secondary mb-6">
                    Your photo is uploaded. Choose your preferences and click generate to create stunning outfit variations.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutfitGenerator;