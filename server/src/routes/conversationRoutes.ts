import express, { RequestHandler } from 'express';
import { authenticate } from '../middlewares/authMiddleware';
import {
  getConversations,
  createConversation,
  deleteConversation,
  getConversationMessages,
} from '../controllers/conversationController';

const router = express.Router();

// All conversation routes require authentication
router.use(authenticate as unknown as RequestHandler);

router.get('/', getConversations as unknown as RequestHandler);
router.post('/', createConversation as unknown as RequestHandler);
router.delete('/:id', deleteConversation as unknown as RequestHandler);
router.get(
  '/:id/messages',
  getConversationMessages as unknown as RequestHandler
);

export default router;
