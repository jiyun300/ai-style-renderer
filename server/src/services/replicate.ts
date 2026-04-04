import Replicate from "replicate";

const replicate = new Replicate();

interface GenerateOptions {
  stylePrompt: string;
  contentDescription: string;
  imageBase64: string;
  mediaType: string;
  fixMode: boolean;
  strength?: number;
}

export async function generateImage(options: GenerateOptions): Promise<string> {
  const { stylePrompt, contentDescription, imageBase64, mediaType, fixMode, strength } = options;
  const imageUri = `data:${mediaType};base64,${imageBase64}`;
  const fullPrompt = `${contentDescription}, ${stylePrompt}`;
  const negativePrompt = "blurry, low quality, distorted, deformed, watermark, text, ugly, duplicate, morbid";

  if (fixMode) {
    // FIX ON: Use ControlNet-Canny for structural preservation
    const output = await replicate.run(
      "lucataco/sdxl-controlnet:db2ffdbdc7f6cb4d6dab512434679ee3366ae7ab84f89750f8947d5ad24761c9",
      {
        input: {
          image: imageUri,
          prompt: fullPrompt,
          negative_prompt: negativePrompt,
          condition_scale: 0.8,
          guidance_scale: 7.5,
          num_inference_steps: 30,
          scheduler: "K_EULER_ANCESTRAL",
        },
      }
    );
    return extractUrl(output);
  } else {
    // FIX OFF: Use SDXL img2img for creative freedom
    const output = await replicate.run(
      "stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc",
      {
        input: {
          image: imageUri,
          prompt: fullPrompt,
          negative_prompt: negativePrompt,
          prompt_strength: strength ?? 0.65,
          num_inference_steps: 30,
          guidance_scale: 7.5,
          scheduler: "K_EULER_ANCESTRAL",
        },
      }
    );
    return extractUrl(output);
  }
}

function extractUrl(output: unknown): string {
  if (typeof output === "string") return output;
  if (Array.isArray(output) && output.length > 0) {
    const first = output[0];
    if (typeof first === "string") return first;
    if (typeof first === "object" && first !== null && "url" in first) return (first as { url: string }).url;
  }
  if (output && typeof output === "object" && "url" in output) return (output as { url: string }).url;
  throw new Error("Unexpected Replicate output format");
}
