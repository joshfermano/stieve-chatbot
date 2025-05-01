"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chatController_1 = require("../controllers/chatController");
const optionalAuthMiddleware_1 = require("../middlewares/optionalAuthMiddleware");
const router = (0, express_1.Router)();
// Chat routes
router.post('/send', optionalAuthMiddleware_1.optionalAuth, chatController_1.sendMessage);
exports.default = router;
