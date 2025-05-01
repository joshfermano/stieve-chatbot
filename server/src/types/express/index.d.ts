import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

interface UserPayload extends JwtPayload {
  id: string;
  username: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}
