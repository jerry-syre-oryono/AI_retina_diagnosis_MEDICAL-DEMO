import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import axios from "axios";
import { db, initDB } from "./db"; // Import db and initDB
import { v4 as uuidv4 } from "uuid"; // Import uuid
import { Report } from "./types";

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
        model: "llava:7b", // or your specific DeepSeek model
        prompt: `You are an advanced AI medical imaging analyst specializing in ophthalmology.
        Analyze the provided retinal fundus image (base64 encoded) for any observable pathologies.
        Your analysis should be suitable for a medical professional (e.g., an optometrist or ophthalmologist).

        Based on the image, provide the following in a concise JSON format:
        - "result": A detailed description of any observable abnormalities. This may include, but is not limited to, signs of:
            - Diabetic Retinopathy (e.g., microaneurysms, hemorrhages, exudates, neovascularization)
            - Glaucoma (e.g., optic disc cupping, nerve fiber layer defects)
            - Macular Degeneration (e.g., drusen, pigmentary changes, geographic atrophy)
            - Hypertensive Retinopathy (e.g., AV nicking, cotton wool spots, flame hemorrhages)
            - Other vascular or retinal abnormalities.
          If the image appears normal, state "No significant abnormalities detected".
        - "confidence": Your confidence in the assessment (e.g., "High", "Medium", "Low"), based on image quality and clarity of findings.
        - "recommendations": A list of recommended next steps. This could include:
            - "Routine follow-up"
            - "Referral to a retinal specialist"
            - "Further diagnostic imaging (e.g., OCT, fluorescein angiography)"
            - "Monitoring of blood pressure or blood glucose levels"

        Example JSON output:
        {
          "result": "Signs of moderate non-proliferative diabetic retinopathy (NPDR) observed, including multiple microaneurysms and a few dot-and-blot hemorrhages in the superior temporal quadrant. No macular edema is apparent from this image.",
          "confidence": "High",
          "recommendations": ["Referral to a retinal specialist for further evaluation and management.", "Strict glycemic and blood pressure control is advised."]
        }
        
        Return results in concise JSON.`,

        images: [imageBase64],
        stream: false,
      },
      { timeout: 800000 } // allow up to 3 minutes
    );

    // 3. Parse DeepSeek response
    let output = response.data.response || response.data;
    console.log("Raw Ollama output:", output); // Log the raw output for debugging
    let jsonData;

    try {
      // Find the start and end of the JSON object
      const jsonStart = output.indexOf('{');
      const jsonEnd = output.lastIndexOf('}');
      
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        const jsonString = output.substring(jsonStart, jsonEnd + 1);
        jsonData = JSON.parse(jsonString);
      } else {
        // If no JSON object is found, fall back to the old behavior
        jsonData = { result: String(output), confidence: "N/A", recommendations: [] };
      }
    } catch (err) {
      // If parsing still fails, wrap the raw output in the result field
      jsonData = { result: String(output), confidence: "N/A", recommendations: [] };
    }

    // Create a new report and save it to the database
    const newReport: Report = {
      id: uuidv4(),
      filename: req.file.originalname || req.file.filename,
      createdAt: new Date().toISOString(),
      analysis: {
        result: jsonData.result || "unknown",
        confidence: jsonData.confidence || 0,
        recommendations: jsonData.recommendations || [],
        rawOutput: output,
      },
    };
    db.data.reports.push(newReport);
    await db.write();

    res.json(newReport);
  } catch (error: any) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Analysis failed", details: error.message });
  }
});

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Peek Vision API!" });
});

// New endpoint to get all reports
app.get("/api/reports", (req, res) => {
  res.json(db.data.reports);
});

app.listen(4000, () => {
  initDB(); // Initialize the database
  console.log("✅ Peek Vision API running at http://localhost:4000");
});