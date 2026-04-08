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

export const STYLE_ANALYSIS_MULTI_PROMPT = `You are a rendering style analyst. You are given multiple images. Analyze their COMMON rendering/artistic style attributes.
Do NOT describe the content, subject, characters, or scene. Focus exclusively on the shared style across all images:

1. Rendering technique (cel-shading, watercolor, oil paint, digital paint, 3D render, pixel art, etc.)
2. Color palette (warm, cool, pastel, saturated, muted, monochrome, etc.)
3. Lighting style (rim lighting, flat lighting, volumetric, dramatic shadows, soft ambient, etc.)
4. Line work (clean outlines, sketchy, no outlines, variable weight, thick, thin, etc.)
5. Texture (smooth, grainy, noisy, painterly, crisp, etc.)
6. Overall aesthetic (anime, photorealistic, impressionist, minimalist, retro, etc.)

Find the COMMON style that unifies all the provided images. If styles differ, identify the dominant shared characteristics.

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

export const CONTENT_DESCRIPTION_PROMPT = `Describe the content of this image in EXTREME detail for use in image generation.
You must preserve every visual element so the generated image looks identical in content.
Describe in detail:
- Main subject (exact appearance, pose, expression, clothing colors, accessories)
- Exact spatial layout and composition (where things are positioned)
- Background elements in detail
- Proportions and scale relationships
- Any text, patterns, or specific design elements

Output a detailed comma-separated prompt string. Do NOT describe the art/rendering style - ONLY the content.
Example: "a girl with long straight blue twin tails, white sailor uniform with navy collar, red ribbon bow, sitting at brown wooden desk, right hand on chin, looking out window to the left, bright classroom background, rows of empty desks behind, green chalkboard on right wall, soft sunlight through window"`;

