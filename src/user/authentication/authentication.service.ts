import {
  ConflictException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { HashingService } from '../hashing/hashing.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';
import { Op } from 'sequelize';
import { SignInDto } from '../dto/sign-in.dto';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { UserDto } from '../dto/user.dto';
import { Request } from 'express';
import { ForgotUserPasswordDto } from '../dto/forgot-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { InjectModel } from '@nestjs/sequelize';
import { UserService } from '../user.service';
import { PhoneDto } from '../dto/otp-code.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectModel(User)
    private readonly usersRepository: typeof User,
    private readonly hashingService: HashingService,
    private userService: UserService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const {
      email,
      firstName,
      lastName,
      phone,
      password,
      username,
      gender,
      birthday,
      psi,
      ghanaCard,
      digitalAddress,
    } = createUserDto;
    console.log('Raw password', password);
    try {
      const userInDB = await this.usersRepository.findOne<User>({
        where: {
          [Op.or]: [
            { email: createUserDto.email },
            { public_service_id: createUserDto.psi },
            { phone_number: createUserDto.phone },
            { username: createUserDto.username },
            { ghana_card_id: createUserDto.ghanaCard },
          ],
        },
      });
      if (userInDB) {
        throw new ConflictException('User Already exists');
      }

      const hashed = await this.hashingService.hash(password);
      console.log('Hashed password', hashed);
      const user = new User();
      user.email = email;
      user.first_name = firstName;
      user.phone_number = phone;
      user.last_name = lastName;
      user.password = hashed;
      user.username = username;
      user.gender = gender;
      user.birthday = birthday;
      user.public_service_id = psi;
      user.digital_address = digitalAddress;
      user.ghana_card_id = ghanaCard;
      const userData = await user.save();
      return userData;
    } catch (error) {
      throw error;
    }
  }

  async signIn(signInDto: SignInDto) {
    try {
      const { email, username, psi, otp, password } = signInDto;
      const userInDB = await this.usersRepository.findOne<User>({
        where: {
          [Op.or]: [
            { email: email || null },
            { public_service_id: psi || null },
            { username: username || null },
          ],
        },
      });
      console.log('User Details', userInDB);

      if (!userInDB && otp == null) {
        throw new HttpException(
          `Invalid login credentials`,
          HttpStatus.BAD_REQUEST,
        );
      }

      if (otp) {
        const userKey: any = await this.userService.getFromCache(otp);
        const userInDB = await this.userService.getUserByPhone(userKey);
        console.log('User from Cache', userInDB);
        const accessToken = await this.generateTokens(userInDB);
        return {
          firstName: userInDB.first_name,
          lastName: userInDB.last_name,
          accessToken,
        };
      }
      const isEqual = await this.hashingService.iCompare(
        password,
        userInDB.password,
      );

      if (!isEqual) {
        throw new HttpException(
          `Invalid login credentials`,
          HttpStatus.BAD_REQUEST,
        );
      }
      const accessToken = await this.generateTokens(userInDB);
      return {
        firstName: userInDB.first_name,
        lastName: userInDB.last_name,
        accessToken,
      };
    } catch (error) {
      throw error;
    }
  }

  async generateOtp(phoneDto: PhoneDto) {
    const { phone } = phoneDto;
    console.log('Before breakpoint');
    await this.userService.generateOtp(phone);
  }

  async getUserByEmail(email: string) {
    return await this.usersRepository.findOne<User>({
      where: { email },
    });
  }

  async getUser(id: string) {
    const user = await this.usersRepository.findByPk<User>(id);
    if (!user) {
      throw new HttpException(
        'User with given id not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return new UserDto(user);
  }

  /**
   *
   * @param email - string
   * @returns {boolean}
   */
  async forgotPassword(
    @Req() request: Request,
    forgotPassDto: ForgotUserPasswordDto,
  ) {
    const { email, psi, username } = forgotPassDto;
    console.log('email type of', typeof forgotPassDto.email);
    const currentDate = new Date();
    const origin = request.get('host');
    const user = await this.usersRepository.findOne({
      where: {
        [Op.or]: [
          { public_service_id: psi || null },
          { username: username || null },
          { email: email || null },
          {
            passwordResetExpires: {
              [Op.gt]: new Date(),
            },
          },
        ],
      },
    });

    const token = await this.getToken(user);

    if (user.phone_number) {
      await this.userService.generateOtp(user.phone_number);
    } else {
      throw new HttpException(
        'User Phone required to reset password',
        HttpStatus.BAD_REQUEST,
      );
    }

    const resetURL = `${request.protocol}://${origin}/api/v1/user-authentication/${token.accessToken}`;

    user.passwordResetExpires = new Date(currentDate.getTime() + 10 * 60000);
    try {
      console.log('ResetUrl', resetURL);
      console.log('Token for Forgot password', token);
      const data = await user.save();
      //  this.mailService.forgotPassword(user.email, user.firstname, resetURL);
      return data;
    } catch (error) {
      if (user) {
        await user.update({
          where: {
            passwordResetToken: null,
            passwordResetExpires: null,
          },
        });
        // Make sure to await the save operation
      }
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  // Reset Password
  async resetPassword(resetPass: ResetPasswordDto) {
    const { psi, username, password, otp } = resetPass;
    console.log('Username and PSi: ', typeof username, typeof psi);
    const hashed = await this.hashingService.hash(password);
    // 1) Get user based on the token
    const user = await this.usersRepository.findOne({
      where: {
        [Op.and]: [
          { public_service_id: psi },
          { username: username },
          {
            passwordResetExpires: {
              [Op.gt]: new Date(),
            },
          },
        ],
      },
    });

    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
      throw new HttpException(`User not found`, HttpStatus.NOT_FOUND);
    }

    const userPhone: any = await this.userService.getFromCache(otp);
    const userInDB = await this.userService.getUserByPhone(userPhone);
    if (!userInDB) {
      throw new HttpException(
        `Invalid Token or Token has Expired`,
        HttpStatus.NOT_FOUND,
      );
    }
    userInDB.password = hashed;
    userInDB.passwordResetExpires = null;
    userInDB.save();
    return user;
  }

  private async generateTokens(user: UserDto) {
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<ActiveUserData>>(
        user.id,
        this.jwtConfiguration.accessTokenTtl,
        { email: user.email },
      ),
      this.signToken(user.id, this.jwtConfiguration.refreshTokenTtl),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }

  private async signToken<T>(userId: string, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn: this.jwtConfiguration.accessTokenTtl,
      },
    );
  }
  private async getToken(user: User) {
    const [accessToken] = await Promise.all([
      this.signToken<Partial<ActiveUserData>>(
        user.id,
        this.jwtConfiguration.accessTokenTtl,
        { email: user.email },
      ),
    ]);
    return {
      accessToken,
    };
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      const { sub } = await this.jwtService.verifyAsync<
        Pick<ActiveUserData, 'sub'>
      >(refreshTokenDto.refreshToken, {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
      });
      const user = await this.getUser(sub);
      console.log('User sub', user);
      return this.generateTokens(user);
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
