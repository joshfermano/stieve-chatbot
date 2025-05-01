import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  id: string;
  username: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET || 'fallback_secret'
      ) as JwtPayload;

      req.user = decoded;
      next();
    } catch (jwtError) {
      // Clear the invalid token cookie
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/',
      });

      console.error('JWT verification error:', jwtError);
      return res.status(401).json({ message: 'Invalid token' });
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ message: 'Authentication failed' });
  }
};
