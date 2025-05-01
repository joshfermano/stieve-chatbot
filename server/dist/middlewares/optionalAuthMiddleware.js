"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const optionalAuth = (req, res, next) => {
    var _a;
    try {
        // Get token from cookies
        const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token;
        if (!token) {
            return next();
        }
        // Verify token
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET || '');
            // Attach user data to request
            req.user = decoded;
        }
        catch (jwtError) {
            // In case of invalid token, clear it but continue
            if (jwtError instanceof jsonwebtoken_1.default.TokenExpiredError ||
                jwtError instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                res.clearCookie('token', {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                });
            }
        }
        next();
    }
    catch (error) {
        console.error('Optional auth middleware error:', error);
        next();
    }
};
exports.optionalAuth = optionalAuth;
