"use strict";
/**
 * MI-Dojo - API Routes
 *
 * This file defines the Express routes for the MI-Dojo API.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const genkit_1 = require("../genkit");
/**
 * Enhances a persona's communication style based on a sample text
 */
function enhancePersonaCommunicationStyle(persona, communicationSample) {
    try {
        // First, save the original communication style
        const originalStyle = persona.base_characteristics.communication_style;
        // Analyze the sample to identify key communication patterns
        const patterns = [];
        // Check for sentence length
        const sentences = communicationSample.split(/[.!?]+/).filter((s) => s.trim().length > 0);
        const avgSentenceLength = sentences.reduce((sum, s) => sum + s.trim().length, 0) / Math.max(1, sentences.length);
        if (avgSentenceLength < 40) {
            patterns.push("Uses short, concise sentences");
        }
        else if (avgSentenceLength > 80) {
            patterns.push("Uses longer, more complex sentences");
        }
        // Check for first-person usage
        const firstPersonCount = (communicationSample.match(/\b(i|i'm|i'll|i've|i'd|me|my|mine)\b/gi) || []).length;
        if (firstPersonCount > 5) {
            patterns.push("Frequently references self");
        }
        // Check for question marks
        const questionCount = (communicationSample.match(/\?/g) || []).length;
        if (questionCount > 3) {
            patterns.push("Tends to ask questions");
        }
        // Check for filler words
        const fillerCount = (communicationSample.match(/\b(um|uh|like|you know|actually|basically)\b/gi) || []).length;
        if (fillerCount > 3) {
            patterns.push("Uses filler words");
        }
        // Format the patterns
        const patternText = patterns.length > 0
            ? `Speaks with the following patterns: ${patterns.join('; ')}. `
            : "";
        // Combine original style characteristics with custom speech patterns
        persona.base_characteristics.communication_style =
            `${patternText}Based on: ${originalStyle}. Communicates with this speech pattern: ${communicationSample.slice(0, 300)}${communicationSample.length > 300 ? '...' : ''}`;
        console.log("Enhanced communication style:", persona.base_characteristics.communication_style);
    }
    catch (error) {
        console.error("Error enhancing communication style:", error);
        // Don't throw - if enhancement fails, just keep the original style
    }
}
const router = (0, express_1.Router)();
// In-memory storage for sessions
// In a production app, this would be replaced with a database
const sessions = {};
/**
 * Generate a persona
 * POST /api/persona
 */
router.post('/persona', async (req, res) => {
    try {
        const { scenario_type, change_readiness, additional_context, communication_sample } = req.body;
        console.log("Received persona request:", { scenario_type, change_readiness, additional_context, communication_sample });
        if (!scenario_type || !change_readiness) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }
        const persona = await (0, genkit_1.generatePersonaFlow)({
            scenario_type,
            change_readiness,
            additional_context
        });
        // Apply communication style enhancement if a sample was provided
        if (communication_sample && communication_sample.length > 0) {
            enhancePersonaCommunicationStyle(persona, communication_sample);
        }
        // Create session
        const sessionId = Date.now().toString();
        sessions[sessionId] = {
            id: sessionId,
            persona,
            messages: []
        };
        // Log the complete persona for debugging
        console.log("Created persona:", persona);
        res.json({
            sessionId,
            persona
        });
    }
    catch (error) {
        console.error('Error generating persona:', error);
        res.status(500).json({ error: 'Failed to generate persona', message: error.message });
    }
});
/**
 * Get session information
 * GET /api/session/:sessionId
 */
router.get('/session/:sessionId', (req, res) => {
    const { sessionId } = req.params;
    if (!sessions[sessionId]) {
        return res.status(404).json({ error: 'Session not found' });
    }
    res.json(sessions[sessionId]);
});
/**
 * Send a message to the persona
 * POST /api/session/:sessionId/message
 */
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
            try {
                coaching = await (0, genkit_1.miCoachingFlow)({
                    user_message: message,
                    conversation_history: session.messages.slice(0, -1), // Exclude the just-added message
                    persona: session.persona
                });
            }
            catch (coachingError) {
                console.error('Error generating coaching feedback:', coachingError);
                // Continue even if coaching fails
            }
        }
        // Generate response
        const response = await (0, genkit_1.streamingPersonaChatFlow)({
            persona: session.persona,
            message,
            conversation_history: session.messages
        });
        // Add persona response
        session.messages.push({
            role: 'persona',
            content: response
        });
        res.json({
            response,
            messages: session.messages,
            coaching
        });
    }
    catch (error) {
        console.error('Error processing message:', error);
        res.status(500).json({ error: 'Failed to process message', message: error.message });
    }
});
/**
 * Generate session feedback
 * GET /api/session/:sessionId/feedback
 */
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
        const feedback = await (0, genkit_1.sessionFeedbackFlow)({
            conversation: session.messages,
            persona: session.persona
        });
        res.json(feedback);
    }
    catch (error) {
        console.error('Error generating feedback:', error);
        res.status(500).json({ error: 'Failed to generate feedback', message: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=routes.js.map