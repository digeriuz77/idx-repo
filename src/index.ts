/**
 * MI-Dojo - Main Entry Point
 * 
 * This is the main entry point for the MI-Dojo application.
 * It exports both the server and CLI functionality.
 */

// Re-export flows for Genkit CLI
export * from './genkit';

// Export demo function
export { default as runDemo } from './cli';

// Import server
import './server';