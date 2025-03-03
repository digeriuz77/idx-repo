import express from 'express';
import cors from 'cors';
import path from 'path';
import { Server as WebSocketServer } from 'ws';
import http from 'http';
import { v4 as uuidv4 } from 'uuid';
import {
  generatePersonaFlow,
  streamingPersonaChatFlow,
  miCoachingFlow,
  sessionFeedbackFlow,
  PersonaOutputSchema,
  MessageSchema
} from './genkit-flows';

const app = express();
const port = process.env.PORT || 3000;

// Create HTTP server and WebSocket server
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// In-memory storage for sessions (in a real app, this would be a database)
const sessions: Record<string, {
  sessionId: string;
  persona: any;
  conversation: Array<{ role: 'user' | 'persona'; content: string }>;
  createdAt: Date;
}> = {};

// API Endpoints

// Generate a new persona
app.post('/api/persona', async (req, res) => {
  try {
    const { scenario_type, change_readiness, additional_context } = req.body;
    
    const persona = await generatePersonaFlow({
      scenario_type,
      change_readiness,
      additional_context: additional_context || ''
    });
    
    // Create a new session
    const sessionId = uuidv4();
    sessions[sessionId] = {
      sessionId,
      persona,
      conversation: [],
      createdAt: new Date()
    };
    
    res.json({ sessionId, persona });
  } catch (error) {
    console.error('Error generating persona:', error);
    res.status(500).json({ error: 'Failed to generate persona' });
  }
});

// Get session data
app.get('/api/session/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  
  if (!sessions[sessionId]) {
    return res.status(404).json({ error: 'Session not found' });
  }
  
  res.json(sessions[sessionId]);
});

// Add a message to a session (non-streaming)
app.post('/api/session/:sessionId/message', async (req, res) => {
  const { sessionId } = req.params;
  const { message } = req.body;
  
  if (!sessions[sessionId]) {
    return res.status(404).json({ error: 'Session not found' });
  }
  
  const session = sessions[sessionId];
  
  // Add user message to conversation
  session.conversation.push({ role: 'user', content: message });
  
  try {
    // Get coaching feedback
    let coaching = null;
    if (session.conversation.length > 1) {
      coaching = await miCoachingFlow({
        user_message: message,
        conversation_history: session.conversation.slice(0, -1),
        persona: session.persona
      });
    }
    
    // Get persona response
    const response = await streamingPersonaChatFlow({
      persona: session.persona,
      message,
      conversation_history: session.conversation.slice(0, -1)
    });
    
    // Add persona response to conversation
    session.conversation.push({ role: 'persona', content: response });
    
    res.json({
      coaching,
      response,
      conversation: session.conversation
    });
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

// Get session analysis
app.get('/api/session/:sessionId/analysis', async (req, res) => {
  const { sessionId } = req.params;
  
  if (!sessions[sessionId]) {
    return res.status(404).json({ error: 'Session not found' });
  }
  
  const session = sessions[sessionId];
  
  // Need at least 4 messages for a meaningful analysis
  if (session.conversation.length < 4) {
    return res.status(400).json({ error: 'Not enough conversation for analysis' });
  }
  
  try {
    const analysis = await sessionFeedbackFlow({
      conversation: session.conversation,
      persona: session.persona
    });
    
    res.json(analysis);
  } catch (error) {
    console.error('Error analyzing session:', error);
    res.status(500).json({ error: 'Failed to analyze session' });
  }
});

// WebSocket connection for streaming chat
wss.on('connection', (ws) => {
  console.log('New WebSocket connection');
  
  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message.toString());
      
      // Handle different message types
      if (data.type === 'chat') {
        const { sessionId, message } = data;
        
        if (!sessions[sessionId]) {
          ws.send(JSON.stringify({ error: 'Session not found' }));
          return;
        }
        
        const session = sessions[sessionId];
        
        // Add user message to conversation
        session.conversation.push({ role: 'user', content: message });
        
        // Get coaching feedback
        let coaching = null;
        if (session.conversation.length > 1) {
          coaching = await miCoachingFlow({
            user_message: message,
            conversation_history: session.conversation.slice(0, -1),
            persona: session.persona
          });
          
          // Send coaching feedback
          if (coaching) {
            ws.send(JSON.stringify({
              type: 'coaching',
              coaching
            }));
          }
        }
        
        // Stream persona response
        const { stream } = await streamingPersonaChatFlow.stream({
          persona: session.persona,
          message,
          conversation_history: session.conversation.slice(0, -1)
        });
        
        let fullResponse = '';
        
        for await (const chunk of stream) {
          fullResponse += chunk.text;
          
          ws.send(JSON.stringify({
            type: 'chat_chunk',
            text: chunk.text
          }));
        }
        
        // Add complete persona response to conversation
        session.conversation.push({ role: 'persona', content: fullResponse });
        
        // Indicate completion
        ws.send(JSON.stringify({
          type: 'chat_complete',
          sessionId
        }));
      }
    } catch (error) {
      console.error('WebSocket error:', error);
      ws.send(JSON.stringify({ error: 'Internal server error' }));
    }
  });
});

// Default route - serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start the server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});