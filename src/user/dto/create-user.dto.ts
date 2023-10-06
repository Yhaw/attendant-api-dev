import {
  IsString,
  IsEmail,
  IsEnum,
  IsISO8601,
  IsOptional,
  MinLength,
  IsNotEmpty,
  MaxLength,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '../enum/gender.enum';

export class CreateUserDto {
  @ApiProperty({
    example: 'pineapple@gmail.com',
    description: 'user email',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'pineapple',
    description: 'User Password',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(30)
  @Matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/, {
    message: 'Password is weak',
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: 'Maxwell',
    description: 'First Name',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    example: 'Tom',
    description: 'Last Name',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    example: '0542448994',
    description: 'User Phone',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    example: 'testing',
    description: 'Username',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: 'male',
    description: 'Gender (male | female)',
  })
  @IsOptional()
  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;

  @ApiProperty({
    example: '1996-08-01',
    description: 'Birth Date',
  })
  @IsISO8601()
  @IsNotEmpty()
  birthday: string;

  @ApiProperty({
    example: '45-41861-de234',
    description: 'Public Service ID',
  })
  @IsString()
  @IsNotEmpty()
  psi: string;

  @ApiProperty({
    example: 'GB-056-7892',
    description: 'Digital Address',
  })
  @IsString()
  @IsNotEmpty()
  digitalAddress: string;

  @ApiProperty({
    example: 'GHA-001864563-9',
    description: 'Ghana Card ID',
  })
  @IsString()
  @IsNotEmpty()
  ghanaCard: string;
}
