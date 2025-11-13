export interface IPreReg {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}

export interface IVerify {
  email: string;
  otp: string;
}
