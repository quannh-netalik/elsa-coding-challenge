import mongoose from "mongoose";
import { logger } from "./logger";
import { constant } from "../constant";

mongoose
  .connect(constant.mongoUri)
  .then(() => {
    logger.info("[QuizSessionService] Connected to MongoDB");
  })
  .catch((err) => {
    logger.error({ msg: "[QuizSessionService] Failed to connect to MongoDB", ...err });
  });
