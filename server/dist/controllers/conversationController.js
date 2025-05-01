"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteConversation = exports.getConversationMessages = exports.createConversation = exports.getConversations = void 0;
const Conversation_1 = __importDefault(require("../models/Conversation"));
const getConversations = async (req, res) => {
    try {
        const userId = req.user.id;
        const conversations = await Conversation_1.default.find({ userId })
            .sort({ updatedAt: -1 })
            .select('title createdAt updatedAt')
            .lean();
        const formattedConversations = conversations.map((conv) => ({
            id: conv._id.toString(),
            title: conv.title,
            timestamp: conv.updatedAt || conv.createdAt,
        }));
        res.json(formattedConversations);
    }
    catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({ message: 'Failed to fetch conversations' });
    }
};
exports.getConversations = getConversations;
const createConversation = async (req, res) => {
    try {
        const userId = req.user.id;
        const { title } = req.body;
        console.log('Creating conversation for user:', userId, 'with title:', title);
        const conversation = await Conversation_1.default.create({
            userId,
            title: title || 'New Chat',
            messages: [],
        });
        console.log('Conversation created:', conversation._id);
        res.status(201).json({
            id: conversation._id.toString(),
            title: conversation.title,
            timestamp: conversation.createdAt,
        });
    }
    catch (error) {
        console.error('Error creating conversation:', error);
        res.status(500).json({ message: 'Failed to create conversation' });
    }
};
exports.createConversation = createConversation;
const getConversationMessages = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const conversation = await Conversation_1.default.findOne({
            _id: id,
            userId,
        });
        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }
        res.json({ messages: conversation.messages });
    }
    catch (error) {
        console.error('Error fetching conversation messages:', error);
        res.status(500).json({ message: 'Failed to fetch conversation messages' });
    }
};
exports.getConversationMessages = getConversationMessages;
const deleteConversation = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        console.log('Deleting conversation:', id, 'for user:', userId);
        const conversation = await Conversation_1.default.findOneAndDelete({
            _id: id,
            userId,
        });
        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }
        res.json({ message: 'Conversation deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting conversation:', error);
        res.status(500).json({ message: 'Failed to delete conversation' });
    }
};
exports.deleteConversation = deleteConversation;
