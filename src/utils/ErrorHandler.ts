// utils/errorhandler.ts
class ErrorHandler extends Error {
    public statusCode: number;
    public errors?: any;
    public path?: string;  // MongoDB's error properties
    public keyValue?: any;
    public code?: number;
  
    constructor(message: string, statusCode: number, errors?: any) {
      super(message);
      this.statusCode = statusCode;
      this.errors = errors;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  export default ErrorHandler;
  