
# MI-Dojo: Motivational Interviewing Practice Platform

MI-Dojo is an AI-powered application for practicing Motivational Interviewing (MI) techniques with simulated personas using Genkit and Gemini.

## Getting Started

### Prerequisites

- Node.js 18+ 
- NPM 8+

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Run the application:

```bash
# Quick start - runs everything with one command:
./start.sh

# Or use npm script:
npm run start:all
```

4. The application will open in your browser:
   - Web application: http://localhost:3000
   - Genkit UI: http://localhost:4000

## Project Structure

The project follows a clean architecture that separates concerns:

```
mi-dojo/
├── src/                  # TypeScript source code
│   ├── genkit/           # Genkit flows and schemas
│   │   ├── flows.ts      # Core Genkit flow implementations
│   │   ├── schemas.ts    # Zod schema definitions
│   │   └── index.ts      # Exports for flows and schemas
│   ├── server/           # Express server implementation
│   │   ├── routes.ts     # API route handlers
│   │   └── index.ts      # Server configuration
│   ├── cli.ts            # Command-line demo implementation
│   └── index.ts          # Main entry point
├── public/               # Frontend assets
│   ├── css/
│   ├── js/
│   └── index.html
├── dist/                 # Compiled JavaScript (generated)
└── start.sh              # Startup script
```

## Using the Web Application

The browser-based application provides a full-featured interface for MI practice:

1. **Creating a Persona**: Select a scenario type and change readiness level to generate a realistic client persona.

2. **Chat Interface**: Practice MI techniques in a natural conversation with your AI persona.

3. **Real-time Coaching**: Receive immediate feedback on your MI techniques during the conversation.

4. **Session Analysis**: Get comprehensive MITI-based feedback on your MI performance.

## Development Commands

```bash
# Build TypeScript code
npm run build

# Start the application in development mode
npm run dev

# Run just the CLI demo
npm run cli

# Start just the Genkit UI with the CLI demo
npm run genkit

# Start Genkit UI with hot reloading for development
npm run genkit:dev

# Clear the ports if needed
npm run killports
```

## How It Works

MI-Dojo consists of several AI-powered components:

1. **Persona Generation** - Creates realistic client personas with specific characteristics for MI practice.

2. **Interactive Chat** - Engages in natural conversations with AI personas based on their characteristics.

3. **Real-time Coaching** - Provides immediate feedback on your MI techniques.

4. **Session Analysis** - Delivers comprehensive MITI-based feedback on your MI performance.

## Architecture

- **TypeScript Core**: All Genkit flows are implemented in TypeScript with proper type definitions
- **Express Backend**: RESTful API endpoints with proper error handling
- **WebSocket Support**: For streaming chat responses
- **Frontend**: Simple HTML/CSS/JS interface for easy customization
- **CLI Demo**: Standalone command-line interface to showcase core functionality

## Deployment Considerations

For production deployment:

1. Set up proper environment variable management
2. Consider containerization with Docker
3. Implement proper user authentication
4. Replace in-memory session storage with a database
5. Add monitoring and logging
6. Set up HTTPS for secure communication

## Development Context & Implementation Guide

This document outlines the development approach for MI-Dojo, an AI-powered application for Motivational Interviewing (MI) practice with simulated personas. The app uses Firebase for hosting and authentication, and Genkit with Gemini LLMs for AI capabilities.

## Project Overview

MI-Dojo allows managers to:
1. Generate realistic personas with specific characteristics for practicing MI techniques
2. Engage in roleplay conversations with these AI personas
3. Receive real-time coaching based on MITI principles
4. Get post-session performance analysis and improvement suggestions
5. Track progress over time through comprehensive reports

## Technology Stack

- **Frontend**: React with Material UI
- **Backend**: Firebase Functions with Genkit
- **AI**: Google Gemini LLMs (gemini20Flash/gemini20Pro)
- **Authentication**: Firebase Authentication
- **Data Storage**: Firestore
- **Hosting**: Firebase Hosting

Here's a comprehensive list of likely dependencies that an automated coding agent could install for the MI-Dojo application:
Backend (Functions) Dependencies
Core Dependencies

