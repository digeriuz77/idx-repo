/**
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { gemini20Flash, googleAI } from '@genkit-ai/googleai';
import { genkit, z } from 'genkit';

// This makes the flows available for genkit-cli to discover
const flowExports = {};

// Initialize Genkit with Google AI plugin
const ai = genkit({
  plugins: [googleAI()],
});

// ===== SCHEMAS =====

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

// Define the schema for chat messages
const MessageSchema = z.object({
  role: z.enum(['user', 'persona']),
  content: z.string(),
});

// Define the schema for chat input
const ChatInputSchema = z.object({
  persona: PersonaOutputSchema,
  message: z.string(),
  conversation_history: z.array(MessageSchema).optional(),
});

// Define the schema for coaching input
const CoachingInputSchema = z.object({
  user_message: z.string(),
  conversation_history: z.array(MessageSchema),
  persona: PersonaOutputSchema,
});

// Define the schema for coaching output
const CoachingOutputSchema = z.object({
  has_coaching: z.boolean(),
  coaching_message: z.string().optional(),
  mi_technique_used: z.string().optional(),
  missed_opportunity: z.string().optional(),
});

// Define the schema for session feedback input
const SessionFeedbackInputSchema = z.object({
  conversation: z.array(MessageSchema),
  persona: PersonaOutputSchema,
});

// Define the schema for MITI scores
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

// ===== FLOWS =====

// 1. Persona Generation Flow
export const generatePersonaFlow = ai.defineFlow(
  {
    name: "generatePersonaFlow",
    inputSchema: PersonaInputSchema,
    outputSchema: PersonaOutputSchema,
  },
  async (input) => {
    const result = await ai.generate({
      model: gemini20Flash,
      prompt: `Create an authentic patient persona for Motivational Interviewing practice
        with scenario: ${input.scenario_type} and readiness stage: ${input.change_readiness}.
        ${input.additional_context || ''}
        
        Be creative but realistic. Keep descriptions concise.
        For change_talk_patterns, use numbers 1-10 to indicate frequency.
        Key resistances should include 2-4 realistic objections.
        Give a unique persona_id combining scenario type and a random element.
        
        Respond with a JSON object exactly matching this schema:
        {
          "persona_id": string,
          "base_characteristics": {
            "condition": string,
            "stage_of_change": string,
            "key_resistances": string[],
            "communication_style": string
          },
          "scenario_context": {
            "life_circumstances": string,
            "support_system": string,
            "stress_factors": string[]
          },
          "change_dynamics": {
            "readiness_level": string,
            "ambivalence_areas": string[],
            "change_talk_patterns": {
              "commitment": number,
              "desire": number,
              "ability": number,
              "need": number,
              "reasons": number,
              "taking_steps": number
            }
          }
        }`,
      output: { 
        schema: PersonaOutputSchema,
        format: 'json'
      },
    });
    
    return result.output || {
      persona_id: "",
      base_characteristics: { 
        condition: "", 
        stage_of_change: "", 
        key_resistances: [], 
        communication_style: "" 
      },
      scenario_context: { 
        life_circumstances: "", 
        support_system: "", 
        stress_factors: [] 
      },
      change_dynamics: {
        readiness_level: "",
        ambivalence_areas: [],
        change_talk_patterns: {
          commitment: 0,
          desire: 0,
          ability: 0,
          need: 0,
          reasons: 0,
          taking_steps: 0
        }
      }
    };
  }
);

// 2. Chat Interface with Personas
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

// 3. Real-time MI Coaching System
export const miCoachingFlow = ai.defineFlow(
  {
    name: "miCoachingFlow",
    inputSchema: CoachingInputSchema,
    outputSchema: CoachingOutputSchema,
  },
  async (input) => {
    const result = await ai.generate({
      model: gemini20Flash,
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
      If the user is doing well, indicate that no coaching is needed.
      
      Respond with a JSON object exactly matching this schema:
      {
        "has_coaching": boolean,
        "coaching_message": string,
        "mi_technique_used": string,
        "missed_opportunity": string
      }
      
      If has_coaching is false, the coaching_message, mi_technique_used, and missed_opportunity fields can be empty strings.`,
      output: { 
        schema: CoachingOutputSchema,
        format: 'json'
      },
    });
    
    return result.output || {
      has_coaching: false,
      coaching_message: "",
      mi_technique_used: "",
      missed_opportunity: ""
    };
  }
);

// 4. Session Analysis & Feedback System
export const sessionFeedbackFlow = ai.defineFlow(
  {
    name: "sessionFeedbackFlow", 
    inputSchema: SessionFeedbackInputSchema,
    outputSchema: MITIScoreSchema,
  },
  async (input) => {
    const result = await ai.generate({
      model: gemini20Flash, // Use the same model as other flows
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

      Highlight 2-3 specific strengths and 2-3 areas for improvement.
      
      Respond with a JSON object exactly matching this schema:
      {
        "global_scores": {
          "partnership": number,
          "empathy": number,
          "autonomy_support": number,
          "evocation": number
        },
        "behavior_counts": {
          "open_questions": number,
          "closed_questions": number,
          "simple_reflections": number,
          "complex_reflections": number,
          "affirming_statements": number,
          "seeking_collaboration": number,
          "emphasizing_autonomy": number,
          "confrontations": number
        },
        "derived_metrics": {
          "reflection_to_question_ratio": number,
          "percent_complex_reflections": number,
          "percent_open_questions": number,
          "percent_mi_adherent": number
        },
        "strengths": string[],
        "areas_for_improvement": string[],
        "examples": {
          "good_examples": string[],
          "missed_opportunities": string[]
        }
      }`,
      output: { 
        schema: MITIScoreSchema,
        format: 'json'
      },
    });
    
    return result.output || {
      global_scores: {
        partnership: 3,
        empathy: 3,
        autonomy_support: 3,
        evocation: 3
      },
      behavior_counts: {
        open_questions: 0,
        closed_questions: 0,
        simple_reflections: 0,
        complex_reflections: 0,
        affirming_statements: 0,
        seeking_collaboration: 0,
        emphasizing_autonomy: 0,
        confrontations: 0
      },
      derived_metrics: {
        reflection_to_question_ratio: 0,
        percent_complex_reflections: 0,
        percent_open_questions: 0,
        percent_mi_adherent: 0
      },
      strengths: ["Not enough conversation to evaluate"],
      areas_for_improvement: ["Not enough conversation to evaluate"],
      examples: {
        good_examples: [],
        missed_opportunities: []
      }
    };
  }
);

// ===== Demo / Test =====

const runDemo = async () => {
  try {
    console.log("===== MI-Dojo: Motivational Interviewing Practice Platform =====\n");
    
    // Step 1: Generate a sample persona
    console.log("Generating persona...");
    const persona = await generatePersonaFlow({
      scenario_type: "addiction",
      change_readiness: "contemplation",
      additional_context: "The person is struggling with alcohol dependency and has a supportive family but stressful job."
    });
    
    console.log("\nGenerated Persona:");
    console.log(JSON.stringify(persona, null, 2));
    
    // Step 2: Sample conversation
    console.log("\n===== Starting Sample Conversation =====");
    
    // Initialize conversation history
    const conversationHistory: { role: "user" | "persona"; content: string }[] = [];
    
    // User message 1
    const userMessage1 = "Hello, I'm a counselor here to talk with you today. How are you feeling about your relationship with alcohol?";
    console.log(`\nUser: ${userMessage1}`);
    
    // Persona response 1
    const personaResponse1 = await streamingPersonaChatFlow({
      persona,
      message: userMessage1,
      conversation_history: conversationHistory
    });
    console.log(`\nPersona: ${personaResponse1}`);
    
    // Update conversation history
    conversationHistory.push(
      { role: "user", content: userMessage1 },
      { role: "persona", content: personaResponse1 }
    );
    
    // User message 2
    const userMessage2 = "That sounds challenging. What would you say are some of the negative impacts alcohol has had on your life?";
    console.log(`\nUser: ${userMessage2}`);
    
    // Get coaching feedback on user message
    const coaching = await miCoachingFlow({
      user_message: userMessage2,
      conversation_history: conversationHistory,
      persona
    });
    
    // Display coaching feedback if available
    if (coaching.has_coaching) {
      console.log("\n--- Coaching Feedback ---");
      console.log(`Tip: ${coaching.coaching_message}`);
      if (coaching.mi_technique_used) {
        console.log(`Technique used: ${coaching.mi_technique_used}`);
      }
      if (coaching.missed_opportunity) {
        console.log(`Missed opportunity: ${coaching.missed_opportunity}`);
      }
      console.log("-------------------------\n");
    }
    
    // Persona response 2
    const personaResponse2 = await streamingPersonaChatFlow({
      persona,
      message: userMessage2,
      conversation_history: conversationHistory
    });
    console.log(`\nPersona: ${personaResponse2}`);
    
    // Update conversation history
    conversationHistory.push(
      { role: "user", content: userMessage2 },
      { role: "persona", content: personaResponse2 }
    );
    
    // Step 3: Session feedback
    console.log("\n===== Session Feedback =====");
    const feedback = await sessionFeedbackFlow({
      conversation: conversationHistory,
      persona
    });
    
    console.log("MITI Scores:");
    console.log(JSON.stringify(feedback, null, 2));
    
    console.log("\n===== Demo Complete =====");
    
  } catch (error) {
    console.error("Error in MI-Dojo demo:", error);
  }
};

// Run the demo
runDemo();

// Export flows for Genkit UI
export default {
  generatePersonaFlow,
  streamingPersonaChatFlow,
  miCoachingFlow,
  sessionFeedbackFlow
};
