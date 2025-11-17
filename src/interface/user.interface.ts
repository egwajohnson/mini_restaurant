export interface IPreRegister {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}

export interface IVerifyUser {
  email: string;
  otp: string;
}
