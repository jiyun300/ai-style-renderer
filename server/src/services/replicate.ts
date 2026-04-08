import { InferenceClient } from "@huggingface/inference";

let client: InferenceClient;
function getClient() {
  if (!client) client = new InferenceClient(process.env.HF_API_TOKEN);
  return client;
}

interface GenerateOptions {
  stylePrompt: string;
  contentDescription: string;
  imageBase64: string;
  mediaType: string;
  fixMode: boolean;
  strength?: number;
}

export async function generateImage(options: GenerateOptions): Promise<string> {
  const { stylePrompt, contentDescription } = options;

  // 콘텐츠 묘사 + 스타일 프롬프트를 결합하되, 콘텐츠를 우선
  const fullPrompt = `${contentDescription}, rendered in ${stylePrompt}`;

  const hf = getClient();

  const result = await hf.textToImage({
    model: "stabilityai/stable-diffusion-xl-base-1.0",
    inputs: fullPrompt,
    parameters: {
      negative_prompt: "blurry, low quality, distorted, deformed, watermark, text, ugly, different composition, different layout, different content",
      guidance_scale: 9,
      num_inference_steps: 35,
    },
  });

  if (typeof result === "string") {
    return result;
  }
  const blob = result as Blob;
  const arrayBuffer = await blob.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  return `data:image/png;base64,${base64}`;
}
