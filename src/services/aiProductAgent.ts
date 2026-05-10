import { GoogleGenAI } from '@google/genai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey: API_KEY });

export interface AIProductData {
  name_en: string;
  name_bn: string;
  description_en: string;
  description_bn: string;
  ingredients: string;
  category: string;
  skin_type: string;
  tags: string;
  is_featured: boolean;
}

export const aiProductAgent = {
  async researchProduct(productName: string, price: number): Promise<AIProductData> {
    const prompt = `
You are a Korean skincare product data expert. Research this product and return ONLY valid JSON.

Product Name: "${productName}"
Price: ৳${price}

Return this exact JSON structure (no markdown, no explanation):
{
  "name_en": "Full official product name in English",
  "name_bn": "পণ্যের নাম বাংলায়",
  "description_en": "Professional 2-3 sentence product description in English highlighting key benefits",
  "description_bn": "বাংলায় ২-৩ বাক্যে পণ্যের বিবরণ, মূল উপকারিতা সহ",
  "ingredients": "Key active ingredients comma separated (e.g., Snail Secretion Filtrate, Niacinamide, Hyaluronic Acid, Centella Asiatica)",
  "category": "One of: Serum, Toner, Moisturizer, Cleanser, Mask, Sunscreen, Eye Cream, Essence, Ampoule, Mist, Sheet Mask, Exfoliator",
  "skin_type": "One of: All, Dry, Oily, Combination, Sensitive",
  "tags": "5-8 relevant tags comma separated (e.g., anti-aging, brightening, hydrating, K-beauty)",
  "is_featured": false
}

Research based on the product name. If you don't know exact details, infer from the product name context professionally.
`;

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: { systemInstruction: 'You are a Korean skincare expert. Always return valid JSON only, no markdown.' },
      history: [],
    });

    const response = await chat.sendMessage({ message: prompt });
    const text = response.text || '{}';

    // Clean up any markdown code blocks
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    try {
      const data = JSON.parse(cleaned);
      return data as AIProductData;
    } catch {
      // Fallback if JSON parse fails
      return {
        name_en: productName,
        name_bn: productName,
        description_en: `${productName} is a premium Korean skincare product designed to enhance your skin's health and radiance.`,
        description_bn: `${productName} একটি প্রিমিয়াম কোরিয়ান স্কিনকেয়ার পণ্য যা আপনার ত্বকের যত্নে তৈরি।`,
        ingredients: 'Water, Glycerin, Niacinamide, Hyaluronic Acid',
        category: 'Serum',
        skin_type: 'All',
        tags: 'k-beauty, skincare, korean, hydrating',
        is_featured: false,
      };
    }
  },
};
