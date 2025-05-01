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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const chatRoutes_1 = __importDefault(require("./routes/chatRoutes"));
const conversationRoutes_1 = __importDefault(require("./routes/conversationRoutes"));
const db_1 = require("./config/db");
require("dotenv/config");
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const app = (0, express_1.default)();
const allowedOrigins = [
    'https://stieve-chatbot.vercel.app',
    'https://stieve-chatbot-git-main-josh-khovick-fermanos-projects.vercel.app',
    'https://stieve-chatbot-im374hg6x-josh-khovick-fermanos-projects.vercel.app',
    CLIENT_URL,
    'http://localhost:5173',
];
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin) || NODE_ENV === 'development') {
            callback(null, true);
        }
        else {
            console.log('Blocked by CORS:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: [
        'Access-Control-Allow-Origin',
        'Access-Control-Allow-Credentials',
    ],
    optionsSuccessStatus: 200,
}));
app.options('*', (0, cors_1.default)());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/chats', chatRoutes_1.default);
app.use('/api/conversations', conversationRoutes_1.default);
// Simple health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', environment: NODE_ENV });
});
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isConnected = yield (0, db_1.connectDb)();
        if (!isConnected) {
            console.error('❌ Failed to start: MongoDB connection unsuccessful');
            process.exit(1);
        }
        else {
            console.log('✅ MongoDB connection successful');
        }
        app.listen(PORT, () => {
            console.log(`✨ Server running in ${NODE_ENV} mode on port: ${PORT}`);
            console.log(`🌐 CORS enabled for origins: ${allowedOrigins.join(', ')}`);
        });
    }
    catch (error) {
        console.error('❌ Server startup failed:', error);
        process.exit(1);
    }
});
startServer();
exports.default = app;
