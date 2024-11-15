"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = exports.BadRequestError = void 0;
const errorMiddleware = (err, req, res, next) => {
    // Set default error status and message
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    // Handle validation errors (e.g., Mongoose validation errors)
    if (err.errors) {
        err.statusCode = 400;
        err.message = Object.values(err.errors)
            .map((value) => value.message)
            .join(", ");
    }
    // Handle cast errors (e.g., invalid ObjectId)
    if (err.path) {
        err.statusCode = 400;
        err.message = `Resource not found. Invalid ${err.path}`;
    }
    // Handle duplicate key errors (e.g., duplicate value in a unique field)
    if (err.code === 11000) {
        err.statusCode = 400;
        err.message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    }
    // Send error response to the client
    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};
// middleware/error.ts
class BadRequestError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 400;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.BadRequestError = BadRequestError;
class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 404;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.NotFoundError = NotFoundError;
exports.default = errorMiddleware;