genkit: Core Genkit functionality for AI workflows
@genkit-ai/googleai: Google AI plugin for Genkit to access Gemini models
firebase-admin: Firebase admin SDK for server-side operations
firebase-functions: Cloud Functions for Firebase
zod: Type validation and schema definition

Development Dependencies

typescript: TypeScript language support
ts-node: Run TypeScript code directly
genkit-cli: Command-line interface for Genkit development
firebase-tools: Firebase CLI for deployment and emulation
@types/node: TypeScript definitions for Node.js
nodemon: Auto-restart development server on changes
eslint: Code linting
prettier: Code formatting

Frontend (Hosting) Dependencies
Core Dependencies

react: UI library
react-dom: DOM rendering for React
react-router-dom: Routing for React applications
@mui/material: Material UI component library
@mui/icons-material: Material UI icons
@emotion/react: Styling engine for Material UI
@emotion/styled: Styled components for Material UI
firebase: Firebase JavaScript SDK
react-markdown: Markdown rendering
chart.js: Charting library for visualizations
react-chartjs-2: React wrapper for Chart.js
date-fns: Date manipulation library
axios: HTTP client
formik or react-hook-form: Form handling

Development Dependencies

vite: Build tool and development server
@vitejs/plugin-react: React plugin for Vite
typescript: TypeScript language support
@types/react: TypeScript definitions for React
@types/react-dom: TypeScript definitions for React DOM
eslint: Code linting
eslint-plugin-react: React-specific linting rules
prettier: Code formatting
vitest: Testing framework compatible with Vite

Installation Commands
For Backend (Functions)
bashCopycd functions
npm install genkit @genkit-ai/googleai firebase-admin firebase-functions zod
npm install -D typescript ts-node genkit-cli firebase-tools @types/node nodemon eslint prettier
For Frontend (Hosting)
bashCopycd hosting
npm install react react-dom react-router-dom @mui/material @mui/icons-material @emotion/react @emotion/styled firebase react-markdown chart.js react-chartjs-2 date-fns axios react-hook-form
npm install -D vite @vitejs/plugin-react typescript @types/react @types/react-dom eslint eslint-plugin-react prettier vitest
These dependencies should cover all the major functionality required for the MI-Dojo application, from AI integration to UI components and data visualization for performance tracking.

## Project Structure

```
mi-dojo/
├── functions/              # Firebase Cloud Functions
│   ├── src/
│   │   ├── genkit/         # Genkit flows and prompts
│   │   │   ├── personaFlow.ts
│   │   │   ├── chatFlow.ts
│   │   │   ├── feedbackFlow.ts
│   │   │   └── prompts/    # Prompt templates
│   │   ├── auth/           # Auth functions
│   │   └── firestore/      # Firestore triggers
│   └── package.json
├── hosting/                # Frontend React app
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── lib/            # Utility functions
│   │   └── assets/         # Static assets
│   └── package.json
└── firebase.json           # Firebase configuration
```

## Core Implementation Components

# Key Genkit Considerations for MI-Dojo

1. **Architecture**
   - Separate concerns into distinct flows
   - Compose smaller flows instead of building monolithic ones
   - Plan deliberate state management between flows

2. **Safety & Performance**
   - Implement rate limiting and output validation
   - Secure prompts against injection attacks
   - Use appropriate models for each task (Flash vs Pro)

3. **Advanced Features**
   - Leverage tool calling for external actions
   - Use structured output with Zod schemas
   - Implement RAG for MI training materials
   - Use flow observability for debugging

4. **Production Readiness**
   - Secure API keys properly
   - Design for scalability
   - Implement comprehensive monitoring

These practices will ensure reliability, security, and performance as your agentic system scales.

### 1. Persona Generation System

The core of MI-Dojo is the ability to generate realistic personas that represent different client scenarios for MI practice.

