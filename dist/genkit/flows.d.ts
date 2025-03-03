/**
 * MI-Dojo - Genkit flow definitions
 *
 * This file contains the implementation of all Genkit flows used in the application:
 * - Persona generation
 * - Chat interaction with the persona
 * - Real-time coaching
 * - Session feedback/MITI scoring
 */
import { z } from 'genkit';
/**
 * Flow for generating a persona for motivational interviewing practice
 */
export declare const generatePersonaFlow: import("genkit").Action<z.ZodObject<{
    scenario_type: z.ZodEnum<["chronic_illness", "addiction", "lifestyle_change", "mental_health", "preventive_care"]>;
    change_readiness: z.ZodEnum<["pre_contemplation", "contemplation", "preparation", "action", "maintenance"]>;
    additional_context: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    scenario_type: "chronic_illness" | "addiction" | "lifestyle_change" | "mental_health" | "preventive_care";
    change_readiness: "pre_contemplation" | "contemplation" | "preparation" | "action" | "maintenance";
    additional_context?: string | undefined;
}, {
    scenario_type: "chronic_illness" | "addiction" | "lifestyle_change" | "mental_health" | "preventive_care";
    change_readiness: "pre_contemplation" | "contemplation" | "preparation" | "action" | "maintenance";
    additional_context?: string | undefined;
}>, z.ZodObject<{
    persona_id: z.ZodString;
    base_characteristics: z.ZodObject<{
        condition: z.ZodString;
        stage_of_change: z.ZodString;
        key_resistances: z.ZodArray<z.ZodString, "many">;
        communication_style: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        condition: string;
        stage_of_change: string;
        key_resistances: string[];
        communication_style: string;
    }, {
        condition: string;
        stage_of_change: string;
        key_resistances: string[];
        communication_style: string;
    }>;
    scenario_context: z.ZodObject<{
        life_circumstances: z.ZodString;
        support_system: z.ZodString;
        stress_factors: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        life_circumstances: string;
        support_system: string;
        stress_factors: string[];
    }, {
        life_circumstances: string;
        support_system: string;
        stress_factors: string[];
    }>;
    change_dynamics: z.ZodObject<{
        readiness_level: z.ZodString;
        ambivalence_areas: z.ZodArray<z.ZodString, "many">;
        change_talk_patterns: z.ZodObject<{
            commitment: z.ZodNumber;
            desire: z.ZodNumber;
            ability: z.ZodNumber;
            need: z.ZodNumber;
            reasons: z.ZodNumber;
            taking_steps: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            commitment: number;
            desire: number;
            ability: number;
            need: number;
            reasons: number;
            taking_steps: number;
        }, {
            commitment: number;
            desire: number;
            ability: number;
            need: number;
            reasons: number;
            taking_steps: number;
        }>;
    }, "strip", z.ZodTypeAny, {
        readiness_level: string;
        ambivalence_areas: string[];
        change_talk_patterns: {
            commitment: number;
            desire: number;
            ability: number;
            need: number;
            reasons: number;
            taking_steps: number;
        };
    }, {
        readiness_level: string;
        ambivalence_areas: string[];
        change_talk_patterns: {
            commitment: number;
            desire: number;
            ability: number;
            need: number;
            reasons: number;
            taking_steps: number;
        };
    }>;
}, "strip", z.ZodTypeAny, {
    persona_id: string;
    base_characteristics: {
        condition: string;
        stage_of_change: string;
        key_resistances: string[];
        communication_style: string;
    };
    scenario_context: {
        life_circumstances: string;
        support_system: string;
        stress_factors: string[];
    };
    change_dynamics: {
        readiness_level: string;
        ambivalence_areas: string[];
        change_talk_patterns: {
            commitment: number;
            desire: number;
            ability: number;
            need: number;
            reasons: number;
            taking_steps: number;
        };
    };
}, {
    persona_id: string;
    base_characteristics: {
        condition: string;
        stage_of_change: string;
        key_resistances: string[];
        communication_style: string;
    };
    scenario_context: {
        life_circumstances: string;
        support_system: string;
        stress_factors: string[];
    };
    change_dynamics: {
        readiness_level: string;
        ambivalence_areas: string[];
        change_talk_patterns: {
            commitment: number;
            desire: number;
            ability: number;
            need: number;
            reasons: number;
            taking_steps: number;
        };
    };
}>, z.ZodTypeAny>;
/**
 * Streaming flow for chat interaction with the persona
 */
