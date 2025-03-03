/**
 * MI-Dojo - Main Entry Point
 *
 * This is the main entry point for the MI-Dojo application.
 * It exports both the server and CLI functionality.
 */
export * from './genkit';
export { default as runDemo } from './cli';
import './server';
