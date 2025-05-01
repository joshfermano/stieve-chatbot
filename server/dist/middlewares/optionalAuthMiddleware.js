"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Optional auth middleware - allows requests without a token
const optionalAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.token;
        // If no token, just continue without setting user
        if (!token) {
            return next();
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET || 'fallback_secret');
            req.user = decoded;
        }
        catch (jwtError) {
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
    }
    catch (error) {
        console.error('Optional auth error:', error);
        next(); // Proceed anyway since this is optional auth
    }
});
exports.optionalAuth = optionalAuth;
