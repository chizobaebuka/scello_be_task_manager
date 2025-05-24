import Task from '../models/task';
import { CreateTaskInput, UpdateTaskInput } from '../interfaces/task.interface';
import { Op } from 'sequelize';

export const createTask = async (data: CreateTaskInput) => {
    return await Task.create(data);
};

export const getAllTasksByUser = async (
    userId: string,
    offset: number,
    limit: number,
    sortBy: string,
    sortOrder: 'ASC' | 'DESC'
) => {
    return await Task.findAndCountAll({
        where: { userId },
        limit,
        offset,
        order: [[sortBy, sortOrder]],
    });
};

export const findTaskById = async (id: string, userId: string) => {
    return await Task.findOne({ where: { id, userId } });
};

export const updateTaskById = async (
    id: string,
    updates: UpdateTaskInput,
    userId: string
) => {
    const task = await findTaskById(id, userId);
    if (!task) return null;
    return await task.update(updates);
};

export const deleteTaskById = async (id: string, userId: string) => {
    const task = await findTaskById(id, userId);
    if (!task) return null;
    await task.destroy();
    return task;
};

export const getTimeSpentOnTasks = async (userId: string, startDate: string, endDate: string) => {
    return await Task.findAll({
        where: {
            userId,
            createdAt: {
                [Op.between]: [startDate, endDate],
            },
        },
        attributes: ['id', 'title', 'createdAt', 'updatedAt'],
    });
};

export const getTaskCompletionReport = async (userId: string) => {
    const totalTasks = await Task.count({ where: { userId } });
    const completedTasks = await Task.count({ where: { userId, status: 'completed' } });

    return {
        totalTasks,
        completedTasks,
        completionRate: totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(2) + '%' : '0%',
    };
};