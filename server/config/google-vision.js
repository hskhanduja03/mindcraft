const vision = require('@google-cloud/vision');

// Create a client with your Google Cloud credentials
const client = new vision.ImageAnnotatorClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
});

module.exports = client;