import { Transform, TransformFnParams } from 'class-transformer';
import { IsDate, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import GeneralEntity from 'src/interfaces/generalEntity';
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

  @Column({ type: 'varchar' })
  @IsString()
  password: string;

  @Column({ type: 'varchar', unique: true })
  @IsString()
  email: string;

  @Column({ type: 'varchar', length: 15 })
  @IsString()
  @MinLength(3)
  firstName: string;

  @Column({ type: 'varchar', length: 15 })
  @IsString()
  @MinLength(3)
  lastName: string;

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

  @Column({ type: 'varchar', nullable: true })
  @IsString()
  @IsOptional()
  country?: string;
}
