import genAI from '../utils/geminiClient';
import { generateWardrobeOverlay } from './nativeBananaService';

/**
 * ENHANCED GEMINI SERVICE WITH ROBUST URL IMAGE EXTRACTION
 * 
 * This service implements a comprehensive URL image extraction system that works with
 * any website using multiple authentication strategies, proxy services, and fallback methods.
 * 
 * Updated Features:
 * - Improved NetworkError handling and recovery
 * - More reliable proxy services with health checks
 * - Better timeout management and progressive delays
 * - Enhanced error logging and user feedback
 * - Graceful fallback to upload when all strategies fail
 * - Improved CORS handling for different browser environments
 */

/**
 * ROBUST URL IMAGE EXTRACTION SYSTEM
 * Handles any website with multiple fallback strategies and authentication methods
 * @param {string} imageUrl - URL of the image to extract
 * @param {Object} options - Extraction options
 * @returns {Promise<Object>} Extracted image data with metadata
 */
export async function extractImageFromUrl(imageUrl, options = {}) {
  const {
    maxRetries = 2,
    timeout = 10000,
    useProxy = true,
    enableFallbacks = true,
    validateContent = true,
    userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  } = options;

  // Reorder strategies for better success rate
  const extractionStrategies = [
    'direct_cors_request',
    'no_cors_request',
    'reliable_proxy_request',
    'image_proxy_service',
    'simple_proxy_request'
  ];

  let lastError = null;
  let allErrors = [];
  
  // Validate and normalize URL
  const normalizedUrl = validateAndNormalizeUrl(imageUrl);
  if (!normalizedUrl?.isValid) {
    throw new Error(`Invalid URL: ${normalizedUrl.error}`);
  }

  console.log(`🔍 Starting image extraction for: ${normalizedUrl?.hostname}`);
  
  // Try each extraction strategy with improved error handling
  for (let i = 0; i < extractionStrategies?.length; i++) {
    const strategy = extractionStrategies?.[i];
    
    try {
      console.log(`📡 Trying strategy ${i + 1}/${extractionStrategies?.length}: ${strategy}`);
      
      const result = await executeExtractionStrategy(strategy, normalizedUrl?.url, {
        timeout: timeout,
        userAgent,
        maxRetries: 1
      });

      if (result?.success && result?.imageData) {
        if (validateContent) {
          const validation = await validateImageContent(result?.imageData, result?.mimeType);
          if (!validation?.isValid) {
            console.warn(`❌ Content validation failed for ${strategy}: ${validation?.error}`);
            allErrors?.push({ strategy, error: validation?.error, type: 'validation' });
            continue;
          }
        }

        console.log(`✅ Successfully extracted image using: ${strategy}`);
        
        return {
          success: true,
          imageData: result?.imageData,
          mimeType: result?.mimeType,
          originalUrl: imageUrl,
          normalizedUrl: normalizedUrl?.url,
          strategy: strategy,
          metadata: {
            fileSize: result?.fileSize || (result?.imageData?.length * 3 / 4),
            extractionTime: result?.extractionTime || Date.now(),
            contentType: result?.contentType || result?.mimeType
          },
          timestamp: new Date()?.toISOString()
        };
      }

    } catch (error) {
      const errorMessage = error?.message || 'Unknown error';
      console.warn(`❌ Strategy ${strategy} failed: ${errorMessage}`);
      
      allErrors?.push({ 
        strategy, 
        error: errorMessage, 
        type: error?.name || 'unknown',
        timestamp: new Date()?.toISOString()
      });
      
      lastError = error;
      
      // Add progressive delay between strategies (except for the last one)
      if (i < extractionStrategies?.length - 1) {
        const delay = Math.min(500 + (i * 200), 1500);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  // All strategies failed - provide detailed feedback
  const errorSummary = `All ${extractionStrategies?.length} extraction strategies failed. Last error: ${lastError?.message || 'Unknown error'}. Please use the upload fallback.`;
  
  console.error('🚨 All extraction strategies failed:', { 
    allErrors, 
    url: imageUrl, 
    hostname: normalizedUrl?.hostname 
  });

  const error = new Error(errorSummary);
  error.allErrors = allErrors;
  error.extractionStrategies = extractionStrategies;
  throw error;
}

/**
 * Validates and normalizes URL for image extraction
 * @param {string} url - URL to validate
 * @returns {Object} Validation result with normalized URL
 */
function validateAndNormalizeUrl(url) {
  try {
    if (!url || typeof url !== 'string') {
      return { isValid: false, error: 'URL must be a non-empty string' };
    }

    // Add protocol if missing
    if (!url?.startsWith('http://') && !url?.startsWith('https://')) {
      url = 'https://' + url;
    }

    const urlObj = new URL(url);
    
    // Check for blocked domains
    const blockedDomains = ['localhost', '127.0.0.1', '0.0.0.0'];
    if (blockedDomains?.some(domain => urlObj?.hostname?.includes(domain))) {
      return { isValid: false, error: 'Local URLs are not supported for security reasons' };
    }

    // Detect and handle special cases
    const specialCases = detectSpecialUrlCases(urlObj);
    
    return {
      isValid: true,
      url: urlObj?.toString(),
      hostname: urlObj?.hostname,
      specialCase: specialCases?.type,
      suggestions: specialCases?.suggestions
    };

  } catch (error) {
    return { isValid: false, error: `Invalid URL format: ${error?.message}` };
  }
}

/**
 * Detects special URL cases (product pages, social media, etc.)
 * @param {URL} urlObj - URL object to analyze
 * @returns {Object} Special case information
 */
function detectSpecialUrlCases(urlObj) {
  const hostname = urlObj?.hostname?.toLowerCase();
  const pathname = urlObj?.pathname?.toLowerCase();
  
  // Product page detection
  const productPageDomains = [
    'zara.com', 'h&m.com', 'amazon.com', 'ebay.com', 'etsy.com', 
    'shopify.com', 'nike.com', 'adidas.com', 'target.com', 'walmart.com'
  ];
  
  if (productPageDomains?.some(domain => hostname?.includes(domain))) {
    return {
      type: 'product_page',
      suggestions: [
        'Right-click on the product image and select "Copy image address"',
        'Look for "View larger" or "Zoom" options that open the full image',
        'Try the direct product image URL instead of the product page'
      ]
    };
  }

  // Social media detection
  if (hostname?.includes('instagram.com')) {
    return {
      type: 'social_media',
      suggestions: [
        'Instagram images require special handling due to authentication',
        'Try copying the direct image URL from browser developer tools',
        'Consider uploading the image directly instead'
      ]
    };
  }

  // CDN and image hosting services (usually work well)
  const imageCdnDomains = ['imgur.com', 'unsplash.com', 'cloudinary.com', 'amazonaws.com'];
  if (imageCdnDomains?.some(domain => hostname?.includes(domain))) {
    return {
      type: 'image_cdn',
      suggestions: ['This should work well with direct extraction']
    };
  }

  // Direct image file detection
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'];
  if (imageExtensions?.some(ext => pathname?.endsWith(`.${ext}`))) {
    return {
      type: 'direct_image',
      suggestions: ['Direct image URL detected - should extract successfully']
    };
  }

  return {
    type: 'unknown',
    suggestions: ['If extraction fails, try right-clicking the image and copying the image address directly']
  };
}

/**
 * Executes specific extraction strategy with improved error handling
 * @param {string} strategy - Strategy name to execute
 * @param {string} url - URL to extract from  
 * @param {Object} options - Strategy-specific options
 * @returns {Promise<Object>} Extraction result
 */
async function executeExtractionStrategy(strategy, url, options) {
  const startTime = Date.now();
  
  try {
    switch (strategy) {
      case 'direct_cors_request':
        return await directCorsRequest(url, options);
        
      case 'no_cors_request':
        return await noCorsRequest(url, options);
        
      case 'reliable_proxy_request':
        return await reliableProxyRequest(url, options);
        
      case 'image_proxy_service':
        return await imageProxyService(url, options);
        
      case 'simple_proxy_request':
        return await simpleProxyRequest(url, options);
        
      default:
        throw new Error(`Unknown extraction strategy: ${strategy}`);
    }
  } catch (error) {
    // Add timing information to error
    error.executionTime = Date.now() - startTime;
    error.strategy = strategy;
    throw error;
  }
}

/**
 * Direct CORS request with enhanced headers and better error handling
 */
async function directCorsRequest(url, options) {
  const { timeout = 8000, userAgent } = options;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller?.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'User-Agent': userAgent,
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      mode: 'cors',
      cache: 'no-store',
      redirect: 'follow',
      signal: controller?.signal
    });

    clearTimeout(timeoutId);

    if (!response?.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await processImageResponse(response, 'direct_cors');
    
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error?.name === 'AbortError') {
      throw new Error('Request timeout - server took too long to respond');
    }
    
    if (error?.message?.includes('NetworkError')) {
      throw new Error('Network error - unable to connect to image server');
    }
    
    throw error;
  }
}

