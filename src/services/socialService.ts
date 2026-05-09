import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface SocialResponse {
  facebook_caption: string;
  instagram_caption: string;
  hashtags: string[];
  story_text: string;
  best_time: string;
}

export const socialService = {
  async generateSocialContent(productName: string, imageDesc: string, goal: 'awareness' | 'sale' | 'engagement'): Promise<SocialResponse> {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Gemini API Key is missing.");
    }

    const prompt = `
      You are a creative social media manager for "Korean Skin Food" (কোরিয়ান স্কিন ফুড), a K-beauty brand in Bangladesh.

      Product Name: ${productName}
      Image Description: ${imageDesc}
      Goal: ${goal}

      Your task:
      Generate social media content:
      1. Facebook Post Caption (Bangla + a little English) — max 150 words, conversational, emoji-friendly
      2. Instagram Caption (Bangla + English mix) — punchy, aesthetic, max 100 words
      3. 15–20 Hashtags — mix of Bengali, English, K-beauty specific
      4. Best time to post suggestion (Bangladesh timezone)
      5. Story text (1–2 lines) — bold and attention-grabbing

      Brand voice:
      - Fun, youthful, K-beauty obsessed
      - Celebrate Bangladesh + Korean beauty culture together
      - Use trendy but not cringy language
      - Emojis: yes, but tasteful (max 5 per post)

      Goal-based tone:
      - Awareness -> Educate and inspire
      - Sale -> Create urgency ("Limited stock!", " আজই অর্ডার করুন")
      - Engagement -> Ask a question, run a poll idea

      Output format: Return as JSON with keys: facebook_caption, instagram_caption, hashtags[], story_text, best_time.
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
      console.error("Social Generation Error:", error);
      throw error;
    }
  }
};
