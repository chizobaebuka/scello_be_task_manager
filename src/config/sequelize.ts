import { configDotenv } from "dotenv";
import { Sequelize } from "sequelize";
import { logger } from "../utils/logger";

configDotenv();

export const sequelize = new Sequelize(
    process.env.DB_NAME!,
    process.env.DB_USER!,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST!,
        dialect: 'postgres',
        logging: process.env.SQL_LOGGING === 'true' ? (msg) => logger.debug(msg) : false,
        pool: {
            max: Number(process.env.DB_POOL_MAX) || 10,
            min: Number(process.env.DB_POOL_MIN) || 0,
            acquire: Number(process.env.DB_POOL_ACQUIRE_MS) || 30000,
            idle: Number(process.env.DB_POOL_IDLE_MS) || 10000,
        },
    }
);

// Throws on failure so the caller (server startup) can decide to exit
// instead of running a process that never opened a listening port.
export const connectDB = async () => {
    await sequelize.authenticate();
};