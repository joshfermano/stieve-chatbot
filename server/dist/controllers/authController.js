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
exports.verifyToken = exports.logout = exports.login = exports.register = void 0;
const Users_1 = __importDefault(require("../models/Users"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
// Get cookie settings based on environment
const getCookieOptions = () => {
    const isProduction = process.env.NODE_ENV === 'production';
    return {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000,
        path: '/',
    };
};
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    try {
        // Check if user already exists
        const isUserExists = yield Users_1.default.findOne({ $or: [{ username }, { email }] });
        if (isUserExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Create new user
        const user = yield Users_1.default.create({ username, email, password });
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ id: user._id, username: user.username, email: user.email }, process.env.ACCESS_TOKEN_SECRET || 'fallback_secret', { expiresIn: '1d' });
        // Set token in HTTP-only cookie
        res.cookie('token', token, getCookieOptions());
        // Return user info (without sensitive data)
        res.status(201).json({
            message: 'User registered successfully',
            user: {
                username: user.username,
                email: user.email,
            },
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Failed to register user' });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        // Check if user exists
        const user = yield Users_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' }); // Better security to use generic message
        }
        // Check if password is correct
        const isPasswordValid = yield user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ id: user._id, username: user.username, email: user.email }, process.env.ACCESS_TOKEN_SECRET || 'fallback_secret', { expiresIn: '1d' });
        // Set token in HTTP-only cookie
        res.cookie('token', token, getCookieOptions());
        // Return user info
        res.status(200).json({
            message: 'Login successful',
            user: {
                username: user.username,
                email: user.email,
            },
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Failed to login' });
    }
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Clear the auth cookie
        res.clearCookie('token', Object.assign(Object.assign({}, getCookieOptions()), { maxAge: 0 }));
        res.status(200).json({ message: 'Logged out successfully' });
    }
    catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Failed to logout' });
    }
});
exports.logout = logout;
const verifyToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // The user data is attached to req by the authenticate middleware
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: 'Authentication failed' });
        }
        // Return user data with the response
        res.status(200).json({
            username: user.username,
            email: user.email,
            valid: true,
        });
    }
    catch (error) {
        console.error('Error verifying token:', error);
        res.status(401).json({ message: 'Authentication failed' });
    }
});
exports.verifyToken = verifyToken;
