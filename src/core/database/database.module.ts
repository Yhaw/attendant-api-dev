import { Module } from '@nestjs/common';
import { databaseProviders } from './database.providers';
import { DatabaseConfig } from './database.config';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [...databaseProviders, ConfigService, DatabaseConfig],
  exports: [...databaseProviders, DatabaseConfig],
})
export class DatabaseModule {}

