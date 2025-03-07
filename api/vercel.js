// This is a Vercel adapter file that makes your Express app compatible with Vercel serverless

// Load dependencies
const express = require('express');
const path = require('path');
const cors = require('cors');

// Initialize Express
const app = express();

// Use middleware
app.use(cors());
app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// Import Vercel-specific API routes that directly use the API key
const apiRoutes = require('./vercel-api');
app.use('/api', apiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'MI-Dojo API is running on Vercel',
    environment: process.env.NODE_ENV,
    google_api_key: process.env.GOOGLE_API_KEY ? 'configured' : 'missing'
  });
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Export as Vercel serverless function
module.exports = app;