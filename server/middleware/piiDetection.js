const patterns = {
  // Aadhaar: 12-digit with space after every 4 digits → "1234 5678 9123"
  aadhaar: /\b\d{4}\s\d{4}\s\d{4}\b/,

  // Indian DOB: only DD/MM/YYYY (01-31 / 01-12 / 1900–2099)
  dob: /\b(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}\b/,

  phone: /\b(?:\+91[\-\s]?)?[6789]\d{9}\b/,
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/,

  pan: /\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/,
  collegeId: /\b(?:[A-Z]{2,3}\/|\b)[A-Z]{2,}\d{2,}[A-Z]*\d*\b/i,
  passport: /\b[A-Z]{1,2}\d{6,8}\b/,
  drivingLicense: /\b[A-Z]{2}\d{2}\s?\d{4}\s?\d{7}\b/,
  vehicleNumber: /\b[A-Z]{2}\s?[0-9]{1,2}\s?[A-Z]{1,2}\s?[0-9]{1,4}\b/,
  bankAccount: /\b\d{9,18}\b/,
  ifscCode: /\b[A-Z]{4}0[A-Z0-9]{6}\b/,
  creditCard: /\b(?:\d{4}[- ]?){3}\d{4}\b/,
  upiId: /\b[\w.\-]+@[\w]+\b/,
  voterId: /\b[A-Z]{3}\d{7}\b/,
  ssn: /\b\d{3}-\d{2}-\d{4}\b/,

  usPhone: /\b\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/,
  ukPhone: /\b(?:(?:\+44\s?|0)7\d{3}\s?\d{6}|\d{4}\s?\d{6})\b/,

  name: /\b(?:[A-Z][a-z]+)(?:\s+[A-Z][a-z]+)+\b/,
  address: /\b\d+\s+[\w\s]+\b(?:,\s*\w+)*\b/,
};



exports.detectPII = (text) => {
  const detectedPII = {};
  

  for (const [piiType, pattern] of Object.entries(patterns)) {
    const matches = text.match(pattern);
    if (matches) {
      detectedPII[piiType] = matches.filter((value, index, self) => 
        self.indexOf(value) === index 
      );
    }
  }
  
  // Enhanced name detection with context
  const nameContextPatterns = [
    /(?:name|fullname|username|person)\s*[:=]\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/gi,
    /(?:mr\.|mrs\.|ms\.|dr\.)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/gi
  ];
  
  for (const pattern of nameContextPatterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      if (!detectedPII.name) detectedPII.name = [];
      if (!detectedPII.name.includes(match[1])) {
        detectedPII.name.push(match[1]);
      }
    }
  }
  
  // Enhanced email detection with context
  const emailContextPattern = /(?:email|e-mail|contact)\s*[:=]\s*([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,})/gi;
  let emailMatch;
  while ((emailMatch = emailContextPattern.exec(text)) !== null) {
    if (!detectedPII.email) detectedPII.email = [];
    if (!detectedPII.email.includes(emailMatch[1])) {
      detectedPII.email.push(emailMatch[1]);
    }
  }
  
  return detectedPII;
};