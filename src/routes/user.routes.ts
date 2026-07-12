import express from 'express';
import { authenticate, authorize, authorizeSelfOrRole } from '../middlewares/auth.middleware';
import { authLimiter } from '../middlewares/errorhandler.middleware';
import { createUser, deleteUser, getUserById, getUsers, loginUser, updateUser } from '../controllers/user.controller';


/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API endpoints to manage users
 */

const router = express.Router();

router.post('/create', authLimiter, createUser);
router.post('/login', authLimiter, loginUser);
router.get('/', authenticate, authorize(['admin']), getUsers);
router.get('/:id', authenticate, authorizeSelfOrRole(['admin']), getUserById);
router.put('/:id', authenticate, authorizeSelfOrRole(['admin']), updateUser);
router.delete('/:id', authenticate, authorizeSelfOrRole(['admin']), deleteUser);

export default router;