import { Router } from 'express';
import { sendMessage } from '../controllers/chatController';
import { optionalAuth } from '../middlewares/optionalAuthMiddleware';

const router = Router();

// Chat routes
router.post('/send', optionalAuth, sendMessage);

export default router;
