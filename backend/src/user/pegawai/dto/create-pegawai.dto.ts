import {
  IsString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
} from 'class-validator';

// Enum untuk jenis kelamin
export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
}

export class CreatePegawaiDto {
  @IsString()
  @IsNotEmpty()
  nama_depan: string;

  @IsString()
  @IsNotEmpty()
  nama_belakang: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsPhoneNumber(null)
  @IsNotEmpty()
  no_hp: string;

  @IsEnum(Gender)
  @IsNotEmpty()
  jenis_kelamin: Gender;

  @IsString()
  @IsNotEmpty()
  address: string;
}
