import { Dialect } from 'sequelize/types';

export const config = {
  database: {
    dialect: process.env.LOCAL_DATABASE_DIALECT as Dialect,
    host: process.env.LOCAL_DATABASE_HOST,
    port: process.env.LOCAL_DATABASE_PORT,
    username: process.env.LOCAL_DATABASE_USER,
    password: process.env.LOCAL_DATABASE_PASSWORD,
    database: process.env.LOCAL_DATABASE_NAME,
    logging: Boolean(process.env.LOCAL_DATABASE_LOGGING),
  },
};
