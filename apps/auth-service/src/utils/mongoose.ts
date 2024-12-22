import mongoose from "mongoose";
import { logger } from "./logger";
import { constant } from "../constant";

mongoose
  .connect(constant.mongoUri)
  .then(() => {
    logger.info("[AuthService] Connected to MongoDB");
  })
  .catch((err) => {
    logger.error({ msg: "[AuthService] Failed to connect to MongoDB", ...err });
  });
