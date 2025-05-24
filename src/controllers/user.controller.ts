import { Request, Response } from 'express';
import {
    createNewUser,
    fetchUsers,
    fetchUserById,
    modifyUser,
    removeUser,
    loginUserService,
} from '../services/user.service';
import { loginSchema, registerSchema, updateUserSchema } from '../validations/user.validation';

export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const parsed = registerSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({ message: parsed.error.errors[0].message });
            return;
        }

        const user = await createNewUser(parsed.data);
        res.status(201).json({ message: 'User created', user });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const validatedData = loginSchema.safeParse(req.body);
        if (!validatedData.success) {
            res.status(400).json({ message: validatedData.error.errors[0].message });
            return;
        }

        const { email, password } = validatedData.data;

        const { user, token } = await loginUserService(email, password);

        res.status(200).json({
            message: 'Login successful',
            data: {
                user,
                token
            }
        });
    } catch (error: any) {
        if (error.message === 'User not found') {
            res.status(404).json({ message: error.message });
        } else if (error.message === 'Invalid password') {
            res.status(401).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await fetchUsers(req.query);
        res.status(200).json({
            message: 'Users fetched',
            data: {
                ...result
            }
        });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const user = await fetchUserById(id);
        res.status(200).json({
            message: 'User fetched',
            data: user
        });
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const parsed = updateUserSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({ message: parsed.error.errors[0].message });
            return;
        }

        const updated = await modifyUser(id, parsed.data);
        res.status(200).json({
            message: 'User updated',
            data: updated
        });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        await removeUser(id);
        res.status(200).json({
            message: 'User deleted'
        });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};