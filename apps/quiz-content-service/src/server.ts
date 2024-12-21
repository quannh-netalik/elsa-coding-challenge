import "./env";
import "./mongoose";
import express, { Request, Response } from "express";

import { auth, logIncomingRequest, errHandler } from "./middleware";
import { bootstrapData } from "./utils/bootstrapData";
import { quizGeneration } from "./controller/quiz.controller";
import { constant } from "./constant";
import { logger } from "./utils/logger";

// Express app setup
const app = express();
const PORT: number = constant.port;

app.use(express.json());

// Log incoming traffic and responses
app.use(logIncomingRequest);

app.get("/health", (_: Request, res: Response) => {
  res.status(200).send("Successful");
});

// POST /quiz-generation endpoint
app.post("/quiz-generation", auth, quizGeneration);

// Error handler
app.use(errHandler);

// Start the server
app.listen(PORT, async () => {
  console.log(`[QuizContentService] is running on port ${PORT}`);
  logger.info({
    message: `[QuizContentService] is running on port ${PORT}`,
    correlationId: "NA",
  });
  await bootstrapData();
});
