import path from "path";
import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
    swagger: '2.0',
    info: {
        title: "My API",
        version: "1.0.0",
        description: "API documentation for Task Manager application",
    },
    servers: [
        {
            url: "http://localhost:4403/api/v1",
            description: "Development server",
        },
    ],
    paths: {
        '/api/v1/users/create': {
            post: {
                tags: ['Users'],
                summary: 'Create a new user',
                description: 'This endpoint allows you to create a new user.',
                parameters: [
                    {
                        name: 'user',
                        in: 'body',
                        required: true,
                        schema: {
                            type: 'object',
                            properties: {
                                name: { type: 'string', example: 'John Doe' },
                                email: { type: 'string', example: 'john.doe@example.com' },
                                password: { type: 'string', example: 'password123' },
                                role: { type: 'string', enum: ['user', 'admin'], example: 'admin', default: 'user' },
                            },
                            required: ['name', 'email', 'password'],
                        }
                    }
                ],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/User',
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: 'User created successfully',
                        schema: {
                            $ref: '#/components/schemas/User',
                        },
                    },
                    400: {
                        description: 'Bad request',
                    },
                    500: {
                        description: 'Internal server error',
                    }
                },
            }
        },
        '/api/v1/users/login': {
            post: {
                tags: ['Users'],
                summary: 'User login',
                description: 'This endpoint allows a user to log in.',
                parameters: [
                    {
                        name: 'credentials',
                        in: 'body',
                        required: true,
                        schema: {
                            type: 'object',
                            properties: {
                                email: { type: 'string', example: 'johnDoe@gmail.com' },
                                password: { type: 'string', example: 'hashedpassword' },
                            },
                            required: ['email', 'password'],
                        }
                    }
                ],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    email: { type: 'string', example: 'JohnDoe@gmail.com' },
                                    password: { type: 'string', example: 'hashedpassword' },
                                },
                                required: ['email', 'password'],
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'User logged in successfully',
                        schema: {
                            type: 'object',
                            properties: {
                                token: { type: 'string', example: 'JWT token' },
                                user: {
                                    $ref: '#/components/schemas/User',
                                },
                            },
                        },
                    },
                    401: {
                        description: 'Unauthorized',
                    },
                    500: {
                        description: 'Internal server error',
                    },
                },
            },
        },
        '/api/v1/users': {
            get: {
                tags: ['Users'],
                summary: 'Get all users',
                description: 'Fetch all users with pagination, search, filtering, and sorting options.',
                parameters: [
                    {
                        name: 'page',
                        in: 'query',
                        description: 'Page number',
                        required: false,
                        schema: {
                            type: 'integer',
                            default: 1,
                        },
                    },
                    {
                        name: 'pageSize',
                        in: 'query',
                        description: 'Number of items per page',
                        required: false,
                        schema: {
                            type: 'integer',
                            default: 10,
                        },
                    },
                    {
                        name: 'sortBy',
                        in: 'query',
                        description: 'Field to sort by',
                        required: false,
                        schema: {
                            type: 'string',
                            default: 'createdAt',
                        },
                    },
                    {
                        name: 'sortOrder',
                        in: 'query',
                        description: 'Sort order (ASC or DESC)',
                        required: false,
                        schema: {
                            type: 'string',
                            enum: ['ASC', 'DESC'],
                            default: 'DESC',
                        },
                    },
                ],
                security: [
                    {
                        JWTAuth: [],
                    },
                ],
                responses: {
                    200: {
                        description: 'Users fetched successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        pagination: {
                                            type: 'object',
                                            properties: {
                                                totalItems: { type: 'integer' },
                                                totalPages: { type: 'integer' },
                                                currentPage: { type: 'integer' },
                                                pageSize: { type: 'integer' },
                                                hasNextPage: { type: 'boolean' },
                                                hasPreviousPage: { type: 'boolean' },
                                            },
                                        },
                                        items: {
                                            type: 'array',
                                            items: {
                                                $ref: '#/components/schemas/User',
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    401: {
                        description: 'Unauthorized - JWT is invalid or missing',
                    },
                    500: {
                        description: 'Internal server error',
                    },
                },
            },
        },
        '/api/v1/users/{id}': {
            get: {
                tags: ['Users'],
                summary: 'Get a user by ID',
                description: 'Fetch a user by their ID',
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        description: 'User ID',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                    },
                ],
                security: [{ JWTAuth: [] }],
                responses: {
                    200: {
                        description: 'User fetched successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/User',
                                },
                            },
                        },
                    },
                    401: {
                        description: 'Unauthorized',
                    },
                    404: {
                        description: 'User not found',
                    },
                    500: {
                        description: 'Internal server error',
                    },
                },
            },
            put: {
                tags: ['Users'],
                summary: 'Update a user by ID',
                description: 'Update a user by their ID',
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        description: 'User ID',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                    },
                    {
                        in: 'body',
                        name: 'user',
                        description: 'Details to update the user',
                        required: true,
                        schema: {
                            type: 'object',
                            properties: {
                                name: { type: 'string' },
                                email: { type: 'string', format: 'email' },
                                password: { type: 'string', minLength: 6 },
                                role: { type: 'string', enum: ['user', 'admin'] },
                            },
                            optional: ['name', 'email', 'password', 'role'],
                        }
                    }
                ],
                security: [{ JWTAuth: [] }],
                responses: {
                    200: {
                        description: 'User updated successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/User',
                                },
                            },
                        },
                    },
                    400: {
                        description: 'Invalid request body',
                    },
                    401: {
                        description: 'Unauthorized',
                    },
                    404: {
                        description: 'User not found',
                    },
                    500: {
                        description: 'Internal server error',
                    },
                }
            },
            delete: {
                tags: ['Users'],
                summary: 'Delete a user by ID',
                description: 'Delete a user by their ID',
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        description: 'User ID',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                    },
                ],
                security: [{ JWTAuth: [] }],
                responses: {
                    204: {
                        description: 'User deleted successfully',
                    },
                    401: {
                        description: 'Unauthorized',
                    },
                    404: {
                        description: 'User not found',
                    },
                    500: {
                        description: 'Internal server error',
                    },
                },
            },
        },
        '/api/v1/tasks/create': {
            post: {
                tags: ['Tasks'],
                summary: 'Create a new task',
                description: 'This endpoint allows you to create a new task.',
                parameters: [
                    {
                        name: 'task',
                        in: 'body',
                        required: true,
                        description: 'Task object',
                        schema: {
                            type: 'object',
                            properties: {
                                title: { type: 'string', example: 'Task Title' },
                                description: { type: 'string', example: 'Task Description' },
                                status: { type: 'string', enum: ['pending', 'in-progress', 'completed'], example: 'pending' },
                                userId: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' },
                            },
                            required: ['title', 'description', 'status'],
                        }
                    }
                ],
                security: [{ JWTAuth: [] }],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Task',
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: 'Task created successfully',
                        schema: {
                            $ref: '#/components/schemas/Task',
                        },
                    },
                    400: {
                        description: 'Bad request',
                    },
                    500: {
                        description: 'Internal server error',
                    }
                },
            },
        },
        '/api/v1/tasks': {
            get: {
                tags: ['Tasks'],
                summary: 'Get all tasks',
                description: 'Retrieve all tasks belonging to the authenticated user, with pagination and sorting options.',
                parameters: [
                    {
                        name: 'page',
                        in: 'query',
                        description: 'Page number',
                        required: false,
                        schema: {
                            type: 'integer',
                            default: 1,
                        },
                    },
                    {
                        name: 'pageSize',
                        in: 'query',
                        description: 'Number of items per page',
                        required: false,
                        schema: {
                            type: 'integer',
                            default: 10,
                        },
                    },
                    {
                        name: 'sortBy',
                        in: 'query',
                        description: 'Field to sort by',
                        required: false,
                        schema: {
                            type: 'string',
                            default: 'createdAt',
                        },
                    },
                    {
                        name: 'sortOrder',
                        in: 'query',
                        description: 'Sort order',
                        required: false,
                        schema: {
                            type: 'string',
                            enum: ['ASC', 'DESC'],
                            default: 'DESC',
                        },
                    },
                ],
                security: [{ JWTAuth: [] }],
                responses: {
                    200: {
                        description: 'Tasks retrieved successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        items: {
                                            type: 'array',
                                            items: { $ref: '#/components/schemas/Task' },
                                        },
                                        pagination: {
                                            type: 'object',
                                            properties: {
                                                totalItems: { type: 'integer' },
                                                currentPage: { type: 'integer' },
                                                pageSize: { type: 'integer' },
                                                totalPages: { type: 'integer' },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    401: {
                        description: 'Unauthorized',
                    },
                    500: {
                        description: 'Internal server error',
                    },
                },
            },
        },
        '/api/v1/tasks/{id}': {
            get: {
                tags: ['Tasks'],
                summary: 'Get a task by ID',
                description: 'Fetch a task by its ID - need to be authenticated',
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        description: 'Task ID',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                    },
                ],
                security: [{ JWTAuth: [] }],
                responses: {
                    200: {
                        description: 'Task fetched successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Task',
                                },
                            },
                        },
                    },
                    401: {
                        description: 'Unauthorized',
                    },
                    404: {
                        description: 'Task not found',
                    },
                    500: {
                        description: 'Internal server error',
                    },
                },
            },
            put: {
                tags: ['Tasks'],
                summary: 'Update a task by ID',
                description: 'Update a task by its ID - need to be authenticated',
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        description: 'Task ID',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                    },
                    {
                        in: 'body',
                        name: 'task',
                        description: 'Details to update the task all optional',
                        required: true,
                        schema: {
                            type: 'object',
                            properties: {
                                title: { type: 'string' },
                                description: { type: 'string' },
                                status: { type: 'string', enum: ['pending', 'in-progress', 'completed'] },
                            },
                            optional: ['title', 'description', 'status'],
                        }
                    }
                ],
                security: [{ JWTAuth: [] }],
                responses: {
                    200: {
                        description: 'Task updated successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Task',
                                },
                            },
                        },
                    },
                    400: {
                        description: 'Invalid request body',
                    },
                    401: {
                        description: 'Unauthorized',
                    },
                    404: {
                        description: 'Task not found',
                    },
                    500: {
                        description: 'Internal server error',
                    },
                }
            },
            delete: {
                tags: ['Tasks'],
                summary: 'Delete a task by ID',
                description: 'Delete a task by its ID - need to be authenticated',
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        description: 'Task ID',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                    },
                ],
                security: [{ JWTAuth: [] }],
                responses: {
                    204: {
                        description: 'Task deleted successfully',
                    },
                    401: {
                        description: 'Unauthorized',
                    },
                    404: {
                        description: 'Task not found',
                    },
                    500: {
                        description: 'Internal server error',
                    },
                },
            },
        },
        '/api/v1/tasks/report-time': {
            get: {
                tags: ['Tasks'],
                summary: 'Track time spent on tasks',
                description: 'Retrieve the total time spent on tasks within a specified date range.',
                parameters: [
                    {
                        name: 'startDate',
                        in: 'query',
                        description: 'Start date for the time tracking (YYYY-MM-DD)',
                        required: true,
                        schema: {
                            type: 'string',
                            format: 'date',
                            example: '2025-05-01',
                        },
                    },
                    {
                        name: 'endDate',
                        in: 'query',
                        description: 'End date for the time tracking (YYYY-MM-DD)',
                        required: true,
                        schema: {
                            type: 'string',
                            format: 'date',
                            example: '2025-05-23',
                        },
                    },
                ],
                security: [{ JWTAuth: [] }],
                responses: {
                    200: {
                        description: 'Time spent on tasks fetched successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        totalTimeSpent: { type: 'string', example: '15 hours' },
                                        tasks: {
                                            type: 'array',
                                            items: {
                                                type: 'object',
                                                properties: {
                                                    id: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' },
                                                    title: { type: 'string', example: 'Complete project documentation' },
                                                    timeSpent: { type: 'string', example: '5 hours' },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    400: {
                        description: 'Bad request - Missing or invalid query parameters',
                    },
                    401: {
                        description: 'Unauthorized - JWT is invalid or missing',
                    },
                    500: {
                        description: 'Internal server error',
                    },
                },
            },
        },
        '/api/v1/tasks/report': {
            get: {
                tags: ['Tasks'],
                summary: 'Generate task completion report',
                description: 'Retrieve a report on task completion rates for the authenticated user.',
                security: [{ JWTAuth: [] }],
                responses: {
                    200: {
                        description: 'Task completion report fetched successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        totalTasks: { type: 'integer', example: 10 },
                                        completedTasks: { type: 'integer', example: 7 },
                                        completionRate: { type: 'string', example: '70%' },
                                    },
                                },
                            },
                        },
                    },
                    401: {
                        description: 'Unauthorized - JWT is invalid or missing',
                    },
                    500: {
                        description: 'Internal server error',
                    },
                },
            },
        },
    },
    securityDefinitions: {
        JWTAuth: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header'
        }
    },
    components: {
        schemas: {
            User: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' },
                    name: { type: 'string', example: 'John Doe' },
                    email: { type: 'string', example: 'john.doe@example.com' },
                    password: { type: 'string', example: 'hashedpassword' },
                    role: { type: 'string', enum: ['user', 'admin'], example: 'admin', default: 'user' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                },
                required: ['name', 'email', 'password', 'role'],
            },
            Task: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' },
                    title: { type: 'string', example: 'Task Title' },
                    description: { type: 'string', example: 'Task Description' },
                    status: { type: 'string', enum: ['pending', 'in-progress', 'completed'], example: 'pending' },
                    userId: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                },
                required: ['title', 'description', 'status'],
            }
        },
    },

    tags: [
        { name: 'Tasks', description: 'Task management' },
        { name: 'Users', description: 'User management' },
    ],
}

const options = {
    swaggerDefinition,
    apis: [path.join(__dirname, '../routes/*.ts')], // Ensures correct path resolution
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;