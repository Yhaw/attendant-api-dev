import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsEnum, IsISO8601, IsOptional, IsString } from 'class-validator';
import { Gender } from '../enum/gender.enum';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly firstName?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly lastName?: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(Gender)
  readonly gender?: Gender;

  @ApiProperty()
  @IsOptional()
  @IsISO8601()
  readonly birthday?: string;
}
