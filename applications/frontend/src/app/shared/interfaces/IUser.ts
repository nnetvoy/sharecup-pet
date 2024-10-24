import {IRegisterUser} from "./IRegisterUser";

export interface IUser extends IRegisterUser {
  isAdmin: boolean
  _id: string;
}
