import { GoogleGenAI } from '@google/genai';
import { Product } from '../types';

const API_KEY =
  import.meta.env.VITE_GEMINI_API_KEY ||
  (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : '') ||
  '';

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Use gemini-2.0-flash — fastest, most available model
const MODEL = 'gemini-2.0-flash';

export const geminiService = {
  async getChatResponse(message: string, history: any[], products: Product[], user?: any): Promise<string> {
    if (!API_KEY) {
      return 'দয়া করে VITE_GEMINI_API_KEY সেট করুন।';
    }

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
- ঢাকার ভেতরে ডেলিভারি চার্জ ৳60, বাইরে ৳120।
- প্রতিযোগী ব্র্যান্ড উল্লেখ করবেন না।
- শেষে লিখুন: "আর কোনো সাহায্য লাগলে জানাবেন! 😊"`;

    // Build conversation history as a single formatted string
    const historyText = history.map(m =>
      `${m.role === 'user' ? 'Customer' : 'Sabiha'}: ${m.parts[0].text}`
    ).join('\n');

    const fullPrompt = `${systemPrompt}\n\n${historyText ? 'Conversation so far:\n' + historyText + '\n\n' : ''}Customer: ${message}\nSabiha:`;

    try {
      const response = await ai.models.generateContent({
        model: MODEL,
        contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
      });
      return response.text?.trim() || 'দুঃখিত, উত্তর পেতে সমস্যা হচ্ছে।';
    } catch (error: any) {
      console.error('[Gemini] Error:', error?.message || error);
      // Fallback: try with gemini-1.5-flash
      try {
        const fallback = await ai.models.generateContent({
          model: 'gemini-1.5-flash',
          contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
        });
        return fallback.text?.trim() || 'দুঃখিত, উত্তর পেতে সমস্যা হচ্ছে।';
      } catch (fallbackError: any) {
        console.error('[Gemini] Fallback Error:', fallbackError?.message || fallbackError);
        return 'দুঃখিত, এই মুহূর্তে AI সার্ভিস পাওয়া যাচ্ছে না। একটু পরে আবার চেষ্টা করুন।';
      }
    }
  },

  // For product research in AdminInventory
  async generateProductInfo(prompt: string): Promise<string> {
    if (!API_KEY) return '';
    try {
      const response = await ai.models.generateContent({
        model: MODEL,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });
      return response.text?.trim() || '';
    } catch (error: any) {
      console.error('[Gemini] generateProductInfo Error:', error?.message || error);
      return '';
    }
  },
};
