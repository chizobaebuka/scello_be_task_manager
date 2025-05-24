export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
}

export interface UserAttributes {
    id: string;
    name: string;
    email: string;
    password: string;
    role: UserRole;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface UserCreationAttributes extends Partial<Pick<UserAttributes, 'id' | 'role'>> { }

export interface UserResponse {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    createdAt: Date;
}

export interface AuthPayload {
    userId: string;
    email: string;
    role: string;
}

export interface TokenResponse {
    token: string;
    expiresIn: string;
}

export type CreateUserInput = {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
};

export type LoginUserInput = {
    email: string;
    password: string;
}