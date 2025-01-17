import { Transform, TransformFnParams } from 'class-transformer';
import { IsDate, IsEnum, IsOptional, IsString, Length, MinLength } from 'class-validator';
import GeneralEntity from 'src/common/interfaces/generalEntity';
import { Column, Entity } from 'typeorm';

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

@Entity('users')
export class Users extends GeneralEntity {
  @Column({ type: 'varchar', length: 15, unique: true })
  @IsString()
  username: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  @IsString()
  @IsOptional()
  firstName?: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  @IsString()
  @IsOptional()
  lastName?: string;

  @Column({ type: 'varchar' })
  @IsString()
  password: string;

  @Column({ type: 'varchar', unique: true })
  @IsString()
  email: string;

  @Column({ type: 'enum', enum: Gender, nullable: true })
  @IsEnum(Gender)
  gender: string;

  @Column({ type: 'timestamp', nullable: true })
  @IsDate()
  dateOfBirth: Date;

  @Column({ type: 'timestamp', default: new Date() })
  @IsDate()
  @Transform(({ value }: TransformFnParams) => new Date(value))
  joiningDate: Date;

  @Column({ type: 'boolean', default: false })
  hasProfileImage: boolean;

  @Column({ type: 'varchar', nullable: true })
  @IsString()
  @IsOptional()
  country?: string;

  @Column({ type: 'varchar', nullable: true })
  @IsString()
  @IsOptional()
  refreshToken?: string;
}
