const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function refinePIIWithGemini(fullText, detections, piiData) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
I have OCR text extracted from an Indian ID card. 
Here is the full text:
"""
${fullText}
"""

Detected PII (from regex + rules):
${JSON.stringify(piiData)}

You are an OCR post-processor. 
From the extracted OCR text of Indian identity documents (Aadhaar, PAN, Passport, Voter ID, Driving License, etc.), identify and return only Personally Identifiable Information (PII) that must be masked.

PII includes:
- Full name of the person (and father/mother/spouse names if present)
- Date of Birth (DOB), year of birth, or age if mentioned
- Gender
- Mobile number, email ID
- Complete or partial address
- Unique ID numbers (Aadhaar, PAN, Passport, Voter ID, Driving License, etc.)
- Signature, QR-code encoded numbers, or barcodes containing ID numbers

Do NOT include:
- Government slogans (e.g., "मेरा आधार मेरी पहचान", "भारत सरकार", "Government of India")
- Decorative text, emblems, or generic words like "MALE/FEMALE" unless directly linked to gender
- Common instructions (e.g., "Valid in India", "Signature of holder")

Return the result in JSON format:
{
  "mask": [ "list of exact sensitive text values found in OCR" ]
}

`;

      const result = await model.generateContent(prompt);
      let responseText = result.response.text();

      // 🔹 Clean Gemini output (remove markdown fences if present)
      responseText = responseText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      return JSON.parse(responseText);
    } catch (err) {
      console.error("Gemini PII refinement error:", err);
      return { mask: [] };
    }
}

module.exports = refinePIIWithGemini;
