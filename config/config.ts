// import { Dialect } from 'sequelize'; // Importing the Dialect type for better type safety
import * as dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const configuration = {
  development: {
    username: process.env.LOCAL_DATABASE_USER,
    password: process.env.LOCAL_DATABASE_PASSWORD,
    database: process.env.LOCAL_DATABASE_NAME,
    host: process.env.LOCAL_DATABASE_HOST,
    port: process.env.LOCAL_DATABASE_PORT,
    dialect: 'postgres',
    // dialectOptions: {
    //   ssl: {
    //     require: Boolean(process.env.DATABASE_SSL),
    //     rejectUnauthorized: Boolean(process.env.DATABASE_REJECT_UNAUTHORIZED),
    //   },
    // },
  },
  test: {
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    dialect: 'postgres',
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
    dialect: 'postgres',
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
export default configuration;
