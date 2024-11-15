"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// utils/errorhandler.ts
class ErrorHandler extends Error {
    constructor(message, statusCode, errors) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.default = ErrorHandler;
