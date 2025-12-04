export interface IInitializeTransaction {
  email: string;
  amount: number;
  callback_url: string;
  metadata: object;
}