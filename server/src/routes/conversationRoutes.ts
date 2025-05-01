import express, { RequestHandler } from 'express';
import { authenticate } from '../middlewares/authMiddleware';
import {
  getConversations,
  createConversation,
  deleteConversation,
  getConversationMessages,
} from '../controllers/conversationController';

const router = express.Router();

router.use(authenticate as RequestHandler);

router.get('/', getConversations as RequestHandler);
router.post('/', createConversation as RequestHandler);
router.delete('/:id', deleteConversation as RequestHandler);
router.get('/:id/messages', getConversationMessages as RequestHandler);

export default router;
