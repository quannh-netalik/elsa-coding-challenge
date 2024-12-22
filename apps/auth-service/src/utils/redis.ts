import * as redis from "redis";
import { logger } from "./logger";
import { constant } from "../constant";

const redisClient = redis.createClient({
  url: constant.redisUri,
});

redisClient
  .connect()
  .then(() => {
    logger.info("[AuthService] Connected to Redis");
  })
  .catch((err) => {
    logger.error({ msg: "[AuthService] Failed to connect to Redis", ...err });
  });

export { redisClient };