```typescript
// functions/src/genkit/personaFlow.ts
import { gemini20Flash, googleAI } from '@genkit-ai/googleai';
import { genkit, z } from 'genkit';

const ai = genkit({
  plugins: [googleAI()],
  model: gemini20Flash,
});

// Define the schema for persona generation input
const PersonaInputSchema = z.object({
  scenario_type: z.enum([
    'chronic_illness', 
    'addiction', 
    'lifestyle_change', 
    'mental_health', 
    'preventive_care'
  ]),
  change_readiness: z.enum([
    'pre_contemplation', 
    'contemplation', 
    'preparation', 
    'action', 
    'maintenance'
  ]),
  additional_context: z.string().optional(),
});

// Define the schema for the generated persona
const PersonaOutputSchema = z.object({
  persona_id: z.string(),
  base_characteristics: z.object({
    condition: z.string(),
    stage_of_change: z.string(),
    key_resistances: z.array(z.string()),
    communication_style: z.string(),
  }),
  scenario_context: z.object({
    life_circumstances: z.string(),
    support_system: z.string(),
    stress_factors: z.array(z.string()),
  }),
  change_dynamics: z.object({
    readiness_level: z.string(),
    ambivalence_areas: z.array(z.string()),
    change_talk_patterns: z.object({
      commitment: z.coerce.number(),
      desire: z.coerce.number(),
      ability: z.coerce.number(),
      need: z.coerce.number(),
      reasons: z.coerce.number(),
      taking_steps: z.coerce.number(),
    }),
  }),
});

// Define the flow for persona generation
export const generatePersonaFlow = ai.defineFlow(
  {
    name: "generatePersonaFlow",
    inputSchema: PersonaInputSchema,
    outputSchema: PersonaOutputSchema,
  },
  async (input) => {
    const { text } = await ai.generate({
      prompt: `Create an authentic patient persona for Motivational Interviewing practice
      with scenario: ${input.scenario_type} and readiness stage: ${input.change_readiness}.
      ${input.additional_context || ''}
      
      Be creative but realistic. Keep descriptions concise.
      For change_talk_patterns, use numbers 1-10 to indicate frequency.
      Key resistances should include 2-4 realistic objections.
      Give a unique persona_id combining scenario type and a random element.`,
      output: { schema: PersonaOutputSchema },
    });
    
    return text.output;
  }
);
```

### 2. Chat Interface with Personas

The chat interface allows users to interact with the generated personas in a natural conversation flow, simulating a real MI session.

```typescript
// functions/src/genkit/chatFlow.ts
import { gemini20Flash, googleAI } from '@genkit-ai/googleai';
import { genkit, z } from 'genkit';

const ai = genkit({
  plugins: [googleAI()],
  model: gemini20Flash,
});

// Define the schema for chat input
const ChatInputSchema = z.object({
  persona: PersonaOutputSchema,
  message: z.string(),
  conversation_history: z.array(
    z.object({
      role: z.enum(['user', 'persona']),
      content: z.string(),
    })
  ).optional(),
});

// Define the streaming chat flow
export const streamingPersonaChatFlow = ai.defineFlow(
  {
    name: "streamingPersonaChatFlow",
    inputSchema: ChatInputSchema,
    streamSchema: z.object({
      text: z.string(),
    }),
    outputSchema: z.string(),
  },
  async (input, { sendChunk }) => {
    const prompt = `You are roleplaying as a person with the following characteristics:
    
    Condition: ${input.persona.base_characteristics.condition}
    Stage of Change: ${input.persona.base_characteristics.stage_of_change}
    Key Resistances: ${input.persona.base_characteristics.key_resistances.join(", ")}
    Communication Style: ${input.persona.base_characteristics.communication_style}
    
    Life Circumstances: ${input.persona.scenario_context.life_circumstances}
    Support System: ${input.persona.scenario_context.support_system}
    Stress Factors: ${input.persona.scenario_context.stress_factors.join(", ")}
    
    Readiness Level: ${input.persona.change_dynamics.readiness_level}
    Ambivalence Areas: ${input.persona.change_dynamics.ambivalence_areas.join(", ")}
    
    Given your change talk patterns:
    - Commitment level: ${input.persona.change_dynamics.change_talk_patterns.commitment}/10
    - Desire level: ${input.persona.change_dynamics.change_talk_patterns.desire}/10
    - Ability level: ${input.persona.change_dynamics.change_talk_patterns.ability}/10
    - Need level: ${input.persona.change_dynamics.change_talk_patterns.need}/10
    - Reasons level: ${input.persona.change_dynamics.change_talk_patterns.reasons}/10
    - Taking steps level: ${input.persona.change_dynamics.change_talk_patterns.taking_steps}/10
    
    ${input.conversation_history ? `Previous conversation:\n${input.conversation_history.map(msg => 
      `${msg.role === 'user' ? 'User' : 'You'}: ${msg.content}`).join('\n')}` : ''}
    
    User's message: ${input.message}
    
    Respond in first person as this persona would naturally speak. 
    Be authentic to your communication style, readiness level, and ambivalence areas. 
    Show appropriate levels of resistance or openness based on your stage of change.
    Do not break character or reference that you are an AI.`;

    const { response, stream } = await ai.generateStream({
      model: gemini20Flash,
      prompt,
    });

    for await (const chunk of stream) {
      sendChunk({ text: chunk.text });
    }

    return (await response).text;
  }
);
```

