import { Router } from 'express';
import {
  register,
  login,
  verifyToken,
  logout,
} from '../controllers/authController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

// Auth routes
router.post('/register', register);
router.post('/login', login);
router.get('/verify', authenticate, verifyToken);
router.post('/logout', logout);

export default router;
