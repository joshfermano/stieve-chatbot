import { Router } from 'express';
import {
  getConversations,
  createConversation,
  deleteConversation,
  getConversationMessages,
} from '../controllers/conversationController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

// Apply authentication middleware to all conversation routes
router.use(authenticate);

// Conversation routes
router.get('/', getConversations);
router.post('/', createConversation);
router.delete('/:id', deleteConversation);
router.get('/:id/messages', getConversationMessages);

export default router;
