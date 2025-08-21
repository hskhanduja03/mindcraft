require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const imageRoutes = require('./routes/imageRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json());

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/masked', express.static(path.join(__dirname, 'public/masked')));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/image', imageRoutes);

// Default route (optional for health check)
app.get('/', (req, res) => {
  res.send('Server is running...');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
