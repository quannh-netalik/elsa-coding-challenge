import jwt from "jsonwebtoken";
import { constant, TokenStatus, UserType } from "../constant";

import { redisClient } from "../utils/redis";
import { LoginSession } from "../model/login-session.model";
import { logger } from "../utils/logger";

interface GetGuestTokenInterface {
  username: string;
  type: UserType;
  expirationDate: Date;
}

export const getGuestToken = async ({
  username,
  type,
  expirationDate,
}: GetGuestTokenInterface): Promise<string> => {
  const token = jwt.sign({ username, type }, constant.secretKey, {
    expiresIn: constant.expirationDuration / 1000,
  });

  await redisClient.setEx(
    `auth-service:${username}:${type}`,
    constant.expirationDuration / 1000,
    token
  );

  const session = new LoginSession({
    username,
    type,
    token,
    expirationDate,
    status: TokenStatus.ACTIVE,
  });

  await session.save();

  logger.info({ msg: `[AuthService] Generate token successfully`, token });

  return token;
};

interface GetInternalUserTokenInterface {
  username: string;
  firstName: string;
  lastName: string;
  expirationDate: Date;
}

export const getInternalUserToken = async ({
  username,
  firstName,
  lastName,
  expirationDate,
}: GetInternalUserTokenInterface): Promise<string> => {
  const payload = { username, firstName, lastName, type: "internal" };
  const token = jwt.sign(payload, constant.secretKey, {
    expiresIn: constant.expirationDuration / 1000,
  });

  await redisClient.setEx(
    `auth-service:${username}:internal`,
    constant.expirationDuration / 1000,
    token
  );

  const session = new LoginSession({
    username,
    type: UserType.INTERNAL,
    token,
    expirationDate,
    status: TokenStatus.ACTIVE,
  });

  await session.save();

  logger.info({ msg: `[AuthService] Generate token successfully`, token });

  return token;
};

export const logoutHandler = async (token: string): Promise<Object> => {
  const session = await LoginSession.findOne({
    token,
    status: TokenStatus.ACTIVE,
  });
  if (!session) {
    return {};
  }

  const payload = jwt.verify(token, constant.secretKey) as jwt.JwtPayload;

  session.status = TokenStatus.EXPIRED;
  await session.save();
  await redisClient.del(`auth-service:${payload.username}:${payload.type}`);
  logger.info(`Remove keys for: auth-service:${payload.username}:${payload.type}`)
  
  return {
    username: session.username,
    type: session.type,
    token: session.token,
  };
};
