import request from 'supertest';
import app from '../../src/app';
import * as userService from '../../src/services/user.service';

jest.mock('../../src/services/user.service');

describe('User Controller - API Endpoints', () => {
    describe('POST /api/v1/users/create', () => {
        it('should create a user and return 201 status', async () => {
            const userData = {
                name: 'John Doe',
                email: 'john.doe@example.com',
                password: 'securepassword123',
            };

            const mockUser = {
                id: 'user-123',
                name: 'John Doe',
                email: 'john.doe@example.com',
                role: 'user',
                createdAt: new Date().toISOString(),
            };

            (userService.createNewUser as jest.Mock).mockResolvedValue(mockUser);

            const response = await request(app)
                .post('/api/v1/users/create') // <-- correct route
                .send(userData)
                .expect(201);

            expect(userService.createNewUser).toHaveBeenCalledWith(userData);
            expect(response.body).toEqual({
                message: 'User created',
                user: mockUser,
            });
        });

        it('should return 400 when required fields are missing', async () => {
            const invalidUserData = {
                email: 'john.doe@example.com', // missing name
                password: 'securepassword123',
            };

            const response = await request(app)
                .post('/api/v1/users/create')
                .send(invalidUserData)
                .expect(400);

            expect(response.body).toEqual({
                message: 'Required',
            });
        });

        it('should return 400 when email is already in use', async () => {
            const userData = {
                name: 'John Doe',
                email: 'john.doe@example.com',
                password: 'securepassword123',
            };
            (userService.createNewUser as jest.Mock).mockRejectedValue(new Error('Email already in use'));
            const response = await request(app)
                .post('/api/v1/users/create')
                .send(userData)
                .expect(400);
            expect(response.body).toEqual({
                message: 'Email already in use',
            });
        });
    });

    describe('POST /api/v1/users/login', () => {
        it('should login a user and return a token', async () => {
            const credentials = {
                email: 'john.doe@example.com',
                password: 'securepassword123',
            };

            (userService.loginUserService as jest.Mock).mockResolvedValue({
                token: 'mock-jwt-token',
            });

            const response = await request(app)
                .post('/api/v1/users/login') // <-- correct route
                .send(credentials)
                .expect(200);

            expect(userService.loginUserService).toHaveBeenCalledWith(credentials);
            expect(response.body).toEqual({
                message: 'Login successful',
                data: {
                    "token": "mock-jwt-token",
                },
            });
        });

        it('should return 400 when email or password is missing', async () => {
            const invalidCredentials = {
                email: '', // missing email
                password: 'securepassword123',
            };
            const response = await request(app)
                .post('/api/v1/users/login')
                .send(invalidCredentials)
                .expect(400);

            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                message: 'Invalid email',
            });
        });

        it('should return 404 when user is not found', async () => {
            const credentials = {
                email: 'jogn.raymond@gmail.com',
                password: 'securepassword123',
            };
            (userService.loginUserService as jest.Mock).mockRejectedValue(new Error('User not found'));

            const response = await request(app)
                .post('/api/v1/users/login')
                .send(credentials)
                .expect(404);

            expect(response.status).toBe(404);
            expect(response.body).toEqual({
                message: 'User not found',
            });
            expect(userService.loginUserService).toHaveBeenCalledWith(credentials);
        });
    });
});