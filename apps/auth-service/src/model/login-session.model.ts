import mongoose from "mongoose";
import { TokenStatus, UserType } from "../constant";

// Login Session Schema
export interface ILoginSession {
  username: string;
  type: UserType.GUEST | UserType.INTERNAL;
  token: string;
  createdDate: Date;
  expirationDate: Date;
  status: TokenStatus.EXPIRED | TokenStatus.ACTIVE;
}

export const loginSessionSchema = new mongoose.Schema<ILoginSession>({
  username: { type: String, required: true },
  type: { type: String, enum: UserType, required: true },
  token: { type: String, required: true, unique: true },
  createdDate: { type: Date, default: Date.now },
  expirationDate: { type: Date, required: true },
  status: { type: String, enum: TokenStatus, default: TokenStatus.ACTIVE },
});

export const LoginSession = mongoose.model<ILoginSession>(
  "LoginSession",
  loginSessionSchema
);
