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
const gemini_1 = require("../config/gemini");
const gemini_2 = require("../config/gemini");
const Conversation_1 = __importDefault(require("../models/Conversation"));
function generateResponse(message) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield gemini_2.model.generateContent(message);
            const response = yield result.response;
            return response.text();
        }
        catch (error) {
            console.error('Error generating AI response:', error);
            throw new Error('Failed to generate response');
        }
    });
}
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { message, conversationId } = req.body;
        // Handle guest mode
        if (conversationId === 'guest') {
            try {
                const text = yield (0, gemini_1.generateSafeResponse)(message);
                res.json({
                    response: text,
                    conversationId: 'guest',
                    success: true,
                });
            }
            catch (error) {
                console.error('Error in guest chat:', error);
                res.status(500).json({
                    message: 'Failed to generate response',
                    success: false,
                });
            }
            return;
        }
        // For authenticated users
        if (!req.user || !req.user.id) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        let conversation = yield Conversation_1.default.findOne({
            _id: conversationId,
            userId: req.user.id,
        });
        if (!conversation) {
            res.status(404).json({ message: 'Conversation not found' });
            return;
        }
        // Update conversation title for first message
        if (conversation.messages.length === 0) {
            conversation.title =
                message.length > 50 ? `${message.slice(0, 50)}...` : message;
        }
        // Add user message
        conversation.messages.push({
            role: 'user',
            content: message,
        });
        // Generate and add AI response
        const text = yield (0, gemini_1.generateSafeResponse)(message);
        conversation.messages.push({
            role: 'model',
            content: text,
        });
        yield conversation.save();
        res.json({
            response: text,
            title: conversation.title,
            conversationId: conversation._id,
        });
    }
    catch (error) {
        console.error('Error in sendMessage:', error);
        res.status(500).json({
            message: 'Failed to process message',
            success: false,
        });
    }
});
exports.sendMessage = sendMessage;