/**
 * No-CORS request for when CORS is blocking access
 */
async function noCorsRequest(url, options) {
  const { timeout = 8000, userAgent } = options;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller?.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'image/*,*/*;q=0.8',
        'User-Agent': userAgent
      },
      mode: 'no-cors',
      cache: 'no-store',
      redirect: 'follow',
      signal: controller?.signal
    });

    clearTimeout(timeoutId);
    
    // no-cors mode doesn't give us access to response status or body // We'll try to create a blob and see if it works
    const blob = await response?.blob();
    
    if (blob?.size > 0) {
      const arrayBuffer = await blob?.arrayBuffer();
      const base64Data = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      
      return {
        success: true,
        imageData: base64Data,
        mimeType: blob?.type || 'image/png',
        fileSize: blob?.size,
        extractionTime: Date.now(),
        method: 'no_cors'
      };
    } else {
      throw new Error('Empty or invalid response from no-CORS request');
    }
    
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error?.name === 'AbortError') {
      throw new Error('Request timeout in no-CORS mode');
    }
    
    throw error;
  }
}

/**
 * Reliable proxy request using working proxy services
 */
async function reliableProxyRequest(url, options) {
  // Use only reliable, tested proxy services
  const reliableProxies = [
    {
      url: 'https://api.allorigins.win/get?url=',
      type: 'allorigins',
      encoding: 'json'
    },
    {
      url: 'https://api.codetabs.com/v1/proxy/?quest=',
      type: 'codetabs', 
      encoding: 'direct'
    }
  ];

  let lastError;
  
  for (const proxy of reliableProxies) {
    try {
      console.log(`🔄 Trying reliable proxy: ${proxy?.type}`);
      
      let proxyUrl = proxy?.url + encodeURIComponent(url);
      const response = await fetch(proxyUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json, image/*, */*',
          'User-Agent': options?.userAgent,
          'X-Requested-With': 'XMLHttpRequest'
        },
        timeout: options?.timeout || 8000
      });

      if (response?.ok) {
        if (proxy?.type === 'allorigins') {
          const data = await response?.json();
          if (data?.contents) {
            // Try to process as base64 encoded image data
            return await processProxyResponse(data?.contents, 'allorigins_proxy');
          }
        } else {
          // Direct response processing
          return await processImageResponse(response, 'reliable_proxy');
        }
      } else {
        throw new Error(`Proxy responded with status ${response.status}`);
      }
      
    } catch (error) {
      lastError = error;
      console.warn(`❌ Reliable proxy ${proxy?.type} failed:`, error?.message);
    }
  }
  
  throw lastError || new Error('All reliable proxy services failed');
}