export declare const streamingPersonaChatFlow: import("genkit").Action<z.ZodObject<{
    persona: z.ZodObject<{
        persona_id: z.ZodString;
        base_characteristics: z.ZodObject<{
            condition: z.ZodString;
            stage_of_change: z.ZodString;
            key_resistances: z.ZodArray<z.ZodString, "many">;
            communication_style: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            condition: string;
            stage_of_change: string;
            key_resistances: string[];
            communication_style: string;
        }, {
            condition: string;
            stage_of_change: string;
            key_resistances: string[];
            communication_style: string;
        }>;
        scenario_context: z.ZodObject<{
            life_circumstances: z.ZodString;
            support_system: z.ZodString;
            stress_factors: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            life_circumstances: string;
            support_system: string;
            stress_factors: string[];
        }, {
            life_circumstances: string;
            support_system: string;
            stress_factors: string[];
        }>;
        change_dynamics: z.ZodObject<{
            readiness_level: z.ZodString;
            ambivalence_areas: z.ZodArray<z.ZodString, "many">;
            change_talk_patterns: z.ZodObject<{
                commitment: z.ZodNumber;
                desire: z.ZodNumber;
                ability: z.ZodNumber;
                need: z.ZodNumber;
                reasons: z.ZodNumber;
                taking_steps: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                commitment: number;
                desire: number;
                ability: number;
                need: number;
                reasons: number;
                taking_steps: number;
            }, {
                commitment: number;
                desire: number;
                ability: number;
                need: number;
                reasons: number;
                taking_steps: number;
            }>;
        }, "strip", z.ZodTypeAny, {
            readiness_level: string;
            ambivalence_areas: string[];
            change_talk_patterns: {
                commitment: number;
                desire: number;
                ability: number;
                need: number;
                reasons: number;
                taking_steps: number;
            };
        }, {
            readiness_level: string;
            ambivalence_areas: string[];
            change_talk_patterns: {
                commitment: number;
                desire: number;
                ability: number;
                need: number;
                reasons: number;
                taking_steps: number;
            };
        }>;
    }, "strip", z.ZodTypeAny, {
        persona_id: string;
        base_characteristics: {
            condition: string;
            stage_of_change: string;
            key_resistances: string[];
            communication_style: string;
        };
        scenario_context: {
            life_circumstances: string;
            support_system: string;
            stress_factors: string[];
        };
        change_dynamics: {
            readiness_level: string;
            ambivalence_areas: string[];
            change_talk_patterns: {
                commitment: number;
                desire: number;
                ability: number;
                need: number;
                reasons: number;
                taking_steps: number;
            };
        };
    }, {
        persona_id: string;
        base_characteristics: {
            condition: string;
            stage_of_change: string;
            key_resistances: string[];
            communication_style: string;
        };
        scenario_context: {
            life_circumstances: string;
            support_system: string;
            stress_factors: string[];
        };
        change_dynamics: {
            readiness_level: string;
            ambivalence_areas: string[];
            change_talk_patterns: {
                commitment: number;
                desire: number;
                ability: number;
                need: number;
                reasons: number;
                taking_steps: number;
            };
        };
    }>;
    message: z.ZodString;
    conversation_history: z.ZodOptional<z.ZodArray<z.ZodObject<{
        role: z.ZodEnum<["user", "persona"]>;
        content: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        role: "user" | "persona";
        content: string;
    }, {
        role: "user" | "persona";
        content: string;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    message: string;
    persona: {
        persona_id: string;
        base_characteristics: {
            condition: string;
            stage_of_change: string;
            key_resistances: string[];
            communication_style: string;
        };
        scenario_context: {
            life_circumstances: string;
            support_system: string;
            stress_factors: string[];
        };
        change_dynamics: {
            readiness_level: string;
            ambivalence_areas: string[];
            change_talk_patterns: {
                commitment: number;
                desire: number;
                ability: number;
                need: number;
                reasons: number;
                taking_steps: number;
            };
        };
    };
    conversation_history?: {
        role: "user" | "persona";
        content: string;
    }[] | undefined;
}, {
    message: string;
    persona: {
        persona_id: string;
        base_characteristics: {
            condition: string;
            stage_of_change: string;
            key_resistances: string[];
            communication_style: string;
        };
        scenario_context: {
            life_circumstances: string;
            support_system: string;
            stress_factors: string[];
        };
        change_dynamics: {
            readiness_level: string;
            ambivalence_areas: string[];
            change_talk_patterns: {
                commitment: number;
                desire: number;
                ability: number;
                need: number;
                reasons: number;
                taking_steps: number;
            };
        };
    };
    conversation_history?: {
        role: "user" | "persona";
        content: string;
    }[] | undefined;
}>, any, any>;
/**
 * Flow for providing real-time MI coaching
 */
export declare const miCoachingFlow: import("genkit").Action<z.ZodObject<{
    user_message: z.ZodString;
    conversation_history: z.ZodArray<z.ZodObject<{
        role: z.ZodEnum<["user", "persona"]>;
        content: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        role: "user" | "persona";
        content: string;
    }, {
        role: "user" | "persona";
        content: string;
    }>, "many">;
    persona: z.ZodObject<{
        persona_id: z.ZodString;
        base_characteristics: z.ZodObject<{
            condition: z.ZodString;
            stage_of_change: z.ZodString;
            key_resistances: z.ZodArray<z.ZodString, "many">;
            communication_style: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            condition: string;
            stage_of_change: string;
            key_resistances: string[];
            communication_style: string;
        }, {
            condition: string;
            stage_of_change: string;
            key_resistances: string[];
            communication_style: string;
        }>;
        scenario_context: z.ZodObject<{
            life_circumstances: z.ZodString;
            support_system: z.ZodString;
            stress_factors: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            life_circumstances: string;
            support_system: string;
            stress_factors: string[];
        }, {
            life_circumstances: string;
            support_system: string;
            stress_factors: string[];
        }>;
        change_dynamics: z.ZodObject<{
            readiness_level: z.ZodString;
            ambivalence_areas: z.ZodArray<z.ZodString, "many">;
            change_talk_patterns: z.ZodObject<{
                commitment: z.ZodNumber;
                desire: z.ZodNumber;
                ability: z.ZodNumber;
                need: z.ZodNumber;
                reasons: z.ZodNumber;
                taking_steps: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                commitment: number;
                desire: number;
                ability: number;
                need: number;
                reasons: number;
                taking_steps: number;
            }, {
                commitment: number;
                desire: number;
                ability: number;
                need: number;
                reasons: number;
                taking_steps: number;
            }>;
        }, "strip", z.ZodTypeAny, {
            readiness_level: string;
            ambivalence_areas: string[];
            change_talk_patterns: {
                commitment: number;
                desire: number;
                ability: number;
                need: number;
                reasons: number;
                taking_steps: number;
            };
        }, {
            readiness_level: string;
            ambivalence_areas: string[];
            change_talk_patterns: {
                commitment: number;
                desire: number;
                ability: number;
                need: number;
                reasons: number;
                taking_steps: number;
            };
        }>;
    }, "strip", z.ZodTypeAny, {
        persona_id: string;
        base_characteristics: {
            condition: string;
            stage_of_change: string;
            key_resistances: string[];
            communication_style: string;
        };
        scenario_context: {
            life_circumstances: string;
            support_system: string;
            stress_factors: string[];
        };
        change_dynamics: {
            readiness_level: string;
            ambivalence_areas: string[];
            change_talk_patterns: {
                commitment: number;
                desire: number;
                ability: number;
                need: number;
                reasons: number;
                taking_steps: number;
            };
        };
    }, {
        persona_id: string;
        base_characteristics: {
            condition: string;
            stage_of_change: string;
            key_resistances: string[];
            communication_style: string;
        };
        scenario_context: {
            life_circumstances: string;
            support_system: string;
            stress_factors: string[];
        };
        change_dynamics: {
            readiness_level: string;
            ambivalence_areas: string[];
            change_talk_patterns: {
                commitment: number;
                desire: number;
                ability: number;
                need: number;
                reasons: number;
                taking_steps: number;
            };
        };
    }>;
}, "strip", z.ZodTypeAny, {
    persona: {
        persona_id: string;
        base_characteristics: {
            condition: string;
            stage_of_change: string;
            key_resistances: string[];
            communication_style: string;
        };
        scenario_context: {
            life_circumstances: string;
            support_system: string;
            stress_factors: string[];
        };
        change_dynamics: {
            readiness_level: string;
            ambivalence_areas: string[];
            change_talk_patterns: {
                commitment: number;
                desire: number;
                ability: number;
                need: number;
                reasons: number;
                taking_steps: number;
            };
        };
    };
    conversation_history: {
        role: "user" | "persona";
        content: string;
    }[];
    user_message: string;
}, {
    persona: {
        persona_id: string;
        base_characteristics: {
            condition: string;
            stage_of_change: string;
            key_resistances: string[];
            communication_style: string;
        };
        scenario_context: {
            life_circumstances: string;
            support_system: string;
            stress_factors: string[];
        };
        change_dynamics: {
            readiness_level: string;
            ambivalence_areas: string[];
            change_talk_patterns: {
                commitment: number;
                desire: number;
                ability: number;
                need: number;
                reasons: number;
                taking_steps: number;
            };
        };
    };
    conversation_history: {
        role: "user" | "persona";
        content: string;
    }[];
    user_message: string;
}>, z.ZodObject<{
    has_coaching: z.ZodBoolean;
    coaching_message: z.ZodOptional<z.ZodString>;
    mi_technique_used: z.ZodOptional<z.ZodString>;
    missed_opportunity: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    has_coaching: boolean;
    coaching_message?: string | undefined;
    mi_technique_used?: string | undefined;
    missed_opportunity?: string | undefined;
}, {
    has_coaching: boolean;
    coaching_message?: string | undefined;
    mi_technique_used?: string | undefined;
    missed_opportunity?: string | undefined;
}>, z.ZodTypeAny>;
/**
 * Flow for providing comprehensive MITI-based session feedback
 */
export declare const sessionFeedbackFlow: import("genkit").Action<z.ZodObject<{
    conversation: z.ZodArray<z.ZodObject<{
        role: z.ZodEnum<["user", "persona"]>;
        content: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        role: "user" | "persona";
        content: string;
    }, {
        role: "user" | "persona";
        content: string;
    }>, "many">;
    persona: z.ZodObject<{
        persona_id: z.ZodString;
        base_characteristics: z.ZodObject<{
            condition: z.ZodString;
            stage_of_change: z.ZodString;
            key_resistances: z.ZodArray<z.ZodString, "many">;
            communication_style: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            condition: string;
            stage_of_change: string;
            key_resistances: string[];
            communication_style: string;
        }, {
            condition: string;
            stage_of_change: string;
            key_resistances: string[];
            communication_style: string;
        }>;
        scenario_context: z.ZodObject<{
            life_circumstances: z.ZodString;
            support_system: z.ZodString;
            stress_factors: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            life_circumstances: string;
            support_system: string;
            stress_factors: string[];
        }, {
            life_circumstances: string;
            support_system: string;
            stress_factors: string[];
        }>;
        change_dynamics: z.ZodObject<{
            readiness_level: z.ZodString;
            ambivalence_areas: z.ZodArray<z.ZodString, "many">;
            change_talk_patterns: z.ZodObject<{
                commitment: z.ZodNumber;
                desire: z.ZodNumber;
                ability: z.ZodNumber;
                need: z.ZodNumber;
                reasons: z.ZodNumber;
                taking_steps: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                commitment: number;
                desire: number;
                ability: number;
                need: number;
                reasons: number;
                taking_steps: number;
            }, {
                commitment: number;
                desire: number;
                ability: number;
                need: number;
                reasons: number;
                taking_steps: number;
            }>;
        }, "strip", z.ZodTypeAny, {
            readiness_level: string;
            ambivalence_areas: string[];
            change_talk_patterns: {
                commitment: number;
                desire: number;
                ability: number;
                need: number;
                reasons: number;
                taking_steps: number;
            };
        }, {
            readiness_level: string;
            ambivalence_areas: string[];
            change_talk_patterns: {
                commitment: number;
                desire: number;
                ability: number;
                need: number;
                reasons: number;
                taking_steps: number;
            };
        }>;
    }, "strip", z.ZodTypeAny, {
        persona_id: string;
        base_characteristics: {
            condition: string;
            stage_of_change: string;
            key_resistances: string[];
            communication_style: string;
        };
        scenario_context: {
            life_circumstances: string;
            support_system: string;
            stress_factors: string[];
        };
        change_dynamics: {
            readiness_level: string;
            ambivalence_areas: string[];
            change_talk_patterns: {
                commitment: number;
                desire: number;
                ability: number;
                need: number;
                reasons: number;
                taking_steps: number;
            };
        };
    }, {
        persona_id: string;
        base_characteristics: {
            condition: string;
            stage_of_change: string;
            key_resistances: string[];
            communication_style: string;
        };
        scenario_context: {
            life_circumstances: string;
            support_system: string;
            stress_factors: string[];
        };
        change_dynamics: {
            readiness_level: string;
            ambivalence_areas: string[];
            change_talk_patterns: {
                commitment: number;
                desire: number;
                ability: number;
                need: number;
                reasons: number;
                taking_steps: number;
            };
        };
    }>;
}, "strip", z.ZodTypeAny, {
    persona: {
        persona_id: string;
        base_characteristics: {
            condition: string;
            stage_of_change: string;
            key_resistances: string[];
            communication_style: string;
        };
        scenario_context: {
            life_circumstances: string;
            support_system: string;
            stress_factors: string[];
        };
        change_dynamics: {
            readiness_level: string;
            ambivalence_areas: string[];
            change_talk_patterns: {
                commitment: number;
                desire: number;
                ability: number;
                need: number;
                reasons: number;
                taking_steps: number;
            };
        };
    };
    conversation: {
        role: "user" | "persona";
        content: string;
    }[];
}, {
    persona: {
        persona_id: string;
        base_characteristics: {
            condition: string;
            stage_of_change: string;
            key_resistances: string[];
            communication_style: string;
        };
        scenario_context: {
            life_circumstances: string;
            support_system: string;
            stress_factors: string[];
        };
        change_dynamics: {
            readiness_level: string;
            ambivalence_areas: string[];
            change_talk_patterns: {
                commitment: number;
                desire: number;
                ability: number;
                need: number;
                reasons: number;
                taking_steps: number;
            };
        };
    };
    conversation: {
        role: "user" | "persona";
        content: string;
    }[];
}>, z.ZodObject<{
    global_scores: z.ZodObject<{
        partnership: z.ZodNumber;
        empathy: z.ZodNumber;
        autonomy_support: z.ZodNumber;
        evocation: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        partnership: number;
        empathy: number;
        autonomy_support: number;
        evocation: number;
    }, {
        partnership: number;
        empathy: number;
        autonomy_support: number;
        evocation: number;
    }>;
    behavior_counts: z.ZodObject<{
        open_questions: z.ZodNumber;
        closed_questions: z.ZodNumber;
        simple_reflections: z.ZodNumber;
        complex_reflections: z.ZodNumber;
        affirming_statements: z.ZodNumber;
        seeking_collaboration: z.ZodNumber;
        emphasizing_autonomy: z.ZodNumber;
        confrontations: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        open_questions: number;
        closed_questions: number;
        simple_reflections: number;
        complex_reflections: number;
        affirming_statements: number;
        seeking_collaboration: number;
        emphasizing_autonomy: number;
        confrontations: number;
    }, {
        open_questions: number;
        closed_questions: number;
        simple_reflections: number;
        complex_reflections: number;
        affirming_statements: number;
        seeking_collaboration: number;
        emphasizing_autonomy: number;
        confrontations: number;
    }>;
    derived_metrics: z.ZodObject<{
        reflection_to_question_ratio: z.ZodNumber;
        percent_complex_reflections: z.ZodNumber;
        percent_open_questions: z.ZodNumber;
        percent_mi_adherent: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        reflection_to_question_ratio: number;
        percent_complex_reflections: number;
        percent_open_questions: number;
        percent_mi_adherent: number;
    }, {
        reflection_to_question_ratio: number;
        percent_complex_reflections: number;
        percent_open_questions: number;
        percent_mi_adherent: number;
    }>;
    strengths: z.ZodArray<z.ZodString, "many">;
    areas_for_improvement: z.ZodArray<z.ZodString, "many">;
    examples: z.ZodObject<{
        good_examples: z.ZodArray<z.ZodString, "many">;
        missed_opportunities: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        good_examples: string[];
        missed_opportunities: string[];
    }, {
        good_examples: string[];
        missed_opportunities: string[];
    }>;
}, "strip", z.ZodTypeAny, {
    global_scores: {
        partnership: number;
        empathy: number;
        autonomy_support: number;
        evocation: number;
    };
    behavior_counts: {
        open_questions: number;
        closed_questions: number;
        simple_reflections: number;
        complex_reflections: number;
        affirming_statements: number;
        seeking_collaboration: number;
        emphasizing_autonomy: number;
        confrontations: number;
    };
    derived_metrics: {
        reflection_to_question_ratio: number;
        percent_complex_reflections: number;
        percent_open_questions: number;
        percent_mi_adherent: number;
    };
    strengths: string[];
    areas_for_improvement: string[];
    examples: {
        good_examples: string[];
        missed_opportunities: string[];
    };
}, {
    global_scores: {
        partnership: number;
        empathy: number;
        autonomy_support: number;
        evocation: number;
    };
    behavior_counts: {
        open_questions: number;
        closed_questions: number;
        simple_reflections: number;
        complex_reflections: number;
        affirming_statements: number;
        seeking_collaboration: number;
        emphasizing_autonomy: number;
        confrontations: number;
    };
    derived_metrics: {
        reflection_to_question_ratio: number;
        percent_complex_reflections: number;
        percent_open_questions: number;
        percent_mi_adherent: number;
    };
    strengths: string[];
    areas_for_improvement: string[];
    examples: {
        good_examples: string[];
        missed_opportunities: string[];
    };
}>, z.ZodTypeAny>;
