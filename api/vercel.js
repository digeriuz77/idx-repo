// This is a Vercel adapter file that makes your Express app compatible with Vercel serverless

// Load dependencies
const express = require('express');
const path = require('path');
const cors = require('cors');

// Configure Google API key for Vercel environment
if (process.env.GOOGLE_API_KEY) {
  process.env.GENKIT_GOOGLEAI_API_KEY = process.env.GOOGLE_API_KEY;
  console.log('Google API Key configured for Vercel environment');
}

// Initialize Express
const app = express();

// Use middleware
app.use(cors());
app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// Import API routes
const apiRoutes = require('../server/routes/api');
app.use('/api', apiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'MI-Dojo API is running on Vercel',
    environment: process.env.NODE_ENV,
    google_api_key: process.env.GOOGLE_API_KEY ? 'configured' : 'missing',
    genkit_api_key: process.env.GENKIT_GOOGLEAI_API_KEY ? 'configured' : 'missing'
  });
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Export as Vercel serverless function
module.exports = app;