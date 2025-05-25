import { NextFunction, Request, Response } from 'express';
import {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
    getTimeSpentOnTasks,
    getTaskCompletionReport,
} from '../../src/controllers/task.controller';
import { AuthPayload } from '../../src/interfaces';
import * as taskService from '../../src/services/task.service';
import Task from '../../src/models/task';
import request from 'supertest';
import app from '../../src/app'; // Assuming your Express app is exported from this file
import { signToken } from '../../src/utils/jwt';

// Extend the Request type to include the `user` property
declare global {
    namespace Express {
        interface Request {
            user?: AuthPayload;
        }
    }
}

jest.mock('../../src/services/task.service.ts');

jest.mock('../../src/middlewares/auth.middleware.ts', () => ({
    authenticate: (req: Request, res: Response, next: NextFunction) => {
        req.user = { userId: 'user-123', email: 'user@example.com', role: 'user' }; // Mock user
        next();
    },
}));

const mockToken = signToken({
    userId: 'user-123',
    email: 'user@example.com',
    role: 'user',
})

describe('Task Controller', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        req = {
            body: {},
            params: {},
            query: {},
            user: {
                userId: 'user-123',
                email: 'user1@example.com',
                role: 'user',
            } as AuthPayload, // Mock user object
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    describe('createTask', () => {
        it('should return 400 when title is missing', async () => {
            req.body = {
                description: 'Test Description',
                status: 'pending'
            };

            await createTask(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                message: expect.any(String)
            }));
        });

        it('should return 400 when status is invalid', async () => {
            req.body = {
                title: 'Test Task',
                description: 'Test Description',
                status: 'invalid_status'
            };

            await createTask(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                message: expect.any(String)
            }));
        });

        it('should return 400 when user is not authenticated', async () => {
            req.user = undefined;
            req.body = {
                title: 'Test Task',
                description: 'Test Description',
                status: 'pending'
            };

            await createTask(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                message: expect.any(String)
            }));
        });

        it('should return 400 when title exceeds maximum length', async () => {
            req.body = {
                title: 'a'.repeat(101),
                description: 'Test Description',
                status: 'pending'
            };

            await createTask(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                message: expect.any(String)
            }));
        });
    });

    describe('getTasks', () => {
        it('should fetch tasks and return 200 status', async () => {
            const mockTasks = {
                pagination: {
                    totalItems: 0,
                    totalPages: 0,
                    currentPage: 1,
                    currentItems: 0,
                    hasNext: false,
                    nextPage: null,
                    prevPage: null,
                    limit: 10,
                    hasPrevious: false,
                },
                items: [] as Task[],
            };

            jest.spyOn(taskService, 'fetchAllTasks').mockResolvedValue(mockTasks);

            req.query = { page: '1', size: '10' };
            req.user = {
                userId: 'user1',
                email: 'user1@example.com',
                role: 'user',
            };

            await getTasks(req as Request, res as Response);

            expect(taskService.fetchAllTasks).toHaveBeenCalledWith('user1', req.query);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Tasks fetched', ...mockTasks });
        });
    });

    describe('getTaskById', () => {
        it('should fetch a task by ID and return 200 status', async () => {
            const mockTask = {
                id: '1',
                title: 'Test Task',
                description: 'Test Description',
                status: 'pending',
                userId: 'user1',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            } as unknown as Task;
            jest.spyOn(taskService, 'fetchTaskById').mockResolvedValue(mockTask);

            req.params = { id: '1' };
            req.user = { userId: 'user1', email: 'user1@example.com', role: 'user' };

            await getTaskById(req as Request, res as Response);

            expect(taskService.fetchTaskById).toHaveBeenCalledWith('1', 'user1');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Task fetched', task: mockTask });
        });
    });

    describe('updateTask', () => {
        it('should update a task and return 200 status', async () => {
            const mockTask = {
                id: '1',
                title: 'Updated Task',
                description: 'Updated Description',
                status: 'completed',
                userId: 'user1',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            } as unknown as Task;
            jest.spyOn(taskService, 'modifyTask').mockResolvedValue(mockTask);

            req.params = { id: '1' };
            req.body = { title: 'Updated Task', description: 'Updated Description', status: 'completed' };
            req.user = { userId: 'user1', email: 'user1@example.com', role: 'user' };

            await updateTask(req as Request, res as Response);

            expect(taskService.modifyTask).toHaveBeenCalledWith('1', { title: 'Updated Task', description: 'Updated Description', status: 'completed' }, 'user1');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Task updated', task: mockTask });
        });
    });

    describe('deleteTask', () => {
        it('should delete a task and return 200 status with a message', async () => {
            jest.spyOn(taskService, 'removeTask').mockResolvedValue({
                id: '1',
                title: 'Deleted Task',
                description: 'Deleted Description',
                status: 'deleted',
                userId: 'user1',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            } as unknown as Task);

            req.params = { id: '1' };
            req.user = { userId: 'user1', email: 'user1@example.com', role: 'user' };

            await deleteTask(req as Request, res as Response);

            expect(taskService.removeTask).toHaveBeenCalledWith('1', 'user1');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Task deleted successfully' });
        });
    });

    describe('getTimeSpentOnTasks', () => {
        it('should fetch time spent on tasks and return 200 status', async () => {
            const mockResult = { totalTimeSpent: '5 hours', tasks: [] };
            jest.spyOn(taskService, 'fetchTimeSpentOnTasks').mockResolvedValue(mockResult);

            req.query = { startDate: '2023-01-01', endDate: '2023-01-31' };
            req.user = { userId: 'user1', email: 'user1@example.com', role: 'user' };

            await getTimeSpentOnTasks(req as Request, res as Response);

            expect(taskService.fetchTimeSpentOnTasks).toHaveBeenCalledWith('user1', '2023-01-01', '2023-01-31');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Time spent on tasks fetched', ...mockResult });
        });
    });

    describe('getTaskCompletionReport', () => {
        it('should fetch task completion report and return 200 status', async () => {
            const mockReport = { totalTasks: 10, completedTasks: 7, completionRate: '70%' };
            jest.spyOn(taskService, 'fetchTaskCompletionReport').mockResolvedValue(mockReport);

            req.user = { userId: 'user1', email: 'user1@example.com', role: 'user' };

            await getTaskCompletionReport(req as Request, res as Response);

            expect(taskService.fetchTaskCompletionReport).toHaveBeenCalledWith('user1');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Task completion report fetched', ...mockReport });
        });
    });
});

