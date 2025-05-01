"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const optionalAuthMiddleware_1 = require("../middlewares/optionalAuthMiddleware");
const chatController_1 = require("../controllers/chatController");
const router = express_1.default.Router();
router.post('/message', optionalAuthMiddleware_1.optionalAuth, chatController_1.sendMessage);
exports.default = router;
