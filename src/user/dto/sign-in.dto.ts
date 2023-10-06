import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class SignInDto {
  // email
  @ApiProperty({
    example: 'example@outlook.com',
    description: 'User email',
  })
  @IsEmail()
  @IsOptional()
  email: string;

  // email
  @ApiProperty({
    example: 'mangopro',
    description: 'Username',
  })
  @IsString()
  @IsOptional()
  username: string;

  // public service number
  @ApiProperty({
    example: '45-41861-de234',
    description: 'Public Service ID',
  })
  @IsString()
  @IsOptional()
  psi: string;

  @ApiProperty({
    example: '5234',
    description: 'User OTP',
  })
  @IsString()
  @IsOptional()
  @MaxLength(6)
  otp: string;

  // Password
  @ApiProperty({
    example: 'h@veNic3day',
    description: 'Password',
  })
  @IsString()
  @IsOptional()
  password: string;
}
