import http from 'http';
import app from './app';
import { connectDB, sequelize } from './config/sequelize';
import { logger } from './utils/logger';

const PORT = Number(process.env.PORT) || 4001;
const SHUTDOWN_TIMEOUT_MS = 10000;

let server: http.Server | undefined;

(async () => {
    try {
        await connectDB();
        logger.info('Database connected successfully');

        server = app.listen(PORT, () => {
            logger.info(`Server running on http://localhost:${PORT}`);
            logger.info(`Swagger docs at http://localhost:${PORT}/api-doc`);
        });
    } catch (error) {
        logger.error({ err: error }, 'Failed to start server');
        process.exit(1);
    }
})();

const shutdown = (signal: string) => {
    logger.info(`${signal} received, shutting down gracefully`);

    if (!server) {
        process.exit(0);
    }

    server.close(async () => {
        try {
            await sequelize.close();
            logger.info('Database connection closed');
            process.exit(0);
        } catch (error) {
            logger.error({ err: error }, 'Error closing database connection');
            process.exit(1);
        }
    });

    setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
    }, SHUTDOWN_TIMEOUT_MS).unref();
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
