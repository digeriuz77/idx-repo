const express = require('express');
const { generatePersona, generateResponse, generateCoaching, generateFeedback } = require('../genkit-demo');

const router = express.Router();

// In-memory storage for demo
const sessions = {};

// Generate a persona
router.post('/persona', async (req, res) => {
  try {
    const { scenario_type, change_readiness } = req.body;
    
    if (!scenario_type || !change_readiness) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    const persona = await generatePersona(scenario_type, change_readiness);
    
    // Create session
    const sessionId = Date.now().toString();
    sessions[sessionId] = {
      id: sessionId,
      persona,
      messages: []
    };
    
    res.json({
      sessionId,
      persona
    });
  } catch (error) {
    console.error('Error generating persona:', error);
    res.status(500).json({ error: 'Failed to generate persona' });
  }
});

// Get session
router.get('/session/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  
  if (!sessions[sessionId]) {
    return res.status(404).json({ error: 'Session not found' });
  }
  
  res.json(sessions[sessionId]);
});

// Send a message
router.post('/session/:sessionId/message', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { message } = req.body;
    
    if (!sessions[sessionId]) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    const session = sessions[sessionId];
    
    // Add user message
    session.messages.push({
      role: 'user',
      content: message
    });
    
    // Generate coaching feedback (if there's enough conversation history)
    let coaching = null;
    if (session.messages.length > 1) {
      coaching = await generateCoaching(
        session.persona, 
        message, 
        session.messages.slice(0, -1) // Exclude the just-added message
      );
    }
    
    // Generate response
    const response = await generateResponse(session.persona, message);
    
    // Add persona response
    session.messages.push({
      role: 'persona',
      content: response
    });
    
    res.json({
      response,
      messages: session.messages,
      coaching: coaching
    });
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

// Generate session feedback
router.get('/session/:sessionId/feedback', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    if (!sessions[sessionId]) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    const session = sessions[sessionId];
    
    // Make sure there are enough messages for feedback
    if (session.messages.length < 4) {
      return res.status(400).json({ 
        error: 'Not enough conversation history for feedback', 
        required: 4, 
        current: session.messages.length 
      });
    }
    
    // Generate MITI scores and feedback
    const feedback = await generateFeedback(session.persona, session.messages);
    
    res.json(feedback);
  } catch (error) {
    console.error('Error generating feedback:', error);
    res.status(500).json({ error: 'Failed to generate feedback' });
  }
});

module.exports = router;