### 3. Real-time MI Coaching System

This system analyzes the user's messages in real-time to provide coaching nudges based on MI principles.

```typescript
// functions/src/genkit/coachingFlow.ts
import { gemini20Flash, googleAI } from '@genkit-ai/googleai';
import { genkit, z } from 'genkit';

const ai = genkit({
  plugins: [googleAI()],
  model: gemini20Flash,
});

const CoachingInputSchema = z.object({
  user_message: z.string(),
  conversation_history: z.array(
    z.object({
      role: z.enum(['user', 'persona']),
      content: z.string(),
    })
  ),
  persona: PersonaOutputSchema,
});

const CoachingOutputSchema = z.object({
  has_coaching: z.boolean(),
  coaching_message: z.string().optional(),
  mi_technique_used: z.string().optional(),
  missed_opportunity: z.string().optional(),
});

export const miCoachingFlow = ai.defineFlow(
  {
    name: "miCoachingFlow",
    inputSchema: CoachingInputSchema,
    outputSchema: CoachingOutputSchema,
  },
  async (input) => {
    const { output } = await ai.generate({
      prompt: `Analyze this motivational interviewing interaction and provide real-time coaching
      for the practitioner (user). The client has these characteristics:
      
      ${JSON.stringify(input.persona, null, 2)}
      
      Conversation history:
      ${input.conversation_history.map(msg => 
        `${msg.role.toUpperCase()}: ${msg.content}`).join('\n')}
      
      User's latest message: "${input.user_message}"
      
      Evaluate whether the user's latest message demonstrates good MI techniques
      like OARS (Open questions, Affirmations, Reflections, Summaries), shows empathy,
      avoids confrontation, and recognizes change talk.
      
      If you identify an opportunity for improvement, provide a brief coaching tip.
      If the user is doing well, indicate that no coaching is needed.`,
      output: { schema: CoachingOutputSchema },
    });
    
    return output;
  }
);
```

### 4. Session Analysis & Feedback System

After a session, this system provides comprehensive feedback on the user's MI performance.

```typescript
// functions/src/genkit/feedbackFlow.ts
import { gemini20Pro, googleAI } from '@genkit-ai/googleai';
import { genkit, z } from 'genkit';

const ai = genkit({
  plugins: [googleAI()],
  model: gemini20Pro, // Using Pro model for more comprehensive analysis
});

const SessionFeedbackInputSchema = z.object({
  conversation: z.array(
    z.object({
      role: z.enum(['user', 'persona']),
      content: z.string(),
    })
  ),
  persona: PersonaOutputSchema,
});

const MITIScoreSchema = z.object({
  global_scores: z.object({
    partnership: z.number(),
    empathy: z.number(),
    autonomy_support: z.number(),
    evocation: z.number(),
  }),
  behavior_counts: z.object({
    open_questions: z.number(),
    closed_questions: z.number(),
    simple_reflections: z.number(),
    complex_reflections: z.number(),
    affirming_statements: z.number(),
    seeking_collaboration: z.number(),
    emphasizing_autonomy: z.number(),
    confrontations: z.number(),
  }),
  derived_metrics: z.object({
    reflection_to_question_ratio: z.number(),
    percent_complex_reflections: z.number(),
    percent_open_questions: z.number(),
    percent_mi_adherent: z.number(),
  }),
  strengths: z.array(z.string()),
  areas_for_improvement: z.array(z.string()),
  examples: z.object({
    good_examples: z.array(z.string()),
    missed_opportunities: z.array(z.string()),
  }),
});

export const sessionFeedbackFlow = ai.defineFlow(
  {
    name: "sessionFeedbackFlow", 
    inputSchema: SessionFeedbackInputSchema,
    outputSchema: MITIScoreSchema,
  },
  async (input) => {
    const { output } = await ai.generate({
      model: gemini20Pro,
      prompt: `Analyze this motivational interviewing session and provide detailed MITI-based feedback.
      
      PERSONA:
      ${JSON.stringify(input.persona, null, 2)}
      
      CONVERSATION:
      ${input.conversation.map(msg => 
        `${msg.role.toUpperCase()}: ${msg.content}`).join('\n')}
      
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
      output: { schema: MITIScoreSchema },
    });
    
    return output;
  }
);
```

### 5. Frontend Interface

The frontend allows users to interact with the AI personas, receive coaching, and view session feedback.

```tsx
// hosting/src/pages/Chat.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Button, Typography, Paper, Avatar } from '@mui/material';
import UserAvatar from '../components/UserAvatar';
import PersonaAvatar from '../components/PersonaAvatar';
import CoachingTip from '../components/CoachingTip';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/Auth';
import { httpsCallable } from '../lib/functions';
import { addDoc, generateId, orderBy, setDoc, useDocs } from '../lib/firestore';

