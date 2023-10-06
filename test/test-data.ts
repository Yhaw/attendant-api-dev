import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { Gender } from 'src/user/enum/gender.enum';

export const createUserDto1: CreateUserDto = {
  email: 'testemail@gmail.com',
  password: 'password123',
  firstName: 'John',
  lastName: 'Smith',
  gender: Gender.male,
  birthday: '1986-07-17',
  psi: '545-dw433-2464',
  digitalAddress: 'GB-098-75698',
  ghanaCard: 'GHA-343943646-464',
};

export const updateUserDto1: UpdateUserDto = {
  firstName: 'John',
  lastName: 'Smith',
  gender: Gender.female,
  birthday: '1996-07-17',
};
