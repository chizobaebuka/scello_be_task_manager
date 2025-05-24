import {
    createTask,
    deleteTaskById,
    findTaskById,
    getAllTasksByUser,
    updateTaskById,
    getTimeSpentOnTasks,
    getTaskCompletionReport,
} from '../repositories/task.repository';
import { CreateTaskInput, UpdateTaskInput } from '../interfaces/task.interface';
import { getPagination, getPaginationMeta } from '../interfaces/pagination.interface';

const createNewTask = async (data: CreateTaskInput) => {
    return await createTask(data);
};

const fetchAllTasks = async (userId: string, query: any) => {
    const { offset, limit, currentPage } = getPagination(query);
    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder === 'ASC' ? 'ASC' : 'DESC';

    const { count, rows } = await getAllTasksByUser(userId, offset, limit, sortBy, sortOrder);
    const pagination = getPaginationMeta(count, currentPage, limit, rows.length);

    return { pagination, items: rows };
};

const fetchTaskById = async (id: string, userId: string) => {
    const task = await findTaskById(id, userId);
    if (!task) throw new Error('Task not found');
    return task;
};

const modifyTask = async (
    id: string,
    updates: UpdateTaskInput,
    userId: string
) => {
    const updated = await updateTaskById(id, updates, userId);
    if (!updated) throw new Error('Task not found');
    return updated;
};

const removeTask = async (id: string, userId: string) => {
    const task = await deleteTaskById(id, userId);
    if (!task) throw new Error('Task not found');
    return task;
};

const fetchTimeSpentOnTasks = async (userId: string, startDate: string, endDate: string) => {
    const tasks = await getTimeSpentOnTasks(userId, startDate, endDate);

    const totalTimeSpent = tasks.reduce((total, task) => {
        const timeSpent = new Date(task.updatedAt).getTime() - new Date(task.createdAt).getTime();
        return total + timeSpent;
    }, 0);

    return {
        totalTimeSpent: `${Math.floor(totalTimeSpent / (1000 * 60 * 60))} hours`,
        tasks: tasks.map((task) => ({
            id: task.id,
            title: task.title,
            timeSpent: `${Math.floor((new Date(task.updatedAt).getTime() - new Date(task.createdAt).getTime()) / (1000 * 60 * 60))} hours`,
        })),
    };
};

const fetchTaskCompletionReport = async (userId: string) => {
    return await getTaskCompletionReport(userId);
};

export {
    createNewTask,
    fetchAllTasks,
    fetchTaskById,
    modifyTask,
    removeTask,
    fetchTimeSpentOnTasks,
    fetchTaskCompletionReport,
};