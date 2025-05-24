import { z } from 'zod';
import { UserRole } from '../models/user';

export const registerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.nativeEnum(UserRole).optional(),
});

export const loginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(1, "Password is required"),
});

export const optionalUserRoleSchema = z.object({
    role: z.nativeEnum(UserRole).optional(),
});

export const updateUserSchema = z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
    role: z.nativeEnum(UserRole).optional(),
});

export const paginationQuerySchema = z.object({
    page: z.string().optional().transform(Number),
    limit: z.string().optional().transform(Number),
});


