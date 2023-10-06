import { Sequelize } from 'sequelize-typescript';
// import { databaseConfig } from './config';
import { DEVELOPMENT, PRODUCTION, SEQUELIZE, TEST } from '../constants';
import { User } from 'src/user/entities/user.entity';
import { databaseConfig } from './config';
// export NODE_ENV=development
export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async () => {
      let config;
      switch (process.env.NODE_ENV) {
        case DEVELOPMENT:
          config = databaseConfig.development;
          break;
        case TEST:
          config = databaseConfig.test;
          break;
        case PRODUCTION:
          config = databaseConfig.production;
          break;
        default:
          config = databaseConfig.development;
      }
      const sequelize = new Sequelize(config);
      sequelize.addModels([User]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
