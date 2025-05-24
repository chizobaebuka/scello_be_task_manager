import express from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { createUser, deleteUser, getUserById, getUsers, loginUser, updateUser } from '../controllers/user.controller';


/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API endpoints to manage users
 */

const router = express.Router();

router.post('/create', createUser);
router.post('/login', loginUser)
router.get('/', authenticate, getUsers);
router.get('/:id', authenticate, getUserById);
router.put('/:id', authenticate, updateUser);
router.delete('/:id', authenticate, deleteUser);

export default router;