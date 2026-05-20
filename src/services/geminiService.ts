import { GoogleGenAI } from '@google/genai';
import { Product } from '../types';

// Initialize the Google Gen AI client with the API key from environment variables
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn('[Gemini] No API Key found in environment variables!');
}
const genAI = new GoogleGenAI({ apiKey });

// Use gemini-1.5-flash — stable and high quota
const MODEL_NAME = 'models/gemini-flash-latest';



export const geminiService = {
  async getChatResponse(message: string, history: any[], products: Product[], user?: any): Promise<string> {
    const productContext = products.slice(0, 30).map(p => ({
      name_bn: p.name_bn || p.name_en,
      name_en: p.name_en,
      price: p.price,
      discount_price: p.discount_price,
      category: p.category,
      skin_type: p.skin_type,
    }));

    const userInfo = user
      ? `বর্তমান কাস্টমার: ${user.name} (ফোন: ${user.phone}, ঠিকানা: ${user.address || 'জানা নেই'}). কাস্টমার লগ-ইন করা আছেন।`
      : 'কাস্টমার লগ-ইন করেননি। লিড কালেকশনের জন্য নাম ও ফোন চাইবেন।';

    const systemPrompt = `আপনি "সাবিহা" — Korean Skin Food-এর Lead Skincare Consultant।
সবসময় বাংলায় কথা বলুন। উষ্ণ, পেশাদার এবং সহায়ক ভাষায় কথা বলুন।
${userInfo}

প্রোডাক্ট ক্যাটালগ: ${JSON.stringify(productContext)}

নিয়ম:
- স্কিন টাইপ জিজ্ঞেস করুন এবং ক্যাটালগ থেকে উপযুক্ত প্রোডাক্ট সাজেস্ট করুন।
- কাস্টমার কিনতে আগ্রহী হলে নাম, ফোন ও ঠিকানা সংগ্রহ করুন।
- কাস্টমার তার নাম এবং ফোন নাম্বার দিলে এবং আপনি নিশ্চিত হলে যে প্রয়োজনীয় তথ্য সংগৃহীত হয়েছে, তখন উত্তরের একদম শেষে কোনো স্পেস বা অতিরিক্ত টেক্সট ছাড়া এই ফরম্যাটে একটি JSON পে-লোড যুক্ত করুন: [[LEAD_CAPTURE: {"name": "কাস্টমারের নাম", "phone": "কাস্টমারের ফোন", "address": "ঠিকানা (যদি থাকে)", "skin_type": "ত্বকের ধরন", "concern": "ত্বকের সমস্যা"}]]। তথ্য সম্পূর্ণ হওয়ার আগ পর্যন্ত এটি যুক্ত করবেন না।
- ঢাকার ভেতরে ডেলিভারি চার্জ ৳60, বাইরে ৳120।
- প্রতিযোগী ব্র্যান্ড উল্লেখ করবেন না।
- শেষে লিখুন: "আর কোনো সাহায্য লাগলে জানাবেন! 😊"`;

    // Build conversation history for @google/genai
    // Note: The new SDK expects a specific format if using chat, 
    // but here we are using generateContent with a full prompt for simplicity and control.
    const historyText = history.map(m =>
      `${m.role === 'user' ? 'Customer' : 'Sabiha'}: ${m.parts[0].text}`
    ).join('\n');

    const fullPrompt = `${systemPrompt}\n\n${historyText ? 'Conversation so far:\n' + historyText + '\n\n' : ''}Customer: ${message}\nSabiha:`;

    try {
      const result = await genAI.models.generateContent({
        model: MODEL_NAME,
        contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
      });
      return result.text?.trim() || 'দুঃখিত, উত্তর পেতে সমস্যা হচ্ছে।';
    } catch (error: any) {
      console.error('[Gemini] Primary Call Error:', error);
      // Fallback: try with flash-lite

      try {
        const fallbackResult = await genAI.models.generateContent({
          model: 'models/gemini-flash-lite-latest',
          contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
        });
        return fallbackResult.text?.trim() || 'দুঃখিত, উত্তর পেতে সমস্যা হচ্ছে।';
      } catch (fallbackError: any) {

        console.error('[Gemini] Fallback Error:', fallbackError?.message || fallbackError);
        return 'দুঃখিত, এই মুহূর্তে AI সার্ভিস পাওয়া যাচ্ছে না। একটু পরে আবার চেষ্টা করুন।';
      }
    }
  },

  // For product research in AdminInventory
  async generateProductInfo(prompt: string): Promise<string> {
    try {
      const result = await genAI.models.generateContent({
        model: MODEL_NAME,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });
      return result.text?.trim() || '';
    } catch (error: any) {
      console.error('[Gemini] generateProductInfo Error:', error?.message || error);
      return '';
    }
  },
};

