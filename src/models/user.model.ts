import mongoose, { Schema, Document, model } from 'mongoose';
import bcrypt from 'bcrypt';

export enum UserRole {
  Admin = 'admin',
  User = 'user',
  Manager = 'manager',
}

export enum UserStatus {
  Active = 'active',
  Inactive = 'inactive',
  OnVacations = 'on_vacations',
  Ill = 'ill',
  Other = 'other',
}

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
  comparePassword(candidatePassword: string): Promise<Boolean>;
}

const userSchema = new Schema<IUser>(
  {
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
    fullname: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.User,
    },
    date_of_birth: { type: Date },
    profile_picture: { type: String },
    contact_information: { type: Schema.Types.Mixed },
    last_login: { type: Date },
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

userSchema.pre('save', async function (next: (err?: Error) => void) {
  let user = this as IUser;
  if (!user.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(user.password, salt);

  user.password = hash;

  return next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<Boolean> {
  const user = this as IUser;
  return bcrypt.compare(candidatePassword, user.password).catch((e) => false);
};

const UserModel = model<IUser>('User', userSchema);

export default UserModel;
