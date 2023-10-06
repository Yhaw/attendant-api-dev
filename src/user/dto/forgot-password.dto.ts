import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class ForgotUserPasswordDto {
  // email
  @ApiProperty({
    example: 'example@outlook.com',
    description: 'User email',
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'testing',
    description: 'Username',
  })
  @IsString()
  username: string;

  @ApiProperty({
    example: '45-41861-de234',
    description: 'Public Service ID',
  })
  @IsString()
  psi: string;
}
