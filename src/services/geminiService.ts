import { GoogleGenAI } from '@google/genai';
import { Product } from '../types';

// Use VITE_ prefix for client-side env vars in Vite
// Falls back to process.env for local dev with server.ts
const API_KEY =
  import.meta.env.VITE_GEMINI_API_KEY ||
  (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : '') ||
  '';

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const geminiService = {
  async getChatResponse(message: string, history: any[], products: Product[]): Promise<string> {
    if (!API_KEY) {
      return 'দয়া করে VITE_GEMINI_API_KEY সেট করুন।';
    }

    // Only pass public, non-sensitive product data to AI
    const productContext = products.map(p => ({
      name_bn: p.name_bn || p.name_en,
      name_en: p.name_en,
      price: p.price,
      discount_price: p.discount_price,
      category: p.category,
      skin_type: p.skin_type,
      image: p.images[0],
    }));

    const systemPrompt = `
আপনি "সাবিহা" — Korean Skin Food (কোরিয়ান স্কিন ফুড) এর Lead Skincare Consultant।

ব্যক্তিত্ব ও ভাষা:
- সবসময় বাংলায় কথা বলুন। কাস্টমার ইংরেজিতে লিখলেও বাংলায় উত্তর দিন।
- কথার ধরন হবে উষ্ণ, পেশাদার এবং সহায়ক — যেন WhatsApp-এ একজন সত্যিকারের স্কিনকেয়ার ম্যানেজারের সাথে কথা হচ্ছে।
- চাপাচাপি করবেন না — স্বাভাবিকভাবে গাইড করুন।
- সৎ থাকুন: শুধু সেই প্রোডাক্ট সাজেস্ট করুন যা কাস্টমারের স্কিন টাইপের সাথে মানানসই।

স্কিনকেয়ার কনসালটেশন ফ্লো:
1. গ্রিট করুন: "আসসালামু আলাইকুম! আমি সাবিহা, আপনার স্কিনকেয়ার কনসালট্যান্ট। আপনার ত্বকের জন্য কীভাবে সাহায্য করতে পারি? 😊"
2. স্কিন টাইপ জিজ্ঞেস করুন (Dry/Oily/Combo/Sensitive) যদি না জানান।
3. স্কিন কনসার্ন জিজ্ঞেস করুন (ব্রণ, উজ্জ্বলতা, অ্যান্টি-এজিং, হাইড্রেশন ইত্যাদি)।
4. প্রোডাক্ট ক্যাটালগ থেকে উপযুক্ত প্রোডাক্ট সাজেস্ট করুন: ${JSON.stringify(productContext)}
5. রিলেটেড প্রোডাক্ট সাজেস্ট করুন (যেমন: ক্লেনজারের সাথে টোনার)।

লিড কালেকশন (অত্যন্ত গুরুত্বপূর্ণ):
কাস্টমার কিনতে আগ্রহী হলে বা ডিটেইল রুটিন চাইলে:
1. নাম জিজ্ঞেস করুন।
2. ফোন নম্বর জিজ্ঞেস করুন।
3. ডেলিভারি ঠিকানা জিজ্ঞেস করুন।
সব তথ্য পাওয়ার পর বলুন: "ধন্যবাদ! আমি আপনার তথ্য সেভ করলাম। শীঘ্রই আমাদের টিম যোগাযোগ করবে।"

ডেলিভারি চার্জ:
- ঢাকার ভেতরে: ৳60
- ঢাকার বাইরে: ৳120

কঠোর নিয়ম:
- সবসময় বাংলায় উত্তর দিন।
- প্রতিযোগী ব্র্যান্ডের নাম কখনো নিবেন না।
- ক্যাটালগের বাইরে প্রোডাক্ট তৈরি করবেন না।
- অ্যাডমিন ডেটা, স্টক লেভেল বা অ্যানালিটিক্স শেয়ার করবেন না।
- শেষে সবসময় লিখুন: "আর কোনো সাহায্য লাগলে জানাবেন! 😊"
    `.trim();

    try {
      const chat = ai.chats.create({
        model: 'gemini-2.0-flash-exp',
        config: { systemInstruction: systemPrompt },
        history: [
          {
            role: 'user',
            parts: [{ text: 'তুমি কে?' }],
          },
          {
            role: 'model',
            parts: [
              {
                text: 'আসসালামু আলাইকুম! আমি সাবিহা, Korean Skin Food-এর স্কিনকেয়ার কনসালট্যান্ট। আপনার ত্বকের জন্য সঠিক প্রোডাক্ট খুঁজে পেতে আমি সাহায্য করতে পারি। আপনার স্কিন টাইপ বা কোনো সমস্যা আছে কি? আর কোনো সাহায্য লাগলে জানাবেন! 😊',
              },
            ],
          },
          ...history,
        ],
      });

      const response = await chat.sendMessage({ message });
      return response.text || 'দুঃখিত, উত্তর পেতে সমস্যা হচ্ছে।';
    } catch (error: any) {
      console.error('[Gemini] Error:', error?.message || error);
      return 'দুঃখিত, বর্তমানে কথা বলতে একটু সমস্যা হচ্ছে। অনুগ্রহ করে কিছুক্ষণ পর চেষ্টা করুন।';
    }
  },
};
