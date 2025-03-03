"use strict";
/**
 * MI-Dojo - Main Entry Point
 *
 * This is the main entry point for the MI-Dojo application.
 * It exports both the server and CLI functionality.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runDemo = void 0;
// Re-export flows for Genkit CLI
__exportStar(require("./genkit"), exports);
// Export demo function
var cli_1 = require("./cli");
Object.defineProperty(exports, "runDemo", { enumerable: true, get: function () { return __importDefault(cli_1).default; } });
// Import server
require("./server");
//# sourceMappingURL=index.js.map