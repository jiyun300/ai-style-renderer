import { Router, Request, Response } from "express";
import multer from "multer";
import { analyzeStyle, describeContent } from "../services/claude.js";
import { generateImage } from "../services/replicate.js";

const router = Router();
const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } });

router.post(
  "/",
  upload.fields([
    { name: "originalImage", maxCount: 1 },
    { name: "styleImage", maxCount: 1 },
  ]),
  async (req: Request, res: Response) => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const originalFile = files?.originalImage?.[0];
      const styleFile = files?.styleImage?.[0];

      if (!originalFile || !styleFile) {
        res.status(400).json({ error: "Both original and style reference images are required" });
        return;
      }

      const fixMode = req.body.fixMode === "true";
      const strength = req.body.strength ? parseFloat(req.body.strength) : undefined;

      // Analyze style from reference image
      const styleBase64 = styleFile.buffer.toString("base64");
      const styleAnalysis = await analyzeStyle(styleBase64, styleFile.mimetype);

      // Describe content from original image
      const originalBase64 = originalFile.buffer.toString("base64");
      const contentDescription = await describeContent(originalBase64, originalFile.mimetype);

      // Generate image
      const imageUrl = await generateImage({
        stylePrompt: styleAnalysis.stylePrompt,
        contentDescription,
        imageBase64: originalBase64,
        mediaType: originalFile.mimetype,
        fixMode,
        strength,
      });

      res.json({
        imageUrl,
        stylePromptUsed: styleAnalysis.stylePrompt,
        contentDescription,
        styleBreakdown: styleAnalysis.breakdown,
      });
    } catch (error) {
      console.error("Generation error:", error);
      res.status(500).json({ error: "Image generation failed" });
    }
  }
);

export default router;
