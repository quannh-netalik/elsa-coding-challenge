import "./utils/env";
import "./utils/mongoose";
import express, { Request, Response } from "express";

import { auth, errHandler } from "./middleware";
import { postLog } from "./controller/log.controller";
import { constant } from "./constant";

// Express app setup
const app = express();
const PORT: number = constant.port;

// Middleware
app.use(express.json());

app.get("/health", (_: Request, res: Response) => {
  res.status(200).send("Successful");
});
// Log endpoint
app.post("/log", auth, postLog);

// 404 handler for unmatched routes
app.use((req, res, next) => {
  res.status(404).json({ error: '[LoggerService] Route not found' });
});

// Error handler
app.use(errHandler);

// Start the server
app.listen(PORT, (): void => {
  console.log(`[LoggerService] is running on port ${PORT}`);
});
