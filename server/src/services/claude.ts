import Anthropic from "@anthropic-ai/sdk";
import { STYLE_ANALYSIS_PROMPT, CONTENT_DESCRIPTION_PROMPT } from "../utils/prompts.js";

const client = new Anthropic();

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

export async function analyzeStyle(imageBase64: string, mediaType: string): Promise<StyleAnalysisResult> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: mediaType as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
              data: imageBase64,
            },
          },
          {
            type: "text",
            text: STYLE_ANALYSIS_PROMPT,
          },
        ],
      },
    ],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Failed to parse style analysis response");
  return JSON.parse(jsonMatch[0]);
}

export async function describeContent(imageBase64: string, mediaType: string): Promise<string> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 512,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: mediaType as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
              data: imageBase64,
            },
          },
          {
            type: "text",
            text: CONTENT_DESCRIPTION_PROMPT,
          },
        ],
      },
    ],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  return text.trim();
}
