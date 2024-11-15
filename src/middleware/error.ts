// middleware/error.ts
import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";

const errorMiddleware = (
  err: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Set default error status and message
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // Handle validation errors (e.g., Mongoose validation errors)
  if (err.errors) {
    err.statusCode = 400;
    err.message = Object.values(err.errors)
      .map((value: any) => value.message)
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
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 400;
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 404;
    Error.captureStackTrace(this, this.constructor);
  }
}

export { BadRequestError, NotFoundError };

export default errorMiddleware;