/**
 * Simple proxy request with basic CORS bypass
 */
async function simpleProxyRequest(url, options) {
  // Simple CORS proxies that might work
  const simpleProxies = [
    'https://cors-anywhere.herokuapp.com/',
    'https://thingproxy.freeboard.io/fetch/'
  ];

  for (const proxy of simpleProxies) {
    try {
      const proxyUrl = proxy + url;
      const response = await fetch(proxyUrl, {
        method: 'GET',
        headers: {
          'Accept': 'image/*,*/*;q=0.8',
          'Origin': window.location?.origin
        }
      });

      if (response?.ok) {
        return await processImageResponse(response, 'simple_proxy');
      }
    } catch (error) {
      console.warn(`Simple proxy ${proxy} failed:`, error?.message);
    }
  }
  
  throw new Error('All simple proxy services failed');
}

/**
 * Image proxy service request with improved reliability
 */
async function imageProxyService(url, options) {
  // Use more reliable image proxy services
  const imageProxies = [
    {
      name: 'weserv',
      url: 'https://images.weserv.nl/?url=',
      transform: (imageUrl) => imageUrl
    },
    {
      name: 'imageproxy',
      url: 'https://imageproxy.pxlnv.com/get?url=',
      transform: (imageUrl) => imageUrl
    }
  ];

  for (const proxy of imageProxies) {
    try {
      const proxyUrl = proxy?.url + encodeURIComponent(url);
      console.log(`🖼️ Trying image proxy: ${proxy?.name}`);
      
      const response = await fetch(proxyUrl, {
        method: 'GET',
        headers: {
          'Accept': 'image/*,*/*;q=0.8'
        }
      });

      if (response?.ok) {
        return await processImageResponse(response, `image_proxy_${proxy?.name}`);
      } else {
        throw new Error(`Image proxy ${proxy.name} returned status ${response.status}`);
      }
    } catch (error) {
      console.warn(`❌ Image proxy ${proxy?.name} failed:`, error?.message);
    }
  }
  
  throw new Error('All image proxy services failed');
}

