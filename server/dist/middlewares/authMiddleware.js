"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const authenticate = (req, res, next) => {
    var _a;
    try {
        // Get token from cookies
        const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token;
        // Check if token exists
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        // Verify token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET || '');
        // Attach user data to request
        req.user = decoded;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            // Clear expired cookie
            res.clearCookie('token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
            });
            return res.status(401).json({ message: 'Token expired' });
        }
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        console.error('Auth middleware error:', error);
        return res.status(500).json({ message: 'Authentication failed' });
    }
};
exports.authenticate = authenticate;
