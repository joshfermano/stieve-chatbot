"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const conversationController_1 = require("../controllers/conversationController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Apply authentication middleware to all conversation routes
router.use(authMiddleware_1.authenticate);
// Conversation routes
router.get('/', conversationController_1.getConversations);
router.post('/', conversationController_1.createConversation);
router.delete('/:id', conversationController_1.deleteConversation);
router.get('/:id/messages', conversationController_1.getConversationMessages);
exports.default = router;
