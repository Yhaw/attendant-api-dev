import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseConfig {
  constructor(private configService: ConfigService) {}

  get isDevelopment() {
    return this.configService.get<string>('environment') === 'development';
  }

  get isProduction() {
    return this.configService.get<string>('environment') === 'production';
  }

  get host(): string {
    if (this.isDevelopment)
      return this.configService.get<string>('development.host');
    if (this.isProduction)
      return this.configService.get<string>('production.host');
    return null;
  }

  get port() {
    if (this.isDevelopment)
      return this.configService.get<number>('development.port');
    if (this.isProduction)
      return this.configService.get<number>('production.port');
    return null;
  }

  get username() {
    if (this.isDevelopment)
      return this.configService.get<string>('development.username');
    if (this.isProduction)
      return this.configService.get<string>('production.username');
    return null;
  }

  get password() {
    if (this.isDevelopment)
      return this.configService.get<string>('development.password');
    if (this.isProduction)
      return this.configService.get<string>('production.password');
    return null;
  }

  get database() {
    if (this.isDevelopment)
      return this.configService.get<string>('development.database');
    if (this.isProduction)
      return this.configService.get<string>('production.database');
    return null;
  }

  get synchronize() {
    if (this.isDevelopment)
      return Boolean(
        this.configService.get<boolean>('development.synchronize'),
      );
    if (this.isProduction)
      return Boolean(this.configService.get<boolean>('production.synchronize'));
    return null;
  }

  get logging() {
    if (this.isDevelopment)
      return Boolean(this.configService.get<boolean>('development.logging'));
    if (this.isProduction)
      return Boolean(this.configService.get<boolean>('production.logging'));
    return null;
  }

  get dialect(): string {
    if (this.isDevelopment)
      return this.configService.get<string>('development.dialect');
    if (this.isProduction)
      return this.configService.get<string>('production.dialect');
    return null;
  }

  get ssl() {
    if (this.isDevelopment)
      return Boolean(this.configService.get<boolean>('development.ssl'));
    if (this.isProduction)
      return Boolean(this.configService.get<boolean>('production.ssl'));
    return null;
  }

  get autoLoadModels() {
    if (this.isDevelopment)
      return Boolean(
        this.configService.get<boolean>('development.autoLoadModels'),
      );
    if (this.isProduction)
      return Boolean(
        this.configService.get<boolean>('production.autoLoadModels'),
      );
    return null;
  }

  get rejectUnauthorized() {
    if (this.isDevelopment)
      return Boolean(
        this.configService.get<boolean>('development.rejectUnauthorized'),
      );
    if (this.isProduction)
      return Boolean(
        this.configService.get<boolean>('production.rejectUnauthorized'),
      );
    return null;
  }
}
