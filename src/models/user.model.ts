import mongoose, { Schema, Document, model } from "mongoose";
import bcrypt from "bcrypt";

export enum UserRole {
  Admin = "admin",
  User = "user",
  Manager = "manager",
}

export enum UserStatus {
  Active = "active",
  Inactive = "inactive",
  OnVacations = "on_vacations",
  Ill = "ill",
  Other = "other",
}

export interface IContact {
  address: string;
  city: string;
  country: string;
  zip: string;
  phone_number: string;
}

export interface IUser extends Document {
  fullname: string;
  email: string;
  password: string;
  role: UserRole;
  date_of_birth?: Date;
  profile_img?: string;
  contact_information?: IContact;
  last_login?: Date;
  status: UserStatus;
  token?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<Boolean>;
}

const contactSchema = new Schema<IContact>({
  address: String,
  city: String,
  country: String,
  zip: String,
  phone_number: String,
});

const userSchema = new Schema<IUser>(
  {
    fullname: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.User,
    },
    date_of_birth: Date,
    profile_img: String,
    contact_information: { type: contactSchema, _id: false },
    last_login: Date,
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.Active,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  let user = this as IUser;
  if (!user.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(user.password, salt);

  user.password = hash;

  return next();
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<Boolean> {
  const user = this as IUser;
  return bcrypt.compare(candidatePassword, user.password).catch((e) => false);
};

const UserModel = model<IUser>("User", userSchema);

export default UserModel;
