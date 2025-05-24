import { z } from 'zod';
import { UserRole } from '../models/user';

// Register validator
export const registerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.nativeEnum(UserRole).optional(),
});

// Login validator
export const loginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(1, "Password is required"),
});

// Optional user role schema (admin operations)
export const optionalUserRoleSchema = z.object({
    role: z.nativeEnum(UserRole).optional(),
});

// Update user (admin only or self-service)
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


