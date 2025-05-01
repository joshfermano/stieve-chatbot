import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User from '../models/Users';
import 'dotenv/config';

interface RegisterRequestBody {
  username: string;
  email: string;
  password: string;
}

interface LoginRequestBody {
  email: string;
  password: string;
}

const getCookieOptions = () => {
  const cookieOptions: any = {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    sameSite: 'lax',
  };

  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true;
  }

  return cookieOptions;
};

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body as RegisterRequestBody;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, username: user.username },
      process.env.ACCESS_TOKEN_SECRET || '',
      {
        expiresIn: '7d',
      }
    );

    res.cookie('token', token, getCookieOptions());

    // Send response
    res.status(201).json({
      id: user._id,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Failed to register user' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as LoginRequestBody;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' }); // Better security to use generic message
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, username: user.username },
      process.env.ACCESS_TOKEN_SECRET || '',
      { expiresIn: '7d' }
    );

    res.cookie('token', token, getCookieOptions());

    // Send response
    res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Failed to login' });
  }
};

export const logout = (req: Request, res: Response) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to logout' });
  }
};

export const verifyToken = async (req: Request, res: Response) => {
  try {
    // User should be attached by auth middleware
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    // Send the user data
    res.status(200).json({
      user: req.user,
      authenticated: true,
    });
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};
