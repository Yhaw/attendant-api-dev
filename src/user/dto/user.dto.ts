import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '../enum/gender.enum';
import { User } from '../entities/user.entity';

export class UserDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  readonly first_name: string;

  @ApiProperty()
  readonly last_name: string;

  @ApiProperty()
  readonly password: string;

  @ApiProperty()
  readonly phone_number: string;

  @ApiProperty()
  readonly username: string;

  @ApiProperty()
  readonly email: string;

  @ApiProperty()
  readonly gender: Gender;

  @ApiProperty()
  readonly birthday: string;

  @ApiProperty()
  readonly public_service_id: string;

  @ApiProperty()
  readonly digital_address: string;

  @ApiProperty()
  readonly ghana_card_id: string;

  @ApiProperty()
  readonly picture_url: string;

  @ApiProperty()
  readonly verified: boolean;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.first_name = user.first_name;
    this.picture_url = user.picture_url;
    this.last_name = user.last_name;
    this.password = user.password;
    this.gender = user.gender;
    this.phone_number = user.phone_number;
    this.birthday = user.birthday;
    this.public_service_id = user.public_service_id;
    this.digital_address = user.digital_address;
    this.ghana_card_id = user.ghana_card_id;
  }
}
