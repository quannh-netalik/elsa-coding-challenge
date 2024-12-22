import { Response } from "express";
import bcrypt from "bcrypt";

import { User } from "../model/user.model";

import { UserType } from "../constant";
import { authSdk } from "../utils/authSdk";
import { logger } from "../utils/logger";

interface IGuestSignup {
  res: Response;
  username: string;
}

export const guestSignup = async ({ res, username }: IGuestSignup) => {
  const user = new User({
    username,
    type: UserType.GUEST,
  });
  await user.save();

  const token = await authSdk.generateToken({ username, type: UserType.GUEST });
  logger.info(`[UserService] User ${username} signed up successfully.`);

  return res
    .status(201)
    .json({ message: "[UserService] User created successfully.", token });
};

interface IInternalSignup {
  res: Response;
  firstName: string;
  lastName: string;
  password: string;
  username: string;
}

export const internalSignup = async ({
  res,
  firstName,
  lastName,
  password,
  username,
}: IInternalSignup) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    firstName,
    lastName,
    username,
    password: hashedPassword,
    type: UserType.INTERNAL,
  });
  await user.save();

  const token = await authSdk.generateToken({
    username,
    firstName,
    lastName,
    type: UserType.INTERNAL,
  });
  logger.info(`[UserService] User ${username} signed up successfully.`);

  return res
    .status(201)
    .json({ message: "[UserService] User created successfully.", token });
};

interface ILoginHandler {
  res: Response;
  username: string;
  password: string;
}

export const loginHandler = async ({
  res,
  username,
  password,
}: ILoginHandler) => {
  const user = await User.findOne({ username, type: UserType.INTERNAL });

  if (!user) {
    return res.status(404).json({ error: "[UserService] User not found." });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: "[UserService] Invalid credentials." });
  }

  const token = await authSdk.generateToken({
    username,
    type: UserType.INTERNAL,
  });

  logger.info(`[UserService] User ${username} logged in successfully.`);

  return res.status(200).json({ message: "[UserService] Login successful.", token });
};
