import { Document } from "mongoose";
import { UserRole, UserStatus } from "./user.enums";

export interface IUser extends Document {
  fullname: string;
  email: string;
  password: string;
  role: UserRole;
  date_of_birth?: Date;
  profile_img?: string;
  contact_information?: any;
  last_login?: Date;
  status: UserStatus;
  token?: string;
}
