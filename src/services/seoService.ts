import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface SEOResponse {
  seo_title: string;
  meta_description: string;
  product_description: string;
  keywords: string[];
  schema_markup: any;
}

export const seoService = {
  async generateSEO(productName: string, details: string): Promise<SEOResponse> {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Gemini API Key is missing.");
    }

    const prompt = `
      You are an expert SEO copywriter specializing in Korean skincare and K-beauty products.

      Product Name: ${productName}
      Basic Details: ${details}

      Your task:
      Generate the following SEO content:
      1. SEO Title (max 60 characters) — include product name + main benefit + brand name
      2. Meta Description (max 155 characters) — compelling, include main keyword, end with a soft CTA
      3. Product Description (150-200 words) — engaging, benefit-focused, include keywords naturally
      4. 5 SEO Keywords — mix of short-tail and long-tail
      5. JSON-LD Schema Markup — Product schema with name, description, brand, offers

      Keywords to always include naturally (where relevant):
      - Korean skincare Bangladesh
      - K-beauty
      - Korean Skin Food
      - [specific skin concern: acne / brightening / hydration / anti-aging]

      Tone: Professional, trustworthy, beauty-forward
      Language: English (for SEO), but product description can be bilingual (English + Bangla)

      Output format: Return as clean JSON with keys: seo_title, meta_description, product_description, keywords[], schema_markup (as an object, not string).
    `;

    try {
      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });
      const text = result.text;
      if (!text) throw new Error("No content generated");
      return JSON.parse(text);
    } catch (error) {
      console.error("SEO Generation Error:", error);
      throw error;
    }
  }
};
