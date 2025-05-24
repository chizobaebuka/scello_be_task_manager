import express from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { createTask, deleteTask, getTaskById, getTasks, updateTask, getTimeSpentOnTasks, getTaskCompletionReport } from '../controllers/task.controller';


/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: API endpoints to manage tasks
 */

const router = express.Router();

router.post('/create', authenticate, createTask);
router.get('/', authenticate, getTasks);
router.get('/:id', authenticate, getTaskById);
router.put('/:id', authenticate, updateTask);
router.delete('/:id', authenticate, deleteTask);
router.get('/report-time', authenticate, getTimeSpentOnTasks);
router.get('/report', authenticate, getTaskCompletionReport);

export default router;