import { Router, Request, Response } from "express";
import multer from "multer";
import { describeContent } from "../services/claude.js";
import { generateImage } from "../services/replicate.js";

const router = Router();
const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } });

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

      // Describe content from original image
      const originalBase64 = originalFile.buffer.toString("base64");
      const contentDescription = await describeContent(originalBase64, originalFile.mimetype);

      // Generate image
      const imageUrl = await generateImage({
        stylePrompt,
        contentDescription,
        imageBase64: originalBase64,
        mediaType: originalFile.mimetype,
        fixMode,
        strength,
      });

      res.json({
        imageUrl,
        stylePromptUsed: stylePrompt,
        contentDescription,
      });
    } catch (error: any) {
      console.error("Generation error:", error?.message || error);
      res.status(500).json({ error: "Image generation failed", detail: error?.message });
    }
  }
);

export default router;
