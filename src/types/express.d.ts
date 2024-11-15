import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: string; // Custom property to store user info after authentication
    }
  }
}
