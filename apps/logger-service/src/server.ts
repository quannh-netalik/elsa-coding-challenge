import express, { Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: __dirname + "../.env" });

import { auth } from "./middleware/auth";
import { postLog } from "./controller/log.controller";
import { constant } from "./constant";

// Express app setup
const app = express();
const PORT: number = constant.port;

// Middleware
app.use(express.json());

mongoose
  .connect(constant.mongoUri)
  .then(() => {
    console.log("[LoggerService] Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });

app.get("/health", (_: Request, res: Response) => {
  res.status(200).send("Successful");
});
// Log endpoint
app.post("/log", auth, postLog);

// Start the server
app.listen(PORT, (): void => {
  console.log(`Log service is running on port ${PORT}`);
});
