import { Document } from 'mongoose';
import { UserRole, UserStatus } from './user.enums';

export interface IUser extends Document {
  email: string;
  password: string;
  fullname: string;
  role: UserRole;
  date_of_birth?: Date;
  profile_picture?: string;
  contact_information?: any;
  last_login?: Date;
  status: UserStatus;
  token?: string;
}
