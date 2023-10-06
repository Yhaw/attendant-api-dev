import {
  Table,
  Model,
  Column,
  DataType,
  Unique,
  IsEmail,
  UpdatedAt,
  CreatedAt,
  DeletedAt,
} from 'sequelize-typescript';
import { Gender } from '../enum/gender.enum';
import { Exclude } from 'class-transformer';
@Table({
  tableName: 'users',
  timestamps: true,
  paranoid: true,
  indexes: [
    {
      unique: true,
      fields: ['id'],
    },
  ],
})
export class User extends Model<User> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({})
  first_name: string;

  @Column({})
  last_name: string;

  @Column(DataType.DATEONLY)
  birthday: string;

  @Unique
  @IsEmail
  @Column
  email: string;

  @Exclude()
  @Column({})
  password: string;

  @Column({ unique: true })
  phone_number: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  digital_address: string;

  @Column({ type: DataType.ENUM(Gender.female, Gender.male) })
  gender: Gender;

  @Column({ unique: true })
  public_service_id: string;

  @Column({ unique: true })
  ghana_card_id: string;

  @Column({})
  picture_url: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  profile_visibility: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  verified: boolean;

  @Column({})
  verifiedAt: Date;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  isActive: boolean;

  @Column({})
  phoneVerifiedAt: Date;

  @Column({})
  passwordChangedAt: Date;

  @Column({ type: DataType.STRING(400) })
  passwordResetToken: string;

  @Column({})
  passwordResetExpires: Date;

  @CreatedAt
  @Column({})
  created_at: Date;

  @UpdatedAt
  @Column({})
  updated_at: Date;

  @DeletedAt
  @Column({})
  deleted_at: Date;
}
