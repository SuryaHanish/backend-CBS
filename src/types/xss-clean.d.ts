// src/types/xss-clean.d.ts
declare module 'xss-clean' {
    import { Request, Response, NextFunction } from 'express';
    
    // Properly declare the middleware as a default export
    const xssClean: (req: Request, res: Response, next: NextFunction) => void;

    export default xssClean;
}