// import request from 'supertest';
// import app from '../../src/app';
// import * as taskService from '../../src/services/task.service';
// import { signToken } from '../../src/utils/jwt';

// jest.mock('../../src/services/task.service');

// const mockUser = {
//     id: 'user-123',
//     name: 'John Doe',
//     email: 'john.doe@example.com',
//     role: 'user',
//     createdAt: new Date().toISOString(),
// };

// const mockToken = signToken(
//     mockUser,
//     { expiresIn: '1h' }
// );

// describe('Task Controller - API Endpoints', () => {
//     describe('POST /api/v1/tasks/create', () => {
//         it('should create a task and return 201 status', async () => {
//             const taskData = {
//                 title: 'Test Task',
//                 description: 'This is a test task',
//                 status: 'pending',
//             };

//             const mockTask = {
//                 id: 'task-123',
//                 ...taskData,
//                 userId: 'user-123',
//                 createdAt: new Date().toISOString(),
//                 updatedAt: new Date().toISOString(),
//             };

//             (taskService.createNewTask as jest.Mock).mockResolvedValue(mockTask);

//             const response = await request(app)
//                 .post('/api/v1/tasks/create')
//                 .set('Authorization', `Bearer ${mockToken}`) // Mock token
//                 .send(taskData)
//                 .expect(201);

//             expect(taskService.createNewTask).toHaveBeenCalledWith({
//                 ...taskData,
//                 userId: mockUser.id,
//             });
//             expect(response.body).toEqual({
//                 message: 'Task created successfully',
//                 task: mockTask,
//             });
//         });

//         it('should return 400 when required fields are missing', async () => {
//             const invalidTaskData = {
//                 description: 'This is a test task without a title',
//             };

//             const response = await request(app)
//                 .post('/api/v1/tasks/create')
//                 .set('Authorization', `Bearer some-valid-token`)
//                 .send(invalidTaskData)
//                 .expect(400);

//             expect(response.body).toEqual({
//                 message: 'Required fields are missing or invalid',
//             });
//         });
//     });

//     // Additional tests for other endpoints can be added here
// })