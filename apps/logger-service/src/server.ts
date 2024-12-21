import "./env";
import "./mongoose";
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

// Error handler
app.use(errHandler);

// Start the server
app.listen(PORT, (): void => {
  console.log(`Log service is running on port ${PORT}`);
});
