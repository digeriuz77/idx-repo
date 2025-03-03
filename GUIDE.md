# MI-Dojo Development Guide

This document explains how the MI-Dojo application is structured and how you can interact with it during development.

## Application Structure

MI-Dojo consists of several key components:

1. **Express Server (port 3000)**
   - Serves the web application frontend
   - Provides API endpoints for:
     - Persona generation
     - Message handling
     - Session management

2. **Genkit UI (port 4000)**
   - Development interface for the AI flows
   - Allows direct testing of flows without the web UI
   - Shows detailed prompt history and tokens used

3. **Web Application (port 3000)**
   - Browser-based UI for MI-Dojo
   - Allows persona creation and conversation
   - User-friendly interface for practicing MI

## Development Workflow

Here's how to effectively work with the MI-Dojo codebase:

### 1. Start Everything

For the full development setup:

```bash
npm run start:all
```

This starts both the Express server and Genkit UI, and opens both in your browser.

### 2. Interact with the Web Application

Visit http://localhost:3000 to use the web application:

1. Select a scenario type and change readiness level
2. Click "Create Persona" to generate a persona
3. Engage in conversation with the persona
4. Test your motivational interviewing skills

### 3. Use the Genkit UI for Flow Development

Visit http://localhost:4000 to use the Genkit UI:

1. Select a flow from the sidebar
2. Configure input parameters
3. Run the flow to test
4. View the generated prompts and responses

### 4. Understand the Code

Key files:

- `server/server.js` - Express server and API routes
- `server/genkit-demo.js` - Simplified Genkit flows for web API
- `public/js/app.js` - Web application frontend code
- `index.ts` - Original full-featured CLI flows

### 5. Adding New Features

To add new MI-Dojo features:

1. Add/modify flows in `server/genkit-demo.js`
2. Update APIs in `server/routes/api.js`
3. Enhance the UI in `public/js/app.js` and `public/index.html`
4. Update the Genkit flows in `index.ts` for CLI and Genkit UI

## Deployment

For deployment to production:

1. Build the TypeScript code:
   ```bash
   npm run build
   ```

2. Deploy to your target environment:
   - Express server for backend
   - Static files for frontend
   - Consider using Firebase for hosting as mentioned in the original requirements

## Contact

If you have questions about MI-Dojo, please refer to the README.md or create an issue on the repository.