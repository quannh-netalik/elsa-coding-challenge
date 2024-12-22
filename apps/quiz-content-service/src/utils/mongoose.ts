import mongoose from "mongoose";
import { constant } from "../constant";
import { logger } from "./logger";

// Connect to MongoDB
mongoose
  .connect(constant.mongoUri)
  .then(() => {
    logger.info("[QuizContentService] Connected to MongoDB");
  })
  .catch((err) => {
    logger.error({
      msg: "[QuizContentService] Failed to connect to MongoDB",
      ...err,
    });
  });
