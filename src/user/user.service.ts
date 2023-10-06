import {
  ConflictException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserDto } from './dto/user.dto';
import { Op } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { customAlphabet } from 'nanoid/async';
import { sendOtpMessage } from 'src/utils/send-sms';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { UpdateUserProfileDto } from './dto/user-profile.dto';
import { HashingService } from './hashing/hashing.service';

@Injectable()
export class UserService {
  nanoid = customAlphabet('1234567890', 6);

  constructor(
    @InjectModel(User)
    private readonly usersRepository: typeof User,
    private readonly hashingService: HashingService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const userInDB = await this.usersRepository.findOne<User>({
        where: {
          [Op.or]: [
            { email: createUserDto.email },
            { public_service_id: createUserDto.psi },
            { ghana_card_id: createUserDto.ghanaCard },
          ],
        },
      });
      if (userInDB) {
        throw new ConflictException('User Already exists');
      }
      const hashed = await this.hashingService.hash(createUserDto.password);
      const user = new User();
      user.email = createUserDto.email;
      user.first_name = createUserDto.firstName;
      user.last_name = createUserDto.lastName;
      user.password = hashed;
      user.username = createUserDto.username;
      user.gender = createUserDto.gender;
      user.phone_number = createUserDto.phone;
      user.birthday = createUserDto.birthday;
      user.public_service_id = createUserDto.psi;
      user.digital_address = createUserDto.digitalAddress;
      user.ghana_card_id = createUserDto.ghanaCard;
      const userData = await user.save();
      return userData;
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    const users = await this.usersRepository.findAll<User>();
    return users.map((user) => new UserDto(user));
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
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

  async getUserByEmail(email: string) {
    const userInDB = await this.usersRepository.findOne<User>({
      where: { email },
    });

    if (!userInDB) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return userInDB;
  }

  async getUserByPhone(phone: string) {
    const userInDB = await this.usersRepository.findOne<User>({
      where: { phone_number: phone },
    });
    if (!userInDB) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }

    return userInDB;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findByPk<User>(id);
    if (!user) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }

    user.email = updateUserDto.email;
    user.first_name = updateUserDto.firstName;
    user.last_name = updateUserDto.lastName;
    user.username = updateUserDto.username;
    user.gender = updateUserDto.gender;
    user.phone_number = updateUserDto.phone;
    user.birthday = updateUserDto.birthday;
    user.public_service_id = updateUserDto.psi;
    user.digital_address = updateUserDto.digitalAddress;
    user.ghana_card_id = updateUserDto.ghanaCard;

    try {
      const data = await user.save();
      return new UserDto(data);
    } catch (err) {
      throw err;
    }
  }

  async delete(id: string) {
    const user = await this.usersRepository.findByPk<User>(id);
    await user.destroy();
    return new UserDto(user);
  }

  async saveUrl(id: string, file_url: string) {
    const user = await this.usersRepository.findByPk<User>(id);
    if (!user) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }
    user.picture_url = file_url;
    try {
      user.save();
    } catch (error) {
      throw error;
    }
  }

  // async createUserProfilePicture(
  //   userId: string,
  //   profileDto: UpdateUserProfileDto,
  // ) {
  //   const user = await this.usersRepository.findByPk<User>(userId);

  //   user.picture_url = profileDto.profileUrl;
  //   try {
  //     const data = await user.save();
  //     return new UserDto(data);
  //   } catch (err) {
  //     throw err;
  //   }
  // }

  async deleteUserProfilePicture(userId: string) {
    const user = await this.usersRepository.findByPk<User>(userId);

    user.picture_url = null;
    try {
      const data = await user.save();
      return new UserDto(data);
    } catch (err) {
      throw err;
    }
  }

  async generateCode(): Promise<string> {
    const otp = await this.nanoid();
    console.log(otp);
    return otp;
  }

  // GENERATE OTP
  async generateOtp(phone: string) {
    try {
      console.log(phone);
      const userPhone = await this.getUserByPhone(phone);
      console.log('User in DB', userPhone);
      if (!userPhone) {
        throw new HttpException(
          "couldn't create new user",
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const code = await this.generateCode();
      await this.addToCache(code, phone);
      console.log('Added to cache');
      sendOtpMessage(phone, code);
      return code;
    } catch (error) {
      throw error;
    }
  }

  async addToCache(key: string, item: string) {
    console.log('Adding to cache', key, item);
    await this.cacheManager.set(key, item, 300);
  }

  async getFromCache(key: string) {
    try {
      console.log('Getting from cache', key);
      const value = await this.cacheManager.get(key);
      console.log('User Phone Key', value);
      return value;
    } catch (err) {
      throw err;
    }
  }

  async getCurrentUser(userId: string) {
    const user = await this.getUser(userId);

    return {
      id: user.id,
      firstname: user.first_name,
      lastname: user.last_name,
      phone: user.phone_number,
      photo: user.picture_url,
      verified: user.verified,
      email: user.email,
    };
  }
}
