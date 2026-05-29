import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | null = null;
const imageCache = new Map<string, string>();

export async function generateRoomImage(prompt: string, roomId: string): Promise<string> {
  if (imageCache.has(roomId)) {
    return imageCache.get(roomId)!;
  }

  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing");
    }
    ai = new GoogleGenAI({ apiKey });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: prompt,
      config: {
        // @ts-ignore
        imageConfig: {
          aspectRatio: "16:9",
        }
      }
    });

    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData) {
        const base64 = part.inlineData.data;
        const mimeType = part.inlineData.mimeType || 'image/jpeg';
        const dataUrl = `data:${mimeType};base64,${base64}`;
        imageCache.set(roomId, dataUrl);
        return dataUrl;
      }
    }
    throw new Error("No image data found in response");
  } catch (error) {
    console.error(`Failed to generate image for ${roomId}:`, error);
    throw error;
  }
}
