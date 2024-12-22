import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { redisClient } from "../utils/redis";
import { constant } from "../constant";
import {
  getGuestToken,
  getInternalUserToken,
  logoutHandler,
} from "../services/auth.service";
import { logger } from "../utils/logger";

export const generateToken = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { firstName, lastName, username, type } = req.body;

  if (!username) {
    return res
      .status(400)
      .json({ error: "[AuthService] Username is required." });
  }

  const expirationDate = new Date(Date.now() + constant.expirationDuration);

  if (type === "guest") {
    const token = await getGuestToken({
      username,
      type,
      expirationDate,
    });
    return res.status(200).json({ token, expirationDate });
  }

  try {
    const token = await getInternalUserToken({
      username,
      firstName,
      lastName,
      expirationDate,
    });
    return res.status(200).json({ token, expirationDate });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "[AuthService] Internal server error." });
  }
};

export const verifyToken = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: "Token is required." });
  }

  try {
    const payload = jwt.verify(token, constant.secretKey) as jwt.JwtPayload;
    logger.info({ msg: `[AuthService] Verify token successfully`, ...payload });
    return res.status(200).json(payload);
  } catch (err: unknown) {
    logger.error({
      msg: "[AuthService] Verify token unsuccessful",
      err,
    });
    return res.status(401).json({ error: "Invalid token." });
  }
};

export const logout = async (req: Request, res: Response): Promise<any> => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: "Token is required." });
  }

  try {
    const session = await logoutHandler(token);
    logger.info({ msg: `[AuthService] Logout successfully`, token });

    return res.status(200).json({
      message:
        "[AuthService] Token has been logged out and removed from Redis.",
      session,
    });
  } catch (err) {
    logger.error({
      msg: "[AuthService] Verify token unsuccessful",
      err,
    });
    return res
      .status(500)
      .json({ error: "[AuthService] Internal server error." });
  }
};
