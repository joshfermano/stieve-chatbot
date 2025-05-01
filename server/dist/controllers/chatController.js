"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = void 0;
const generative_ai_1 = require("@google/generative-ai");
const Conversation_1 = __importDefault(require("../models/Conversation"));
require("dotenv/config");
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { message, conversationId } = req.body;
        // Generate AI response
        try {
            const result = yield model.generateContent(message);
            const text = result.response.text();
            // If no conversation ID or user ID, just return the response
            if (!conversationId || !((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
                return res.json({
                    response: text,
                    success: true,
                });
            }
            // Otherwise, try to save to existing conversation
        }
        catch (aiError) {
            console.error('AI generation error:', aiError);
            return res.status(500).json({
                message: 'Failed to generate AI response',
                success: false,
            });
        }
        // Get or create conversation
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        // Try to find the conversation
        const conversation = yield Conversation_1.default.findOne({
            _id: conversationId,
            userId: req.user.id,
        });
        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }
        // Generate AI response
        const result = yield model.generateContent(message);
        const text = result.response.text();
        // Save the user message and AI response to the conversation
        conversation.messages.push({
            role: 'user',
            content: message,
            timestamp: new Date(),
        }, {
            role: 'assistant',
            content: text,
            timestamp: new Date(),
        });
        yield conversation.save();
        // Return the AI response
        return res.json({
            response: text,
            success: true,
            conversationId: conversation._id,
        });
    }
    catch (error) {
        console.error('Chat controller error:', error);
        return res.status(500).json({
            message: 'Failed to process chat message',
            success: false,
        });
    }
});
exports.sendMessage = sendMessage;
