import { Document, Query, Schema, UpdateQuery } from "mongoose";
import { IUser } from "./user.interface";
import { UserRole, UserStatus } from "./user.enums";
import {
  trimFullname,
  convertEmailToLowercase,
  hashPassword,
} from "./user.middleware";

import bcrypt from "bcrypt";
const saltRounds = 10;

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v: string) {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  password: {
    type: String,
    required: true,
    // validate: {
    //   validator: function (v: string) {
    //     return /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(v);
    //   },
    //   message: `Is not a valid password format!`,
    // },
    select: false,
  },
  fullname: { type: String, required: true },
  role: { type: String, enum: Object.values(UserRole), default: UserRole.User },
  date_of_birth: { type: Date },
  profile_picture: { type: String },
  contact_information: { type: Schema.Types.Mixed },
  last_login: { type: Date },
  status: {
    type: String,
    enum: Object.values(UserStatus),
    default: UserStatus.Active,
  },
});

userSchema.path("fullname").set(trimFullname);
userSchema.pre("save", hashPassword);
userSchema.pre("save", convertEmailToLowercase);

userSchema.pre<IUser & UpdateQuery<any>>(
  "findOneAndUpdate",
  async function (next) {
    const update: IUser = this.getUpdate();
    update.fullname = update.fullname.trim();
    update.email = update.email.toLowerCase();
    if (update.password)
      update.password = await bcrypt.hash(this._update.password, saltRounds);

    next();
  }
);
export default userSchema;
