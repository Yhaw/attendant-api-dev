import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateUserProfileDto {
  @ApiProperty()
  @IsString()
  readonly profileUrl?: string;
}
