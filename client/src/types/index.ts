export interface StyleBreakdown {
  renderingTechnique: string;
  colorPalette: string;
  lighting: string;
  lineWork: string;
  texture: string;
  aesthetic: string;
}

export interface AnalysisResult {
  stylePrompt: string;
  breakdown: StyleBreakdown;
}

export interface GenerationResult {
  imageUrl: string;
  stylePromptUsed: string;
  contentDescription: string;
  styleBreakdown: StyleBreakdown;
}
