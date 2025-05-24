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
    };
}

const config: IConfig = {
    development: {
        username: process.env.DB_USER ?? 'postgres',
        password: process.env.DB_PASSWORD ?? null,
        database: process.env.DB_NAME ?? 'scello_be_task_manager',
        host: process.env.DB_HOST ?? 'localhost',
        dialect: 'postgres',
    },
    test: {
        username: process.env.DB_USER ?? 'postgres',
        password: process.env.DB_PASSWORD ?? null,
        database: process.env.TEST_DB_NAME ?? 'scello_be_task_manager',
        host: process.env.DB_HOST ?? 'localhost',
        dialect: 'postgres',
    },
    production: {
        username: process.env.DB_USER ?? 'postgres',
        password: process.env.DB_PASSWORD ?? null,
        database: process.env.PROD_DB_NAME ?? 'scello_be_task_manager',
        host: process.env.DB_HOST ?? 'localhost',
        dialect: 'postgres',
    },
};

export = config;