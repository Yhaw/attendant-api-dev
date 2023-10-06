import { Dialect } from 'sequelize/types';

export const config = {
  database: {
    dialect: process.env.DATABASE_DIALECT as Dialect,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    logging: Boolean(process.env.DATABASE_LOGGING),
  },
  jwtPrivateKey: process.env.JWT_PRIVATE_KEY,
};
