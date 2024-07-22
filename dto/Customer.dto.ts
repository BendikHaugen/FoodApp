import { IsEmail, IsEmpty, Length } from "class-validator";

export class CreateCustomerInputs {
  @IsEmail()
  email: string;
  @IsEmpty()
  @Length(7, 12)
  phone: string;
  @IsEmpty()
  @Length(6, 12)
  password: string;
}

export interface CustomerPayLoad {
  _id: string;
  email: string;
  verified: boolean;
}

export class UserLoginInputs {
  @IsEmail()
  email: string;
  @Length(6, 12)
  password: string;
}
