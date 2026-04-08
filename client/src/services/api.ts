import type { AnalysisResult, GenerationResult } from "../types";

export async function analyzeStyle(imageFiles: File | File[]): Promise<AnalysisResult> {
  const formData = new FormData();
  const files = Array.isArray(imageFiles) ? imageFiles : [imageFiles];
  files.forEach((file) => formData.append("images", file));

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
  strength?: number
): Promise<GenerationResult> {
  const formData = new FormData();
  formData.append("originalImage", originalImage);
  formData.append("stylePrompt", stylePrompt);
  formData.append("fixMode", String(fixMode));
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
