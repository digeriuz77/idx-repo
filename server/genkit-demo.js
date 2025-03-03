const { genkit, z } = require('genkit');
const { gemini20Flash, googleAI } = require('@genkit-ai/googleai');

// Initialize Genkit with Google AI plugin
const ai = genkit({
  plugins: [googleAI()],
});

// Define Zod schema for persona
const PersonaSchema = z.object({
  name: z.string(),
  age: z.number(),
  condition: z.string(),
  background: z.string(),
  resistance: z.string(),
  motivation: z.string()
});

// Define Zod schema for feedback
const FeedbackSchema = z.object({
  global_scores: z.object({
    partnership: z.number(),
    empathy: z.number(),
    autonomy_support: z.number(),
    evocation: z.number()
  }),
  behavior_counts: z.object({
    open_questions: z.number(),
    closed_questions: z.number(),
    simple_reflections: z.number(),
    complex_reflections: z.number(),
    affirming_statements: z.number(),
    seeking_collaboration: z.number(),
    emphasizing_autonomy: z.number(),
    confrontations: z.number()
  }),
  derived_metrics: z.object({
    reflection_to_question_ratio: z.number(),
    percent_complex_reflections: z.number(),
    percent_open_questions: z.number(),
    percent_mi_adherent: z.number()
  }),
  strengths: z.array(z.string()),
  areas_for_improvement: z.array(z.string()),
  examples: z.object({
    good_examples: z.array(z.string()),
    missed_opportunities: z.array(z.string())
  })
});

// Define Zod schema for coaching
const CoachingSchema = z.object({
  has_coaching: z.boolean(),
  coaching_message: z.string().optional(),
  mi_technique_used: z.string().optional(),
  missed_opportunity: z.string().optional()
});

// Simple persona generator flow
const generatePersona = async (type, readiness) => {
  const result = await ai.generate({
    model: gemini20Flash,
    prompt: `Create a persona for a motivational interviewing scenario.
    
    The scenario type is: ${type}
    The stage of change is: ${readiness}
    
    Respond with a JSON object with these fields:
    - name: A fictional name for the persona
    - age: Age between 25-65
    - condition: The specific health condition or behavior to address
    - background: Brief life context (2-3 sentences)
    - resistance: 2-3 factors that make them resistant to change
    - motivation: 1-2 potential motivating factors for change`,
    output: { 
      schema: PersonaSchema,
      format: 'json'
    }
  });
  
  return result.output;
};

// Simple chat flow
const generateResponse = async (persona, message) => {
  const result = await ai.generate({
    model: gemini20Flash,
    prompt: `You are roleplaying as ${persona.name}, a ${persona.age}-year-old person with ${persona.condition}.
    
    Background: ${persona.background}
    
    You are resistant to change because: ${persona.resistance}
    
    Potential motivating factors: ${persona.motivation}
    
    Respond naturally as this persona would to this message from a counselor:
    "${message}"`
  });
  
  return result.text;
};

// Generate coaching feedback for the user's message
const generateCoaching = async (persona, userMessage, conversationHistory) => {
  // Format conversation history
  const formattedHistory = conversationHistory.map(msg => 
    `${msg.role.toUpperCase()}: ${msg.content}`).join('\n');
  
  const result = await ai.generate({
    model: gemini20Flash,
    prompt: `Analyze this motivational interviewing interaction and provide real-time coaching
    for the practitioner (user). The client has these characteristics:
    
    Name: ${persona.name}
    Age: ${persona.age}
    Condition: ${persona.condition}
    Background: ${persona.background}
    Resistance factors: ${persona.resistance}
    Motivation factors: ${persona.motivation}
    
    Conversation history:
    ${formattedHistory}
    
    User's latest message: "${userMessage}"
    
    Evaluate whether the user's latest message demonstrates good MI techniques
    like OARS (Open questions, Affirmations, Reflections, Summaries), shows empathy,
    avoids confrontation, and recognizes change talk.
    
    If you identify an opportunity for improvement, provide a brief coaching tip.
    If the user is doing well, indicate that no coaching is needed.
    
    Respond with a JSON object with these fields:
    - has_coaching: Whether coaching feedback is provided (true/false)
    - coaching_message: The coaching feedback message (if has_coaching is true)
    - mi_technique_used: Which MI technique was used effectively (if any)
    - missed_opportunity: What opportunity was missed (if any)`,
    output: { 
      schema: CoachingSchema,
      format: 'json'
    }
  });
  
  return result.output;
};

// Generate MITI scores for the conversation
const generateFeedback = async (persona, conversationHistory) => {
  // Format conversation history
  const formattedHistory = conversationHistory.map(msg => 
    `${msg.role.toUpperCase()}: ${msg.content}`).join('\n');
  
  const result = await ai.generate({
    model: gemini20Flash,
    prompt: `Analyze this motivational interviewing session and provide detailed MITI-based feedback.
    
    PERSONA:
    Name: ${persona.name}
    Age: ${persona.age}
    Condition: ${persona.condition}
    Background: ${persona.background}
    Resistance factors: ${persona.resistance}
    Motivation factors: ${persona.motivation}
    
    CONVERSATION:
    ${formattedHistory}
    
    Provide a comprehensive analysis using the Motivational Interviewing Treatment Integrity (MITI) 
    coding system. Score global measures on a scale from 1-5, count specific behaviors, 
    and calculate derived metrics. Include specific examples from the conversation to support your ratings.
    
    Focus particularly on:
    1. Practitioner's ability to evoke change talk
    2. Use of reflections vs. questions
    3. Empathic understanding
    4. Supporting client autonomy
    5. Partnership with client

    Highlight 2-3 specific strengths and 2-3 areas for improvement.`,
    output: { 
      schema: FeedbackSchema,
      format: 'json'
    }
  });
  
  return result.output;
};

module.exports = {
  generatePersona,
  generateResponse,
  generateCoaching,
  generateFeedback
};