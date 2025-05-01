"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// Create the schema
const userSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        minlength: 8,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});
// Middlewares
// Hash password before saving
userSchema.pre('save', async function (next) {
    const hash = await bcryptjs_1.default.hash(this.password, 10);
    this.password = hash;
    next();
});
// Compare password
userSchema.methods.comparePassword = async function (password) {
    const isValid = await bcryptjs_1.default.compare(password, this.password);
    return isValid;
};
// Check if user exists
userSchema.statics.userExists = async function (username, email) {
    const user = await this.findOne({
        $or: [{ username }, { email }],
    });
    return !!user;
};
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
