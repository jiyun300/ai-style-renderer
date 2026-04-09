// Image style transfer via Gemini Image Generation (Nano Banana)
// Preserves original image composition/content while changing only the rendering style.

const AI_PROXY_BASE_URL = process.env.AI_PROXY_BASE_URL!;
const AI_PROXY_TOKEN = process.env.AI_PROXY_PERSONAL_TOKEN!;
const IMAGE_MODEL = "gemini-3.1-flash-image-preview";

interface GenerateOptions {
  stylePrompt: string;
  contentDescription: string;
  imageBase64: string;
  mediaType: string;
  fixMode: boolean;
  strength?: number;
}

export async function generateImage(options: GenerateOptions): Promise<string> {
  const { stylePrompt, imageBase64, mediaType } = options;

  const instruction = `Transform this image into the following art style: ${stylePrompt}. CRITICAL: Keep the exact same composition, subject, characters, poses, layout, and content. Only change the rendering and art style. Do not add, remove, or alter any visual element other than the artistic rendering.`;

  const url = `${AI_PROXY_BASE_URL}/google/v1beta/models/${IMAGE_MODEL}:generateContent`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${AI_PROXY_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { inline_data: { data: imageBase64, mime_type: mediaType } },
            { text: instruction },
          ],
        },
      ],
      generationConfig: {
        responseModalities: ["TEXT", "IMAGE"],
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini Image API error ${res.status}: ${errText}`);
  }

  const data: any = await res.json();
  const parts = data?.candidates?.[0]?.content?.parts || [];
  for (const p of parts) {
    const inline = p.inline_data || p.inlineData;
    if (inline?.data) {
      const mime = inline.mime_type || inline.mimeType || "image/png";
      return `data:${mime};base64,${inline.data}`;
    }
  }
  throw new Error("Gemini Image API returned no image");
}
