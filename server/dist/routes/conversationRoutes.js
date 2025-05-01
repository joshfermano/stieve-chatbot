"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const conversationController_1 = require("../controllers/conversationController");
const router = express_1.default.Router();
// All conversation routes require authentication
router.use(authMiddleware_1.authenticate);
router.get('/', conversationController_1.getConversations);
router.post('/', conversationController_1.createConversation);
router.delete('/:id', conversationController_1.deleteConversation);
router.get('/:id/messages', conversationController_1.getConversationMessages);
exports.default = router;