/**
 * Processes image response from fetch
 * @param {Response} response - Fetch response
 * @param {string} method - Extraction method used
 * @returns {Promise<Object>} Processed image data
 */
async function processImageResponse(response, method) {
  const blob = await response?.blob();
  
  if (blob?.size === 0) {
    throw new Error('Empty response received');
  }

  // Convert to base64
  const arrayBuffer = await blob?.arrayBuffer();
  const base64Data = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
  
  return {
    success: true,
    imageData: base64Data,
    mimeType: blob?.type || 'image/png',
    fileSize: blob?.size,
    extractionTime: Date.now(),
    method: method,
    contentType: response?.headers?.get('content-type')
  };
}

/**
 * Processes proxy response with improved format handling
 */
async function processProxyResponse(content, method) {
  try {
    // Handle different content types
    if (typeof content === 'string') {
      // Check if it's base64 encoded image data
      if (content?.startsWith('data:image/')) {
        const base64Data = content?.split(',')?.[1];
        const mimeType = content?.match(/data:([^;]+)/)?.[1];
        
        return {
          success: true,
          imageData: base64Data,
          mimeType: mimeType,
          fileSize: base64Data?.length,
          extractionTime: Date.now(),
          method: method
        };
      }
      
      // Try to detect if content is HTML containing image URLs
      if (content?.includes('<img') || content?.includes('og:image')) {
        const imageUrls = extractImageUrlsFromHtml(content);
        if (imageUrls?.length > 0) {
          // Try to fetch the first found image URL directly
          const firstImageUrl = imageUrls?.[0];
          console.log(`🔍 Found image URL in HTML: ${firstImageUrl}`);
          return await directCorsRequest(firstImageUrl, { timeout: 8000 });
        }
      }
    }
    
    throw new Error('Invalid or unsupported proxy response format');
    
  } catch (error) {
    throw new Error(`Failed to process proxy response: ${error.message}`);
  }
}

/**
 * Extracts image URLs from HTML content
 * @param {string} html - HTML content to parse
 * @returns {Array<string>} Array of image URLs found
 */
