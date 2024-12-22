import mongoose from "mongoose";
import { UserType } from "../constant";

// User Schema
export interface IUserSchema {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  type: UserType;
}

export const userSchema = new mongoose.Schema<IUserSchema>({
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  type: { type: String, enum: UserType, required: true },
});

export const User = mongoose.model<IUserSchema>("User", userSchema);
