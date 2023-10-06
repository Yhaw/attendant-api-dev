import { Injectable } from '@nestjs/common';
import config from '../../config';
// /home/maxwell/Documents/projects/js/attendant-api/config.ts

@Injectable()
export class ConfigDbService {
  get sequelizeOrmConfig() {
    return config.database;
  }

  // get jwtConfig() {
  //   return { privateKey: config.jwtPrivateKey };
  // }
}
