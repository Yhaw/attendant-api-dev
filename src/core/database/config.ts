import * as dotenv from 'dotenv';
import { IDatabaseConfig } from './interfaces/dbConfig.interface';

dotenv.config();

export const databaseConfig: IDatabaseConfig = {
  development: {
    username: process.env.LOCAL_DATABASE_USER,
    password: process.env.LOCAL_DATABASE_PASSWORD,
    database: process.env.LOCAL_DATABASE_NAME,
    host: process.env.LOCAL_DATABASE_HOST,
    port: process.env.LOCAL_DATABASE_PORT,
    dialect: process.env.LOCAL_DATABASE_DIALECT,
    autoLoadModels: true,
    synchronize: Boolean(process.env.LOCAL_DATABASE_SYNCHRONIZE),
    // ssl: Boolean(process.env.DATABASE_SSL),
  },
  test: {
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    dialect: process.env.DATABASE_DIALECT,
    autoLoadModels: true,
    synchronize: Boolean(process.env.DATABASE_SYNCHRONIZE),
    ssl: Boolean(process.env.DATABASE_SSL),
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
  production: {
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    dialect: process.env.DATABASE_DIALECT,
    autoLoadModels: Boolean(process.env.DATABASE_AUTOLOAD_MODELS),
    synchronize: Boolean(process.env.DATABASE_SYNCHRONIZATION),
    ssl: Boolean(process.env.DATABASE_SSL),
    dialectOptions: {
      ssl: {
        require: Boolean(process.env.DATABASE_SSL),
        rejectUnauthorized: Boolean(process.env.DATABASE_REJECT_UNAUTHORIZED),
      },
    },
  },
};
