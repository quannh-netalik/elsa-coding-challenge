import mongoose from "mongoose";
import { logger } from "./logger";
import { constant } from "../constant";

mongoose
  .connect(constant.mongoUri)
  .then(() => {
    logger.info("[UserService] Connected to MongoDB");
  })
  .catch((err) => {
    logger.error({ msg: "[UserService] Failed to connect to MongoDB", ...err });
  });
