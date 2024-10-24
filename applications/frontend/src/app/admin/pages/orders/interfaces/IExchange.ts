import {IUser} from "../../../../shared/interfaces/IUser";

export interface IExchange {
  amount: number;
  approve: boolean;
  createdAt: boolean;
  type: 'order' | 'return';
  _id: string;
  user: IUser
}
