"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    res.status(500).json({
        message: 'Server error',
        error: process.env.NODE_ENV === 'development'
            ? err.message
            : 'Internal server error',
    });
};
exports.errorHandler = errorHandler;