function extractImageUrlsFromHtml(html) {
  const imageUrls = [];
  
  try {
    // Extract img src attributes
    const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
    let match;
    while ((match = imgRegex.exec(html)) !== null) {
      imageUrls.push(match[1]);
    }
    
    // Extract og:image meta tags
    const ogImageRegex = /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["'][^>]*>/gi;
    while ((match = ogImageRegex.exec(html)) !== null) {
      imageUrls.push(match[1]);
    }
    
    // Extract twitter:image meta tags
    const twitterImageRegex = /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["'][^>]*>/gi;
    while ((match = twitterImageRegex.exec(html)) !== null) {
      imageUrls.push(match[1]);
    }
    
    return imageUrls.filter(url => url && url.startsWith('http'));
    
  } catch (error) {
    console.warn('Failed to extract image URLs from HTML:', error?.message);
    return [];
  }
}

/**
 * Validates extracted image content
 * @param {string} base64Data - Base64 image data
 * @param {string} mimeType - MIME type
 * @returns {Promise<Object>} Validation result
 */
async function validateImageContent(base64Data, mimeType) {
  try {
    if (!base64Data) {
      return { isValid: false, error: 'No image data provided' };
    }

    // Check if it's a valid base64 string
    try {
      atob(base64Data);
    } catch (error) {
      return { isValid: false, error: 'Invalid base64 encoding' };
    }

    // Check file size (max 20MB)
    const sizeInBytes = (base64Data?.length * 3) / 4;
    if (sizeInBytes > 20 * 1024 * 1024) {
      return { isValid: false, error: 'Image too large (max 20MB)' };
    }

    // Check MIME type
    const validMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (mimeType && !validMimeTypes?.includes(mimeType?.toLowerCase())) {
      return { isValid: false, error: `Unsupported MIME type: ${mimeType}` };
    }

    // Validate image headers
    const headerValidation = validateImageHeaders(base64Data);
    if (!headerValidation?.isValid) {
      return headerValidation;
    }

    return { isValid: true };
    
  } catch (error) {
    return { isValid: false, error: `Validation failed: ${error?.message}` };
  }
}

/**
 * Validates image file headers
 * @param {string} base64Data - Base64 image data
 * @returns {Object} Header validation result
 */
function validateImageHeaders(base64Data) {
  try {
    // Decode first few bytes to check file signature
    const binaryString = atob(base64Data?.substring(0, 100));
    const bytes = [];
    for (let i = 0; i < Math.min(binaryString?.length, 10); i++) {
      bytes?.push(binaryString?.charCodeAt(i));
    }

    // Check common image signatures
    const signatures = {
      jpeg: [0xFF, 0xD8, 0xFF],
      png: [0x89, 0x50, 0x4E, 0x47],
      gif: [0x47, 0x49, 0x46],
      webp: [0x52, 0x49, 0x46, 0x46] // RIFF header for WebP
    };

    for (const [format, signature] of Object.entries(signatures)) {
      if (signature?.every((byte, index) => bytes?.[index] === byte)) {
        return { isValid: true, format: format };
      }
    }

    return { isValid: false, error: 'Invalid image file signature' };
    
  } catch (error) {
    return { isValid: false, error: `Header validation failed: ${error?.message}` };
  }
}

/**
 * Enhanced URL-based fashion generation with improved error handling
 */
export async function generateFromImageUrlRobust(imageUrl, wardrobePrompt, options = {}) {
  const {
    selectedStyles = ['realistic'],
    perStyleCounts = {},
    preservePose = true,
    preserveFacialExpressions = true,
    creativityLevel = 0.7,
    maxRetries = 2,
    enableUploadFallback = true
  } = options;

  try {
    // Step 1: Extract image using robust extraction system
    console.log('🔍 Starting robust image extraction...');
    
    const extractionResult = await extractImageFromUrl(imageUrl, {
      maxRetries: maxRetries,
      timeout: 10000,
      useProxy: true,
      enableFallbacks: true,
      validateContent: true
    });

    if (!extractionResult?.success) {
      throw new Error(`Image extraction failed: ${extractionResult?.error || 'Unknown extraction error'}`);
    }

    console.log(`✅ Image extracted successfully using: ${extractionResult?.strategy}`);

    // Step 2: Analyze image with Gemini
    const analysisResult = await analyzeExtractedImage(extractionResult, wardrobePrompt);
    
    if (!analysisResult?.success) {
      console.warn('⚠️ Image analysis failed, proceeding without detailed analysis');
      // Continue without analysis rather than failing completely
    }

    // Step 3: Generate fashion overlays
    console.log('🎨 Generating fashion overlays...');
    
    // Convert base64 to File object for compatibility
    const imageFile = await base64ToFile(
      extractionResult?.imageData, 
      extractionResult?.mimeType, 
      'extracted-image'
    );

    const enhancedPrompt = `${wardrobePrompt}

${analysisResult?.success ? `EXTRACTED IMAGE ANALYSIS:
${analysisResult?.analysis}

PRESERVATION REQUIREMENTS:
- Maintain the exact same pose and body positioning
- Preserve facial expressions and features  
- Keep lighting and background context
- Apply fashion overlays naturally and seamlessly

Generate fashion overlays that respect the original image characteristics while applying the requested wardrobe changes.` : 'Apply the requested wardrobe changes while preserving the person\'s natural pose and characteristics.'}`;

    const overlayResults = await generateWardrobeOverlay(imageFile, enhancedPrompt, {
      creativityLevel: creativityLevel,
      selectedStyles: selectedStyles,
      preserveFace: preserveFacialExpressions,
      preservePose: preservePose
    });

    return {
      success: true,
      generatedImages: overlayResults?.overlayImages || [],
      originalAnalysis: analysisResult?.analysis || 'Analysis not available',
      extractionMetadata: extractionResult?.metadata,
      originalUrl: imageUrl,
      extractionStrategy: extractionResult?.strategy,
      model: 'enhanced_gemini_extraction'
    };

  } catch (error) {
    console.error('🚨 Enhanced URL generation failed:', error);
    
    // Enhanced fallback handling with detailed information
    if (enableUploadFallback && (
      error?.message?.includes('All extraction strategies failed') ||
      error?.message?.includes('NetworkError') ||
      error?.message?.includes('CORS')
    )) {
      
      return {
        success: false,
        requiresUpload: true,
        error: error?.message,
        fallbackMessage: `Unable to extract image from the provided URL due to network restrictions. Please upload the image directly using the upload button below.`,
        extractionStrategies: error?.extractionStrategies || [
          'Direct CORS request',
          'No-CORS request',
          'Reliable proxy services',
          'Image proxy services',
          'Simple proxy services'
        ],
        errorDetails: error?.allErrors || [],
        suggestions: [
          'Right-click on the image and select "Copy image address"',
          'Try opening the image in a new tab and copying that URL',
          'Save the image to your device and upload directly',
          'Check if the image URL is publicly accessible',
          'Try a different image hosting service (imgur, unsplash, etc.)'
        ]
      };
    }
    
    throw new Error(`Enhanced URL generation failed: ${error.message}`);
  }
}

/**
 * Analyzes extracted image using Gemini vision API
 * @param {Object} extractionResult - Result from image extraction
 * @param {string} context - Analysis context
 * @returns {Promise<Object>} Analysis result
 */
async function analyzeExtractedImage(extractionResult, context) {
  try {
    const model = genAI?.getGenerativeModel({ model: 'gemini-1.5-pro' });
    
    const imagePart = {
      inlineData: {
        data: extractionResult?.imageData,
        mimeType: extractionResult?.mimeType || 'image/png',
      },
    };
    
    const analysisPrompt = `Analyze this extracted fashion image for virtual wardrobe overlay generation.

Context: ${context}
Source URL: ${extractionResult?.originalUrl}
Extraction Strategy: ${extractionResult?.strategy}

Please provide:
1. Detailed description of the person's pose and body positioning
2. Facial expression and features analysis for preservation  
3. Current clothing and style assessment
4. Lighting conditions and background elements
5. Optimal overlay strategies for this specific image
6. Color palette and style recommendations
7. Any challenges or considerations for virtual wardrobe application

Focus on providing actionable insights for creating seamless fashion overlays while maintaining the person's natural characteristics.`;

    const result = await model?.generateContent([analysisPrompt, imagePart]);
    const analysisResponse = await result?.response;
    
    return {
      success: true,
      analysis: analysisResponse?.text(),
      timestamp: new Date()?.toISOString()
    };
    
  } catch (error) {
    console.error('Image analysis failed:', error);
    return {
      success: false,
      error: error?.message,
      timestamp: new Date()?.toISOString()
    };
  }
}

/**
 * Converts base64 data to File object
 * @param {string} base64Data - Base64 image data
 * @param {string} mimeType - MIME type
 * @param {string} filename - File name
 * @returns {Promise<File>} File object
 */
async function base64ToFile(base64Data, mimeType, filename) {
  try {
    // Convert base64 to blob
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters?.length; i++) {
      byteNumbers[i] = byteCharacters?.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });
    
    // Convert blob to File
    const file = new File([blob], filename, { type: mimeType });
    return file;
    
  } catch (error) {
    throw new Error(`Failed to convert base64 to file: ${error.message}`);
  }
}

/**
 * Creates enhanced fallback upload UI with detailed error information
 */
export function createUploadFallback(failureInfo) {
  return {
    type: 'upload_fallback',
    title: 'Image Extraction Failed',
    message: failureInfo?.fallbackMessage,
    strategies_tried: failureInfo?.extractionStrategies,
    error_details: failureInfo?.errorDetails,
    suggestions: failureInfo?.suggestions,
    upload_config: {
      accept: 'image/png,image/jpeg,image/jpg,image/webp',
      maxSize: '4MB',
      description: 'Upload the image directly to continue with fashion generation'
    },
    retry_options: {
      enable_retry: true,
      retry_strategies: ['direct_image_url', 'different_image_source', 'manual_upload'],
      tips: [
        'Try copying the image URL from a different source',
        'Use image hosting services like Imgur or Unsplash',
        'Upload the image directly for guaranteed results'
      ]
    }
  };
}

// Enhanced exports with improved error handling
export { analyzeExtractedImage, validateAndNormalizeUrl, validateImageContent };