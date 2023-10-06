import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
// import { usersProviders } from './user.providers';
import { DatabaseModule } from 'src/core/database/database.module';
import { HashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';
import { AccessTokenGuard } from './authentication/guards/access-token/access-token.guard';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticationGuard } from './authentication/guards/authentication/authentication.guard';
import { APP_GUARD } from '@nestjs/core';
import { User } from './entities/user.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { FilesAzureService } from 'src/fileUpload/file.service';

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    DatabaseModule,
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  controllers: [UserController, AuthenticationController],
  providers: [
    UserService,
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    AccessTokenGuard,
    AuthenticationService,
    FilesAzureService,
  ],
  exports: [UserService],
})
export class UserModule {}

