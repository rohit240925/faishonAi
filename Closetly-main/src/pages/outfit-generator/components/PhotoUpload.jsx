import React, { useRef, useState } from 'react';
import Icon from '../../../components/AppIcon';

const PhotoUpload = ({ onPhotoUpload, currentPhoto, isGenerating }) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  // File validation - restrict to PNG, JPEG, JPG only
  const validateFile = (file) => {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    const maxSize = 4 * 1024 * 1024; // 4MB for Gemini API

    if (!allowedTypes?.includes(file?.type)) {
      alert('Only PNG, JPEG, and JPG files are allowed. Other formats are not supported for security reasons.');
      return false;
    }

    if (file?.size > maxSize) {
      alert('File size must be less than 4MB to ensure optimal processing.');
      return false;
    }

    return true;
  };

  const handleFile = (file) => {
    if (file && validateFile(file)) {
      // Create full-size preview URL to ensure entire image is displayed
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onPhotoUpload(file);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e?.target?.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrag = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (e?.type === 'dragenter' || e?.type === 'dragover') {
      setDragActive(true);
    } else if (e?.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setDragActive(false);

    const file = e?.dataTransfer?.files?.[0];
    if (file) handleFile(file);
  };

  const openFileDialog = () => {
    fileInputRef?.current?.click();
  };

  const removePhoto = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    onPhotoUpload(null);
    if (fileInputRef?.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-surface dark:bg-dark-surface rounded-2xl shadow-card border border-border-light dark:border-dark-border-light overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Icon name="Camera" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold">Upload Your Photo</h2>
            <p className="text-purple-100 text-sm">
              Secure upload - PNG, JPEG, JPG only (max 4MB)
            </p>
          </div>
        </div>
      </div>
      <div className="p-6">
        {!currentPhoto ? (
          // Upload Area
          (<div
            className={`
              relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 cursor-pointer
              ${dragActive 
                ? 'border-primary dark:border-dark-primary bg-primary-50 dark:bg-dark-primary-100' :'border-border-light dark:border-dark-border-light hover:border-primary dark:hover:border-dark-primary hover:bg-surface-hover dark:hover:bg-dark-surface-hover'
              }
              ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            onClick={!isGenerating ? openFileDialog : undefined}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={!isGenerating ? handleDrop : undefined}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              onChange={handleFileInputChange}
              className="hidden"
              disabled={isGenerating}
            />
            <div className="w-16 h-16 bg-purple-100 dark:bg-dark-primary-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Upload" size={28} className="text-purple-600 dark:text-dark-primary" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary dark:text-dark-text-primary mb-2">
              Upload Your Photo
            </h3>
            <p className="text-text-secondary dark:text-dark-text-secondary mb-4">
              Drag and drop or click to select a photo
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-text-tertiary dark:text-dark-text-tertiary">
              <span>PNG, JPEG, JPG only</span>
              <span>•</span>
              <span>Max 4MB</span>
              <span>•</span>
              <span>Secure processing</span>
            </div>
            {dragActive && (
              <div className="absolute inset-0 bg-primary-50/80 dark:bg-dark-primary-100/80 rounded-2xl flex items-center justify-center">
                <div className="text-primary dark:text-dark-primary font-medium">Drop your photo here</div>
              </div>
            )}
          </div>)
        ) : (
          // Photo Preview - Ensure entire image is displayed correctly
          (<div className="space-y-4">
            <div className="relative">
              <img
                src={previewUrl}
                alt="Uploaded photo"
                className="w-full max-h-96 object-contain rounded-xl border border-border-light dark:border-dark-border-light bg-surface-hover dark:bg-dark-surface-hover"
                style={{ 
                  aspectRatio: 'auto',
                  maxWidth: '100%',
                  height: 'auto'
                }}
              />
              
              <button
                onClick={removePhoto}
                disabled={isGenerating}
                className="absolute top-3 right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-200 disabled:opacity-50"
              >
                <Icon name="X" size={16} />
              </button>
            </div>
            {/* Photo Info */}
            <div className="bg-green-50 dark:bg-dark-success-100 border border-green-200 dark:border-dark-border-light rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <Icon name="CheckCircle" size={20} className="text-green-600 dark:text-dark-success mt-0.5" />
                <div>
                  <p className="font-medium text-green-800 dark:text-dark-text-primary">Photo Uploaded Successfully</p>
                  <p className="text-sm text-green-700 dark:text-dark-text-secondary">
                    Your image is ready for AI fashion generation. Full image preserved for accurate processing.
                  </p>
                </div>
              </div>
            </div>
            {/* Security Notice */}
            <div className="bg-blue-50 dark:bg-dark-primary-100 border border-blue-200 dark:border-dark-border-light rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <Icon name="Shield" size={20} className="text-blue-600 dark:text-dark-primary mt-0.5" />
                <div>
                  <p className="font-medium text-blue-800 dark:text-dark-text-primary">Privacy & Security</p>
                  <p className="text-sm text-blue-700 dark:text-dark-text-secondary">
                    Images are processed securely and automatically deleted after generation. Your privacy is protected.
                  </p>
                </div>
              </div>
            </div>
            {/* Replace Photo Button */}
            <button
              onClick={openFileDialog}
              disabled={isGenerating}
              className="w-full py-3 px-4 border border-border-light dark:border-dark-border-light rounded-xl text-text-secondary dark:text-dark-text-secondary hover:bg-surface-hover dark:hover:bg-dark-surface-hover transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-center space-x-2">
                <Icon name="RefreshCw" size={16} />
                <span>Replace Photo</span>
              </div>
            </button>
          </div>)
        )}
      </div>
    </div>
  );
};

export default PhotoUpload;