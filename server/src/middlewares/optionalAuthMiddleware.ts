import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  id: string;
  username: string;
  email: string;
}

export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return next();
    }

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET || 'fallback_secret'
    ) as JwtPayload;

    req.user = decoded;
    next();
  } catch (error) {
    console.error('Optional auth error:', error);
    next();
  }
};
