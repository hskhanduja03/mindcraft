const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

module.exports = async (imagePath, detections, piiData) => {
  try {
    let image = sharp(imagePath);
    const metadata = await image.metadata();

    const composites = [];

    // Process each text annotation (skip index 0 = full text)
    for (let i = 1; i < detections.length; i++) {
      const text = detections[i].description;

      // Check if this text is PII
      let containsPII = false;
      for (const piiType in piiData) {
        if (piiData[piiType].includes(text)) {
          containsPII = true;
          break;
        }
      }

      if (containsPII) {
        const vertices = detections[i].boundingPoly.vertices;

        const left = vertices[0].x || 0;
        const top = vertices[0].y || 0;
        const width = (vertices[2].x || metadata.width) - left;
        const height = (vertices[2].y || metadata.height) - top;

        // Create SVG rectangle
        const svgRect = `
          <svg width="${metadata.width}" height="${metadata.height}">
            <rect x="${left}" y="${top}" width="${width}" height="${height}" fill="black" />
          </svg>
        `;

        composites.push({
          input: Buffer.from(svgRect),
          blend: 'over'
        });
      }
    }

    if (composites.length > 0) {
      image = image.composite(composites);
    }

    // Save masked image
    const outputDir = path.join(__dirname, '..', 'public', 'masked');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, `masked_${path.basename(imagePath)}`);
    await image.toFile(outputPath);

    return outputPath;
  } catch (error) {
    console.error('Error masking image:', error);
    throw error;
  }
};
