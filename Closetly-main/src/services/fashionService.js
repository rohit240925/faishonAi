import { supabase } from '../lib/supabase';

export const fashionService = {
  // Generate fashion analysis using AI
  async generateFashionAnalysis(imageData, options = {}) {
    try {
      const {
        styles = [],
        creativityLevel = 0.7,
        maxImages = 1,
        inspirationImage = null,
        conversationalPrompt = ''
      } = options;

      // Check user credits first
      const { data: userProfile } = await supabase?.from('user_profiles')?.select('current_api_credits')?.eq('id', (await supabase?.auth?.getUser())?.data?.user?.id)?.single();

      if (!userProfile || userProfile?.current_api_credits < 1) {
        throw new Error('Insufficient API credits');
      }

      // Call the AI generation edge function
      const { data, error } = await supabase?.functions?.invoke('process-ai-generation', {
        body: {
          imageData,
          styles,
          creativityLevel,
          maxImages,
          inspirationImage,
          conversationalPrompt,
          operationType: 'fashion_analysis'
        }
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Fashion analysis error:', error);
      throw error;
    }
  },

  // Get user's fashion portfolio
  async getUserPortfolio(userId, page = 1, limit = 20) {
    try {
      const offset = (page - 1) * limit;

      const { data, error, count } = await supabase?.from('fashion_portfolio_images')?.select('*', { count: 'exact' })?.eq('user_id', userId)?.eq('is_expired', false)?.order('created_at', { ascending: false })?.range(offset, offset + limit - 1);

      if (error) throw error;

      return {
        images: data || [],
        total: count || 0,
        page,
        totalPages: Math.ceil((count || 0) / limit)
      };
    } catch (error) {
      console.error('Get portfolio error:', error);
      throw error;
    }
  },

  // Save generated image to portfolio
  async saveToPortfolio(imageData, metadata = {}) {
    try {
      const user = await supabase?.auth?.getUser();
      if (!user?.data?.user) throw new Error('User not authenticated');

      const { data, error } = await supabase?.from('fashion_portfolio_images')?.insert({
          user_id: user?.data?.user?.id,
          image_data: imageData,
          image_metadata: metadata,
          style: metadata?.style || 'realistic',
          original_prompt: metadata?.originalPrompt || '',
          expires_at: new Date(Date.now() + 72 * 60 * 60 * 1000)?.toISOString() // 72 hours
        })?.select()?.single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Save to portfolio error:', error);
      throw error;
    }
  },

  // Delete image from portfolio
  async deleteFromPortfolio(imageId) {
    try {
      const { error } = await supabase?.from('fashion_portfolio_images')?.delete()?.eq('id', imageId);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Delete from portfolio error:', error);
      throw error;
    }
  },

  // Upload inspiration image to storage
  async uploadInspirationImage(file, userId) {
    try {
      const fileExt = file?.name?.split('.')?.pop();
      const fileName = `${userId}/inspiration/${Date.now()}.${fileExt}`;

      // Check storage limit
      const canUpload = await supabase?.rpc('check_storage_limit', {
        user_uuid: userId,
        file_size: file?.size
      });

      if (!canUpload?.data) {
        throw new Error('Storage limit exceeded. Please upgrade your plan or free up space.');
      }

      const { data, error } = await supabase?.storage?.from('fashion-images')?.upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Update user storage usage
      await supabase?.rpc('update_user_storage_usage', {
        user_uuid: userId
      });

      // Get public URL
      const { data: { publicUrl } } = supabase?.storage?.from('fashion-images')?.getPublicUrl(fileName);

      return {
        path: data?.path,
        url: publicUrl
      };
    } catch (error) {
      console.error('Upload inspiration image error:', error);
      throw error;
    }
  },

  // Get user storage stats
  async getUserStorageStats(userId) {
    try {
      const { data, error } = await supabase?.from('user_profiles')?.select('storage_used_bytes, storage_limit_bytes')?.eq('id', userId)?.single();

      if (error) throw error;

      const usedMB = Math.round(data?.storage_used_bytes / (1024 * 1024));
      const limitMB = Math.round(data?.storage_limit_bytes / (1024 * 1024));
      const usagePercent = Math.round((data?.storage_used_bytes / data?.storage_limit_bytes) * 100);

      return {
        used: usedMB,
        limit: limitMB,
        usagePercent,
        isNearLimit: usagePercent >= 90
      };
    } catch (error) {
      console.error('Get storage stats error:', error);
      throw error;
    }
  },

  // Get available styles
  getAvailableStyles() {
    return [
      { id: 'realistic', name: 'Realistic', description: 'Photorealistic fashion rendering' },
      { id: 'artistic', name: 'Artistic', description: 'Creative and stylized interpretation' },
      { id: 'vintage', name: 'Vintage', description: 'Classic retro fashion styles' },
      { id: 'modern', name: 'Modern', description: 'Contemporary fashion trends' },
      { id: 'casual', name: 'Casual', description: 'Everyday comfortable wear' },
      { id: 'formal', name: 'Formal', description: 'Professional and elegant attire' },
      { id: 'streetwear', name: 'Streetwear', description: 'Urban and edgy fashion' },
      { id: 'bohemian', name: 'Bohemian', description: 'Free-spirited and artistic style' },
      { id: 'minimalist', name: 'Minimalist', description: 'Clean and simple designs' },
      { id: 'glamour', name: 'Glamour', description: 'Luxurious and sophisticated looks' }
    ];
  },

  // Format storage size
  formatStorageSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes?.[i];
  }
};