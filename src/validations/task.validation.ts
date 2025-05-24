import { z } from 'zod';
import { TaskStatus } from '../models/task';

// Create Task
export const createTaskSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    status: z.nativeEnum(TaskStatus).optional(), // Default to pending in model
    userId: z.string().uuid("Invalid user ID"), // Assuming userId is a UUID attached from req
});

// Update Task
export const updateTaskSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    status: z.nativeEnum(TaskStatus).optional(),
});
