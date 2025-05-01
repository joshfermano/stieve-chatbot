import express, { RequestHandler } from 'express';
import { optionalAuth } from '../middlewares/optionalAuthMiddleware';
import { sendMessage } from '../controllers/chatController';

const router = express.Router();

router.post(
  '/message',
  optionalAuth as unknown as RequestHandler,
  sendMessage as unknown as RequestHandler
);

export default router;
