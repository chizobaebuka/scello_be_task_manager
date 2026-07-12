// src/app.ts
import './config/env'; // Load .env first
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import pinoHttp from 'pino-http';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './docs/swagger';
import userRoutes from './routes/user.routes';
import taskRoutes from './routes/task.routes';
import { apiLimiter, errorHandler } from './middlewares/errorhandler.middleware';
import { logger } from './utils/logger';
import { sequelize } from './config/sequelize';

const app = express();

// CORS_ORIGIN accepts a comma-separated allow-list; defaults to '*' for local/dev use.
const corsOrigin = process.env.CORS_ORIGIN;
app.use(cors({
    origin: corsOrigin ? corsOrigin.split(',').map((origin) => origin.trim()) : '*',
}));
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: process.env.BODY_LIMIT || '100kb' }));
app.use(express.urlencoded({ extended: true, limit: process.env.BODY_LIMIT || '100kb' }));

app.use(pinoHttp({
    logger,
    autoLogging: {
        ignore: (req) => req.url === '/health' || req.url === '/health/ready',
    },
}));

// Liveness check: process is up, no dependency checks (fast, cheap to poll).
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'success', message: 'Server is healthy' });
});

// Readiness check: verifies the DB connection so orchestrators can gate traffic on it.
app.get('/health/ready', async (req, res) => {
    try {
        await sequelize.authenticate();
        res.status(200).json({ status: 'ready' });
    } catch (error) {
        res.status(503).json({ status: 'not-ready' });
    }
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