const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

module.exports = async (imagePath, detections, piiData) => {
  try {
    let image = sharp(imagePath);
    const metadata = await image.metadata();

    const composites = [];

    // Helper function to normalize text for comparison
    const normalize = (s) => s.replace(/\s+/g, "").toLowerCase().trim();

    // Helper function to check if text should be masked
    const shouldMaskText = (text) => {
      const normalizedText = normalize(text);

      // Skip very short texts (like single characters, punctuation)
      if (text.length <= 1) return false;

      // Skip common non-PII words that shouldn't be masked
      const skipWords = [
        "permanent",
        "account",
        "number",
        "card",
        "income",
        "tax",
        "department",
        "govt",
        "india",
        "name",
        "father",
        "date",
        "birth",
        "signature",
        "of",
        "the",
        "and",
        "or",
        "/",
        ".",
      ];

      if (skipWords.includes(normalizedText)) {
        return false;
      }

      // Check against PII data
      for (const piiType in piiData) {
        for (const piiValue of piiData[piiType]) {
          const normalizedPII = normalize(piiValue);

          // Exact match
          if (normalizedText === normalizedPII) {
            console.log(
              `Exact match found: "${text}" matches PII "${piiValue}" (${piiType})`
            );
            return true;
          }

          // Check if the text is part of a larger PII value
          if (
            normalizedPII.includes(normalizedText) &&
            normalizedText.length > 2
          ) {
            console.log(
              `Partial match found: "${text}" is part of PII "${piiValue}" (${piiType})`
            );
            return true;
          }

          // Check if PII is part of the text (for cases like compound words)
          if (
            normalizedText.includes(normalizedPII) &&
            normalizedPII.length > 2
          ) {
            console.log(
              `Contains match found: "${text}" contains PII "${piiValue}" (${piiType})`
            );
            return true;
          }
        }
      }

      // Special handling for names - check if text looks like a name
      if (piiData.name) {
        for (const name of piiData.name) {
          // Skip "Permanent Account Number Card" as it's not a person's name
          if (
            name.toLowerCase().includes("permanent") ||
            name.toLowerCase().includes("card")
          ) {
            continue;
          }

          const nameWords = name.split(/\s+/);
          // Check if current text matches any word in a name
          for (const nameWord of nameWords) {
            if (normalize(nameWord) === normalizedText && nameWord.length > 2) {
              console.log(
                `Name word match: "${text}" matches name word "${nameWord}" from "${name}"`
              );
              return true;
            }
          }
        }
      }

      return false;
    };

    // Enhanced PII detection for names from the extracted text
    const extractedText = detections[0]?.description || "";
    const detectedNames = [];

    // Extract names from specific patterns in PAN card
    const namePatterns = [
      /नाम\s*\/\s*Name\s*\n\s*([A-Z\s]+)/i,
      /Name\s*\n\s*([A-Z\s]+)/i,
      /पिता का नाम\s*\/\s*Father's Name\s*\n\s*([A-Z\s]+)/i,
      /Father's Name\s*\n\s*([A-Z\s]+)/i,
    ];

    for (const pattern of namePatterns) {
      const match = extractedText.match(pattern);
      if (match && match[1]) {
        const name = match[1].trim();
        if (name.length > 2) {
          detectedNames.push(name);
          console.log(`Detected name from pattern: "${name}"`);
        }
      }
    }

    // Add detected names to PII data
    if (detectedNames.length > 0) {
      if (!piiData.name) piiData.name = [];
      for (const name of detectedNames) {
        if (
          !piiData.name.some(
            (existingName) => normalize(existingName) === normalize(name)
          )
        ) {
          piiData.name.push(name);
        }
      }
    }

    console.log("Enhanced PII Data:", piiData);

    // Process each text annotation (skip index 0 = full text)
    for (let i = 1; i < detections.length; i++) {
      const text = detections[i].description.trim();
      if (!text) continue;


      if (shouldMaskText(text)) {

        const vertices = detections[i].boundingPoly.vertices;

        // Ensure we have valid coordinates
        const left = Math.max(0, vertices[0].x || 0);
        const top = Math.max(0, vertices[0].y || 0);
        const right = Math.min(metadata.width, vertices[2].x || metadata.width);
        const bottom = Math.min(
          metadata.height,
          vertices[2].y || metadata.height
        );

        const width = right - left;
        const height = bottom - top;

        // Only create mask if dimensions are valid
        if (width > 0 && height > 0) {
          const svgRect = `
            <svg width="${metadata.width}" height="${metadata.height}">
              <rect x="${left}" y="${top}" width="${width}" height="${height}" fill="black"/>
            </svg>
          `;

          composites.push({
            input: Buffer.from(svgRect),
            blend: "over",
          });
        }
      }
    }


    if (composites.length > 0) {
      image = image.composite(composites);
    }

    // Save masked image
    const outputDir = path.join(__dirname, "..", "public", "masked");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(
      outputDir,
      `masked_${path.basename(imagePath)}`
    );
    await image.toFile(outputPath);

    console.log(`Masked image saved to: ${outputPath}`);
    return outputPath;
  } catch (error) {
    console.error("Error masking image:", error);
    throw error;
  }
};
