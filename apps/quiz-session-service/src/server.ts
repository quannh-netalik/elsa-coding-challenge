import "./utils/env";
import "./utils/mongoose";

import express, { Request, Response } from "express";

import { logger } from "./utils/logger";
import { constant } from "./constant";
import {
  auth,
  errHandler,
  logIncomingRequest,
  setCorrelationId,
} from "./middleware";
import {
  activateSession,
  joinSession,
  sessionDetails,
  startSession,
} from "./controller/quiz-session.controller";

// Initialize Express app
const app = express();
const PORT: number = constant.port;

app.use(express.json());

// Log incoming traffic and responses
app.use(logIncomingRequest);
app.use(setCorrelationId);

app.get("/health", (_: Request, res: Response) => {
  res.status(200).send("Successful");
});

// Start a new session API
app.post("/start-session", auth, startSession);

// Join a session API
app.post("/join-session", auth, joinSession);

// Activate a session API
app.post("/activate-session/:sessionId", auth, activateSession);

// Get session status API
app.get("/session/:sessionId", auth, sessionDetails);

// 404 handler for unmatched routes
app.use((req, res, next) => {
  res.status(404).json({ error: "[QuizSessionService] Route not found" });
});

// Error handler
app.use(errHandler);

// Start the server
app.listen(PORT, () => {
  logger.info(`[QuizSessionService] is running on port ${PORT}`);
});
