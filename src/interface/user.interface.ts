export interface IPreRegister {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  is_verified: boolean;
}

export interface IVerifyUser {
  email: string;
  otp: string;
  is_verified: true;
}