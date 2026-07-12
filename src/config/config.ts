import { Dialect } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

interface IConfig {
    [key: string]: {
        username: string;
        password: string | null;
        database: string;
        host: string;
        dialect: Dialect;
        pool: {
            max: number;
            min: number;
            acquire: number;
            idle: number;
        };
    };
}

const pool = {
    max: Number(process.env.DB_POOL_MAX) || 10,
    min: Number(process.env.DB_POOL_MIN) || 0,
    acquire: Number(process.env.DB_POOL_ACQUIRE_MS) || 30000,
    idle: Number(process.env.DB_POOL_IDLE_MS) || 10000,
};

const config: IConfig = {
    development: {
        username: process.env.DB_USER ?? 'postgres',
        password: process.env.DB_PASSWORD ?? null,
        database: process.env.DB_NAME ?? 'scello_be_task_manager',
        host: process.env.DB_HOST ?? 'localhost',
        dialect: 'postgres',
        pool,
    },
    test: {
        username: process.env.DB_USER ?? 'postgres',
        password: process.env.DB_PASSWORD ?? null,
        database: process.env.TEST_DB_NAME ?? 'scello_be_task_manager',
        host: process.env.DB_HOST ?? 'localhost',
        dialect: 'postgres',
        pool,
    },
    production: {
        username: process.env.DB_USER ?? 'postgres',
        password: process.env.DB_PASSWORD ?? null,
        database: process.env.PROD_DB_NAME ?? 'scello_be_task_manager',
        host: process.env.DB_HOST ?? 'localhost',
        dialect: 'postgres',
        pool,
    },
};

export = config;