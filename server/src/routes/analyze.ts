import { Router, Request, Response } from "express";
import multer from "multer";
import { analyzeStyle } from "../services/claude.js";

const router = Router();
const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } });

router.post("/", upload.single("image"), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No image file provided" });
      return;
    }

    const imageBase64 = req.file.buffer.toString("base64");
    const mediaType = req.file.mimetype;

    const result = await analyzeStyle(imageBase64, mediaType);
    res.json(result);
  } catch (error) {
    console.error("Analysis error:", error);
    res.status(500).json({ error: "Style analysis failed" });
  }
});

export default router;
