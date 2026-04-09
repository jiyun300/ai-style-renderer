import { Router, Request, Response } from "express";
import multer from "multer";
import sharp from "sharp";
import { analyzeStyle, type Provider } from "../services/claude.js";

const router = Router();
const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } });

async function normalizeImage(buffer: Buffer): Promise<{ base64: string; mediaType: string }> {
  // Resize so longest side <= 1568px and re-encode as JPEG to keep under Claude's 5MB limit
  const resized = await sharp(buffer)
    .resize({ width: 1568, height: 1568, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toBuffer();
  return { base64: resized.toString("base64"), mediaType: "image/jpeg" };
}

router.post("/", upload.array("images", 10), async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[] | undefined;
    if (!files || files.length === 0) {
      res.status(400).json({ error: "No image files provided" });
      return;
    }

    const provider: Provider = req.body.provider === "claude" ? "claude" : "gemini";

    const images = await Promise.all(files.map((f) => normalizeImage(f.buffer)));

    const result = await analyzeStyle(images, provider);
    res.json({ ...result, provider });
  } catch (error: any) {
    console.error("Analysis error:", error?.message || error);
    res.status(500).json({ error: "Style analysis failed", detail: error?.message });
  }
});

export default router;
