"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const messageSchema = new mongoose_1.default.Schema({
    role: {
        type: String,
        enum: ['user', 'model'],
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});
const conversationSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    messages: [messageSchema],
}, { timestamps: true });
const Conversation = mongoose_1.default.model('Conversation', conversationSchema);
exports.default = Conversation;
