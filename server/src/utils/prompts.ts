export const STYLE_ANALYSIS_PROMPT = `You are a rendering style analyst. Given an image, extract ONLY the rendering/artistic style attributes.
Do NOT describe the content, subject, characters, or scene. Focus exclusively on:

1. Rendering technique (cel-shading, watercolor, oil paint, digital paint, 3D render, pixel art, etc.)
2. Color palette (warm, cool, pastel, saturated, muted, monochrome, etc.)
3. Lighting style (rim lighting, flat lighting, volumetric, dramatic shadows, soft ambient, etc.)
4. Line work (clean outlines, sketchy, no outlines, variable weight, thick, thin, etc.)
5. Texture (smooth, grainy, noisy, painterly, crisp, etc.)
6. Overall aesthetic (anime, photorealistic, impressionist, minimalist, retro, etc.)

Respond in JSON format:
{
  "stylePrompt": "comma-separated prompt string suitable for Stable Diffusion",
  "breakdown": {
    "renderingTechnique": "...",
    "colorPalette": "...",
    "lighting": "...",
    "lineWork": "...",
    "texture": "...",
    "aesthetic": "..."
  }
}

The stylePrompt should be a concise, comma-separated string. Example:
"cel-shading, soft pastel color palette, 2D anime flat style, warm rim lighting, clean black outlines, smooth gradients"`;

export const CONTENT_DESCRIPTION_PROMPT = `Describe the content of this image concisely for use in an image generation prompt.
Focus on: subject, pose, composition, background elements, clothing, and key visual features.
Output a single comma-separated prompt string. Do NOT describe the art style - only the content.
Example: "a girl with long blue twin tails, school uniform, sitting at a desk, classroom background, looking out window"`;
