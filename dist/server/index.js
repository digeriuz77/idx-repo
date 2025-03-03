"use strict";
/**
 * MI-Dojo - Server
 *
 * This is the main server file for the MI-Dojo application.
 * It sets up the Express server, WebSocket support, and serves the frontend.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const ws_1 = require("ws");
const http_1 = __importDefault(require("http"));
const routes_1 = __importDefault(require("./routes"));
// Create Express app
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Create HTTP server
const server = http_1.default.createServer(app);
// Create WebSocket server
const wss = new ws_1.Server({ server });
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Static files
app.use(express_1.default.static(path_1.default.join(__dirname, '../../public')));
// API routes
app.use('/api', routes_1.default);
// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'MI-Dojo API is running' });
});
// Serve index.html for all other routes (SPA)
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../../public/index.html'));
});
// WebSocket connection handling
wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message.toString());
            console.log('Received WebSocket message:', data);
            // Handle different message types
            // This would be expanded in a full implementation
        }
        catch (error) {
            console.error('Error processing WebSocket message:', error);
        }
    });
    ws.on('close', () => {
        console.log('Client disconnected from WebSocket');
    });
});
// Start the server
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`- Static files from: ${path_1.default.join(__dirname, '../../public')}`);
    console.log(`- API available at: http://localhost:${PORT}/api`);
});
//# sourceMappingURL=index.js.map