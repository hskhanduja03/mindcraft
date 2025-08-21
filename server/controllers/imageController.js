const client = require("../config/google-vision");
const maskImage = require("../utils/maskImage");
const { detectPII } = require("../middleware/piiDetection");

exports.processImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    // Perform text detection using Google Vision API
    const [result] = await client.textDetection(req.file.path);
    const detections = result.textAnnotations;
    console.log("detections", detections);
    

    if (!detections || detections.length === 0) {
      return res.status(400).json({ error: "No text detected in the image" });
    }

    // Extract all text
    const fullText = detections[0].description;

    // Detect PII in the text
    const piiData = detectPII(fullText);
    console.log("PII Detected:", piiData);

    // Mask the image based on detected PII and bounding boxes
    const maskedImagePath = await maskImage(req.file.path, detections, piiData);

    // Send response
    res.json({
      success: true,
      originalText: fullText,
      piiDetected: piiData,
      maskedImage: `masked/masked_${req.file.filename}`,
      originalFilename: req.file.filename,
    });
  } catch (error) {
    console.error("Error processing image:", error);
    res.status(500).json({ error: "Failed to process image" });
  }
};
