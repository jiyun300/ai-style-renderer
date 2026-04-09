import { Router, Request, Response } from "express";
import multer from "multer";
import sharp from "sharp";
import { generateImage } from "../services/replicate.js";

const router = Router();
const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } });

async function normalizeImage(buffer: Buffer): Promise<{ base64: string; mediaType: string }> {
  const resized = await sharp(buffer)
    .resize({ width: 1568, height: 1568, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toBuffer();
  return { base64: resized.toString("base64"), mediaType: "image/jpeg" };
}

router.post(
  "/",
  upload.fields([
    { name: "originalImage", maxCount: 1 },
  ]),
  async (req: Request, res: Response) => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const originalFile = files?.originalImage?.[0];
      const stylePrompt = req.body.stylePrompt;

      if (!originalFile) {
        res.status(400).json({ error: "Original image is required" });
        return;
      }
      if (!stylePrompt) {
        res.status(400).json({ error: "Style prompt is required. Analyze style first." });
        return;
      }

      const fixMode = req.body.fixMode === "true";
      const strength = req.body.strength ? parseFloat(req.body.strength) : undefined;

      // Normalize original image (resize + JPEG re-encode)
      const normalized = await normalizeImage(originalFile.buffer);

      // Generate styled image (preserves composition, only changes art style)
      const imageUrl = await generateImage({
        stylePrompt,
        contentDescription: "",
        imageBase64: normalized.base64,
        mediaType: normalized.mediaType,
        fixMode,
        strength,
      });

      res.json({
        imageUrl,
        stylePromptUsed: stylePrompt,
      });
    } catch (error: any) {
      console.error("Generation error:", error?.message || error);
      res.status(500).json({ error: "Image generation failed", detail: error?.message });
    }
  }
);

export default router;
