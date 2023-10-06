import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class PhoneDto {
  // Otp Code
  @ApiProperty({
    example: '0542448956',
    description: 'User Phone',
  })
  @IsString()
  @MaxLength(10)
  phone: string;
}
