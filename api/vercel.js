// This is a Vercel adapter file that doesn't affect your core application
// It simply loads your Express app and makes it compatible with Vercel's serverless environment

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

// Import API routes - this should match your actual API implementation
const apiRoutes = require('../server/routes/api');
app.use('/api', apiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'MI-Dojo API is running on Vercel' });
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Export as Vercel serverless function
module.exports = app;