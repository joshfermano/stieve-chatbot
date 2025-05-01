import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload | { id: string; email: string; username: string };
    }
  }
}

export {};
