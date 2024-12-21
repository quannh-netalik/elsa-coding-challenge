import mongoose from "mongoose";
import { constant } from "./constant";
import { logger } from "./utils/logger";

// Connect to MongoDB
mongoose
  .connect(constant.mongoUri)
  .then(() => {
    console.log("[QuizContentService] Connected to MongoDB");
    logger.info({
      message: `[QuizContentService] Connected to MongoDB`,
      correlationId: "NA",
    });
  })
  .catch((err) => {
    logger.error({
      message: { msg: "Failed to connect to MongoDB", ...err },
      correlationId: "NA",
    });
    console.error("Failed to connect to MongoDB:", err);
  });
