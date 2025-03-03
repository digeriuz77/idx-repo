#!/bin/bash

# Kill ports if in use
echo "Killing any processes on ports 3000 and 4000..."
npx kill-port 3000 4000 || true

# Build the TypeScript code
echo "Building TypeScript code..."
npm run build

# Start Genkit server UI and CLI demo
echo "Starting Genkit server on port 4000..."
npx genkit start --port 4000 -- node dist/cli.js &
GENKIT_PID=$!

# Wait for Genkit server to initialize
echo "Waiting for Genkit server to initialize..."
sleep 5

# Open browsers
echo "Opening browsers..."
npx open-cli http://localhost:3000 &
npx open-cli http://localhost:4000 &

# Start the web server
echo "Starting web server on port 3000..."
echo "Note: Press Ctrl+C to stop both servers when done"
node dist/index.js

# If web server stops, kill the Genkit server
echo "Stopping Genkit server..."
kill $GENKIT_PID