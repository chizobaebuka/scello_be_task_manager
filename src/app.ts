// src/app.ts
import './config/env'; // Load .env first
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './docs/swagger';
import userRoutes from './routes/user.routes';
import taskRoutes from './routes/task.routes';
import { apiLimiter, errorHandler } from './middlewares/errorhandler.middleware';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});

// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'success', message: 'Server is healthy' });
});

// Swagger documentation
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));

// Rate limiter middleware
app.use(apiLimiter);

// API routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/tasks', taskRoutes);

// Global error handler
app.use(errorHandler);

export default app;