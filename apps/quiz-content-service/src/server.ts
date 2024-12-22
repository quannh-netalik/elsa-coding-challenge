import "./utils/env";
import "./utils/mongoose";
import express, { Request, Response } from "express";

import {
  auth,
  logIncomingRequest,
  errHandler,
  setCorrelationId,
} from "./middleware";
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
app.use(setCorrelationId);

app.get("/health", (_: Request, res: Response) => {
  res.status(200).send("Successful");
});

// POST /quiz-generation endpoint
app.post("/quiz-generation", auth, quizGeneration);

// 404 handler for unmatched routes
app.use((req, res, next) => {
  res.status(404).json({ error: "[QuizContentService] Route not found" });
});

// Error handler
app.use(errHandler);

// Start the server
app.listen(PORT, async () => {
  logger.info(`[QuizContentService] is running on port ${PORT}`);
  await bootstrapData();
});
