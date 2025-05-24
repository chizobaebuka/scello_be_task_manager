import argon2 from 'argon2';
import {
    createUser,
    deleteUserById,
    findUserByEmail,
    findUserById,
    getAllUsers,
    updateUserById,
} from '../repositories/user.repository';
import { getPagination, getPaginationMeta } from '../interfaces/pagination.interface';
import { AuthPayload, CreateUserInput, LoginUserInput, UserResponse } from '../interfaces/user.interface';
import { signToken } from '../utils/jwt';

export const createNewUser = async (data: CreateUserInput) => {
    const existing = await findUserByEmail(data.email);
    if (existing) throw new Error('Email already in use');

    const hashedPassword = await argon2.hash(data.password);

    return await createUser({ ...data, password: hashedPassword });
};


export const loginUserService = async (email: string, password: string): Promise<{ user: UserResponse; token: string }> => {
    const user = await findUserByEmail(email);

    if (!user) {
        throw new Error('User not found');
    }

    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
        throw new Error('Invalid password');
    }

    const payload: AuthPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
    };

    const token = signToken(payload, { expiresIn: '3h' });

    const userResponse: UserResponse = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt!,
    };

    return { user: userResponse, token };
};

export const fetchUsers = async (query: any) => {
    const { offset, limit, currentPage } = getPagination(query);
    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder === 'ASC' ? 'ASC' : 'DESC';

    const { count, rows } = await getAllUsers(offset, limit, sortBy, sortOrder);
    const pagination = getPaginationMeta(count, currentPage, limit, rows.length);

    return { pagination, items: rows };
};

export const fetchUserById = async (id: string) => {
    const user = await findUserById(id);
    if (!user) throw new Error('User not found');
    return user;
};

export const modifyUser = async (id: string, updates: Partial<CreateUserInput>) => {
    const updated = await updateUserById(id, updates);
    if (!updated) throw new Error('User not found');
    return updated;
};

export const removeUser = async (id: string) => {
    const user = await deleteUserById(id);
    if (!user) throw new Error('User not found');
    return user;
};