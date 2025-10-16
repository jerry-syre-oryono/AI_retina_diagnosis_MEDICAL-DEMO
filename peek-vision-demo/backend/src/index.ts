import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import axios from "axios";

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

app.post("/analyze", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image uploaded" });
  }

  try {
    // 1. Read and encode image
    const imagePath = req.file.path;
    const imageBase64 = fs.readFileSync(imagePath, { encoding: "base64" });

    // 2. Send to DeepSeek via Ollama
    const response = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "llava", // or your specific DeepSeek model
        prompt: `You are an AI eye-disease analyzer. 
        Analyze this base64-encoded eye image and describe:
        - What conditions are visible (if any)
        - Confidence level (low/medium/high)
        - Recommended next steps for the patient.
        Return results in concise JSON:
        {
          "result": "...",
          "confidence": "...",
          "recommendations": ["...", "..."]
        }`,
        images: [imageBase64],
        stream: false,
      },
      { timeout: 180000 } // allow up to 3 minutes
    );

    // 3. Parse DeepSeek response
    let output = response.data.response || response.data;
    let jsonData;

    try {
      jsonData = JSON.parse(output);
    } catch (err) {
      jsonData = { result: output, confidence: "N/A", recommendations: [] };
    }

    res.json(jsonData);
  } catch (error: any) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Analysis failed", details: error.message });
  }
});

app.listen(4000, () => console.log("✅ Peek Vision API running at http://localhost:4000"));