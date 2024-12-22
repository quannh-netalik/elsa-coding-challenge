import "./utils/env";
import "./utils/mongoose";
import express, { Request, Response } from "express";

import {
  auth,
  errHandler,
  logIncomingRequest,
  setCorrelationId,
} from "./middleware";
import { logger } from "./utils/logger";
import {
  generateToken,
  logout,
  verifyToken,
} from "./controller/auth.controller";
import { constant } from "./constant";

const app = express();
const PORT: number = constant.port;

app.use(express.json());

// Log incoming traffic and responses
app.use(logIncomingRequest);
app.use(setCorrelationId);

app.get("/health", (_: Request, res: Response) => {
  res.status(200).send("Successful");
});

// Generate Token API
app.post("/generate-token", auth, generateToken);

// Verify Token API
app.post("/verify-token", auth, verifyToken);

// Logout API
app.post("/logout", auth, logout);

// 404 handler for unmatched routes
app.use((req, res, next) => {
  res.status(404).json({ error: "[AuthService] Route not found" });
});

// Error handler
app.use(errHandler);

// Start the server
app.listen(PORT, () => {
  logger.info(`[AuthService] is running on port ${PORT}`);
});
