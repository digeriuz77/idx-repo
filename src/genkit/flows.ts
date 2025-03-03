/**
 * MI-Dojo - Genkit flow definitions
 * 
 * This file contains the implementation of all Genkit flows used in the application:
 * - Persona generation
 * - Chat interaction with the persona
 * - Real-time coaching
 * - Session feedback/MITI scoring
 */

import { genkit, z } from 'genkit';
import { gemini20Flash, googleAI } from '@genkit-ai/googleai';
import {
  PersonaInputSchema,
  PersonaOutputSchema,
  ChatInputSchema,
  MessageSchema,
  CoachingInputSchema,
  CoachingOutputSchema,
  SessionFeedbackInputSchema,
  MITIScoreSchema
} from './schemas';

// Initialize Genkit with Google AI plugin
const ai = genkit({
  plugins: [googleAI()],
});

/**
 * Flow for generating a persona for motivational interviewing practice
 */
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

/**
 * Streaming flow for chat interaction with the persona
 */
export const streamingPersonaChatFlow = ai.defineFlow(
  {
    name: "streamingPersonaChatFlow",
    inputSchema: ChatInputSchema,
    // Type as any to workaround the type error for now
    streamSchema: z.object({
      text: z.string(),
    }) as any,
    outputSchema: z.string() as any,
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

/**
 * Flow for providing real-time MI coaching
 */
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

/**
 * Flow for providing comprehensive MITI-based session feedback
 */
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

      Highlight 2-3 specific strengths and 2-3 areas for improvement.`,
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