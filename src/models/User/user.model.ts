import { model } from "mongoose";
import userSchema from "./user.schema";
import { IUser } from "./user.interface";

const UserModel = model<IUser>("User", userSchema);

export default UserModel;
