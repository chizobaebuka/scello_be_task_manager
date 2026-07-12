import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { logger } from '../utils/logger';

// Error handling middleware
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    logger.error({ err, path: req.path, method: req.method }, 'Unhandled request error');

    if (res.headersSent) {
        return next(err);
    }

    res.status(err.status || 500).json({
        message: err.message || 'Something went wrong',
    });
};

export const apiLimiter = rateLimit({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: Number(process.env.RATE_LIMIT_MAX) || 100,
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) =>
        req.path === '/health' ||
        req.path === '/health/ready' ||
        req.path === '/api-doc' ||
        req.path.startsWith('/swagger'),
});

// Tighter limit for auth endpoints to slow down credential stuffing / brute force.
export const authLimiter = rateLimit({
    windowMs: Number(process.env.AUTH_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: Number(process.env.AUTH_RATE_LIMIT_MAX) || 20,
    standardHeaders: true,
    legacyHeaders: false,
});