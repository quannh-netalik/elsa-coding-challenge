import { Request, Response } from "express";
import { authSdk } from "../utils/authSdk";
import { logger } from "../utils/logger";
import { User } from "../model/user.model";
import { UserType } from "../constant";
import {
  guestSignup,
  internalSignup,
  loginHandler,
} from "../services/user.service";

export const signup = async (req: Request, res: Response): Promise<any> => {
  const { firstName, lastName, username, password, type } = req.body;

  if (!username) {
    return res
      .status(400)
      .json({ error: "[UserService] Username field is required." });
  }

  const ifUserExisted = await User.findOne({ username }, { username: 1 });
  if (ifUserExisted) {
    return res.status(400).json({ error: "[UserService] User existed" });
  }

  try {
    if (type === UserType.GUEST) {
      return guestSignup({ res, username });
    }

    if (!firstName || !lastName || !username || !password || !type) {
      return res
        .status(400)
        .json({ error: "[UserService] All fields are required." });
    }

    return internalSignup({ res, firstName, lastName, password, username });
  } catch (error: unknown) {
    logger.error(`[UserService] Error during signup: ${JSON.stringify(error)}`);
    return res
      .status(500)
      .json({ error: "[UserService] Internal server error." });
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "[UserService] username and password is required." });
  }

  try {
    return loginHandler({ res, username, password });
  } catch (error: unknown) {
    logger.error(`[UserService] Error during signup: ${JSON.stringify(error)}`);
    return res
      .status(500)
      .json({ error: "[UserService] Internal server error." });
  }
};

export const userInfo = async (req: Request, res: Response): Promise<any> => {
  const authorization = req.headers["authorization"] as string;
  const [, token] = authorization.split(" ");

  if (!token || typeof token !== "string") {
    return res.status(400).json({ error: "Token is required." });
  }

  try {
    const payload = await authSdk.verifyToken(token);
    const user = await User.findOne({ username: payload.username });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    logger.info(`[UserService] User info retrieved for ${payload.username}`);

    return res.status(200).json({
      userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
    });
  } catch (error) {
    logger.error(
      `[UserService] Error retrieving user info: ${JSON.stringify(error)}`
    );
    return res
      .status(500)
      .json({ error: "[UserService] Internal server error" });
  }
};

export const logout = async (req: Request, res: Response): Promise<any> => {
  const authorization = req.headers["authorization"] as string;
  const [, token] = authorization.split(" ");

  if (!token) {
    return res.status(400).json({ error: "[UserService] Token is required." });
  }

  try {
    await authSdk.logout(token);
    logger.info(`[UserService] User logged out successfully.`);

    return res
      .status(200)
      .json({ message: `[UserService] User logged out successfully.` });
  } catch (error) {
    logger.error(`[UserService] Error during logout: ${JSON.stringify(error)}`);
    return res
      .status(500)
      .json({ error: "[UserService] Internal server error." });
  }
};
