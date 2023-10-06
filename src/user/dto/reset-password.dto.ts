import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class ResetPasswordDto {
  // Password
  @ApiProperty()
  @IsString()
  @Matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/, {
    message: 'Password is weak',
  })
  password: string;

  @ApiProperty({
    example: '45-41861-de234',
    description: 'Public Service ID',
  })
  @IsString()
  @IsNotEmpty()
  psi: string;

  @ApiProperty({
    example: 'testing',
    description: 'Username',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: '523487',
    description: 'User OTP',
  })
  @IsString()
  @MaxLength(6)
  otp: string;
}
