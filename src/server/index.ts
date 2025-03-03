/**
 * MI-Dojo - Server
 * 
 * This is the main server file for the MI-Dojo application.
 * It sets up the Express server, WebSocket support, and serves the frontend.
 */

import express from 'express';
import cors from 'cors';
import path from 'path';
import { Server as WebSocketServer } from 'ws';
import http from 'http';
import apiRoutes from './routes';

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Create HTTP server
const server = http.createServer(app);

// Create WebSocket server
const wss = new WebSocketServer({ server });

// Middleware
app.use(cors());
app.use(express.json());

// Static files
app.use(express.static(path.join(__dirname, '../../public')));

// API routes
app.use('/api', apiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'MI-Dojo API is running' });
});

// Serve index.html for all other routes (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('Client connected to WebSocket');
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      console.log('Received WebSocket message:', data);
      
      // Handle different message types
      // This would be expanded in a full implementation
    } catch (error) {
      console.error('Error processing WebSocket message:', error);
    }
  });
  
  ws.on('close', () => {
    console.log('Client disconnected from WebSocket');
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`- Static files from: ${path.join(__dirname, '../../public')}`);
  console.log(`- API available at: http://localhost:${PORT}/api`);
});
