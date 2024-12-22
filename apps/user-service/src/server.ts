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
import { logout, login, signup, userInfo } from "./controller/user.controller";

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

// Signup API
app.post("/signup", auth, signup);

// Login API
app.post("/login", auth, login);

// User Info API
app.get("/user-info", auth, userInfo);

// Logout API
app.get("/logout", auth, logout);

// 404 handler for unmatched routes
app.use((req, res, next) => {
  res.status(404).json({ error: "[UserService] Route not found" });
});

// Error handler
app.use(errHandler);

// Start the server
app.listen(PORT, () => {
  logger.info(`[UserService] is running on port ${PORT}`);
});
