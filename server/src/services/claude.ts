import Anthropic from "@anthropic-ai/sdk";
import { STYLE_ANALYSIS_PROMPT, STYLE_ANALYSIS_MULTI_PROMPT, CONTENT_DESCRIPTION_PROMPT } from "../utils/prompts.js";

export type Provider = "gemini" | "claude";

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

const AI_PROXY_BASE_URL = process.env.AI_PROXY_BASE_URL!;
const AI_PROXY_TOKEN = process.env.AI_PROXY_PERSONAL_TOKEN!;
const GEMINI_MODEL = "gemini-2.5-flash";
const CLAUDE_MODEL = "claude-sonnet-4-20250514";

// Anthropic SDK client routed through AI Proxy
let anthropicClient: Anthropic;
function getAnthropicClient() {
  if (!anthropicClient) {
    anthropicClient = new Anthropic({
      baseURL: `${AI_PROXY_BASE_URL}/anthropic`,
      apiKey: AI_PROXY_TOKEN,
    });
  }
  return anthropicClient;
}

// --- Gemini via AI Proxy (REST) ---

async function callGemini(parts: any[]): Promise<string> {
  const url = `${AI_PROXY_BASE_URL}/google/v1beta/models/${GEMINI_MODEL}:generateContent`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${AI_PROXY_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [{ role: "user", parts }],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${errText}`);
  }

  const data: any = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini returned empty response");
  return text;
}

// --- Claude via AI Proxy (Anthropic SDK) ---

async function callClaude(imageInputs: ImageInput[], promptText: string): Promise<string> {
  const client = getAnthropicClient();
  const content: Anthropic.ContentBlockParam[] = [
    ...imageInputs.map((img) => ({
      type: "image" as const,
      source: {
        type: "base64" as const,
        media_type: img.mediaType as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
        data: img.base64,
      },
    })),
    { type: "text" as const, text: promptText },
  ];

  const response = await client.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 2048,
    messages: [{ role: "user", content }],
  });

  const block = response.content.find((b) => b.type === "text");
  if (!block || block.type !== "text") throw new Error("Claude returned no text");
  return block.text;
}

// --- Public API ---

export async function analyzeStyle(
  images: ImageInput[],
  provider: Provider = "gemini"
): Promise<StyleAnalysisResult> {
  const promptText = images.length > 1 ? STYLE_ANALYSIS_MULTI_PROMPT : STYLE_ANALYSIS_PROMPT;

  let text: string;
  if (provider === "claude") {
    text = await callClaude(images, promptText);
  } else {
    const parts = [
      ...images.map((img) => ({
        inline_data: { data: img.base64, mime_type: img.mediaType },
      })),
      { text: promptText },
    ];
    text = await callGemini(parts);
  }

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Failed to parse style analysis response");
  return JSON.parse(jsonMatch[0]);
}

export async function describeContent(
  imageBase64: string,
  mediaType: string,
  provider: Provider = "gemini"
): Promise<string> {
  if (provider === "claude") {
    const text = await callClaude([{ base64: imageBase64, mediaType }], CONTENT_DESCRIPTION_PROMPT);
    return text.trim();
  }

  const parts = [
    { inline_data: { data: imageBase64, mime_type: mediaType } },
    { text: CONTENT_DESCRIPTION_PROMPT },
  ];
  const text = await callGemini(parts);
  return text.trim();
}
