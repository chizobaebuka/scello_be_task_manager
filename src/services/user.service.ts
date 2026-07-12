import argon2 from 'argon2';
import {
    createUser,
    deleteUserById,
    findUserByEmail,
    findUserById,
    getAllUsers,
    updateUserById,
} from '../repositories/user.repository';
import { getPagination, getPaginationMeta, resolveSort } from '../interfaces/pagination.interface';
import { AuthPayload, CreateUserInput, LoginUserInput, UserResponse } from '../interfaces/user.interface';
import { signToken } from '../utils/jwt';

const USER_SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'name', 'email'] as const;

// Never let a raw model instance (which carries the password hash) escape the service layer.
const toUserResponse = (user: any): UserResponse => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
});

export const createNewUser = async (data: CreateUserInput) => {
    const existing = await findUserByEmail(data.email);
    if (existing) throw new Error('Email already in use');

    const hashedPassword = await argon2.hash(data.password);

    const user = await createUser({ ...data, password: hashedPassword });
    return toUserResponse(user);
};


export const loginUserService = async (data: LoginUserInput): Promise<{ user: UserResponse; token: string }> => {
    const user = await findUserByEmail(data.email);

    if (!user) {
        throw new Error('User not found');
    }

    const isPasswordValid = await argon2.verify(user.password, data.password);
    if (!isPasswordValid) {
        throw new Error('Invalid password');
    }

    const payload: AuthPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
    };

    const token = signToken(payload, { expiresIn: '3h' });

    return { user: toUserResponse(user), token };
};

export const fetchUsers = async (query: any) => {
    const { offset, limit, currentPage } = getPagination(query);
    const { sortBy, sortOrder } = resolveSort(query, USER_SORTABLE_FIELDS, 'createdAt');

    const { count, rows } = await getAllUsers(offset, limit, sortBy, sortOrder);
    const pagination = getPaginationMeta(count, currentPage, limit, rows.length);

    return { pagination, items: rows.map(toUserResponse) };
};

export const fetchUserById = async (id: string) => {
    const user = await findUserById(id);
    if (!user) throw new Error('User not found');
    return toUserResponse(user);
};

export const modifyUser = async (id: string, updates: Partial<CreateUserInput>) => {
    const payload = { ...updates };
    if (payload.password) {
        payload.password = await argon2.hash(payload.password);
    }

    const updated = await updateUserById(id, payload);
    if (!updated) throw new Error('User not found');
    return toUserResponse(updated);
};

export const removeUser = async (id: string) => {
    const user = await deleteUserById(id);
    if (!user) throw new Error('User not found');
    return toUserResponse(user);
};