const streamingPersonaChat = httpsCallable('streamingPersonaChat');
const getCoachingFeedback = httpsCallable('getCoachingFeedback');

export default function Chat() {
  const { user } = useAuth();
  const { sessionId } = useParams();
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [persona, setPersona] = useState(null);
  const [coaching, setCoaching] = useState(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  
  const { items: messages } = useDocs(
    `users/${user?.id}/sessions/${sessionId}/messages`,
    orderBy('createdAt', 'asc'),
  );
  
  useEffect(() => {
    // Load persona data
    // Scroll to bottom of messages
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sessionId]);
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    setIsSubmitting(true);
    const userMessage = { role: 'user', content: message };
    
    // Save user message
    const newMessageId = generateId(`users/${user?.id}/sessions/${sessionId}/messages`);
    await setDoc(`users/${user?.id}/sessions/${sessionId}/messages/${newMessageId}`, {
      message: userMessage,
      createdAt: new Date()
    });
    
    // Get coaching feedback
    const coachingResponse = await getCoachingFeedback({
      user_message: message,
      conversation_history: messages.map(m => m.message),
      persona: persona
    });
    
    setCoaching(coachingResponse.data);
    
    // Get AI response
    const personaResponseId = generateId(`users/${user?.id}/sessions/${sessionId}/messages`);
    await setDoc(`users/${user?.id}/sessions/${sessionId}/messages/${personaResponseId}`, {
      message: {
        role: 'persona',
        content: '' // Will be updated as stream comes in
      },
      createdAt: new Date()
    });
    
    // Start the stream and update the message as chunks arrive
    const response = await streamingPersonaChat({
      persona: persona,
      message: message,
      conversation_history: messages.map(m => m.message)
    });
    
    // Update the Firestore doc with complete response
    await setDoc(`users/${user?.id}/sessions/${sessionId}/messages/${personaResponseId}`, {
      message: {
        role: 'persona',
        content: response.data
      },
      createdAt: new Date()
    });
    
    setMessage('');
    setIsSubmitting(false);
  };
  
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header with persona info */}
      
      {/* Messages display */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
        {messages.map((item, index) => (
          <Box 
            key={index}
            sx={{ 
              display: 'flex', 
              flexDirection: item.message.role === 'user' ? 'row-reverse' : 'row',
              mb: 2
            }}
          >
            {item.message.role === 'user' ? 
              <UserAvatar user={user} /> : 
              <PersonaAvatar persona={persona} />
            }
            <Paper 
              sx={{ 
                p: 2, 
                ml: item.message.role === 'user' ? 0 : 1,
                mr: item.message.role === 'user' ? 1 : 0,
                maxWidth: '70%',
                bgcolor: item.message.role === 'user' ? 'primary.main' : 'background.paper'
              }}
            >
              <Typography>{item.message.content}</Typography>
            </Paper>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>
      
      {/* Coaching tip display */}
      {coaching?.has_coaching && (
        <CoachingTip 
          message={coaching.coaching_message} 
          technique={coaching.mi_technique_used}
          opportunity={coaching.missed_opportunity}
        />
      )}
      
      {/* Message input */}
      <Box component="form" onSubmit={handleSendMessage} sx={{ p: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={isSubmitting}
          multiline
          maxRows={4}
        />
        <Button 
          type="submit" 
          variant="contained" 
          disabled={isSubmitting || !message.trim()}
          sx={{ mt: 1 }}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
}
```

### 6. Firebase Setup

The Firebase configuration handles authentication, Firestore setup, and Cloud Functions deployment.

```javascript
// firebase.json
{
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "functions": [
    {
      "source": "functions",
      "codebase": "default",
      "ignore": ["node_modules", ".git", "firebase-debug.log", "firebase-debug.*.log"]
    }
  ],
  "hosting": {
    "public": "hosting/build",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  },
  "emulators": {
    "auth": {
      "port": 9099
    },
    "functions": {
      "port": 5001
    },
    "firestore": {
      "port": 8080
    },
    "hosting": {
      "port": 5000
    }
  }
}
```

```javascript
// functions/src/index.ts
import { onCall } from 'firebase-functions/v2/https';
import { initializeApp } from 'firebase-admin/app';
import { generatePersonaFlow, streamingPersonaChatFlow, miCoachingFlow, sessionFeedbackFlow } from './genkit';

initializeApp();

// Expose Genkit flows as callable Cloud Functions
export const generatePersona = onCall(
  { secrets: ["GOOGLE_GENAI_API_KEY"] },
  async (request) => {
    const { scenario_type, change_readiness, additional_context } = request.data;
    return generatePersonaFlow({
      scenario_type,
      change_readiness,
      additional_context
    });
  }
);

export const streamingPersonaChat = onCall(
  { secrets: ["GOOGLE_GENAI_API_KEY"] },
  async (request) => {
    const { persona, message, conversation_history } = request.data;
    return streamingPersonaChatFlow({
      persona,
      message,
      conversation_history
    });
  }
);

export const getCoachingFeedback = onCall(
  { secrets: ["GOOGLE_GENAI_API_KEY"] },
  async (request) => {
    const { user_message, conversation_history, persona } = request.data;
    return miCoachingFlow({
      user_message,
      conversation_history,
      persona
    });
  }
);

export const getSessionFeedback = onCall(
  { secrets: ["GOOGLE_GENAI_API_KEY"] },
  async (request) => {
    const { conversation, persona } = request.data;
    return sessionFeedbackFlow({
      conversation,
      persona
    });
  }
);
```

## Deployment Steps

1. **Setup Firebase Project**:
   ```
   firebase login
   firebase init
   ```

2. **Configure Google API Key**:
   ```
   firebase functions:secrets:set GOOGLE_GENAI_API_KEY
   ```

3. **Install Dependencies**:
   ```
   npm install --prefix functions
   npm install --prefix hosting
   ```

4. **Build and Deploy**:
   ```
   npm run build --prefix hosting
   firebase deploy
   ```

## Development Mode

For local development:

```
# Start Genkit development server
npm run genkit:dev --prefix functions

# Start React development server
npm start --prefix hosting

# Start Firebase emulators
firebase emulators:start
```

## Best Practices and Considerations

1. **Security**: Implement proper authentication and data access rules in Firestore.
2. **Error Handling**: Add robust error handling for AI model failures.
3. **AI Model Versioning**: Use specific model versions to maintain consistency.
4. **Performance**: Implement caching for frequently used personas and feedback templates.
5. **Privacy**: Ensure user data and chat transcripts are properly protected.
6. **Scaling**: Design the system to handle multiple concurrent sessions efficiently.
7. **Template Usage**: While Handlebars templates might seem convenient for prompt construction, they should be avoided in code.  They add unnecessary complexity and create debugging errors. Instead use standard template literals with proper input validation to construct prompts directly. 

By following this implementation guide, you'll create a comprehensive MI-Dojo application that provides powerful training capabilities for managers looking to improve their motivational interviewing skills.
