import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from cookies
    const token = req.cookies?.token;

    if (!token) {
      return next();
    }

    // Verify token
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || '');

      // Attach user data to request
      req.user = decoded as jwt.JwtPayload;
    } catch (jwtError) {
      // In case of invalid token, clear it but continue
      if (
        jwtError instanceof jwt.TokenExpiredError ||
        jwtError instanceof jwt.JsonWebTokenError
      ) {
        res.clearCookie('token', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
        });
      }
    }

    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    next();
  }
};
