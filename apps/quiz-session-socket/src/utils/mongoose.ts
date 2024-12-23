import mongoose from "mongoose";
import { logger } from "./logger";
import { constant } from "../constant";

mongoose
  .connect(constant.mongoUri)
  .then(() => {
    logger.info("[QuizSessionSocket] Connected to MongoDB");
  })
  .catch((err) => {
    logger.error({
      msg: "[QuizSessionSocket] Failed to connect to MongoDB",
      ...err,
    });
  });
