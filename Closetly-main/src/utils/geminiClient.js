import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Enhanced Gemini client for native image generation (Nano Banana functionality)
 * Initializes with support for both text and image generation models
 * @returns {GoogleGenerativeAI} Configured Gemini client instance with image generation capabilities.
 */
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export default genAI;