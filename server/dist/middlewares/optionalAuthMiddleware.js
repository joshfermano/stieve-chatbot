"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const optionalAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            // Allow request to continue without authentication
            return next();
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET || 'fallback_secret');
        req.user = decoded;
        next();
    }
    catch (error) {
        // Even if token is invalid, allow request to continue
        console.error('Optional auth error:', error);
        next();
    }
};
exports.optionalAuth = optionalAuth;
