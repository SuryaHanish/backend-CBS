"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBlog = void 0;
//validation/contentValidation.ts
const express_validator_1 = require("express-validator");
exports.validateBlog = [
    (0, express_validator_1.body)('title').notEmpty().withMessage('Title is required'),
    (0, express_validator_1.body)('content').notEmpty().withMessage('Content is required'),
    (0, express_validator_1.body)('category').notEmpty().withMessage('Category is required'),
];
