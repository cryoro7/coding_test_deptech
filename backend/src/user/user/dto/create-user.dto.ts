export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
}
export class CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: Date;
  gender: Gender;
  password: string;
}
