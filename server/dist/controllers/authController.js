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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Users_1 = __importDefault(require("../models/Users"));
require("dotenv/config");
const getCookieOptions = () => {
    const cookieOptions = {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        sameSite: 'lax',
    };
    if (process.env.NODE_ENV === 'production') {
        cookieOptions.secure = true;
    }
    return cookieOptions;
};
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        // Check if user already exists
        const existingUser = yield Users_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Hash password
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        // Create user
        const user = yield Users_1.default.create({
            username,
            email,
            password: hashedPassword,
        });
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email, username: user.username }, process.env.ACCESS_TOKEN_SECRET || '', {
            expiresIn: '7d',
        });
        res.cookie('token', token, getCookieOptions());
        // Send response
        res.status(201).json({
            id: user._id,
            username: user.username,
            email: user.email,
        });
    }
    catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Failed to register user' });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Find user
        const user = yield Users_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' }); // Better security to use generic message
        }
        // Check password
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email, username: user.username }, process.env.ACCESS_TOKEN_SECRET || '', { expiresIn: '7d' });
        res.cookie('token', token, getCookieOptions());
        // Send response
        res.status(200).json({
            id: user._id,
            username: user.username,
            email: user.email,
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Failed to login' });
    }
});
exports.login = login;
const logout = (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        });
        res.status(200).json({ message: 'Logged out successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to logout' });
    }
};
exports.logout = logout;
const verifyToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    }
    catch (error) {
        res.status(401).json({ message: 'Authentication failed' });
    }
});
exports.verifyToken = verifyToken;
