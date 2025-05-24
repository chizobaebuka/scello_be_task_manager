import '../config/env'; // Must come before anything else
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

const getJwtSecret = (): string => {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET is not defined in environment variables');
    return secret;
};

export const signToken = (
    payload: object,
    options: SignOptions = { expiresIn: '1d' }
): string => {
    return jwt.sign(payload, getJwtSecret(), options);
};

export const verifyToken = (
    token: string
): JwtPayload | string => {
    return jwt.verify(token, getJwtSecret());
};