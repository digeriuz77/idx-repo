"use strict";
/**
 * MI-Dojo - CLI Demo
 *
 * This file contains a simple CLI demo of the MI-Dojo functionality.
 * It showcases the core Genkit flows without requiring a full web server.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const genkit_1 = require("./genkit");
/**
 * Runs a demo of the MI-Dojo functionality in the console
 */
const runDemo = async () => {
    try {
        console.log("===== MI-Dojo: Motivational Interviewing Practice Platform =====\n");
        // Step 1: Generate a sample persona
        console.log("Generating persona...");
        const persona = await (0, genkit_1.generatePersonaFlow)({
            scenario_type: "addiction",
            change_readiness: "contemplation",
            additional_context: "The person is struggling with alcohol dependency and has a supportive family but stressful job."
        });
        console.log("\nGenerated Persona:");
        console.log(JSON.stringify(persona, null, 2));
        // Step 2: Sample conversation
        console.log("\n===== Starting Sample Conversation =====");
        // Initialize conversation history
        const conversationHistory = [];
        // User message 1
        const userMessage1 = "Hello, I'm a counselor here to talk with you today. How are you feeling about your relationship with alcohol?";
        console.log(`\nUser: ${userMessage1}`);
        // Persona response 1
        const personaResponse1 = await (0, genkit_1.streamingPersonaChatFlow)({
            persona,
            message: userMessage1,
            conversation_history: conversationHistory
        });
        console.log(`\nPersona: ${personaResponse1}`);
        // Update conversation history
        conversationHistory.push({ role: "user", content: userMessage1 }, { role: "persona", content: personaResponse1 });
        // User message 2
        const userMessage2 = "That sounds challenging. What would you say are some of the negative impacts alcohol has had on your life?";
        console.log(`\nUser: ${userMessage2}`);
        // Get coaching feedback on user message
        const coaching = await (0, genkit_1.miCoachingFlow)({
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
        const personaResponse2 = await (0, genkit_1.streamingPersonaChatFlow)({
            persona,
            message: userMessage2,
            conversation_history: conversationHistory
        });
        console.log(`\nPersona: ${personaResponse2}`);
        // Update conversation history
        conversationHistory.push({ role: "user", content: userMessage2 }, { role: "persona", content: personaResponse2 });
        // Step 3: Session feedback
        console.log("\n===== Session Feedback =====");
        const feedback = await (0, genkit_1.sessionFeedbackFlow)({
            conversation: conversationHistory,
            persona
        });
        console.log("MITI Scores:");
        console.log(JSON.stringify(feedback, null, 2));
        console.log("\n===== Demo Complete =====");
    }
    catch (error) {
        console.error("Error in MI-Dojo demo:", error);
    }
};
// Run the demo when this file is executed directly
if (require.main === module) {
    runDemo();
}
// Export the demo function for use by Genkit CLI
exports.default = runDemo;
//# sourceMappingURL=cli.js.map