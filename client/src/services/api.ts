import type { AnalysisResult, GenerationResult, Provider } from "../types";

export async function analyzeStyle(
  imageFiles: File | File[],
  provider: Provider = "gemini"
): Promise<AnalysisResult> {
  const formData = new FormData();
  const files = Array.isArray(imageFiles) ? imageFiles : [imageFiles];
  files.forEach((file) => formData.append("images", file));
  formData.append("provider", provider);

  const res = await fetch("/api/analyze", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Analysis failed" }));
    throw new Error(err.error);
  }

  return res.json();
}

export async function generateStyledImage(
  originalImage: File,
  stylePrompt: string,
  fixMode: boolean,
  strength?: number,
  provider: Provider = "gemini"
): Promise<GenerationResult> {
  const formData = new FormData();
  formData.append("originalImage", originalImage);
  formData.append("stylePrompt", stylePrompt);
  formData.append("fixMode", String(fixMode));
  formData.append("provider", provider);
  if (strength !== undefined) formData.append("strength", String(strength));

  const res = await fetch("/api/generate", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Generation failed" }));
    throw new Error(err.error);
  }

  return res.json();
}
