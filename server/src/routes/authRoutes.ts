import express, { RequestHandler } from 'express';
import {
  register,
  login,
  verifyToken,
  logout,
} from '../controllers/authController';
import { authenticate } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/register', register as unknown as RequestHandler);
router.post('/login', login as unknown as RequestHandler);
router.get(
  '/verify',
  authenticate as unknown as RequestHandler,
  verifyToken as unknown as RequestHandler
);
router.post('/logout', logout as unknown as RequestHandler);

export default router;
