import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import * as redisStore from 'cache-manager-redis-store';
import { SentryInterceptor, SentryModule } from '@ntegral/nestjs-sentry';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import appConfig from './config/configuration';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
// import { DatabaseModule } from './core/database/database.module';
import { UserModule } from './user/user.module';
import { SequelizeModule, SequelizeModuleOptions } from '@nestjs/sequelize';
import { DatabaseConfig } from './core/database/database.config';
import { DatabaseModule } from './core/database/database.module';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [DatabaseModule],
      useFactory: async (
        dbConfig: DatabaseConfig,
      ): Promise<SequelizeModuleOptions> => ({
        host: dbConfig.host,
        port: dbConfig.port,
        username: dbConfig.username,
        password: dbConfig.password,
        database: dbConfig.database,
        dialect: dbConfig.dialect as any,
        autoLoadModels: dbConfig.autoLoadModels,
        synchronize: dbConfig.synchronize,
        ssl: dbConfig.ssl,
        dialectOptions: {
          ssl: {
            require: dbConfig.ssl,
            rejectUnauthorized: dbConfig.rejectUnauthorized,
          },
        },
      }),
      inject: [DatabaseConfig],
    }),
    SentryModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        dsn: configService.get<string>('sentry.dns'),
        debug: configService.get<boolean>('sentry.enabled'),
        environment: configService.get<string>('environment'),
        release: 'some_release',
        logLevels: ['debug'],
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ttl: configService.get<number>('throttle.ttl'),
        limit: configService.get<number>('throttle.limit'),
      }),
    }),
    ConfigModule.forRoot({
      load: [appConfig],
      isGlobal: true,
    }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
      no_ready_check: false,
    }),
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useValue: new SentryInterceptor(),
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    DatabaseConfig,
    ConfigService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
