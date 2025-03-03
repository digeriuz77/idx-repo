/**
 * MI-Dojo - Schema definitions for Genkit flows
 * 
 * This file contains all the Zod schema definitions used throughout the application.
 */

import { z } from 'genkit';

// ===== PERSONA SCHEMAS =====

/**
 * Schema for persona generation input
 */
export const PersonaInputSchema = z.object({
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

/**
 * Schema for the generated persona
 */
export const PersonaOutputSchema = z.object({
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

// ===== CHAT SCHEMAS =====

/**
 * Schema for chat messages
 */
export const MessageSchema = z.object({
  role: z.enum(['user', 'persona']),
  content: z.string(),
});

/**
 * Schema for chat input
 */
export const ChatInputSchema = z.object({
  persona: PersonaOutputSchema,
  message: z.string(),
  conversation_history: z.array(MessageSchema).optional(),
});

// ===== COACHING SCHEMAS =====

/**
 * Schema for coaching input
 */
export const CoachingInputSchema = z.object({
  user_message: z.string(),
  conversation_history: z.array(MessageSchema),
  persona: PersonaOutputSchema,
});

/**
 * Schema for coaching output
 */
export const CoachingOutputSchema = z.object({
  has_coaching: z.boolean(),
  coaching_message: z.string().optional(),
  mi_technique_used: z.string().optional(),
  missed_opportunity: z.string().optional(),
});

// ===== FEEDBACK SCHEMAS =====

/**
 * Schema for session feedback input
 */
export const SessionFeedbackInputSchema = z.object({
  conversation: z.array(MessageSchema),
  persona: PersonaOutputSchema,
});

/**
 * Schema for MITI scores
 */
export const MITIScoreSchema = z.object({
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