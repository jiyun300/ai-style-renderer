import { GoogleGenerativeAI } from "@google/generative-ai";
import { STYLE_ANALYSIS_PROMPT, STYLE_ANALYSIS_MULTI_PROMPT, CONTENT_DESCRIPTION_PROMPT } from "../utils/prompts.js";

let genAI: GoogleGenerativeAI;
function getClient() {
  if (!genAI) genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  return genAI;
}

interface ImageInput {
  base64: string;
  mediaType: string;
}

interface StyleAnalysisResult {
  stylePrompt: string;
  breakdown: {
    renderingTechnique: string;
    colorPalette: string;
    lighting: string;
    lineWork: string;
    texture: string;
    aesthetic: string;
  };
}

export async function analyzeStyle(images: ImageInput[]): Promise<StyleAnalysisResult> {
  const model = getClient().getGenerativeModel({ model: "gemini-2.0-flash" });

  const imageParts = images.map((img) => ({
    inlineData: {
      data: img.base64,
      mimeType: img.mediaType,
    },
  }));

  const prompt = images.length > 1 ? STYLE_ANALYSIS_MULTI_PROMPT : STYLE_ANALYSIS_PROMPT;

  const result = await model.generateContent([...imageParts, { text: prompt }]);
  const text = result.response.text();
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Failed to parse style analysis response");
  return JSON.parse(jsonMatch[0]);
}

export async function describeContent(imageBase64: string, mediaType: string): Promise<string> {
  const model = getClient().getGenerativeModel({ model: "gemini-2.0-flash" });

  const result = await model.generateContent([
    {
      inlineData: {
        data: imageBase64,
        mimeType: mediaType,
      },
    },
    { text: CONTENT_DESCRIPTION_PROMPT },
  ]);

  return result.response.text().trim();
}
