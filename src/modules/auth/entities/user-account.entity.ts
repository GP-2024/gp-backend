import { Transform, TransformFnParams } from 'class-transformer';
import { IsDate, IsEnum, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';
import GeneralEntity from 'src/interfaces/generalEntity';
import { Column, Entity } from 'typeorm';

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

@Entity('user_account')
export class UserAccount extends GeneralEntity {
  @IsString()
  @MinLength(3)
  firstName: string;

  @IsString()
  @MinLength(3)
  lastName: string;
  @Column({ type: 'enum', enum: Gender, nullable: true })
  @IsEnum(Gender)
  gender: string;

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
