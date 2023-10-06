import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { SignInDto } from '../dto/sign-in.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { ForgotUserPasswordDto } from '../dto/forgot-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { AuthenticationService } from './authentication.service';
import { Auth } from './decorators/auth.decorators';
import { AuthType } from '../enum/auth-type.enum';
import { CreateUserDto } from '../dto/create-user.dto';
import { PhoneDto } from '../dto/otp-code.dto';
import { CacheTTL } from '@nestjs/cache-manager';

@Auth(AuthType.None)
@ApiTags('User-Authentication')
@Controller('user-authentication')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({})
  @ApiCreatedResponse({ description: 'User signup successful' })
  signUp(@Body() signUpDto: CreateUserDto) {
    console.log('User signup DTO ', signUpDto);
    return this.authService.create(signUpDto);
  }

  @Post('login')
  @ApiOperation({})
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Login success' })
  login(@Body() loginUserDto: SignInDto) {
    return this.authService.signIn(loginUserDto);
  }

  @Post('generate-otp')
  @CacheTTL(20)
  @ApiOperation({})
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Login success' })
  generateOtp(@Body() phone: PhoneDto) {
    return this.authService.generateOtp(phone);
  }

  @Post('forgot-password')
  @ApiOperation({})
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'request success' })
  async forgotPassword(
    @Req() req,
    @Body() forgotPassDto: ForgotUserPasswordDto,
  ) {
    return await this.authService.forgotPassword(req, forgotPassDto);
  }

  // RESET ADMIN PASSWORD
  @Patch('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({})
  @ApiCreatedResponse({})
  async resetPassword(
    @Param('token') params,
    @Body() resetPass: ResetPasswordDto,
  ) {
    console.log('Reset Token', params);
    return await this.authService.resetPassword(resetPass);
  }

  @HttpCode(HttpStatus.OK) // changed since the default is 201
  @Post('refresh-tokens')
  refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto);
  }
}
