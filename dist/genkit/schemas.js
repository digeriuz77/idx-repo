"use strict";
/**
 * MI-Dojo - Schema definitions for Genkit flows
 *
 * This file contains all the Zod schema definitions used throughout the application.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MITIScoreSchema = exports.SessionFeedbackInputSchema = exports.CoachingOutputSchema = exports.CoachingInputSchema = exports.ChatInputSchema = exports.MessageSchema = exports.PersonaOutputSchema = exports.PersonaInputSchema = void 0;
const genkit_1 = require("genkit");
// ===== PERSONA SCHEMAS =====
/**
 * Schema for persona generation input
 */
exports.PersonaInputSchema = genkit_1.z.object({
    scenario_type: genkit_1.z.enum([
        'chronic_illness',
        'addiction',
        'lifestyle_change',
        'mental_health',
        'preventive_care'
    ]),
    change_readiness: genkit_1.z.enum([
        'pre_contemplation',
        'contemplation',
        'preparation',
        'action',
        'maintenance'
    ]),
    additional_context: genkit_1.z.string().optional(),
});
/**
 * Schema for the generated persona
 */
exports.PersonaOutputSchema = genkit_1.z.object({
    persona_id: genkit_1.z.string(),
    base_characteristics: genkit_1.z.object({
        condition: genkit_1.z.string(),
        stage_of_change: genkit_1.z.string(),
        key_resistances: genkit_1.z.array(genkit_1.z.string()),
        communication_style: genkit_1.z.string(),
    }),
    scenario_context: genkit_1.z.object({
        life_circumstances: genkit_1.z.string(),
        support_system: genkit_1.z.string(),
        stress_factors: genkit_1.z.array(genkit_1.z.string()),
    }),
    change_dynamics: genkit_1.z.object({
        readiness_level: genkit_1.z.string(),
        ambivalence_areas: genkit_1.z.array(genkit_1.z.string()),
        change_talk_patterns: genkit_1.z.object({
            commitment: genkit_1.z.coerce.number(),
            desire: genkit_1.z.coerce.number(),
            ability: genkit_1.z.coerce.number(),
            need: genkit_1.z.coerce.number(),
            reasons: genkit_1.z.coerce.number(),
            taking_steps: genkit_1.z.coerce.number(),
        }),
    }),
});
// ===== CHAT SCHEMAS =====
/**
 * Schema for chat messages
 */
exports.MessageSchema = genkit_1.z.object({
    role: genkit_1.z.enum(['user', 'persona']),
    content: genkit_1.z.string(),
});
/**
 * Schema for chat input
 */
exports.ChatInputSchema = genkit_1.z.object({
    persona: exports.PersonaOutputSchema,
    message: genkit_1.z.string(),
    conversation_history: genkit_1.z.array(exports.MessageSchema).optional(),
});
// ===== COACHING SCHEMAS =====
/**
 * Schema for coaching input
 */
exports.CoachingInputSchema = genkit_1.z.object({
    user_message: genkit_1.z.string(),
    conversation_history: genkit_1.z.array(exports.MessageSchema),
    persona: exports.PersonaOutputSchema,
});
/**
 * Schema for coaching output
 */
exports.CoachingOutputSchema = genkit_1.z.object({
    has_coaching: genkit_1.z.boolean(),
    coaching_message: genkit_1.z.string().optional(),
    mi_technique_used: genkit_1.z.string().optional(),
    missed_opportunity: genkit_1.z.string().optional(),
});
// ===== FEEDBACK SCHEMAS =====
/**
 * Schema for session feedback input
 */
exports.SessionFeedbackInputSchema = genkit_1.z.object({
    conversation: genkit_1.z.array(exports.MessageSchema),
    persona: exports.PersonaOutputSchema,
});
/**
 * Schema for MITI scores
 */
exports.MITIScoreSchema = genkit_1.z.object({
    global_scores: genkit_1.z.object({
        partnership: genkit_1.z.number(),
        empathy: genkit_1.z.number(),
        autonomy_support: genkit_1.z.number(),
        evocation: genkit_1.z.number(),
    }),
    behavior_counts: genkit_1.z.object({
        open_questions: genkit_1.z.number(),
        closed_questions: genkit_1.z.number(),
        simple_reflections: genkit_1.z.number(),
        complex_reflections: genkit_1.z.number(),
        affirming_statements: genkit_1.z.number(),
        seeking_collaboration: genkit_1.z.number(),
        emphasizing_autonomy: genkit_1.z.number(),
        confrontations: genkit_1.z.number(),
    }),
    derived_metrics: genkit_1.z.object({
        reflection_to_question_ratio: genkit_1.z.number(),
        percent_complex_reflections: genkit_1.z.number(),
        percent_open_questions: genkit_1.z.number(),
        percent_mi_adherent: genkit_1.z.number(),
    }),
    strengths: genkit_1.z.array(genkit_1.z.string()),
    areas_for_improvement: genkit_1.z.array(genkit_1.z.string()),
    examples: genkit_1.z.object({
        good_examples: genkit_1.z.array(genkit_1.z.string()),
        missed_opportunities: genkit_1.z.array(genkit_1.z.string()),
    }),
});
//# sourceMappingURL=schemas.js.map