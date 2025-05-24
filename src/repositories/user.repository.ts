import User from '../models/user';
import { CreateUserInput } from '../interfaces/user.interface';

export const createUser = async (data: CreateUserInput) => {
    return await User.create(data);
};

export const findUserByEmail = async (email: string) => {
    return await User.findOne({ where: { email } });
};

export const findUserById = async (id: string) => {
    return await User.findByPk(id);
};

export const updateUserById = async (id: string, updates: Partial<CreateUserInput>) => {
    const user = await findUserById(id);
    if (!user) return null;
    return await user.update(updates);
};

export const deleteUserById = async (id: string) => {
    const user = await findUserById(id);
    if (!user) return null;
    await user.destroy();
    return user;
};

export const getAllUsers = async (offset: number, limit: number, sortBy: string, sortOrder: 'ASC' | 'DESC') => {
    return await User.findAndCountAll({
        limit,
        offset,
        order: [[sortBy, sortOrder]],
    });
};
