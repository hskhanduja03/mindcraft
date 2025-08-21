const express = require('express');
const router = express.Router();
const { single } = require('../middleware/upload');
const imageController = require('../controllers/imageController');

// Route for processing image
router.post('/process', single('image'), imageController.processImage);

module.exports = router;
