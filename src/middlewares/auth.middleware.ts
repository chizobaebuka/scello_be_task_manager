import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { AuthPayload } from '../interfaces';

declare global {
    namespace Express {
        interface Request {
            user?: AuthPayload;
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const token = authHeader.split(' ')[1];

        const decoded = verifyToken(token) as AuthPayload;
        req.user = decoded;

        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

export const authorize = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(403).json({ message: 'Forbidden' });
            return;
        }

        const userRole = req.user.role;

        if (!roles.includes(userRole)) {
            res.status(403).json({ message: 'Forbidden' });
            return;
        }

        next();
    };
}

// Allows access when the caller is acting on their own resource (req.params.id
// matches the authenticated user) OR holds one of the given roles (e.g. admin).
export const authorizeSelfOrRole = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const isSelf = req.user.userId === req.params.id;
        const hasRole = roles.includes(req.user.role);

        if (!isSelf && !hasRole) {
            res.status(403).json({ message: 'Forbidden' });
            return;
        }

        next();
    };
}