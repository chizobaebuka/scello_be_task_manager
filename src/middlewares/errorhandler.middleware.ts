import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

// Error handling middleware
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Error:', err);

    if (res.headersSent) {
        return next(err);
    }

    res.status(err.status || 500).json({
        message: err.message || 'Something went wrong',
    });
};

export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    skip: (req) =>
        req.path === '/health' ||
        req.path === '/api-doc' ||
        req.path.startsWith('/swagger'),
});