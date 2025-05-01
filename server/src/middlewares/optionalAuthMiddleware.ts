import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  id: string;
  username: string;
  email: string;
}

// Optional auth middleware - allows requests without a token
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;

    // If no token, just continue without setting user
    if (!token) {
      return next();
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET || 'fallback_secret'
      );

      (req as any).user = decoded;
    } catch (jwtError) {
      // Clear invalid token but don't block the request
      console.error('JWT verification error in optional auth:', jwtError);
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/',
      });
    }

    next();
  } catch (error) {
    console.error('Optional auth error:', error);
    next(); // Proceed anyway since this is optional auth
  }
};
