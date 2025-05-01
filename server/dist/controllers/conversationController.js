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
exports.deleteConversation = exports.getConversationMessages = exports.createConversation = exports.getConversations = void 0;
const Conversation_1 = __importDefault(require("../models/Conversation"));
const getConversations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const conversations = yield Conversation_1.default.find({ userId: req.user.id })
            .select('_id title createdAt updatedAt')
            .sort({ updatedAt: -1 });
        return res.json(conversations);
    }
    catch (error) {
        console.error('Error fetching conversations:', error);
        return res.status(500).json({ message: 'Failed to fetch conversations' });
    }
});
exports.getConversations = getConversations;
/**
 * Create a new conversation
 */
const createConversation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { title } = req.body;
        const conversation = yield Conversation_1.default.create({
            title: title || 'New Conversation',
            userId: req.user.id,
            messages: [],
        });
        return res.status(201).json({
            _id: conversation._id,
            title: conversation.title,
            createdAt: conversation.createdAt,
            updatedAt: conversation.updatedAt,
        });
    }
    catch (error) {
        console.error('Error creating conversation:', error);
        return res.status(500).json({ message: 'Failed to create conversation' });
    }
});
exports.createConversation = createConversation;
/**
 * Get messages for a specific conversation
 */
const getConversationMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { id } = req.params;
        const conversation = yield Conversation_1.default.findOne({
            _id: id,
            userId: req.user.id,
        });
        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }
        return res.json({ messages: conversation.messages });
    }
    catch (error) {
        console.error('Error fetching conversation messages:', error);
        return res
            .status(500)
            .json({ message: 'Failed to fetch conversation messages' });
    }
});
exports.getConversationMessages = getConversationMessages;
/**
 * Delete a conversation
 */
const deleteConversation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { id } = req.params;
        const result = yield Conversation_1.default.deleteOne({
            _id: id,
            userId: req.user.id,
        });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Conversation not found' });
        }
        return res.json({ message: 'Conversation deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting conversation:', error);
        return res.status(500).json({ message: 'Failed to delete conversation' });
    }
});
exports.deleteConversation = deleteConversation;
