import { Request, Response } from 'express';
import { createTaskSchema, updateTaskSchema } from '../validations/task.validation';
import {
    createNewTask,
    fetchAllTasks,
    fetchTaskById,
    fetchTaskCompletionReport,
    fetchTimeSpentOnTasks,
    modifyTask,
    removeTask,

} from '../services/task.service';

export const createTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const parsed = createTaskSchema.safeParse({ ...req.body, userId: req.user?.userId });
        if (!parsed.success) {
            res.status(400).json({ message: parsed.error.errors[0].message });
            return;
        }

        const task = await createNewTask(parsed.data);
        res.status(201).json({ message: 'Task created', task });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getTasks = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await fetchAllTasks(req.user?.userId!, req.query);
        res.status(200).json({ message: 'Tasks fetched', ...result });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getTaskById = async (req: Request, res: Response): Promise<void> => {
    try {
        const task = await fetchTaskById(req.params.id, req.user?.userId!);
        res.status(200).json({ message: 'Task fetched', task });
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
};

export const updateTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const parsed = updateTaskSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({ message: parsed.error.errors[0].message });
            return;
        }

        const task = await modifyTask(req.params.id, parsed.data, req.user?.userId!);
        res.status(200).json({ message: 'Task updated', task });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
    try {
        await removeTask(req.params.id, req.user?.userId!);
        res.status(200).json({ message: 'Task deleted' });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getTimeSpentOnTasks = async (req: Request, res: Response): Promise<void> => {
    try {
        const { startDate, endDate } = req.query;
        if (!startDate || !endDate) {
            res.status(400).json({ message: 'startDate and endDate are required' });
            return;
        }

        const result = await fetchTimeSpentOnTasks(req.user?.userId!, startDate as string, endDate as string);
        res.status(200).json({ message: 'Time spent on tasks fetched', ...result });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getTaskCompletionReport = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await fetchTaskCompletionReport(req.user?.userId!);
        res.status(200).json({ message: 'Task completion report fetched', ...result });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};